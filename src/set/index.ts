/**
 * Immutably sets a nested property value in an object using dot notation.
 * Returns a new object with the specified property set to the new value.
 *
 * @template T - The type of the object
 * @param obj - The object to set the value in
 * @param path - The property path as a string (supports dot notation)
 * @param value - The value to set
 * @returns A new object with the property set to the new value
 *
 * @example
 * ```typescript
 * import { set } from 'datype';
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
 * const updated1 = set(user, 'profile.name', 'Jane');
 * // user.profile.name is still 'John'
 * // updated1.profile.name is 'Jane'
 *
 * // Deep nesting
 * const updated2 = set(user, 'profile.contact.email', 'jane@example.com');
 * // Original user.profile.contact.email is unchanged
 * // updated2.profile.contact.email is 'jane@example.com'
 *
 * // Array modification
 * const updated3 = set(user, 'preferences.0', 'light-mode');
 * // updated3.preferences[0] is 'light-mode'
 *
 * // Creating new nested paths
 * const updated4 = set(user, 'profile.contact.phone', '123-456-7890');
 * // Creates the phone property in contact
 *
 * // Complex objects
 * const config = {
 *   app: {
 *     features: {
 *       auth: { enabled: true }
 *     }
 *   }
 * };
 *
 * const newConfig = set(config, 'app.features.payments.enabled', true);
 * // Creates the payments object with enabled: true
 * ```
 */
export function set<T>(obj: T, path: string, value: any): T {
  if (obj === null || obj === undefined) {
    throw new TypeError('Cannot set property on null or undefined');
  }

  if (!path || typeof path !== 'string') {
    throw new TypeError('Path must be a non-empty string');
  }

  const keys = path.split('.');

  const result = Array.isArray(obj) ? [...obj] : { ...(obj as any) };

  let current: any = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    const nextKey = keys[i + 1]!;

    const isNextKeyNumeric = /^\d+$/.test(nextKey);

    if (current[key] === null || current[key] === undefined) {
      current[key] = isNextKeyNumeric ? [] : {};
    } else {
      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : { ...current[key] };
    }

    current = current[key];
  }

  const lastKey = keys[keys.length - 1]!;
  current[lastKey] = value;

  return result;
}
