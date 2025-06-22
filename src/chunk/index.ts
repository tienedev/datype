/**
 * Splits an array into chunks of specified size.
 * The last chunk may contain fewer elements if the array length is not divisible by the chunk size.
 *
 * @template T - The type of elements in the array
 * @param array - The array to split into chunks
 * @param size - The size of each chunk (must be a positive integer)
 * @returns An array of chunks, where each chunk is an array of elements
 *
 * @example
 * ```typescript
 * import { chunk } from 'datype';
 *
 * // Basic usage
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const chunks = chunk(numbers, 3);
 * // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 *
 * // Uneven division
 * const items = ['a', 'b', 'c', 'd', 'e'];
 * const pairs = chunk(items, 2);
 * // [['a', 'b'], ['c', 'd'], ['e']]
 *
 * // Single element chunks
 * const data = [1, 2, 3];
 * const singles = chunk(data, 1);
 * // [[1], [2], [3]]
 *
 * // Chunk size larger than array
 * const small = [1, 2];
 * const large = chunk(small, 5);
 * // [[1, 2]]
 *
 * // Processing data in batches
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' },
 *   { id: 4, name: 'Diana' },
 *   { id: 5, name: 'Eve' }
 * ];
 *
 * const batches = chunk(users, 2);
 * // Process each batch separately
 * for (const batch of batches) {
 *   console.log('Processing batch:', batch.map(user => user.name));
 * }
 *
 * // Pagination
 * const allItems = Array.from({ length: 100 }, (_, i) => i + 1);
 * const pages = chunk(allItems, 10); // 10 items per page
 * // pages[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * // pages[1] = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
 * // etc.
 *
 * // Matrix operations
 * const flatMatrix = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const matrix3x3 = chunk(flatMatrix, 3);
 * // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 * ```
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
    throw new TypeError('Expected size to be a positive integer');
  }

  if (array.length === 0) {
    return [];
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
}
