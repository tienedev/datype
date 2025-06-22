/**
 * Creates a new array with unique values, removing duplicates.
 * Uses SameValueZero equality comparison (similar to Set behavior).
 *
 * @template T - The type of elements in the array
 * @param array - The array to process
 * @returns A new array with duplicate values removed
 *
 * @example
 * ```typescript
 * import { uniq } from 'datype';
 *
 * // Basic usage
 * const numbers = [1, 2, 2, 3, 1, 4];
 * const unique = uniq(numbers);
 * // [1, 2, 3, 4]
 *
 * // Strings
 * const words = ['hello', 'world', 'hello', 'foo'];
 * const uniqueWords = uniq(words);
 * // ['hello', 'world', 'foo']
 *
 * // Mixed types
 * const mixed = [1, '1', true, 1, 'true', true];
 * const uniqueMixed = uniq(mixed);
 * // [1, '1', true, 'true']
 *
 * // Objects (by reference)
 * const obj1 = { id: 1 };
 * const obj2 = { id: 2 };
 * const objects = [obj1, obj2, obj1, { id: 1 }];
 * const uniqueObjects = uniq(objects);
 * // [obj1, obj2, { id: 1 }] - last { id: 1 } is different reference
 *
 * // Special values
 * const special = [NaN, undefined, null, NaN, undefined, null];
 * const uniqueSpecial = uniq(special);
 * // [NaN, undefined, null]
 * ```
 */
export function uniq<T>(array: readonly T[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (array.length === 0) {
    return [];
  }

  // Use Set for efficient deduplication with SameValueZero equality
  return Array.from(new Set(array));
}

/**
 * Creates a new array with unique values based on the result of an iteratee function.
 * The iteratee is called for each element to generate the value used for uniqueness comparison.
 *
 * @template T - The type of elements in the array
 * @template U - The type returned by the iteratee function
 * @param array - The array to process
 * @param iteratee - Function to transform elements for comparison
 * @returns A new array with duplicate values removed based on iteratee result
 *
 * @example
 * ```typescript
 * import { uniqBy } from 'datype';
 *
 * // By object property
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'Johnny' }, // duplicate id
 *   { id: 3, name: 'Bob' }
 * ];
 *
 * const uniqueUsers = uniqBy(users, user => user.id);
 * // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Bob' }]
 *
 * // By computed value
 * const numbers = [1.1, 1.9, 2.1, 2.9, 3.1];
 * const uniqueFloors = uniqBy(numbers, Math.floor);
 * // [1.1, 2.1, 3.1]
 *
 * // By string transformation
 * const words = ['Hello', 'WORLD', 'hello', 'world'];
 * const uniqueWords = uniqBy(words, word => word.toLowerCase());
 * // ['Hello', 'WORLD']
 *
 * // By complex transformation
 * const items = [
 *   { category: 'A', value: 10 },
 *   { category: 'B', value: 20 },
 *   { category: 'A', value: 30 }, // same category
 *   { category: 'C', value: 10 }  // same value, different category
 * ];
 *
 * const uniqueByCategory = uniqBy(items, item => item.category);
 * // [{ category: 'A', value: 10 }, { category: 'B', value: 20 }, { category: 'C', value: 10 }]
 * ```
 */
export function uniqBy<T, U>(
  array: readonly T[],
  iteratee: (item: T, index: number, array: readonly T[]) => U
): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected first argument to be an array');
  }

  if (typeof iteratee !== 'function') {
    throw new TypeError('Expected iteratee to be a function');
  }

  if (array.length === 0) {
    return [];
  }

  const seen = new Set<U>();
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const key = iteratee(item, i, array);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

/**
 * Creates a new array with unique values based on a property path.
 * Convenient shorthand for uniqBy when working with object properties.
 *
 * @template T - The type of elements in the array
 * @template K - The type of the property key
 * @param array - The array to process
 * @param property - The property name to use for uniqueness comparison
 * @returns A new array with duplicate values removed based on property value
 *
 * @example
 * ```typescript
 * import { uniqByProperty } from 'datype';
 *
 * // By simple property
 * const users = [
 *   { id: 1, name: 'John', active: true },
 *   { id: 2, name: 'Jane', active: false },
 *   { id: 1, name: 'Johnny', active: true }, // duplicate id
 * ];
 *
 * const uniqueById = uniqByProperty(users, 'id');
 * // [{ id: 1, name: 'John', active: true }, { id: 2, name: 'Jane', active: false }]
 *
 * const uniqueByName = uniqByProperty(users, 'name');
 * // [{ id: 1, name: 'John', active: true }, { id: 2, name: 'Jane', active: false }, { id: 1, name: 'Johnny', active: true }]
 *
 * // With different data types
 * const products = [
 *   { sku: 'A001', price: 10.99 },
 *   { sku: 'B002', price: 15.99 },
 *   { sku: 'A001', price: 12.99 }, // duplicate sku
 * ];
 *
 * const uniqueBySku = uniqByProperty(products, 'sku');
 * // [{ sku: 'A001', price: 10.99 }, { sku: 'B002', price: 15.99 }]
 * ```
 */
export function uniqByProperty<T, K extends keyof T>(
  array: readonly T[],
  property: K
): T[] {
  return uniqBy(array, item => item[property]);
}
