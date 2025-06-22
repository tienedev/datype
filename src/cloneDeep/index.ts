/**
 * Creates a deep clone of the given value, recursively cloning nested objects and arrays.
 * Handles circular references and preserves object types.
 *
 * @template T - The type of the value to clone
 * @param value - The value to clone
 * @returns A deep clone of the input value
 *
 * @example
 * ```typescript
 * import { cloneDeep } from 'datype';
 *
 * const original = {
 *   name: 'John',
 *   hobbies: ['reading', 'coding'],
 *   address: { city: 'Paris', zip: '75001' }
 * };
 *
 * const cloned = cloneDeep(original);
 * cloned.address.city = 'London';
 *
 * console.log(original.address.city); // 'Paris' (unchanged)
 * console.log(cloned.address.city);   // 'London'
 * ```
 */
export function cloneDeep<T>(value: T, seen = new WeakMap()): T {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle primitive types
  if (typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (seen.has(value as object)) {
    return seen.get(value as object);
  }

  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    const clonedArray: unknown[] = [];
    seen.set(value as object, clonedArray as T);

    for (let i = 0; i < value.length; i++) {
      clonedArray[i] = cloneDeep(value[i], seen);
    }

    return clonedArray as T;
  }

  // Handle Set objects
  if (value instanceof Set) {
    const clonedSet = new Set();
    seen.set(value as object, clonedSet as T);

    for (const item of Array.from(value as Set<any>)) {
      clonedSet.add(cloneDeep(item, seen));
    }

    return clonedSet as T;
  }

  // Handle Map objects
  if (value instanceof Map) {
    const clonedMap = new Map();
    seen.set(value as object, clonedMap as T);

    for (const [key, val] of Array.from(value as Map<any, any>)) {
      clonedMap.set(cloneDeep(key, seen), cloneDeep(val, seen));
    }

    return clonedMap as T;
  }

  // Handle plain objects
  if (typeof value === 'object') {
    const clonedObject: Record<string, unknown> = {};
    seen.set(value as object, clonedObject as T);

    // Copy all enumerable properties (including inherited ones)
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        clonedObject[key] = cloneDeep(
          (value as Record<string, unknown>)[key],
          seen
        );
      }
    }

    return clonedObject as T;
  }

  // For other types (functions, etc.), return as-is
  return value;
}
