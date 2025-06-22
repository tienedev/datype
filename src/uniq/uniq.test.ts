import { describe, it, expect } from 'vitest';
import { uniq, uniqBy, uniqByProperty } from './index';

describe('uniq', () => {
  describe('basic functionality', () => {
    it('should remove duplicate numbers', () => {
      const numbers = [1, 2, 2, 3, 1, 4, 3];
      const result = uniq(numbers);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should remove duplicate strings', () => {
      const strings = ['hello', 'world', 'hello', 'foo', 'world'];
      const result = uniq(strings);

      expect(result).toEqual(['hello', 'world', 'foo']);
    });

    it('should handle mixed types', () => {
      const mixed = [1, '1', true, 1, 'true', true, '1'];
      const result = uniq(mixed);

      expect(result).toEqual([1, '1', true, 'true']);
    });

    it('should preserve order of first occurrence', () => {
      const items = ['c', 'a', 'b', 'a', 'c', 'd'];
      const result = uniq(items);

      expect(result).toEqual(['c', 'a', 'b', 'd']);
    });

    it('should handle already unique arrays', () => {
      const unique = [1, 2, 3, 4, 5];
      const result = uniq(unique);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('special values', () => {
    it('should handle NaN correctly', () => {
      const withNaN = [NaN, 1, NaN, 2, NaN];
      const result = uniq(withNaN);

      expect(result).toEqual([NaN, 1, 2]);
      expect(Number.isNaN(result[0])).toBe(true);
    });

    it('should handle null and undefined', () => {
      const withNulls = [null, undefined, null, 1, undefined, null];
      const result = uniq(withNulls);

      expect(result).toEqual([null, undefined, 1]);
    });

    it('should handle zero and negative zero', () => {
      const zeros = [0, -0, +0, 1, -0];
      const result = uniq(zeros);

      // SameValueZero treats 0 and -0 as equal
      expect(result).toEqual([0, 1]);
    });

    it('should handle boolean values', () => {
      const booleans = [true, false, true, false, true];
      const result = uniq(booleans);

      expect(result).toEqual([true, false]);
    });
  });

  describe('object handling', () => {
    it('should deduplicate by reference for objects', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // Different object, same content

      const objects = [obj1, obj2, obj1, obj3, obj2];
      const result = uniq(objects);

      expect(result).toEqual([obj1, obj2, obj3]);
      expect(result).toHaveLength(3);
    });

    it('should handle arrays as elements', () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const arr3 = [1, 2]; // Different array, same content

      const arrays = [arr1, arr2, arr1, arr3];
      const result = uniq(arrays);

      expect(result).toEqual([arr1, arr2, arr3]);
    });

    it('should handle complex nested structures', () => {
      const complex1 = { data: { values: [1, 2] } };
      const complex2 = { data: { values: [3, 4] } };

      const complex = [complex1, complex2, complex1];
      const result = uniq(complex);

      expect(result).toEqual([complex1, complex2]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = uniq([]);
      expect(result).toEqual([]);
    });

    it('should handle single element arrays', () => {
      const result = uniq([42]);
      expect(result).toEqual([42]);
    });

    it('should handle arrays with all identical elements', () => {
      const identical = [5, 5, 5, 5, 5];
      const result = uniq(identical);

      expect(result).toEqual([5]);
    });

    it('should handle sparse arrays', () => {
      const sparse = [1, , 2, , 1, 2]; // eslint-disable-line no-sparse-arrays
      const result = uniq(sparse);

      expect(result).toEqual([1, undefined, 2]);
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 2, 3, 1];
      const result = uniq(original);

      expect(original).toEqual([1, 2, 2, 3, 1]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return a new array', () => {
      const original = [1, 2, 3];
      const result = uniq(original);

      expect(result).not.toBe(original);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => uniq('not an array' as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => uniq(null as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => uniq(undefined as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => uniq(123 as any)).toThrow(
        'Expected first argument to be an array'
      );
    });
  });

  describe('performance considerations', () => {
    it('should handle large arrays efficiently', () => {
      const large = Array.from({ length: 10000 }, (_, i) => i % 100);
      const result = uniq(large);

      expect(result).toHaveLength(100);
      expect(result[0]).toBe(0);
      expect(result[99]).toBe(99);
    });
  });
});

describe('uniqBy', () => {
  describe('basic functionality', () => {
    it('should remove duplicates based on iteratee result', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' },
        { id: 3, name: 'Bob' },
      ];

      const result = uniqBy(users, user => user.id);

      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
      ]);
    });

    it('should work with mathematical transformations', () => {
      const numbers = [1.1, 1.9, 2.1, 2.9, 3.1];
      const result = uniqBy(numbers, Math.floor);

      expect(result).toEqual([1.1, 2.1, 3.1]);
    });

    it('should work with string transformations', () => {
      const words = ['Hello', 'WORLD', 'hello', 'world', 'Hi'];
      const result = uniqBy(words, word => word.toLowerCase());

      expect(result).toEqual(['Hello', 'WORLD', 'Hi']);
    });

    it('should preserve first occurrence', () => {
      const items = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 }, // duplicate type
        { type: 'C', value: 4 },
      ];

      const result = uniqBy(items, item => item.type);

      expect(result).toEqual([
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'C', value: 4 },
      ]);
    });
  });

  describe('iteratee function parameters', () => {
    it('should pass item, index, and array to iteratee', () => {
      const items = ['a', 'b', 'a', 'c'];
      const calls: Array<{
        item: string;
        index: number;
        array: readonly string[];
      }> = [];

      uniqBy(items, (item, index, array) => {
        calls.push({ item, index, array });
        return item;
      });

      expect(calls).toEqual([
        { item: 'a', index: 0, array: items },
        { item: 'b', index: 1, array: items },
        { item: 'a', index: 2, array: items },
        { item: 'c', index: 3, array: items },
      ]);
    });

    it('should use index in iteratee logic', () => {
      const items = [10, 20, 30, 40];
      // Keep only items at even indices
      const result = uniqBy(items, (item, index) => index % 2);

      expect(result).toEqual([10, 20]); // indices 0 and 1
    });
  });

  describe('complex scenarios', () => {
    it('should handle nested object properties', () => {
      const data = [
        { user: { profile: { age: 25 } }, id: 1 },
        { user: { profile: { age: 30 } }, id: 2 },
        { user: { profile: { age: 25 } }, id: 3 },
      ];

      const result = uniqBy(data, item => item.user.profile.age);

      expect(result).toEqual([
        { user: { profile: { age: 25 } }, id: 1 },
        { user: { profile: { age: 30 } }, id: 2 },
      ]);
    });

    it('should handle computed values', () => {
      const rectangles = [
        { width: 10, height: 5 },
        { width: 4, height: 7 },
        { width: 2, height: 14 }, // same area as second
        { width: 5, height: 6 },
      ];

      const result = uniqBy(rectangles, rect => rect.width * rect.height);

      expect(result).toEqual([
        { width: 10, height: 5 }, // area: 50
        { width: 4, height: 7 }, // area: 28
        { width: 5, height: 6 }, // area: 30
      ]);
    });

    it('should handle array results from iteratee', () => {
      const data = [
        { tags: ['a', 'b'] },
        { tags: ['c', 'd'] },
        { tags: ['a', 'b'] }, // same tags
      ];

      const result = uniqBy(data, item => item.tags.join(','));

      expect(result).toEqual([{ tags: ['a', 'b'] }, { tags: ['c', 'd'] }]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = uniqBy([], x => x);
      expect(result).toEqual([]);
    });

    it('should handle iteratee returning undefined', () => {
      const items = [1, 2, 3];
      const result = uniqBy(items, () => undefined);

      expect(result).toEqual([1]); // Only first item kept
    });

    it('should handle iteratee returning null', () => {
      const items = ['a', 'b', 'c'];
      const result = uniqBy(items, () => null);

      expect(result).toEqual(['a']); // Only first item kept
    });

    it('should handle iteratee returning NaN', () => {
      const items = [1, 2, 3];
      const result = uniqBy(items, () => NaN);

      expect(result).toEqual([1]); // Only first item kept (NaN equals NaN in Set)
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => uniqBy('not an array' as any, x => x)).toThrow(
        'Expected first argument to be an array'
      );
    });

    it('should throw for non-function iteratee', () => {
      expect(() => uniqBy([1, 2, 3], 'not a function' as any)).toThrow(
        'Expected iteratee to be a function'
      );
      expect(() => uniqBy([1, 2, 3], null as any)).toThrow(
        'Expected iteratee to be a function'
      );
    });
  });

  describe('real-world use cases', () => {
    it('should deduplicate API responses', () => {
      const apiResponses = [
        { id: '1', name: 'John', timestamp: '2023-01-01' },
        { id: '2', name: 'Jane', timestamp: '2023-01-02' },
        { id: '1', name: 'John', timestamp: '2023-01-03' }, // later timestamp
      ];

      const result = uniqBy(apiResponses, response => response.id);

      expect(result).toEqual([
        { id: '1', name: 'John', timestamp: '2023-01-01' },
        { id: '2', name: 'Jane', timestamp: '2023-01-02' },
      ]);
    });

    it('should deduplicate by email domain', () => {
      const emails = [
        'john@gmail.com',
        'jane@yahoo.com',
        'bob@gmail.com',
        'alice@hotmail.com',
        'charlie@yahoo.com',
      ];

      const result = uniqBy(emails, email => email.split('@')[1]);

      expect(result).toEqual([
        'john@gmail.com',
        'jane@yahoo.com',
        'alice@hotmail.com',
      ]);
    });

    it('should group by date (ignoring time)', () => {
      const events = [
        { name: 'Event 1', date: '2023-01-01T10:00:00Z' },
        { name: 'Event 2', date: '2023-01-01T14:00:00Z' }, // same day
        { name: 'Event 3', date: '2023-01-02T09:00:00Z' },
      ];

      const result = uniqBy(events, event => event.date.split('T')[0]);

      expect(result).toEqual([
        { name: 'Event 1', date: '2023-01-01T10:00:00Z' },
        { name: 'Event 3', date: '2023-01-02T09:00:00Z' },
      ]);
    });
  });
});

