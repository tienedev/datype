import { describe, it, expect } from 'vitest';
import { compact, compactBy, compactWith } from './index';

describe('compact', () => {
  describe('basic functionality', () => {
    it('should remove all falsy values', () => {
      const mixed = [0, 1, false, 2, '', 3, null, 4, undefined, 5, NaN];
      const result = compact(mixed);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should preserve all truthy values', () => {
      const truthy = [1, 'hello', true, {}, [], 'world', 42];
      const result = compact(truthy);

      expect(result).toEqual([1, 'hello', true, {}, [], 'world', 42]);
    });

    it('should handle arrays with only falsy values', () => {
      const falsy = [false, null, 0, '', undefined, NaN];
      const result = compact(falsy);

      expect(result).toEqual([]);
    });

    it('should handle arrays with only truthy values', () => {
      const truthy = [1, 'test', true, {}];
      const result = compact(truthy);

      expect(result).toEqual([1, 'test', true, {}]);
    });

    it('should handle empty arrays', () => {
      const result = compact([]);
      expect(result).toEqual([]);
    });
  });

  describe('specific falsy values', () => {
    it('should remove false but keep true', () => {
      const booleans = [true, false, true, false];
      const result = compact(booleans);

      expect(result).toEqual([true, true]);
    });

    it('should remove null and undefined', () => {
      const withNulls = [1, null, 2, undefined, 3];
      const result = compact(withNulls);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should remove zero but keep other numbers', () => {
      const numbers = [0, 1, -1, 0, 2, -0];
      const result = compact(numbers);

      expect(result).toEqual([1, -1, 2]);
    });

    it('should remove empty strings but keep non-empty strings', () => {
      const strings = ['', 'hello', '', 'world', ''];
      const result = compact(strings);

      expect(result).toEqual(['hello', 'world']);
    });

    it('should remove NaN but keep other numbers', () => {
      const withNaN = [1, NaN, 2, NaN, 3];
      const result = compact(withNaN);

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('object and array handling', () => {
    it('should keep all objects (including empty)', () => {
      const objects = [{}, { a: 1 }, null, { b: 2 }, undefined];
      const result = compact(objects);

      expect(result).toEqual([{}, { a: 1 }, { b: 2 }]);
    });

    it('should keep all arrays (including empty)', () => {
      const arrays = [[], [1, 2], null, [3], undefined];
      const result = compact(arrays);

      expect(result).toEqual([[], [1, 2], [3]]);
    });

    it('should keep functions', () => {
      const func = () => {};
      const withFunction = [func, null, 'test', undefined];
      const result = compact(withFunction);

      expect(result).toEqual([func, 'test']);
    });

    it('should keep Dates', () => {
      const date = new Date();
      const withDate = [date, null, 'test', undefined];
      const result = compact(withDate);

      expect(result).toEqual([date, 'test']);
    });
  });

  describe('edge cases', () => {
    it('should handle sparse arrays', () => {
      const sparse = [1, , 2, , 3]; // eslint-disable-line no-sparse-arrays
      const result = compact(sparse);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle mixed types correctly', () => {
      const mixed = [
        0,
        '0',
        false,
        'false',
        null,
        'null',
        undefined,
        'undefined',
        NaN,
        'NaN',
        '',
        ' ',
      ];
      const result = compact(mixed);

      expect(result).toEqual(['0', 'false', 'null', 'undefined', 'NaN', ' ']);
    });

    it('should handle arrays with duplicate falsy values', () => {
      const duplicates = [null, null, 0, 0, false, false, '', ''];
      const result = compact(duplicates);

      expect(result).toEqual([]);
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, null, 2, false, 3];
      const result = compact(original);

      expect(original).toEqual([1, null, 2, false, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return a new array', () => {
      const original = [1, 2, 3];
      const result = compact(original);

      expect(result).not.toBe(original);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => compact('not an array' as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => compact(null as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => compact(undefined as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => compact(123 as any)).toThrow(
        'Expected first argument to be an array'
      );
    });
  });

  describe('TypeScript type inference', () => {
    it('should properly narrow types', () => {
      const mixed: (string | null | undefined | number)[] = [
        'hello',
        null,
        42,
        undefined,
        'world',
      ];
      const result = compact(mixed);

      // Result should be (string | number)[] - NonNullable<string | null | undefined | number>
      expect(result).toEqual(['hello', 42, 'world']);
      expect(typeof result[0]).toBe('string');
      expect(typeof result[1]).toBe('number');
    });
  });

  describe('real-world use cases', () => {
    it('should clean form data', () => {
      const formData = {
        name: 'John',
        email: '',
        age: 0,
        active: true,
        notes: null,
        phone: '123-456-7890',
      };

      const cleanValues = compact(Object.values(formData));
      expect(cleanValues).toEqual(['John', true, '123-456-7890']);
    });

    it('should filter API response data', () => {
      const apiResponse = [
        { id: 1, name: 'Item 1' },
        null, // deleted item
        { id: 2, name: 'Item 2' },
        undefined, // error in response
        { id: 3, name: 'Item 3' },
      ];

      const validItems = compact(apiResponse);
      expect(validItems).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]);
    });

    it('should clean configuration arrays', () => {
      const config = {
        endpoints: [
          'https://api.example.com',
          '',
          null,
          'https://backup.example.com',
        ],
        features: [true, false, null, true, undefined],
        limits: [100, 0, null, 200],
      };

      expect(compact(config.endpoints)).toEqual([
        'https://api.example.com',
        'https://backup.example.com',
      ]);
      expect(compact(config.features)).toEqual([true, true]);
      expect(compact(config.limits)).toEqual([100, 200]);
    });
  });
});

describe('compactBy', () => {
  describe('basic functionality', () => {
    it('should remove specified values', () => {
      const data = [1, 0, 2, -1, 3, 0, 4];
      const result = compactBy(data, [0, -1]);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should remove multiple string values', () => {
      const words = ['hello', 'REMOVE', 'world', 'DELETE', 'foo'];
      const result = compactBy(words, ['REMOVE', 'DELETE']);

      expect(result).toEqual(['hello', 'world', 'foo']);
    });

    it('should preserve order', () => {
      const items = ['a', 'REMOVE', 'b', 'c', 'REMOVE', 'd'];
      const result = compactBy(items, ['REMOVE']);

      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should handle empty removal array', () => {
      const data = [1, 2, 3, 4];
      const result = compactBy(data, []);

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('selective removal', () => {
    it('should remove null but keep other falsy values', () => {
      const mixed = [0, null, false, '', undefined, 1];
      const result = compactBy(mixed, [null]);

      expect(result).toEqual([0, false, '', undefined, 1]);
    });

    it('should remove undefined but keep null', () => {
      const mixed = [null, undefined, 'keep', undefined, null];
      const result = compactBy(mixed, [undefined]);

      expect(result).toEqual([null, 'keep', null]);
    });

    it('should remove specific numbers', () => {
      const numbers = [1, 2, 3, 4, 5, 2, 3];
      const result = compactBy(numbers, [2, 4]);

      expect(result).toEqual([1, 3, 5, 3]);
    });

    it('should handle different types in removal array', () => {
      const various = [1, null, 'keep', undefined, 0, 'remove', false];
      const result = compactBy(various, [null, undefined, 'remove']);

      expect(result).toEqual([1, 'keep', 0, false]);
    });
  });

  describe('object handling', () => {
    it('should remove objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };

      const objects = [obj1, obj2, obj1, obj3, obj2];
      const result = compactBy(objects, [obj1, obj3]);

      expect(result).toEqual([obj2, obj2]);
    });

    it('should not remove objects with same content but different reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 1 }; // Same content, different reference

      const objects = [obj1, obj2];
      const result = compactBy(objects, [obj1]);

      expect(result).toEqual([obj2]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = compactBy([], [1, 2, 3]);
      expect(result).toEqual([]);
    });

    it('should handle NaN correctly', () => {
      const withNaN = [1, NaN, 2, NaN, 3];
      const result = compactBy(withNaN, [NaN]);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle removal of all elements', () => {
      const data = [1, 2, 3];
      const result = compactBy(data, [1, 2, 3]);

      expect(result).toEqual([]);
    });
  });

  describe('immutability', () => {
    it('should not modify original arrays', () => {
      const original = [1, 2, 3, 4];
      const toRemove = [2, 4];
      const result = compactBy(original, toRemove);

      expect(original).toEqual([1, 2, 3, 4]);
      expect(toRemove).toEqual([2, 4]);
      expect(result).toEqual([1, 3]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array first argument', () => {
      expect(() => compactBy('not array' as any, [])).toThrow(
        'Expected first argument to be an array'
      );
    });

    it('should throw for non-array second argument', () => {
      expect(() => compactBy([1, 2, 3], 'not array' as any)).toThrow(
        'Expected second argument to be an array'
      );
    });
  });

  describe('performance', () => {
    it('should handle large removal sets efficiently', () => {
      const data = Array.from({ length: 1000 }, (_, i) => i);
      const toRemove = Array.from({ length: 100 }, (_, i) => i * 2); // Remove even numbers
      const result = compactBy(data, toRemove);

      // Should keep odd numbers
      expect(result).toHaveLength(900);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(3);
    });
  });
});

describe('compactWith', () => {
  describe('basic functionality', () => {
    it('should remove based on predicate', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = compactWith(numbers, n => n % 2 === 0);

      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    it('should remove objects based on property', () => {
      const users = [
        { name: 'John', active: true },
        { name: 'Jane', active: false },
        { name: 'Bob', active: true },
        { name: 'Alice', active: false },
      ];

      const result = compactWith(users, user => !user.active);

      expect(result).toEqual([
        { name: 'John', active: true },
        { name: 'Bob', active: true },
      ]);
    });

    it('should remove based on string length', () => {
      const words = ['hi', 'hello', 'a', 'world', 'js'];
      const result = compactWith(words, word => word.length <= 2);

      expect(result).toEqual(['hello', 'world']);
    });

    it('should preserve items when predicate returns false', () => {
      const items = [1, 2, 3, 4, 5];
      const result = compactWith(items, () => false);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should remove all items when predicate returns true', () => {
      const items = [1, 2, 3, 4, 5];
      const result = compactWith(items, () => true);

      expect(result).toEqual([]);
    });
  });

  describe('predicate function parameters', () => {
    it('should pass item, index, and array to predicate', () => {
      const items = ['a', 'b', 'c'];
      const calls: Array<{
        item: string;
        index: number;
        array: readonly string[];
      }> = [];

      compactWith(items, (item, index, array) => {
        calls.push({ item, index, array });
        return false; // Keep all items
      });

      expect(calls).toEqual([
        { item: 'a', index: 0, array: items },
        { item: 'b', index: 1, array: items },
        { item: 'c', index: 2, array: items },
      ]);
    });

    it('should use index in predicate logic', () => {
      const items = [10, 20, 30, 40, 50];
      // Remove items at even indices
      const result = compactWith(items, (item, index) => index % 2 === 0);

      expect(result).toEqual([20, 40]); // Items at indices 1 and 3
    });
  });

  describe('complex conditions', () => {
    it('should handle complex object filtering', () => {
      const products = [
        { name: 'Laptop', price: 1000, inStock: true },
        { name: 'Mouse', price: 25, inStock: false },
        { name: 'Keyboard', price: 100, inStock: true },
        { name: 'Monitor', price: 300, inStock: false },
      ];

      // Keep only expensive in-stock items
      const result = compactWith(products, p => !p.inStock || p.price < 100);

      expect(result).toEqual([
        { name: 'Laptop', price: 1000, inStock: true },
        { name: 'Keyboard', price: 100, inStock: true },
      ]);
    });

    it('should handle nested property access', () => {
      const data = [
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 17 } } },
        { user: { profile: { age: 30 } } },
        { user: { profile: { age: 16 } } },
      ];

      // Remove minors
      const result = compactWith(data, item => item.user.profile.age < 18);

      expect(result).toEqual([
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 30 } } },
      ]);
    });

    it('should handle multiple conditions', () => {
      const scores = [
        { player: 'Alice', score: 95, valid: true },
        { player: 'Bob', score: 45, valid: true },
        { player: 'Charlie', score: 85, valid: false },
        { player: 'Diana', score: 75, valid: true },
      ];

      // Remove invalid scores or scores below 70
      const result = compactWith(scores, s => !s.valid || s.score < 70);

      expect(result).toEqual([
        { player: 'Alice', score: 95, valid: true },
        { player: 'Diana', score: 75, valid: true },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = compactWith([], () => true);
      expect(result).toEqual([]);
    });

    it('should handle predicate throwing errors', () => {
      const items = [1, 2, 3];

      expect(() => {
        compactWith(items, () => {
          throw new Error('Predicate error');
        });
      }).toThrow('Predicate error');
    });

    it('should handle falsy return values correctly', () => {
      const items = [1, 2, 3, 4, 5];

      // Predicate returns various falsy values (cast to boolean)
      let counter = 0;
      const result = compactWith(items, () => {
        const falsyValues = [false, 0, '', null, undefined];
        return Boolean(falsyValues[counter++ % falsyValues.length]);
      });

      expect(result).toEqual([1, 2, 3, 4, 5]); // All falsy = keep all
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const result = compactWith(original, n => n % 2 === 0);

      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(result).toEqual([1, 3, 5]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => compactWith('not array' as any, () => false)).toThrow(
        'Expected first argument to be an array'
      );
    });

    it('should throw for non-function predicate', () => {
      expect(() => compactWith([1, 2, 3], 'not function' as any)).toThrow(
        'Expected second argument to be a function'
      );
      expect(() => compactWith([1, 2, 3], null as any)).toThrow(
        'Expected second argument to be a function'
      );
    });
  });

  describe('real-world use cases', () => {
    it('should filter invalid email addresses', () => {
      const emails = [
        'valid@example.com',
        'invalid-email',
        'another@valid.com',
        '@invalid.com',
        'test@test.co',
      ];

      // Simple email validation
      const result = compactWith(
        emails,
        email => !email.includes('@') || email.startsWith('@')
      );

      expect(result).toEqual([
        'valid@example.com',
        'another@valid.com',
        'test@test.co',
      ]);
    });

    it('should filter expired items', () => {
      const items = [
        { name: 'Item 1', expiryDate: '2023-12-31' },
        { name: 'Item 2', expiryDate: '2022-01-01' }, // expired
        { name: 'Item 3', expiryDate: '2024-06-15' },
        { name: 'Item 4', expiryDate: '2021-12-31' }, // expired
      ];

      const currentDate = '2023-01-01';
      const result = compactWith(items, item => item.expiryDate < currentDate);

      expect(result).toEqual([
        { name: 'Item 1', expiryDate: '2023-12-31' },
        { name: 'Item 3', expiryDate: '2024-06-15' },
      ]);
    });

    it('should filter based on user permissions', () => {
      const features = [
        { name: 'dashboard', requiredLevel: 1 },
        { name: 'admin', requiredLevel: 5 },
        { name: 'reports', requiredLevel: 3 },
        { name: 'settings', requiredLevel: 2 },
      ];

      const userLevel = 3;
      const result = compactWith(
        features,
        feature => feature.requiredLevel > userLevel
      );

      expect(result).toEqual([
        { name: 'dashboard', requiredLevel: 1 },
        { name: 'reports', requiredLevel: 3 },
        { name: 'settings', requiredLevel: 2 },
      ]);
    });
  });
});
