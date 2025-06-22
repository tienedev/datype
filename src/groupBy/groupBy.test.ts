import { describe, it, expect } from 'vitest';
import { groupBy } from './index';

describe('groupBy', () => {
  describe('basic functionality', () => {
    it('should group by string property', () => {
      const users = [
        { name: 'John', role: 'admin' },
        { name: 'Jane', role: 'user' },
        { name: 'Bob', role: 'admin' },
        { name: 'Alice', role: 'user' },
      ];

      const result = groupBy(users, 'role');

      expect(result.admin).toHaveLength(2);
      expect(result.admin[0].name).toBe('John');
      expect(result.admin[1].name).toBe('Bob');
      expect(result.user).toHaveLength(2);
      expect(result.user[0].name).toBe('Jane');
      expect(result.user[1].name).toBe('Alice');
    });

    it('should group by number property', () => {
      const items = [
        { id: 1, category: 1 },
        { id: 2, category: 2 },
        { id: 3, category: 1 },
        { id: 4, category: 3 },
      ];

      const result = groupBy(items, 'category');

      expect(result['1']).toHaveLength(2);
      expect(result['2']).toHaveLength(1);
      expect(result['3']).toHaveLength(1);
    });

    it('should handle empty arrays', () => {
      const result = groupBy([], 'key');
      expect(result).toEqual({});
    });

    it('should handle single item arrays', () => {
      const result = groupBy([{ type: 'test' }], 'type');
      expect(result.test).toHaveLength(1);
      expect(result.test[0].type).toBe('test');
    });
  });

  describe('function iteratee', () => {
    it('should group by function result', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const result = groupBy(numbers, n => (n % 2 === 0 ? 'even' : 'odd'));

      expect(result.even).toEqual([2, 4, 6]);
      expect(result.odd).toEqual([1, 3, 5]);
    });

    it('should group by complex function logic', () => {
      const users = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 35 },
        { name: 'Bob', age: 45 },
        { name: 'Alice', age: 15 },
      ];

      const result = groupBy(users, user => {
        if (user.age < 18) return 'minor';
        if (user.age < 35) return 'young';
        return 'adult';
      });

      expect(result.minor).toHaveLength(1);
      expect(result.young).toHaveLength(1);
      expect(result.adult).toHaveLength(2);
    });

    it('should handle functions returning different types', () => {
      const items = [1, 2, 3, 4, 5];
      const result = groupBy(items, n => n > 3);

      expect(result.true).toEqual([4, 5]);
      expect(result.false).toEqual([1, 2, 3]);
    });

    it('should group by nested property access in function', () => {
      const products = [
        { name: 'Laptop', category: { type: 'electronics' } },
        { name: 'Book', category: { type: 'media' } },
        { name: 'Phone', category: { type: 'electronics' } },
      ];

      const result = groupBy(products, p => p.category.type);

      expect(result.electronics).toHaveLength(2);
      expect(result.media).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined property values', () => {
      const items = [
        { value: 'test' },
        { value: null },
        { value: undefined },
        { value: 'test2' },
        { value: null },
      ];

      const result = groupBy(items, 'value');

      expect(result.test).toHaveLength(1);
      expect(result.test2).toHaveLength(1);
      expect(result.null).toHaveLength(2);
      expect(result.undefined).toHaveLength(1);
    });

    it('should handle missing properties', () => {
      const items = [
        { name: 'John' },
        { name: 'Jane', role: 'admin' },
        { name: 'Bob' },
      ];

      const result = groupBy(items, 'role' as any);

      expect(result.admin).toHaveLength(1);
      expect(result.undefined).toHaveLength(2);
    });

    it('should handle function returning null or undefined', () => {
      const items = [1, 2, 3, 4];
      const result = groupBy(items, n => (n % 2 === 0 ? null : undefined));

      expect(result.null).toHaveLength(2); // 2, 4
      expect(result.undefined).toHaveLength(2); // 1, 3
    });

    it('should handle objects with complex keys', () => {
      const items = [
        { key: 'simple' },
        { key: 'key with spaces' },
        { key: 'key-with-dashes' },
        { key: 'key_with_underscores' },
      ];

      const result = groupBy(items, 'key');

      expect(result['simple']).toHaveLength(1);
      expect(result['key with spaces']).toHaveLength(1);
      expect(result['key-with-dashes']).toHaveLength(1);
      expect(result['key_with_underscores']).toHaveLength(1);
    });
  });

  describe('real-world examples', () => {
    it('should group users by department', () => {
      const employees = [
        { name: 'John', department: 'Engineering', salary: 75000 },
        { name: 'Jane', department: 'Marketing', salary: 65000 },
        { name: 'Bob', department: 'Engineering', salary: 80000 },
        { name: 'Alice', department: 'Sales', salary: 70000 },
        { name: 'Charlie', department: 'Marketing', salary: 60000 },
      ];

      const result = groupBy(employees, 'department');

      expect(result.Engineering).toHaveLength(2);
      expect(result.Marketing).toHaveLength(2);
      expect(result.Sales).toHaveLength(1);

      expect(result.Engineering.map(e => e.name)).toEqual(['John', 'Bob']);
    });

    it('should group transactions by month', () => {
      const transactions = [
        { id: 1, date: '2023-01-15', amount: 100 },
        { id: 2, date: '2023-01-20', amount: 200 },
        { id: 3, date: '2023-02-10', amount: 150 },
        { id: 4, date: '2023-02-25', amount: 300 },
        { id: 5, date: '2023-03-05', amount: 250 },
      ];

      const result = groupBy(transactions, t => t.date.substring(0, 7)); // YYYY-MM

      expect(result['2023-01']).toHaveLength(2);
      expect(result['2023-02']).toHaveLength(2);
      expect(result['2023-03']).toHaveLength(1);
    });

    it('should group products by price range', () => {
      const products = [
        { name: 'Cheap Item', price: 10 },
        { name: 'Budget Item', price: 25 },
        { name: 'Mid Range', price: 50 },
        { name: 'Premium', price: 100 },
        { name: 'Luxury', price: 500 },
      ];

      const result = groupBy(products, p => {
        if (p.price < 30) return 'budget';
        if (p.price < 80) return 'mid-range';
        return 'premium';
      });

      expect(result.budget).toHaveLength(2);
      expect(result['mid-range']).toHaveLength(1);
      expect(result.premium).toHaveLength(2);
    });

    it('should group log entries by severity', () => {
      const logs = [
        { message: 'User login', level: 'info' },
        { message: 'Database error', level: 'error' },
        { message: 'Slow query', level: 'warn' },
        { message: 'User logout', level: 'info' },
        { message: 'Critical failure', level: 'error' },
      ];

      const result = groupBy(logs, 'level');

      expect(result.info).toHaveLength(2);
      expect(result.error).toHaveLength(2);
      expect(result.warn).toHaveLength(1);
    });
  });

  describe('performance and type safety', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        group: i % 100,
      }));

      const start = performance.now();
      const result = groupBy(largeArray, 'group');
      const end = performance.now();

      expect(Object.keys(result)).toHaveLength(100);
      expect(result['0']).toHaveLength(100);
      expect(end - start).toBeLessThan(100); // Should be fast
    });

    it('should preserve array order within groups', () => {
      const items = [
        { group: 'A', order: 1 },
        { group: 'B', order: 2 },
        { group: 'A', order: 3 },
        { group: 'B', order: 4 },
        { group: 'A', order: 5 },
      ];

      const result = groupBy(items, 'group');

      expect(result.A.map(item => item.order)).toEqual([1, 3, 5]);
      expect(result.B.map(item => item.order)).toEqual([2, 4]);
    });
  });

  describe('error handling', () => {
    it('should throw error for non-array input', () => {
      expect(() => groupBy(null as any, 'key')).toThrow(TypeError);
      expect(() => groupBy(undefined as any, 'key')).toThrow(TypeError);
      expect(() => groupBy('string' as any, 'key')).toThrow(TypeError);
      expect(() => groupBy(123 as any, 'key')).toThrow(TypeError);
      expect(() => groupBy({} as any, 'key')).toThrow(TypeError);
    });

    it('should throw error for invalid iteratee', () => {
      expect(() => groupBy([1, 2, 3], null as any)).toThrow(TypeError);
      expect(() => groupBy([1, 2, 3], undefined as any)).toThrow(TypeError);
      expect(() => groupBy([1, 2, 3], {} as any)).toThrow(TypeError);
    });
  });

  describe('TypeScript type inference', () => {
    it('should work with typed arrays', () => {
      interface User {
        name: string;
        role: 'admin' | 'user';
        age: number;
      }

      const users: User[] = [
        { name: 'John', role: 'admin', age: 30 },
        { name: 'Jane', role: 'user', age: 25 },
      ];

      const byRole = groupBy(users, 'role');
      const byAge = groupBy(users, user =>
        user.age > 27 ? 'senior' : 'junior'
      );

      // These should compile without type errors
      expect(byRole.admin[0].name).toBe('John');
      expect(byAge.senior[0].age).toBe(30);
    });
  });
});
