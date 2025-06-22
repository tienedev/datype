/**
 * Checks if a value is a plain object (not an array, function, Date, etc.).
 *
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 *
 * @example
 * ```typescript
 * import { isPlainObject } from 'datype';
 *
 * isPlainObject({}); // true
 * isPlainObject({ name: 'John' }); // true
 * isPlainObject(new Object()); // true
 * isPlainObject(Object.create(null)); // true
 *
 * isPlainObject([]); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(/regex/); // false
 * isPlainObject(function() {}); // false
 * isPlainObject(null); // false
 * isPlainObject(undefined); // false
 * isPlainObject('string'); // false
 * isPlainObject(42); // false
 * ```
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // Check for built-in object types that we don't consider "plain"
  if (Array.isArray(value)) {
    return false;
  }

  if (value instanceof Date) {
    return false;
  }

  if (value instanceof RegExp) {
    return false;
  }

  if (value instanceof Error) {
    return false;
  }

  // Check if it's a function (though typeof should catch this)
  if (typeof value === 'function') {
    return false;
  }

  // Check for other built-in types
  if (
    value instanceof Map ||
    value instanceof Set ||
    value instanceof WeakMap ||
    value instanceof WeakSet
  ) {
    return false;
  }

  // Check for typed arrays
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
    return false;
  }

  // Check for Promise
  if (value instanceof Promise) {
    return false;
  }

  // At this point, we have an object. Check if it's a plain object
  // by verifying its prototype chain
  const proto = Object.getPrototypeOf(value);

  // Objects created with Object.create(null) have no prototype
  if (proto === null) {
    return true;
  }

  // Objects created with {} or new Object() have Object.prototype as their prototype
  if (proto === Object.prototype) {
    return true;
  }

  // For any other prototype, it's not a plain object
  // This excludes class instances, objects with custom prototypes, etc.
  return false;
}

/**
 * Checks if a value is an array.
 *
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 *
 * @example
 * ```typescript
 * import { isArray } from 'datype';
 *
 * isArray([]); // true
 * isArray([1, 2, 3]); // true
 * isArray(new Array()); // true
 * isArray(Array.from({length: 3})); // true
 *
 * isArray({}); // false
 * isArray('string'); // false
 * isArray(42); // false
 * isArray(null); // false
 * isArray(undefined); // false
 * isArray(arguments); // false (in a function context)
 * ```
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is a function.
 *
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```typescript
 * import { isFunction } from 'datype';
 *
 * isFunction(function() {}); // true
 * isFunction(() => {}); // true
 * isFunction(async function() {}); // true
 * isFunction(function* () {}); // true
 * isFunction(Math.max); // true
 * isFunction(Date); // true
 * isFunction(Array); // true
 *
 * isFunction({}); // false
 * isFunction([]); // false
 * isFunction('string'); // false
 * isFunction(42); // false
 * isFunction(null); // false
 * isFunction(undefined); // false
 * ```
 */
export function isFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}
