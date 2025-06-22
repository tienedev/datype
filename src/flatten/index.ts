/**
 * Flattens a nested array by one level.
 * Only the first level of nesting is flattened.
 *
 * @template T - The type of elements in the array
 * @param array - The array to flatten
 * @returns A new array with one level of nesting removed
 *
 * @example
 * ```typescript
 * import { flatten } from 'datype';
 *
 * // Basic usage
 * const nested = [[1, 2], [3, 4], [5, 6]];
 * const flattened = flatten(nested);
 * // [1, 2, 3, 4, 5, 6]
 *
 * // Mixed nesting levels
 * const mixed = [1, [2, 3], 4, [5, [6, 7]]];
 * const result = flatten(mixed);
 * // [1, 2, 3, 4, 5, [6, 7]] - only one level flattened
 *
 * // String arrays
 * const words = [['hello', 'world'], ['foo', 'bar']];
 * const allWords = flatten(words);
 * // ['hello', 'world', 'foo', 'bar']
 *
 * // Empty and undefined handling
 * const sparse = [1, [], [2, 3], undefined, [4]];
 * const clean = flatten(sparse);
 * // [1, 2, 3, undefined, 4]
 * ```
 */
export function flatten<T>(array: readonly (T | readonly T[])[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item as T);
    }
  }

  return result;
}

/**
 * Recursively flattens a nested array to any depth.
 * All levels of nesting are removed.
 *
 * @template T - The type of elements in the array
 * @param array - The array to flatten deeply
 * @returns A new array with all nesting removed
 *
 * @example
 * ```typescript
 * import { flattenDeep } from 'datype';
 *
 * // Deep nesting
 * const deepNested = [1, [2, [3, [4, 5]]]];
 * const flattened = flattenDeep(deepNested);
 * // [1, 2, 3, 4, 5]
 *
 * // Mixed depth
 * const complex = [1, [2, 3], [[4, 5], [6, [7, 8]]]];
 * const result = flattenDeep(complex);
 * // [1, 2, 3, 4, 5, 6, 7, 8]
 *
 * // Already flat
 * const flat = [1, 2, 3];
 * const stillFlat = flattenDeep(flat);
 * // [1, 2, 3]
 *
 * // Empty arrays
 * const withEmpties = [1, [], [2, []], [[3]]];
 * const cleaned = flattenDeep(withEmpties);
 * // [1, 2, 3]
 * ```
 */
export function flattenDeep<T>(array: readonly any[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  const result: T[] = [];

  function flattenRecursive(arr: readonly any[]): void {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      if (Array.isArray(item)) {
        flattenRecursive(item);
      } else {
        result.push(item as T);
      }
    }
  }

  flattenRecursive(array);
  return result;
}

/**
 * Flattens a nested array to a specified depth.
 *
 * @template T - The type of elements in the array
 * @param array - The array to flatten
 * @param depth - The depth to flatten (default: 1)
 * @returns A new array flattened to the specified depth
 *
 * @example
 * ```typescript
 * import { flattenDepth } from 'datype';
 *
 * // Flatten 2 levels
 * const nested = [1, [2, [3, [4]]]];
 * const result = flattenDepth(nested, 2);
 * // [1, 2, 3, [4]]
 *
 * // Flatten 1 level (same as flatten)
 * const onceNested = [[1, 2], [3, 4]];
 * const once = flattenDepth(onceNested, 1);
 * // [1, 2, 3, 4]
 *
 * // Flatten all levels (depth = Infinity)
 * const deep = [1, [2, [3, [4, 5]]]];
 * const all = flattenDepth(deep, Infinity);
 * // [1, 2, 3, 4, 5]
 * ```
 */
export function flattenDepth<T>(array: readonly any[], depth: number = 1): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (typeof depth !== 'number' || depth < 0) {
    throw new TypeError('Expected depth to be a non-negative number');
  }

  if (depth === 0) {
    return array.slice() as T[];
  }

  if (depth === Infinity) {
    return flattenDeep<T>(array);
  }

  const result: T[] = [];

  function flattenToDepth(arr: readonly any[], currentDepth: number): void {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      if (Array.isArray(item) && currentDepth > 0) {
        // Continue flattening if we haven't reached the target depth
        flattenToDepth(item, currentDepth - 1);
      } else {
        // Add item to result (either not an array or depth reached)
        result.push(item as T);
      }
    }
  }

  flattenToDepth(array, depth);
  return result;
}
