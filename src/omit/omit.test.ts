import { describe, it, expect } from 'vitest';
import { omit } from './index';

describe('omit', () => {
  const testObject = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    age: 30,
    active: true,
    metadata: { created: '2023-01-01' },
  };

  describe('basic functionality', () => {
    it('should omit specified keys from object', () => {
      const result = omit(testObject, ['email', 'age']);

      expect(result).toEqual({
        id: 1,
        name: 'John',
        active: true,
        metadata: { created: '2023-01-01' },
      });
    });

    it('should omit single key', () => {
      const result = omit(testObject, ['email']);

      expect(result).toEqual({
        id: 1,
        name: 'John',
        age: 30,
        active: true,
        metadata: { created: '2023-01-01' },
      });
    });

    it('should omit multiple keys', () => {
      const result = omit(testObject, ['id', 'email', 'metadata']);

      expect(result).toEqual({
        name: 'John',
        age: 30,
        active: true,
      });
    });

    it('should return copy when omitting empty array', () => {
      const result = omit(testObject, []);

      expect(result).toEqual(testObject);
      expect(result).not.toBe(testObject);
    });
  });

  describe('edge cases', () => {
    it('should return empty object when omitting all keys', () => {
      const result = omit(testObject, [
        'id',
        'name',
        'email',
        'age',
        'active',
        'metadata',
      ]);

      expect(result).toEqual({});
    });

    it('should ignore non-existent keys', () => {
      const result = omit(testObject, [
        'nonExistent' as keyof typeof testObject,
      ]);

      expect(result).toEqual(testObject);
      expect(result).not.toBe(testObject);
    });

    it('should work with objects containing undefined values', () => {
      const objWithUndefined = { a: 1, b: undefined, c: 'test' };
      const result = omit(objWithUndefined, ['b']);

      expect(result).toEqual({
        a: 1,
        c: 'test',
      });
    });

    it('should work with objects containing null values', () => {
      const objWithNull = { a: 1, b: null, c: 'test' };
      const result = omit(objWithNull, ['b']);

      expect(result).toEqual({
        a: 1,
        c: 'test',
      });
    });

    it('should not modify original object', () => {
      const original = { ...testObject };
      omit(testObject, ['email', 'age']);

      expect(testObject).toEqual(original);
    });
  });

  describe('error handling', () => {
    it('should throw error for null input', () => {
      expect(() => omit(null as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for undefined input', () => {
      expect(() => omit(undefined as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for primitive input', () => {
      expect(() => omit('string' as any, ['key'])).toThrow(
        'First argument must be an object'
      );
      expect(() => omit(123 as any, ['key'])).toThrow(
        'First argument must be an object'
      );
      expect(() => omit(true as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for non-array keys', () => {
      expect(() => omit(testObject, 'not-array' as any)).toThrow(
        'Second argument must be an array of keys'
      );
      expect(() => omit(testObject, null as any)).toThrow(
        'Second argument must be an array of keys'
      );
      expect(() => omit(testObject, undefined as any)).toThrow(
        'Second argument must be an array of keys'
      );
    });
  });

  describe('immutability', () => {
    it('should create a new object', () => {
      const result = omit(testObject, ['email']);

      expect(result).not.toBe(testObject);
    });

    it('should not share references for nested objects', () => {
      const result = omit(testObject, ['email']);

      expect(result.metadata).toBe(testObject.metadata); // Shallow copy behavior
    });
  });

  describe('property enumeration', () => {
    it('should only copy enumerable own properties', () => {
      const obj = { a: 1, b: 2 };
      Object.defineProperty(obj, 'nonEnumerable', {
        value: 'hidden',
        enumerable: false,
        writable: true,
        configurable: true,
      });

      const result = omit(obj, ['a']);

      expect(result).toEqual({ b: 2 });
      expect('nonEnumerable' in result).toBe(false);
    });

    it('should not copy inherited properties', () => {
      const parent = { inherited: 'value' };
      const child = Object.create(parent);
      child.own = 'ownValue';

      const result = omit(child, []);

      expect(result).toEqual({ own: 'ownValue' });
      expect('inherited' in result).toBe(false);
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObject = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`key${i}`, i])
      );

      const start = performance.now();
      const result = omit(largeObject, ['key0', 'key500', 'key999']);
      const end = performance.now();

      expect(Object.keys(result)).toHaveLength(997);
      expect(result.key0).toBeUndefined();
      expect(result.key500).toBeUndefined();
      expect(result.key999).toBeUndefined();
      expect(result.key1).toBe(1);
      expect(end - start).toBeLessThan(15); // Should be reasonably fast
    });
  });
});
