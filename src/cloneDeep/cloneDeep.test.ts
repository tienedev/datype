import { describe, it, expect } from 'vitest';
import { cloneDeep } from './index';

describe('cloneDeep', () => {
  describe('primitive values', () => {
    it('should return the same value for null', () => {
      expect(cloneDeep(null)).toBe(null);
    });

    it('should return the same value for undefined', () => {
      expect(cloneDeep(undefined)).toBe(undefined);
    });

    it('should return the same value for numbers', () => {
      expect(cloneDeep(42)).toBe(42);
      expect(cloneDeep(0)).toBe(0);
      expect(cloneDeep(-1)).toBe(-1);
      expect(cloneDeep(NaN)).toBeNaN();
      expect(cloneDeep(Infinity)).toBe(Infinity);
    });

    it('should return the same value for strings', () => {
      expect(cloneDeep('hello')).toBe('hello');
      expect(cloneDeep('')).toBe('');
    });

    it('should return the same value for booleans', () => {
      expect(cloneDeep(true)).toBe(true);
      expect(cloneDeep(false)).toBe(false);
    });
  });

  describe('objects', () => {
    it('should clone simple objects', () => {
      const original = { name: 'John', age: 30 };
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone nested objects', () => {
      const original = {
        user: {
          name: 'John',
          address: {
            city: 'Paris',
            zip: '75001',
          },
        },
      };

      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.user).not.toBe(original.user);
      expect(cloned.user.address).not.toBe(original.user.address);

      // Mutating cloned should not affect original
      cloned.user.address.city = 'London';
      expect(original.user.address.city).toBe('Paris');
    });

    it('should clone empty objects', () => {
      const original = {};
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('arrays', () => {
    it('should clone simple arrays', () => {
      const original = [1, 2, 3];
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone nested arrays', () => {
      const original = [
        [1, 2],
        [3, 4],
      ];
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
      expect(cloned[1]).not.toBe(original[1]);

      // Mutating cloned should not affect original
      cloned[0].push(5);
      expect(original[0]).toEqual([1, 2]);
    });

    it('should clone arrays with objects', () => {
      const original = [{ name: 'John' }, { name: 'Jane' }];
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
      expect(cloned[1]).not.toBe(original[1]);

      // Mutating cloned should not affect original
      cloned[0].name = 'Bob';
      expect(original[0].name).toBe('John');
    });

    it('should clone empty arrays', () => {
      const original: unknown[] = [];
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('Date objects', () => {
    it('should clone Date objects', () => {
      const original = new Date('2023-01-01');
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Date).toBe(true);

      // Mutating cloned should not affect original
      cloned.setFullYear(2024);
      expect(original.getFullYear()).toBe(2023);
    });
  });

  describe('RegExp objects', () => {
    it('should clone RegExp objects', () => {
      const original = /test/gi;
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof RegExp).toBe(true);
      expect(cloned.source).toBe(original.source);
      expect(cloned.flags).toBe(original.flags);
    });
  });

  describe('Set objects', () => {
    it('should clone Set objects', () => {
      const original = new Set([1, 2, 3]);
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Set).toBe(true);

      // Mutating cloned should not affect original
      cloned.add(4);
      expect(original.has(4)).toBe(false);
    });

    it('should clone Set with objects', () => {
      const obj1 = { name: 'John' };
      const obj2 = { name: 'Jane' };
      const original = new Set([obj1, obj2]);
      const cloned = cloneDeep(original);

      expect(cloned.size).toBe(original.size);
      expect(cloned).not.toBe(original);

      // Objects in the set should be cloned too
      const clonedArray = Array.from(cloned);
      const originalArray = Array.from(original);
      expect(clonedArray[0]).not.toBe(originalArray[0]);
      expect(clonedArray[1]).not.toBe(originalArray[1]);
    });
  });

  describe('Map objects', () => {
    it('should clone Map objects', () => {
      const original = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Map).toBe(true);

      // Mutating cloned should not affect original
      cloned.set('key3', 'value3');
      expect(original.has('key3')).toBe(false);
    });

    it('should clone Map with object keys and values', () => {
      const keyObj = { id: 1 };
      const valueObj = { name: 'John' };
      const original = new Map([[keyObj, valueObj]]);
      const cloned = cloneDeep(original);

      expect(cloned.size).toBe(original.size);
      expect(cloned).not.toBe(original);

      // Both keys and values should be cloned
      const clonedEntry = Array.from(cloned.entries())[0];
      const originalEntry = Array.from(original.entries())[0];
      expect(clonedEntry[0]).not.toBe(originalEntry[0]); // key
      expect(clonedEntry[1]).not.toBe(originalEntry[1]); // value
    });
  });

  describe('circular references', () => {
    it('should handle circular references in objects', () => {
      const original: Record<string, unknown> = { name: 'John' };
      original.self = original;

      const cloned = cloneDeep(original);

      expect(cloned).not.toBe(original);
      expect(cloned.name).toBe(original.name);
      expect(cloned.self).toBe(cloned); // Should point to the cloned object
      expect(cloned.self).not.toBe(original);
    });

    it('should handle circular references in arrays', () => {
      const original: unknown[] = [1, 2];
      original.push(original);

      const cloned = cloneDeep(original);

      expect(cloned).not.toBe(original);
      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect(cloned[2]).toBe(cloned); // Should point to the cloned array
      expect(cloned[2]).not.toBe(original);
    });
  });

  describe('complex mixed structures', () => {
    it('should clone complex nested structures', () => {
      const original = {
        user: {
          name: 'John',
          hobbies: ['reading', 'coding'],
          metadata: new Map([['created', new Date('2023-01-01')]]),
          tags: new Set(['developer', 'reader']),
        },
        config: {
          settings: {
            theme: 'dark',
            features: {
              notifications: true,
            },
          },
        },
      };

      const cloned = cloneDeep(original);

      // Check that everything is properly cloned
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.user).not.toBe(original.user);
      expect(cloned.user.hobbies).not.toBe(original.user.hobbies);
      expect(cloned.user.metadata).not.toBe(original.user.metadata);
      expect(cloned.user.tags).not.toBe(original.user.tags);
      expect(cloned.config.settings).not.toBe(original.config.settings);

      // Mutating cloned should not affect original
      cloned.user.hobbies.push('gaming');
      cloned.user.tags.add('gamer');
      cloned.config.settings.features.notifications = false;

      expect(original.user.hobbies).toEqual(['reading', 'coding']);
      expect(original.user.tags.has('gamer')).toBe(false);
      expect(original.config.settings.features.notifications).toBe(true);
    });
  });

  describe('functions and special cases', () => {
    it('should return functions as-is', () => {
      const fn = () => 'hello';
      const cloned = cloneDeep(fn);

      expect(cloned).toBe(fn);
    });

    it('should handle objects with function properties', () => {
      const original = {
        name: 'John',
        greet: () => 'hello',
      };

      const cloned = cloneDeep(original);

      expect(cloned).not.toBe(original);
      expect(cloned.name).toBe(original.name);
      expect(cloned.greet).toBe(original.greet); // Function should be same reference
    });
  });
});
