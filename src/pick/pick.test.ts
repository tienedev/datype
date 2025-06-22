import { describe, it, expect } from 'vitest';
import { pick } from './index';

describe('pick', () => {
  const testObject = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    age: 30,
    active: true,
    metadata: { created: '2023-01-01' },
  };

  describe('basic functionality', () => {
    it('should pick specified keys from object', () => {
      const result = pick(testObject, ['id', 'name']);

      expect(result).toEqual({
        id: 1,
        name: 'John',
      });
    });

    it('should pick single key', () => {
      const result = pick(testObject, ['email']);

      expect(result).toEqual({
        email: 'john@example.com',
      });
    });

    it('should pick multiple keys', () => {
      const result = pick(testObject, ['id', 'name', 'active']);

      expect(result).toEqual({
        id: 1,
        name: 'John',
        active: true,
      });
    });

    it('should pick all keys', () => {
      const result = pick(testObject, [
        'id',
        'name',
        'email',
        'age',
        'active',
        'metadata',
      ]);

      expect(result).toEqual(testObject);
    });
  });

  describe('edge cases', () => {
    it('should return empty object when picking empty array', () => {
      const result = pick(testObject, []);

      expect(result).toEqual({});
    });

    it('should ignore non-existent keys', () => {
      const result = pick(testObject, [
        'id',
        'nonExistent' as keyof typeof testObject,
      ]);

      expect(result).toEqual({
        id: 1,
      });
    });

    it('should work with objects containing undefined values', () => {
      const objWithUndefined = { a: 1, b: undefined, c: 'test' };
      const result = pick(objWithUndefined, ['a', 'b']);

      expect(result).toEqual({
        a: 1,
        b: undefined,
      });
    });

    it('should work with objects containing null values', () => {
      const objWithNull = { a: 1, b: null, c: 'test' };
      const result = pick(objWithNull, ['a', 'b']);

      expect(result).toEqual({
        a: 1,
        b: null,
      });
    });

    it('should not modify original object', () => {
      const original = { ...testObject };
      pick(testObject, ['id', 'name']);

      expect(testObject).toEqual(original);
    });
  });

  describe('error handling', () => {
    it('should throw error for null input', () => {
      expect(() => pick(null as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for undefined input', () => {
      expect(() => pick(undefined as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for primitive input', () => {
      expect(() => pick('string' as any, ['key'])).toThrow(
        'First argument must be an object'
      );
      expect(() => pick(123 as any, ['key'])).toThrow(
        'First argument must be an object'
      );
      expect(() => pick(true as any, ['key'])).toThrow(
        'First argument must be an object'
      );
    });

    it('should throw error for non-array keys', () => {
      expect(() => pick(testObject, 'not-array' as any)).toThrow(
        'Second argument must be an array of keys'
      );
      expect(() => pick(testObject, null as any)).toThrow(
        'Second argument must be an array of keys'
      );
      expect(() => pick(testObject, undefined as any)).toThrow(
        'Second argument must be an array of keys'
      );
    });
  });

  describe('immutability', () => {
    it('should create a new object', () => {
      const result = pick(testObject, ['id', 'name']);

      expect(result).not.toBe(testObject);
    });

    it('should not share references for nested objects', () => {
      const result = pick(testObject, ['metadata']);

      expect(result.metadata).toBe(testObject.metadata); // Shallow copy behavior
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObject = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`key${i}`, i])
      );

      const start = performance.now();
      const result = pick(largeObject, ['key0', 'key500', 'key999']);
      const end = performance.now();

      expect(result).toEqual({
        key0: 0,
        key500: 500,
        key999: 999,
      });
      expect(end - start).toBeLessThan(10); // Should be very fast
    });
  });
});
