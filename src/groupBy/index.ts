/**
 * Type for the groupBy iterator function
 */
export type GroupByIterator<T> = (item: T) => any;

/**
 * Result type for groupBy operation
 */
export type GroupByResult<T> = Record<string, T[]>;

/**
 * Groups an array of items by a key or the result of an iterator function.
 *
 * @template T - The type of items in the array
 * @template K - The type of the grouping key
 * @param array - The array to group
 * @param iteratee - A property key or function to determine the grouping key
 * @returns An object where keys are the group identifiers and values are arrays of items
 *
 * @example
 * ```typescript
 * import { groupBy } from 'datype';
 *
 * // Group by property
 * const users = [
 *   { name: 'John', role: 'admin', age: 30 },
 *   { name: 'Jane', role: 'user', age: 25 },
 *   { name: 'Bob', role: 'admin', age: 35 }
 * ];
 *
 * const byRole = groupBy(users, 'role');
 * // {
 * //   admin: [{ name: 'John', role: 'admin', age: 30 }, { name: 'Bob', role: 'admin', age: 35 }],
 * //   user: [{ name: 'Jane', role: 'user', age: 25 }]
 * // }
 *
 * // Group by function result
 * const byAgeGroup = groupBy(users, user => user.age >= 30 ? 'senior' : 'junior');
 * // {
 * //   senior: [{ name: 'John', role: 'admin', age: 30 }, { name: 'Bob', role: 'admin', age: 35 }],
 * //   junior: [{ name: 'Jane', role: 'user', age: 25 }]
 * // }
 *
 * // Group numbers by remainder
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const byRemainder = groupBy(numbers, n => n % 2);
 * // { 1: [1, 3, 5], 0: [2, 4, 6] }
 *
 * // Group strings by length
 * const words = ['cat', 'dog', 'elephant', 'bee'];
 * const byLength = groupBy(words, word => word.length);
 * // { 3: ['cat', 'dog', 'bee'], 8: ['elephant'] }
 *
 * // Group by nested property
 * const products = [
 *   { name: 'Laptop', category: { type: 'electronics', subtype: 'computers' } },
 *   { name: 'Phone', category: { type: 'electronics', subtype: 'mobile' } },
 *   { name: 'Book', category: { type: 'media', subtype: 'books' } }
 * ];
 *
 * const byType = groupBy(products, product => product.category.type);
 * // {
 * //   electronics: [...],
 * //   media: [...]
 * // }
 * ```
 */
export function groupBy<T>(
  array: readonly T[],
  iteratee: keyof T | GroupByIterator<T>
): Record<string, T[]> {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (
    typeof iteratee !== 'string' &&
    typeof iteratee !== 'number' &&
    typeof iteratee !== 'symbol' &&
    typeof iteratee !== 'function'
  ) {
    throw new TypeError('Expected iteratee to be a property key or function');
  }

  const result = {} as Record<string, T[]>;

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let key: any;

    if (typeof iteratee === 'function') {
      key = (iteratee as GroupByIterator<T>)(item);
    } else {
      const value = (item as any)?.[iteratee];
      key = value;
    }

    const safeKey = String(
      key === null || key === undefined ? String(key) : key
    );

    if (!result[safeKey]) {
      result[safeKey] = [];
    }

    result[safeKey].push(item);
  }

  return result;
}

// Note: Overloads are handled by the main function signature above