describe('uniqByProperty', () => {
  describe('basic functionality', () => {
    it('should remove duplicates by property', () => {
      const users = [
        { id: 1, name: 'John', active: true },
        { id: 2, name: 'Jane', active: false },
        { id: 1, name: 'Johnny', active: true }, // duplicate id
      ];

      const result = uniqByProperty(users, 'id');

      expect(result).toEqual([
        { id: 1, name: 'John', active: true },
        { id: 2, name: 'Jane', active: false },
      ]);
    });

    it('should work with string properties', () => {
      const products = [
        { sku: 'A001', name: 'Product A', price: 10.99 },
        { sku: 'B002', name: 'Product B', price: 15.99 },
        { sku: 'A001', name: 'Product A Updated', price: 12.99 },
      ];

      const result = uniqByProperty(products, 'sku');

      expect(result).toEqual([
        { sku: 'A001', name: 'Product A', price: 10.99 },
        { sku: 'B002', name: 'Product B', price: 15.99 },
      ]);
    });

    it('should work with boolean properties', () => {
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true }, // duplicate active state
        { id: 4, active: false }, // duplicate active state
      ];

      const result = uniqByProperty(items, 'active');

      expect(result).toEqual([
        { id: 1, active: true },
        { id: 2, active: false },
      ]);
    });

    it('should work with number properties', () => {
      const scores = [
        { player: 'Alice', score: 100 },
        { player: 'Bob', score: 85 },
        { player: 'Charlie', score: 100 }, // duplicate score
        { player: 'Diana', score: 95 },
      ];

      const result = uniqByProperty(scores, 'score');

      expect(result).toEqual([
        { player: 'Alice', score: 100 },
        { player: 'Bob', score: 85 },
        { player: 'Diana', score: 95 },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle properties with undefined values', () => {
      const items = [
        { id: 1, category: 'A' },
        { id: 2, category: undefined },
        { id: 3, category: 'B' },
        { id: 4, category: undefined }, // duplicate undefined
      ];

      const result = uniqByProperty(items, 'category');

      expect(result).toEqual([
        { id: 1, category: 'A' },
        { id: 2, category: undefined },
        { id: 3, category: 'B' },
      ]);
    });

    it('should handle properties with null values', () => {
      const items = [
        { id: 1, data: 'value1' },
        { id: 2, data: null },
        { id: 3, data: 'value2' },
        { id: 4, data: null }, // duplicate null
      ];

      const result = uniqByProperty(items, 'data');

      expect(result).toEqual([
        { id: 1, data: 'value1' },
        { id: 2, data: null },
        { id: 3, data: 'value2' },
      ]);
    });

    it('should handle missing properties', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2 }, // missing name property
        { id: 3, name: 'Item 3' },
        { id: 4 }, // missing name property (duplicate undefined)
      ];

      const result = uniqByProperty(items, 'name' as keyof (typeof items)[0]);

      expect(result).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2 },
        { id: 3, name: 'Item 3' },
      ]);
    });
  });

  describe('TypeScript type safety', () => {
    it('should preserve types correctly', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const users: User[] = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
        { id: 1, name: 'Johnny', email: 'johnny@example.com' },
      ];

      const result = uniqByProperty(users, 'id');

      // TypeScript should infer User[] type
      expect(result[0]!.id).toBe(1);
      expect(result[0]!.name).toBe('John');
      expect(result[0]!.email).toBe('john@example.com');
    });
  });

  describe('real-world use cases', () => {
    it('should deduplicate shopping cart items', () => {
      const cartItems = [
        { productId: 'P001', name: 'Laptop', quantity: 1 },
        { productId: 'P002', name: 'Mouse', quantity: 2 },
        { productId: 'P001', name: 'Laptop', quantity: 1 }, // duplicate product
      ];

      const result = uniqByProperty(cartItems, 'productId');

      expect(result).toEqual([
        { productId: 'P001', name: 'Laptop', quantity: 1 },
        { productId: 'P002', name: 'Mouse', quantity: 2 },
      ]);
    });

    it('should deduplicate by category', () => {
      const products = [
        { id: 1, name: 'iPhone', category: 'Electronics' },
        { id: 2, name: 'T-Shirt', category: 'Clothing' },
        { id: 3, name: 'MacBook', category: 'Electronics' }, // duplicate category
        { id: 4, name: 'Jeans', category: 'Clothing' }, // duplicate category
      ];

      const result = uniqByProperty(products, 'category');

      expect(result).toEqual([
        { id: 1, name: 'iPhone', category: 'Electronics' },
        { id: 2, name: 'T-Shirt', category: 'Clothing' },
      ]);
    });
  });
});
