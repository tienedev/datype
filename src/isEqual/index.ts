/**
 * Performs a deep equality comparison between two values.
 *
 * @template T - The type of the first value
 * @template U - The type of the second value
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if the values are deeply equal, `false` otherwise
 *
 * This function performs deep comparison for:
 * - Primitive values (using Object.is for NaN/±0 handling)
 * - Objects (comparing own enumerable properties recursively)
 * - Arrays (comparing elements recursively)
 * - Dates (comparing time values)
 * - RegExp (comparing source and flags)
 * - Set and Map (comparing contents)
 * - Functions (reference equality only)
 * - Circular references (handled safely)
 *
 * @example
 * ```typescript
 * import { isEqual } from 'datype';
 *
 * // Primitive values
 * isEqual(1, 1);              // true
 * isEqual('hello', 'hello');  // true
 * isEqual(NaN, NaN);          // true (unlike === comparison)
 * isEqual(+0, -0);            // false (unlike === comparison)
 *
 * // Objects
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 });         // true
 * isEqual({ a: 1, b: 2 }, { b: 2, a: 1 });         // true (order doesn't matter)
 * isEqual({ a: { b: 1 } }, { a: { b: 1 } });       // true (deep comparison)
 *
 * // Arrays
 * isEqual([1, 2, 3], [1, 2, 3]);                   // true
 * isEqual([1, [2, 3]], [1, [2, 3]]);               // true (deep comparison)
 *
 * // Dates
 * isEqual(new Date('2023-01-01'), new Date('2023-01-01')); // true
 *
 * // Mixed types
 * isEqual({ date: new Date('2023-01-01'), arr: [1, 2] },
 *         { date: new Date('2023-01-01'), arr: [1, 2] }); // true
 * ```
 */
export function isEqual<T, U>(a: T, b: U): boolean {
  return deepEqual(a, b, new Map());
}

function deepEqual(
  a: unknown,
  b: unknown,
  seen: Map<unknown, unknown>
): boolean {
  // Use Object.is for primitive comparison (handles NaN and ±0 correctly)
  if (Object.is(a, b)) {
    return true;
  }

  // Handle null/undefined cases
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  // Different types are not equal
  if (typeof a !== typeof b) {
    return false;
  }

  // Handle primitive types
  if (typeof a !== 'object') {
    return false;
  }

  // Circular reference detection
  if (seen.has(a)) {
    return seen.get(a) === b;
  }

  // Both are objects from this point
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return Object.is(a.getTime(), b.getTime());
  }

  // Handle RegExp objects
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Handle Set objects
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }

    seen.set(a, b);

    for (const item of Array.from(a as Set<any>)) {
      let found = false;
      for (const otherItem of Array.from(b as Set<any>)) {
        if (deepEqual(item, otherItem, seen)) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.delete(a);
        return false;
      }
    }

    seen.delete(a);
    return true;
  }

  // Handle Map objects
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }

    seen.set(a, b);

    for (const [key, value] of Array.from(a as Map<any, any>)) {
      let found = false;
      for (const [otherKey, otherValue] of Array.from(b as Map<any, any>)) {
        if (
          deepEqual(key, otherKey, seen) &&
          deepEqual(value, otherValue, seen)
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.delete(a);
        return false;
      }
    }

    seen.delete(a);
    return true;
  }

  // Handle Array objects
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    seen.set(a, b);

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) {
        seen.delete(a);
        return false;
      }
    }

    seen.delete(a);
    return true;
  }

  // One is array, other is not
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  // Handle Functions (reference equality only)
  if (typeof a === 'function' && typeof b === 'function') {
    return a === b;
  }

  // Handle plain objects
  seen.set(a, b);

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Different number of properties
  if (keysA.length !== keysB.length) {
    seen.delete(a);
    return false;
  }

  // Check all properties
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      seen.delete(a);
      return false;
    }

    if (!deepEqual(objA[key], objB[key], seen)) {
      seen.delete(a);
      return false;
    }
  }

  seen.delete(a);
  return true;
}
