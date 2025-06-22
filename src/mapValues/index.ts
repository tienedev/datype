/**
 * Transform all values in an object using an iterator function while preserving the structure.
 * Returns a new object with the same keys but transformed values.
 *
 * @template T - The type of the input object
 * @template U - The type of the transformed values
 * @param obj - The object to transform
 * @param iteratee - Function that transforms each value
 * @returns A new object with transformed values
 *
 * @example
 * ```typescript
 * import { mapValues } from 'datype';
 *
 * // Transform numbers
 * const scores = { alice: 85, bob: 92, charlie: 78 };
 * const grades = mapValues(scores, score => {
 *   if (score >= 90) return 'A';
 *   if (score >= 80) return 'B';
 *   return 'C';
 * });
 * // { alice: 'B', bob: 'A', charlie: 'C' }
 *
 * // Transform strings
 * const users = {
 *   user1: 'john doe',
 *   user2: 'jane smith',
 *   user3: 'bob wilson'
 * };
 *
 * const capitalized = mapValues(users, name =>
 *   name.split(' ').map(part =>
 *     part.charAt(0).toUpperCase() + part.slice(1)
 *   ).join(' ')
 * );
 * // { user1: 'John Doe', user2: 'Jane Smith', user3: 'Bob Wilson' }
 *
 * // Transform objects
 * const products = {
 *   laptop: { price: 1000, currency: 'USD' },
 *   phone: { price: 500, currency: 'USD' },
 *   tablet: { price: 300, currency: 'USD' }
 * };
 *
 * const withTax = mapValues(products, product => ({
 *   ...product,
 *   priceWithTax: product.price * 1.1,
 *   formattedPrice: `$${product.price}`
 * }));
 *
 * // Access key and value in iterator
 * const config = {
 *   apiUrl: 'localhost',
 *   timeout: 5000,
 *   retries: 3
 * };
 *
 * const withDefaults = mapValues(config, (value, key) => {
 *   if (key === 'apiUrl' && value === 'localhost') {
 *     return 'https://api.production.com';
 *   }
 *   return value;
 * });
 * ```
 */
export function mapValues<T extends Record<PropertyKey, any>, U>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T, object: T) => U
): Record<keyof T, U> {
  if (obj === null || obj === undefined) {
    throw new TypeError('Expected object to be non-null');
  }

  if (typeof iteratee !== 'function') {
    throw new TypeError('Expected iteratee to be a function');
  }

  const result = {} as Record<keyof T, U>;

  // Get all enumerable own properties (including symbols)
  const keys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj).filter(symbol =>
      Object.prototype.propertyIsEnumerable.call(obj, symbol)
    ),
  ] as (keyof T)[];

  for (const key of keys) {
    result[key] = iteratee(obj[key], key, obj);
  }

  return result;
}
