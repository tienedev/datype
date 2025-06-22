import { describe, it, expect } from 'vitest';
import { isEqual } from './index';

describe('isEqual', () => {
  describe('primitive values', () => {
    it('should return true for identical primitive values', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('hello', 'hello')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('hello', 'world')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(1, '1')).toBe(false);
    });

    it('should handle null and undefined correctly', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(undefined, 0)).toBe(false);
    });

    it('should handle NaN correctly (unlike ===)', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
      expect(isEqual(NaN, 0)).toBe(false);
    });

    it('should handle positive and negative zero correctly (unlike ===)', () => {
      expect(isEqual(+0, -0)).toBe(false);
      expect(isEqual(+0, +0)).toBe(true);
      expect(isEqual(-0, -0)).toBe(true);
    });
  });

  describe('objects', () => {
    it('should return true for objects with identical properties', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    });

    it('should return false for objects with different properties', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should perform deep comparison on nested objects', () => {
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(
        true
      );

      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(
        false
      );
    });

    it('should handle empty objects', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({}, { a: 1 })).toBe(false);
    });

    it('should compare object references for same objects', () => {
      const obj = { a: 1, b: 2 };
      expect(isEqual(obj, obj)).toBe(true);
    });
  });

  describe('arrays', () => {
    it('should return true for identical arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
    });

    it('should return false for arrays with different elements', () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    it('should perform deep comparison on nested arrays', () => {
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(true);
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 5],
          ]
        )
      ).toBe(false);
    });

    it('should handle empty arrays', () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([], [1])).toBe(false);
    });

    it('should handle mixed array/object structures', () => {
      expect(
        isEqual([{ a: 1 }, { b: [2, 3] }], [{ a: 1 }, { b: [2, 3] }])
      ).toBe(true);

      expect(
        isEqual([{ a: 1 }, { b: [2, 3] }], [{ a: 1 }, { b: [2, 4] }])
      ).toBe(false);
    });
  });

  describe('dates', () => {
    it('should return true for dates with same time', () => {
      const date1 = new Date('2023-01-01T00:00:00.000Z');
      const date2 = new Date('2023-01-01T00:00:00.000Z');
      expect(isEqual(date1, date2)).toBe(true);
    });

    it('should return false for dates with different times', () => {
      const date1 = new Date('2023-01-01T00:00:00.000Z');
      const date2 = new Date('2023-01-02T00:00:00.000Z');
      expect(isEqual(date1, date2)).toBe(false);
    });

    it('should handle invalid dates', () => {
      const invalidDate1 = new Date('invalid');
      const invalidDate2 = new Date('invalid');
      const validDate = new Date('2023-01-01');

      expect(isEqual(invalidDate1, invalidDate2)).toBe(true); // Both have NaN time
      expect(isEqual(invalidDate1, validDate)).toBe(false);
    });
  });

  describe('regular expressions', () => {
    it('should return true for regex with same source and flags', () => {
      expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
      expect(isEqual(/test/, /test/)).toBe(true);
    });

    it('should return false for regex with different source or flags', () => {
      expect(isEqual(/abc/gi, /abc/g)).toBe(false);
      expect(isEqual(/abc/, /def/)).toBe(false);
    });
  });

  describe('sets', () => {
    it('should return true for sets with same values', () => {
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
      expect(isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
    });

    it('should return false for sets with different values', () => {
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).toBe(false);
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
    });

    it('should handle nested objects in sets', () => {
      expect(
        isEqual(new Set([{ a: 1 }, { b: 2 }]), new Set([{ a: 1 }, { b: 2 }]))
      ).toBe(true);

      expect(
        isEqual(new Set([{ a: 1 }, { b: 2 }]), new Set([{ a: 1 }, { b: 3 }]))
      ).toBe(false);
    });
  });

  describe('maps', () => {
    it('should return true for maps with same key-value pairs', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const map2 = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      expect(isEqual(map1, map2)).toBe(true);
    });

    it('should return false for maps with different key-value pairs', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const map2 = new Map([
        ['a', 1],
        ['b', 3],
      ]);
      expect(isEqual(map1, map2)).toBe(false);
    });

    it('should handle complex keys and values in maps', () => {
      const map1 = new Map([[{ key: 'a' }, { value: 1 }]]);
      const map2 = new Map([[{ key: 'a' }, { value: 1 }]]);
      expect(isEqual(map1, map2)).toBe(true);
    });
  });

  describe('functions', () => {
    it('should use reference equality for functions', () => {
      const fn1 = () => 'hello';
      const fn2 = () => 'hello';

      expect(isEqual(fn1, fn1)).toBe(true);
      expect(isEqual(fn1, fn2)).toBe(false);
    });
  });

  describe('mixed types', () => {
    it('should return false for different types', () => {
      expect(isEqual([], {})).toBe(false);
      expect(isEqual('123', 123)).toBe(false);
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual(undefined, null)).toBe(false);
    });

    it('should handle complex nested structures', () => {
      const complex1 = {
        str: 'hello',
        num: 42,
        bool: true,
        arr: [1, 2, { nested: 'value' }],
        obj: {
          date: new Date('2023-01-01'),
          regex: /test/gi,
          set: new Set([1, 2, 3]),
          map: new Map([['key', 'value']]),
        },
      };

      const complex2 = {
        str: 'hello',
        num: 42,
        bool: true,
        arr: [1, 2, { nested: 'value' }],
        obj: {
          date: new Date('2023-01-01'),
          regex: /test/gi,
          set: new Set([1, 2, 3]),
          map: new Map([['key', 'value']]),
        },
      };

      expect(isEqual(complex1, complex2)).toBe(true);
    });
  });

  describe('circular references', () => {
    it('should handle circular references in objects', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2: any = { a: 1 };
      obj2.self = obj2;

      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should handle circular references in arrays', () => {
      const arr1: any[] = [1, 2];
      arr1.push(arr1);

      const arr2: any[] = [1, 2];
      arr2.push(arr2);

      expect(isEqual(arr1, arr2)).toBe(true);
    });

    it('should detect differences even with circular references', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2: any = { a: 2 };
      obj2.self = obj2;

      expect(isEqual(obj1, obj2)).toBe(false);
    });
  });
});
