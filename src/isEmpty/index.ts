/**
 * Checks if a value is empty.
 *
 * @template T - The type of the value to check
 * @param value - The value to check for emptiness
 * @returns `true` if the value is empty, `false` otherwise
 *
 * A value is considered empty if it is:
 * - `null` or `undefined`
 * - An empty string (`""`)
 * - An empty array (`[]`)
 * - An empty object (`{}`) - only own enumerable properties are considered
 * - An empty Set or Map
 *
 * @example
 * ```typescript
 * import { isEmpty } from 'datype';
 *
 * isEmpty(null);          // true
 * isEmpty(undefined);     // true
 * isEmpty('');            // true
 * isEmpty([]);            // true
 * isEmpty({});            // true
 * isEmpty(new Set());     // true
 * isEmpty(new Map());     // true
 *
 * isEmpty('hello');       // false
 * isEmpty([1, 2, 3]);     // false
 * isEmpty({key: 'value'}); // false
 * isEmpty(0);             // false
 * isEmpty(false);         // false
 * ```
 */
export function isEmpty(
  value: unknown
): value is null | undefined | '' | [] | Record<string, never> {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size === 0;
  }

  if (
    value instanceof Date ||
    value instanceof RegExp ||
    typeof value === 'function'
  ) {
    return false;
  }

  if (value.constructor && value.constructor !== Object) {
    return false;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}
