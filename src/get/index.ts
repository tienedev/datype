/**
 * Safely gets a nested property value from an object using dot notation.
 * Returns undefined if any part of the path doesn't exist.
 *
 * @template T - The type of the object
 * @template P - The path string literal type
 * @param obj - The object to get the value from
 * @param path - The property path as a string (supports dot notation)
 * @param defaultValue - Optional default value to return if path doesn't exist
 * @returns The value at the path, or defaultValue if path doesn't exist
 *
 * @example
 * ```typescript
 * import { get } from 'datype';
 *
 * const user = {
 *   profile: {
 *     name: 'John',
 *     contact: {
 *       email: 'john@example.com'
 *     }
 *   },
 *   preferences: ['dark-mode', 'notifications']
 * };
 *
 * // Basic usage
 * get(user, 'profile.name'); // 'John'
 * get(user, 'profile.contact.email'); // 'john@example.com'
 *
 * // Array access
 * get(user, 'preferences.0'); // 'dark-mode'
 *
 * // Non-existent path
 * get(user, 'profile.age'); // undefined
 * get(user, 'profile.contact.phone'); // undefined
 *
 * // With default value
 * get(user, 'profile.age', 25); // 25
 * get(user, 'profile.contact.phone', 'N/A'); // 'N/A'
 *
 * // Deep nesting
 * const data = {
 *   api: {
 *     response: {
 *       data: {
 *         users: [{ id: 1, name: 'Alice' }]
 *       }
 *     }
 *   }
 * };
 *
 * get(data, 'api.response.data.users.0.name'); // 'Alice'
 * get(data, 'api.response.data.users.1.name'); // undefined
 * ```
 */
export function get<T, K>(obj: T, path: string, defaultValue?: K): any {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }

  if (!path || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;

    if (current === null || current === undefined) {
      return defaultValue;
    }

    // Handle array access (numeric keys)
    if (Array.isArray(current) && /^\d+$/.test(key)) {
      const index = parseInt(key, 10);
      current = current[index];
    } else if (typeof current === 'object') {
      current = current[key];
    } else {
      try {
        current = (current as any)[key];
      } catch {
        return defaultValue;
      }
    }
  }

  return current !== undefined ? current : defaultValue;
}
