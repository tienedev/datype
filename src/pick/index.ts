/**
 * Creates a new object with only the specified keys from the source object.
 * Provides perfect TypeScript type inference for the resulting object.
 *
 * @param obj - The source object to pick from
 * @param keys - Array of keys to pick from the source object
 * @returns A new object containing only the specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', age: 30 };
 * const basicInfo = pick(user, ['id', 'name']);
 * // Result: { id: 1, name: 'John' }
 * // Type: { id: number; name: string }
 * ```
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('First argument must be an object');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('Second argument must be an array of keys');
  }

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      (result as Record<string, unknown>)[key] = obj[key];
    }
  }

  return result;
}
