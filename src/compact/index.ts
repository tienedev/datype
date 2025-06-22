/**
 * Creates a new array with all falsy values removed.
 * Falsy values include: false, null, 0, "", undefined, and NaN.
 *
 * @template T - The type of elements in the array
 * @param array - The array to compact
 * @returns A new array with falsy values removed
 *
 * @example
 * ```typescript
 * import { compact } from 'datype';
 *
 * // Basic usage
 * const mixed = [0, 1, false, 2, '', 3, null, 4, undefined, 5, NaN];
 * const compacted = compact(mixed);
 * // [1, 2, 3, 4, 5]
 *
 * // Strings
 * const strings = ['hello', '', 'world', null, 'foo', undefined];
 * const cleanStrings = compact(strings);
 * // ['hello', 'world', 'foo']
 *
 * // Numbers
 * const numbers = [1, 0, 2, NaN, 3, -0, 4];
 * const validNumbers = compact(numbers);
 * // [1, 2, 3, 4]
 *
 * // Booleans
 * const booleans = [true, false, true, null, false];
 * const trueBooleans = compact(booleans);
 * // [true, true]
 *
 * // Objects (all truthy, so preserved)
 * const objects = [{}, { a: 1 }, null, { b: 2 }, undefined];
 * const validObjects = compact(objects);
 * // [{}, { a: 1 }, { b: 2 }]
 *
 * // Arrays (all truthy, including empty array)
 * const arrays = [[], [1, 2], null, [3], undefined];
 * const validArrays = compact(arrays);
 * // [[], [1, 2], [3]]
 *
 * // Real-world: Filter form data
 * const formData = {
 *   name: 'John',
 *   email: '',
 *   age: 0,
 *   active: true,
 *   notes: null
 * };
 *
 * const cleanValues = compact(Object.values(formData));
 * // ['John', true] - only truthy values
 * ```
 */
export function compact<T>(array: readonly T[]): NonNullable<T>[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  const result: NonNullable<T>[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    // Check if item is truthy
    if (item) {
      result.push(item as NonNullable<T>);
    }
  }

  return result;
}

/**
 * Creates a new array with specific values removed.
 * More flexible than compact, allows specifying which values to filter out.
 *
 * @template T - The type of elements in the array
 * @param array - The array to filter
 * @param valuesToRemove - Values to remove from the array
 * @returns A new array with specified values removed
 *
 * @example
 * ```typescript
 * import { compactBy } from 'datype';
 *
 * // Remove specific values
 * const data = [1, 0, 2, -1, 3, 0, 4];
 * const withoutZerosAndNegatives = compactBy(data, [0, -1]);
 * // [1, 2, 3, 4]
 *
 * // Remove specific strings
 * const words = ['hello', 'REMOVE', 'world', 'DELETE', 'foo'];
 * const filtered = compactBy(words, ['REMOVE', 'DELETE']);
 * // ['hello', 'world', 'foo']
 *
 * // Remove null but keep other falsy values
 * const mixed = [0, null, false, '', undefined, 1];
 * const withoutNull = compactBy(mixed, [null]);
 * // [0, false, '', undefined, 1]
 *
 * // Remove multiple types
 * const various = [1, null, 'keep', undefined, 0, 'remove', false];
 * const cleaned = compactBy(various, [null, undefined, 'remove']);
 * // [1, 'keep', 0, false]
 * ```
 */
export function compactBy<T>(
  array: readonly T[],
  valuesToRemove: readonly T[]
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (!Array.isArray(valuesToRemove)) {
    throw new TypeError('Expected second argument to be an array');
  }

  // Convert to Set for efficient lookup
  const removeSet = new Set(valuesToRemove);
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (!removeSet.has(item)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Creates a new array with values removed based on a predicate function.
 * More flexible filtering that allows custom logic for determining what to remove.
 *
 * @template T - The type of elements in the array
 * @param array - The array to filter
 * @param shouldRemove - Function that returns true for items to remove
 * @returns A new array with items removed based on predicate
 *
 * @example
 * ```typescript
 * import { compactWith } from 'datype';
 *
 * // Remove based on custom logic
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const odds = compactWith(numbers, n => n % 2 === 0);
 * // [1, 3, 5, 7, 9] - removed even numbers
 *
 * // Remove objects based on property
 * const users = [
 *   { name: 'John', active: true },
 *   { name: 'Jane', active: false },
 *   { name: 'Bob', active: true },
 *   { name: 'Alice', active: false }
 * ];
 *
 * const activeUsers = compactWith(users, user => !user.active);
 * // [{ name: 'John', active: true }, { name: 'Bob', active: true }]
 *
 * // Remove based on string length
 * const words = ['hi', 'hello', 'a', 'world', 'js'];
 * const longWords = compactWith(words, word => word.length <= 2);
 * // ['hello', 'world']
 *
 * // Remove based on complex conditions
 * const products = [
 *   { name: 'Laptop', price: 1000, inStock: true },
 *   { name: 'Mouse', price: 25, inStock: false },
 *   { name: 'Keyboard', price: 100, inStock: true },
 *   { name: 'Monitor', price: 300, inStock: false }
 * ];
 *
 * const availableExpensive = compactWith(products,
 *   p => !p.inStock || p.price < 50
 * );
 * // [{ name: 'Laptop', price: 1000, inStock: true }, { name: 'Keyboard', price: 100, inStock: true }]
 * ```
 */
export function compactWith<T>(
  array: readonly T[],
  shouldRemove: (item: T, index: number, array: readonly T[]) => boolean
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (typeof shouldRemove !== 'function') {
    throw new TypeError('Expected second argument to be a function');
  }

  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (!shouldRemove(item, i, array)) {
      result.push(item);
    }
  }

  return result;
}
