import { describe, it, expect } from 'vitest';
import { chunk } from './index';

describe('chunk', () => {
  describe('basic functionality', () => {
    it('should split array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6];
      const result = chunk(array, 2);

      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it('should handle arrays that divide evenly', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const result = chunk(array, 3);

      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });

    it('should handle arrays that do not divide evenly', () => {
      const array = [1, 2, 3, 4, 5];
      const result = chunk(array, 2);

      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle single element chunks', () => {
      const array = [1, 2, 3];
      const result = chunk(array, 1);

      expect(result).toEqual([[1], [2], [3]]);
    });

    it('should handle chunk size larger than array length', () => {
      const array = [1, 2, 3];
      const result = chunk(array, 5);

      expect(result).toEqual([[1, 2, 3]]);
    });
  });

  describe('data types', () => {
    it('should work with string arrays', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = chunk(array, 2);

      expect(result).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
    });

    it('should work with object arrays', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Diana' },
      ];

      const result = chunk(users, 2);

      expect(result).toEqual([
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        [
          { id: 3, name: 'Charlie' },
          { id: 4, name: 'Diana' },
        ],
      ]);
    });

    it('should work with mixed type arrays', () => {
      const array = [1, 'a', true, null, undefined];
      const result = chunk(array, 2);

      expect(result).toEqual([[1, 'a'], [true, null], [undefined]]);
    });

    it('should work with nested arrays', () => {
      const array = [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ];
      const result = chunk(array, 2);

      expect(result).toEqual([
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ]);
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const result = chunk(original, 2);

      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should create new arrays for chunks', () => {
      const original = [1, 2, 3, 4];
      const result = chunk(original, 2);

      // Modify a chunk
      result[0]![0] = 999;

      // Original should be unchanged
      expect(original[0]).toBe(1);
      expect(result[0]![0]).toBe(999);
    });

    it('should work with readonly arrays', () => {
      const readonlyArray = [1, 2, 3, 4, 5] as const;
      const result = chunk(readonlyArray, 2);

      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = chunk([], 3);
      expect(result).toEqual([]);
    });

    it('should handle arrays with undefined/null values', () => {
      const array = [1, null, undefined, 2];
      const result = chunk(array, 2);

      expect(result).toEqual([
        [1, null],
        [undefined, 2],
      ]);
    });

    it('should handle large chunk sizes', () => {
      const array = [1, 2, 3];
      const result = chunk(array, 1000);

      expect(result).toEqual([[1, 2, 3]]);
    });

    it('should handle single element arrays', () => {
      const array = [42];
      const result = chunk(array, 1);

      expect(result).toEqual([[42]]);
    });

    it('should handle single element arrays with larger chunk size', () => {
      const array = [42];
      const result = chunk(array, 3);

      expect(result).toEqual([[42]]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => chunk('not an array' as any, 2)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => chunk(null as any, 2)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => chunk(undefined as any, 2)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => chunk(123 as any, 2)).toThrow(
        'Expected first argument to be an array'
      );
      expect(() => chunk({} as any, 2)).toThrow(
        'Expected first argument to be an array'
      );
    });

    it('should throw for invalid size values', () => {
      const array = [1, 2, 3];

      expect(() => chunk(array, 0)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, -1)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, 1.5)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, NaN)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, Infinity)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, 'invalid' as any)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, null as any)).toThrow(
        'Expected size to be a positive integer'
      );
      expect(() => chunk(array, undefined as any)).toThrow(
        'Expected size to be a positive integer'
      );
    });
  });

  describe('performance considerations', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = chunk(largeArray, 100);

      expect(result).toHaveLength(100);
      expect(result[0]).toHaveLength(100);
      expect(result[99]).toHaveLength(100);
      expect(result[0]![0]).toBe(0);
      expect(result[99]![99]).toBe(9999);
    });

    it('should not create unnecessary intermediate arrays', () => {
      const array = [1, 2, 3, 4, 5, 6];
      const result = chunk(array, 2);

      // Each chunk should be a proper array slice
      expect(Array.isArray(result[0])).toBe(true);
      expect(Array.isArray(result[1])).toBe(true);
      expect(Array.isArray(result[2])).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should handle pagination scenario', () => {
      const items = Array.from({ length: 23 }, (_, i) => `item-${i + 1}`);
      const pageSize = 5;
      const pages = chunk(items, pageSize);

      expect(pages).toHaveLength(5);
      expect(pages[0]).toHaveLength(5);
      expect(pages[4]).toHaveLength(3); // Last page has remaining items
      expect(pages[0]).toEqual([
        'item-1',
        'item-2',
        'item-3',
        'item-4',
        'item-5',
      ]);
      expect(pages[4]).toEqual(['item-21', 'item-22', 'item-23']);
    });

    it('should handle batch processing scenario', () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
        { id: 3, email: 'user3@example.com' },
        { id: 4, email: 'user4@example.com' },
        { id: 5, email: 'user5@example.com' },
      ];

      const batches = chunk(users, 2);

      expect(batches).toHaveLength(3);
      expect(batches[0]).toHaveLength(2);
      expect(batches[2]).toHaveLength(1);

      // Simulate batch processing
      const processed = batches.map(batch =>
        batch.map(user => ({ ...user, processed: true }))
      );

      expect(processed[0]).toEqual([
        { id: 1, email: 'user1@example.com', processed: true },
        { id: 2, email: 'user2@example.com', processed: true },
      ]);
    });

    it('should handle matrix creation scenario', () => {
      const flatData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const matrix = chunk(flatData, 4); // 3x4 matrix

      expect(matrix).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      // Access specific matrix element
      expect(matrix[1]![2]).toBe(7); // Row 1, Column 2
    });

    it('should handle file upload chunking scenario', () => {
      const fileData = new Array(1000).fill(0).map((_, i) => `byte-${i}`);
      const chunkSize = 100;
      const fileChunks = chunk(fileData, chunkSize);

      expect(fileChunks).toHaveLength(10);
      expect(fileChunks.every(chunk => chunk.length === chunkSize)).toBe(true);

      // Verify chunk integrity
      const reassembled = fileChunks.flat();
      expect(reassembled).toEqual(fileData);
    });

    it('should handle carousel/slider scenario', () => {
      const images = [
        'img1.jpg',
        'img2.jpg',
        'img3.jpg',
        'img4.jpg',
        'img5.jpg',
        'img6.jpg',
        'img7.jpg',
      ];

      const slidesPerView = 3;
      const slides = chunk(images, slidesPerView);

      expect(slides).toEqual([
        ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        ['img4.jpg', 'img5.jpg', 'img6.jpg'],
        ['img7.jpg'],
      ]);
    });
  });

  describe('TypeScript types', () => {
    it('should preserve element types', () => {
      const numbers = [1, 2, 3, 4];
      const numberChunks = chunk(numbers, 2);

      // TypeScript should infer T[][] where T is number
      expect(typeof numberChunks[0]![0]).toBe('number');

      const strings = ['a', 'b', 'c'];
      const stringChunks = chunk(strings, 2);

      // TypeScript should infer string[][]
      expect(typeof stringChunks[0]![0]).toBe('string');
    });

    it('should work with complex object types', () => {
      interface User {
        id: number;
        name: string;
        active: boolean;
      }

      const users: User[] = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
      ];

      const userChunks = chunk(users, 1);

      // TypeScript should infer User[][]
      expect(userChunks[0]![0]!.id).toBe(1);
      expect(userChunks[0]![0]!.name).toBe('Alice');
      expect(userChunks[0]![0]!.active).toBe(true);
    });
  });
});
