import { describe, it, expect } from 'vitest';
import { flatten, flattenDeep, flattenDepth } from './index';

describe('flatten', () => {
  describe('basic functionality', () => {
    it('should flatten one level of nesting', () => {
      const nested = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const result = flatten(nested);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle mixed nested and flat items', () => {
      const mixed = [1, [2, 3], 4, [5, 6]];
      const result = flatten(mixed);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should only flatten one level', () => {
      const deepNested = [1, [2, [3, 4]], 5];
      const result = flatten(deepNested);

      expect(result).toEqual([1, 2, [3, 4], 5]);
    });

    it('should handle empty arrays', () => {
      const withEmpty = [1, [], [2, 3], [], 4];
      const result = flatten(withEmpty);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle already flat arrays', () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flatten(flat);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('data types', () => {
    it('should work with string arrays', () => {
      const strings = [
        ['hello', 'world'],
        ['foo', 'bar'],
      ];
      const result = flatten(strings);

      expect(result).toEqual(['hello', 'world', 'foo', 'bar']);
    });

    it('should work with object arrays', () => {
      const objects: Record<string, number>[][] = [
        [{ a: 1 }, { b: 2 }],
        [{ c: 3 }],
      ];
      const result = flatten(objects);

      expect(result).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    });

    it('should work with mixed types', () => {
      const mixed: any[] = [1, ['string'], [true, null], [undefined]];
      const result = flatten(mixed);

      expect(result).toEqual([1, 'string', true, null, undefined]);
    });

    it('should preserve nested array structures beyond first level', () => {
      const nested = [[[1, 2]], [[3, 4]]];
      const result = flatten(nested);

      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle completely empty array', () => {
      const result = flatten([]);
      expect(result).toEqual([]);
    });

    it('should handle array with only empty arrays', () => {
      const result = flatten([[], [], []]);
      expect(result).toEqual([]);
    });

    it('should handle null and undefined values', () => {
      const withNulls = [1, [null], [undefined, 2]];
      const result = flatten(withNulls);

      expect(result).toEqual([1, null, undefined, 2]);
    });

    it('should handle sparse arrays', () => {
      const sparse = [1, , [2, , 3]]; // eslint-disable-line no-sparse-arrays
      const result = flatten(sparse);

      expect(result).toEqual([1, undefined, 2, undefined, 3]);
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [
        [1, 2],
        [3, 4],
      ];
      const result = flatten(original);

      expect(original).toEqual([
        [1, 2],
        [3, 4],
      ]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should create new array', () => {
      const original = [
        [1, 2],
        [3, 4],
      ];
      const result = flatten(original);

      expect(result).not.toBe(original);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => flatten('not an array' as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => flatten(null as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => flatten(undefined as any)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => flatten(123 as any)).toThrow(
        'Expected first argument to be an array'
      );
    });
  });
});

describe('flattenDeep', () => {
  describe('basic functionality', () => {
    it('should flatten all levels of nesting', () => {
      const deepNested = [1, [2, [3, [4, 5]]]];
      const result = flattenDeep(deepNested);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle complex nested structures', () => {
      const complex = [
        1,
        [2, 3],
        [
          [4, 5],
          [6, [7, 8]],
        ],
        [[[9]]],
      ];
      const result = flattenDeep(complex);

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should handle already flat arrays', () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flattenDeep(flat);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle mixed depth arrays', () => {
      const mixed = [1, [2], [[3]], [[[4]]], 5];
      const result = flattenDeep(mixed);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty nested arrays', () => {
      const withEmpties = [1, [], [2, []], [[3]], [[[]]]];
      const result = flattenDeep(withEmpties);

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('data types', () => {
    it('should work with strings', () => {
      const strings = ['a', ['b', ['c', ['d']]]];
      const result = flattenDeep(strings);

      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should work with objects', () => {
      const objects = [{ a: 1 }, [{ b: 2 }, [{ c: 3 }]]];
      const result = flattenDeep(objects);

      expect(result).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    });

    it('should work with mixed types', () => {
      const mixed = [1, ['string', [true, [null, [undefined]]]]];
      const result = flattenDeep(mixed);

      expect(result).toEqual([1, 'string', true, null, undefined]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = flattenDeep([]);
      expect(result).toEqual([]);
    });

    it('should handle deeply nested empty arrays', () => {
      const result = flattenDeep([[[[]]], [[]]]);
      expect(result).toEqual([]);
    });

    it('should handle very deep nesting', () => {
      let deep: any = 1;
      for (let i = 0; i < 10; i++) {
        deep = [deep];
      }

      const result = flattenDeep(deep);
      expect(result).toEqual([1]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => flattenDeep('not an array' as any)).toThrow(
        'Expected first argument to be an array'
      );
    });
  });
});

describe('flattenDepth', () => {
  describe('basic functionality', () => {
    it('should flatten to specified depth', () => {
      const nested = [1, [2, [3, [4]]]];

      expect(flattenDepth(nested, 0)).toEqual([1, [2, [3, [4]]]]);
      expect(flattenDepth(nested, 1)).toEqual([1, 2, [3, [4]]]);
      expect(flattenDepth(nested, 2)).toEqual([1, 2, 3, [4]]);
      expect(flattenDepth(nested, 3)).toEqual([1, 2, 3, 4]);
    });

    it('should use depth 1 as default', () => {
      const nested = [
        [1, 2],
        [3, 4],
      ];
      const withDefault = flattenDepth(nested);
      const withExplicit = flattenDepth(nested, 1);

      expect(withDefault).toEqual([1, 2, 3, 4]);
      expect(withExplicit).toEqual([1, 2, 3, 4]);
    });

    it('should handle Infinity depth', () => {
      const deep = [1, [2, [3, [4, [5]]]]];
      const result = flattenDepth(deep, Infinity);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle zero depth', () => {
      const nested = [
        [1, 2],
        [3, 4],
      ];
      const result = flattenDepth(nested, 0);

      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle mixed depth structures', () => {
      const complex = [1, [2, [3]], [[4, [5]], 6]];
      const result = flattenDepth(complex, 2);

      expect(result).toEqual([1, 2, 3, 4, [5], 6]);
    });

    it('should handle empty arrays at various depths', () => {
      const withEmpties = [1, [[], [2, [[]]]], [3]];
      const result = flattenDepth(withEmpties, 2);

      expect(result).toEqual([1, 2, [[]], 3]);
    });

    it('should preserve type information', () => {
      const typed = [['a', 'b'], [['c', 'd']]];
      const result = flattenDepth(typed, 1);

      expect(result).toEqual(['a', 'b', ['c', 'd']]);
    });
  });

  describe('edge cases', () => {
    it('should handle large depth values', () => {
      const simple = [[1], [2]];
      const result = flattenDepth(simple, 1000);

      expect(result).toEqual([1, 2]);
    });

    it('should handle negative depth (should throw)', () => {
      expect(() => flattenDepth([1, [2]], -1)).toThrow(
        'Expected depth to be a non-negative number'
      );
    });

    it('should handle non-number depth', () => {
      expect(() => flattenDepth([1, [2]], 'invalid' as any)).toThrow(
        'Expected depth to be a non-negative number'
      );
    });
  });

  describe('performance considerations', () => {
    it('should handle large arrays efficiently', () => {
      const large = Array.from({ length: 1000 }, (_, i) => [i]);
      const result = flattenDepth(large, 1);

      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(999);
    });

    it('should not stack overflow on deep nesting', () => {
      let deep: any = [1];
      for (let i = 0; i < 100; i++) {
        deep = [deep];
      }

      const result = flattenDepth(deep, 50);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should handle tree structure flattening', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
        { id: 5 },
      ];

      // Extract just the children one level deep
      const children = tree.map(node => node.children || []);
      const flattened = flattenDepth(children, 1);

      expect(flattened).toEqual([{ id: 2 }, { id: 3, children: [{ id: 4 }] }]);
    });

    it('should handle nested configuration merging', () => {
      const configs = [
        { server: [{ port: 3000 }] },
        { database: [{ host: 'localhost' }, [{ port: 5432 }]] },
      ];

      const values = Object.values(configs).map(config =>
        Object.values(config)
      );
      const flattened = flattenDepth(values, 2);

      expect(flattened).toEqual([
        { port: 3000 },
        { host: 'localhost' },
        [{ port: 5432 }],
      ]);
    });

    it('should handle CSV-like data processing', () => {
      const csvGroups = [
        [
          ['name', 'age'],
          ['John', '30'],
        ],
        [
          ['name', 'age'],
          ['Jane', '25'],
        ],
      ];

      const allRows = flattenDepth(csvGroups, 1);

      expect(allRows).toEqual([
        ['name', 'age'],
        ['John', '30'],
        ['name', 'age'],
        ['Jane', '25'],
      ]);
    });
  });

  describe('TypeScript types', () => {
    it('should preserve type information correctly', () => {
      const numbers: number[][] = [
        [1, 2],
        [3, 4],
      ];
      const flattened = flattenDepth(numbers, 1);

      // Should be number[]
      expect(typeof flattened[0]).toBe('number');

      const strings: string[][][] = [[['a', 'b']], [['c', 'd']]];
      const partial = flattenDepth(strings, 1);

      // Should be string[][]
      expect(Array.isArray(partial[0])).toBe(true);
      expect(typeof partial[0]![0]).toBe('string');
    });
  });
});
