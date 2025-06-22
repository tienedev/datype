/**
 * Merges multiple objects into a new object, performing a shallow merge.
 * Properties from later objects override properties from earlier objects.
 *
 * @param objects - The objects to merge
 * @returns A new object containing properties from all input objects
 *
 * @example
 * ```typescript
 * import { merge } from 'datype';
 *
 * // Basic merging
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { b: 3, c: 4 };
 * merge(obj1, obj2); // { a: 1, b: 3, c: 4 }
 *
 * // Multiple objects
 * const obj3 = { d: 5 };
 * merge(obj1, obj2, obj3); // { a: 1, b: 3, c: 4, d: 5 }
 *
 * // Empty objects are handled
 * merge({}, { a: 1 }, {}); // { a: 1 }
 *
 * // With no arguments
 * merge(); // {}
 *
 * // Non-enumerable properties are ignored
 * const objWithHidden = {};
 * Object.defineProperty(objWithHidden, 'hidden', { value: 'secret', enumerable: false });
 * merge({ visible: 1 }, objWithHidden); // { visible: 1 }
 *
 * // Symbol properties are included
 * const sym = Symbol('key');
 * const objWithSymbol = { [sym]: 'value', regular: 'prop' };
 * merge({}, objWithSymbol); // { [sym]: 'value', regular: 'prop' }
 *
 * // Shallow merge - nested objects are not deeply merged
 * const nested1 = { a: { x: 1, y: 2 } };
 * const nested2 = { a: { z: 3 } };
 * merge(nested1, nested2); // { a: { z: 3 } } - nested1.a is completely replaced
 *
 * // Real-world example: configuration merging
 * const defaultConfig = {
 *   timeout: 5000,
 *   retries: 3,
 *   headers: { 'Content-Type': 'application/json' }
 * };
 *
 * const userConfig = {
 *   timeout: 10000,
 *   headers: { 'Authorization': 'Bearer token' }
 * };
 *
 * const config = merge(defaultConfig, userConfig);
 * // {
 * //   timeout: 10000,
 * //   retries: 3,
 * //   headers: { 'Authorization': 'Bearer token' } // Note: completely replaced, not merged
 * // }
 * ```
 */
export function merge<T extends Record<string | symbol, any>>(
  ...objects: (Partial<T> | Record<string | symbol, any>)[]
): T {
  const result = {} as T;

  for (const obj of objects) {
    if (obj !== null && obj !== undefined && typeof obj === 'object') {
      // Copy all enumerable own properties (including Symbol properties)
      const propertyDescriptors = Object.getOwnPropertyDescriptors(obj);

      for (const key in propertyDescriptors) {
        const descriptor = propertyDescriptors[key];
        if (descriptor?.enumerable) {
          (result as any)[key] = obj[key];
        }
      }

      // Copy enumerable Symbol properties
      const symbolKeys = Object.getOwnPropertySymbols(obj);
      for (const symbolKey of symbolKeys) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, symbolKey);
        if (descriptor && descriptor.enumerable) {
          (result as any)[symbolKey] = obj[symbolKey];
        }
      }
    }
  }

  return result;
}
