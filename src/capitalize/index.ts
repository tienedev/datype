/**
 * Capitalizes the first character of a string and converts the rest to lowercase.
 *
 * @param str - The string to capitalize
 * @returns A new string with the first character capitalized and the rest lowercase
 *
 * @example
 * ```typescript
 * import { capitalize } from 'datype';
 *
 * // Basic usage
 * capitalize('hello'); // 'Hello'
 * capitalize('WORLD'); // 'World'
 * capitalize('hELLO wORLD'); // 'Hello world'
 *
 * // Edge cases
 * capitalize(''); // ''
 * capitalize('a'); // 'A'
 * capitalize('123abc'); // '123abc'
 *
 * // Unicode support
 * capitalize('ñoño'); // 'Ñoño'
 * capitalize('été'); // 'Été'
 *
 * // Real-world usage
 * const names = ['john', 'JANE', 'bob'];
 * const capitalized = names.map(capitalize);
 * // ['John', 'Jane', 'Bob']
 *
 * // Form input normalization
 * const userInput = 'jOhN dOe';
 * const normalized = capitalize(userInput); // 'John doe'
 * ```
 */
export function capitalize(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
