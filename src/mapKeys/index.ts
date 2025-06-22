/**
 * Transform all keys in an object using an iterator function while preserving the values.
 * Returns a new object with transformed keys and the same values.
 *
 * @template T - The type of the input object
 * @template K - The type of the new keys
 * @param obj - The object to transform
 * @param iteratee - Function that transforms each key
 * @returns A new object with transformed keys
 *
 * @example
 * ```typescript
 * import { mapKeys } from 'datype';
 *
 * // Transform to camelCase
 * const apiData = {
 *   'first_name': 'John',
 *   'last_name': 'Doe',
 *   'email_address': 'john@example.com'
 * };
 *
 * const camelCase = mapKeys(apiData, key =>
 *   key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
 * );
 * // { firstName: 'John', lastName: 'Doe', emailAddress: 'john@example.com' }
 *
 * // Add prefix to keys
 * const data = { name: 'John', age: 30 };
 * const prefixed = mapKeys(data, key => `user_${key}`);
 * // { user_name: 'John', user_age: 30 }
 *
 * // Transform based on value
 * const config = {
 *   apiUrl: 'https://api.example.com',
 *   timeout: 5000,
 *   retries: 3
 * };
 *
 * const withTypes = mapKeys(config, (key, value) => {
 *   const type = typeof value === 'string' ? 'str' : 'num';
 *   return `${type}_${key}`;
 * });
 * // { str_apiUrl: 'https://api.example.com', num_timeout: 5000, num_retries: 3 }
 *
 * // Normalize keys
 * const messyData = {
 *   'First Name': 'John',
 *   'LAST_NAME': 'Doe',
 *   'Email-Address': 'john@example.com'
 * };
 *
 * const normalized = mapKeys(messyData, key =>
 *   key.toLowerCase().replace(/[-\s]/g, '_')
 * );
 * // { first_name: 'John', last_name: 'Doe', email_address: 'john@example.com' }
 * ```
 */
export function mapKeys<
  T extends Record<PropertyKey, any>,
  K extends PropertyKey,
>(
  obj: T,
  iteratee: (key: keyof T, value: T[keyof T], object: T) => K
): Record<K, T[keyof T]> {
  if (obj === null || obj === undefined) {
    throw new TypeError('Expected object to be non-null');
  }

  if (typeof iteratee !== 'function') {
    throw new TypeError('Expected iteratee to be a function');
  }

  const result = {} as Record<K, T[keyof T]>;

  // Get all enumerable own properties (including symbols)
  const keys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj).filter(symbol =>
      Object.prototype.propertyIsEnumerable.call(obj, symbol)
    ),
  ] as (keyof T)[];

  for (const key of keys) {
    const newKey = iteratee(key, obj[key], obj);
    result[newKey] = obj[key];
  }

  return result;
}

// Helper function for common key transformations
export const keyTransformers = {
  /**
   * Convert snake_case to camelCase
   */
  toCamelCase: (key: string): string =>
    key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),

  /**
   * Convert camelCase to snake_case
   */
  toSnakeCase: (key: string): string =>
    key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),

  /**
   * Convert to kebab-case
   */
  toKebabCase: (key: string): string =>
    key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`),

  /**
   * Convert to lowercase
   */
  toLowerCase: (key: string): string => key.toLowerCase(),

  /**
   * Convert to uppercase
   */
  toUpperCase: (key: string): string => key.toUpperCase(),

  /**
   * Add prefix to key
   */
  addPrefix:
    (prefix: string) =>
    (key: string): string =>
      `${prefix}${key}`,

  /**
   * Add suffix to key
   */
  addSuffix:
    (suffix: string) =>
    (key: string): string =>
      `${key}${suffix}`,

  /**
   * Normalize key by removing special characters and converting to snake_case
   */
  normalize: (key: string): string =>
    key
      .toLowerCase()
      .replace(/[-\s]+/g, '_')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, ''),
};
