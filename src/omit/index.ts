/**
 * Creates a new object excluding the specified keys from the source object.
 * Provides perfect TypeScript type inference for the resulting object.
 *
 * @param obj - The source object to omit from
 * @param keys - Array of keys to exclude from the source object
 * @returns A new object without the specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', age: 30 };
 * const publicInfo = omit(user, ['email', 'age']);
 * // Result: { id: 1, name: 'John' }
 * // Type: { id: number; name: string }
 * ```
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('First argument must be an object');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('Second argument must be an array of keys');
  }

  const keysToOmit = new Set(keys);
  const result = {} as Omit<T, K>;

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !keysToOmit.has(key as unknown as K)
    ) {
      // TypeScript needs explicit casting here due to the complexity of Omit<T, K>
      (result as Record<string, unknown>)[key] = obj[key];
    }
  }

  return result;
}
