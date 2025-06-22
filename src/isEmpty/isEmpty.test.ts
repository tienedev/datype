import { describe, it, expect } from 'vitest';
import { isEmpty } from './index';

describe('isEmpty', () => {
  describe('should return true for empty values', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return true for empty Set', () => {
      expect(isEmpty(new Set())).toBe(true);
    });

    it('should return true for empty Map', () => {
      expect(isEmpty(new Map())).toBe(true);
    });
  });

  describe('should return false for non-empty values', () => {
    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' ')).toBe(false);
      expect(isEmpty('0')).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([null])).toBe(false);
      expect(isEmpty([undefined])).toBe(false);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty({ key: null })).toBe(false);
      expect(isEmpty({ key: undefined })).toBe(false);
      expect(isEmpty({ 0: 'value' })).toBe(false);
    });

    it('should return false for non-empty Set', () => {
      expect(isEmpty(new Set([1]))).toBe(false);
      expect(isEmpty(new Set([1, 2, 3]))).toBe(false);
    });

    it('should return false for non-empty Map', () => {
      expect(isEmpty(new Map([['key', 'value']]))).toBe(false);
      expect(
        isEmpty(
          new Map([
            ['key1', 'value1'],
            ['key2', 'value2'],
          ])
        )
      ).toBe(false);
    });
  });

  describe('should return false for primitive values', () => {
    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(1)).toBe(false);
      expect(isEmpty(-1)).toBe(false);
      expect(isEmpty(NaN)).toBe(false);
      expect(isEmpty(Infinity)).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isEmpty(() => {})).toBe(false);
      expect(isEmpty(function () {})).toBe(false);
    });
  });

  describe('should handle special objects', () => {
    it('should return false for Date objects', () => {
      expect(isEmpty(new Date())).toBe(false);
    });

    it('should return false for RegExp objects', () => {
      expect(isEmpty(/test/)).toBe(false);
    });

    it('should return false for class instances', () => {
      class TestClass {}
      expect(isEmpty(new TestClass())).toBe(false);
    });

    it('should return true for objects with prototype but no own properties', () => {
      const obj = Object.create({ inherited: 'value' });
      expect(isEmpty(obj)).toBe(true); // No own properties = empty
    });

    it('should return true for plain objects with no own properties', () => {
      const obj = Object.create(null);
      expect(isEmpty(obj)).toBe(true);
    });
  });

  describe('TypeScript type narrowing', () => {
    it('should narrow types properly', () => {
      const value: string | null | undefined =
        Math.random() > 0.5 ? 'hello' : null;

      if (isEmpty(value)) {
        // TypeScript should know value is null | undefined | ''
        expect(value === null || value === undefined || value === '').toBe(
          true
        );
      } else {
        // TypeScript should know value is string (and not empty)
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });
});
