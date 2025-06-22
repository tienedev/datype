/**
 * Truncates a string if it's longer than the specified length.
 * The last characters of the truncated string are replaced with the omission string.
 *
 * @param str - The string to truncate
 * @param length - The maximum length of the truncated string (default: 30)
 * @param omission - The string used to indicate omitted characters (default: '...')
 * @returns A truncated string if needed, otherwise the original string
 *
 * @example
 * ```typescript
 * import { truncate } from 'datype';
 *
 * // Basic usage
 * truncate('Hello world, this is a long string', 20);
 * // 'Hello world, this...'
 *
 * // Custom omission
 * truncate('Hello world, this is a long string', 20, '…');
 * // 'Hello world, this i…'
 *
 * // Custom omission with multiple characters
 * truncate('Hello world, this is a long string', 20, ' [more]');
 * // 'Hello world [more]'
 *
 * // String shorter than limit
 * truncate('Short text', 20);
 * // 'Short text'
 *
 * // Empty omission
 * truncate('Hello world, this is a long string', 15, '');
 * // 'Hello world, th'
 *
 * // Real-world examples
 * const title = 'Understanding Advanced TypeScript Utility Types';
 * truncate(title, 30); // 'Understanding Advanced...'
 *
 * const description = 'This is a very long product description that needs to be shortened';
 * truncate(description, 50, '... read more');
 * // 'This is a very long product descr... read more'
 *
 * // For URLs
 * const url = 'https://www.example.com/very/long/path/to/resource';
 * truncate(url, 30, '...');
 * // 'https://www.example.com/...'
 * ```
 */
export function truncate(
  str: string,
  length: number = 30,
  omission: string = '...'
): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (typeof length !== 'number' || !Number.isInteger(length) || length < 0) {
    throw new TypeError('Expected length to be a non-negative integer');
  }

  if (typeof omission !== 'string') {
    throw new TypeError('Expected omission to be a string');
  }

  // If string is already shorter than or equal to the limit, return as-is
  if (str.length <= length) {
    return str;
  }

  // If omission is longer than the limit, just return the omission truncated
  if (omission.length >= length) {
    return omission.slice(0, length);
  }

  // Calculate how much of the original string we can keep
  const truncateAt = length - omission.length;

  // If there's no room for any original content, just return omission
  if (truncateAt <= 0) {
    return omission.slice(0, length);
  }

  return str.slice(0, truncateAt) + omission;
}

/**
 * Truncates a string at the nearest word boundary to avoid cutting words in half.
 *
 * @param str - The string to truncate
 * @param length - The maximum length of the truncated string
 * @param omission - The string used to indicate omitted characters (default: '...')
 * @returns A truncated string at word boundary if possible
 *
 * @example
 * ```typescript
 * import { truncateWords } from 'datype';
 *
 * // Truncate at word boundary
 * truncateWords('Hello world this is a test', 15);
 * // 'Hello world...'
 *
 * // Compare with regular truncate
 * truncate('Hello world this is a test', 15);
 * // 'Hello world thi...'
 *
 * // Long single word
 * truncateWords('Supercalifragilisticexpialidocious', 15);
 * // 'Supercalifrag...' (falls back to character truncation)
 *
 * // No spaces in limit
 * truncateWords('Hello world', 5);
 * // 'He...' (falls back to character truncation)
 * ```
 */
export function truncateWords(
  str: string,
  length: number,
  omission: string = '...'
): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (typeof length !== 'number' || !Number.isInteger(length) || length < 0) {
    throw new TypeError('Expected length to be a non-negative integer');
  }

  if (typeof omission !== 'string') {
    throw new TypeError('Expected omission to be a string');
  }

  // If string is already shorter than or equal to the limit, return as-is
  if (str.length <= length) {
    return str;
  }

  // First, do a regular truncation to get the maximum possible substring
  const maxSubstring = str.slice(0, length - omission.length);

  // Find the last space in this substring
  const lastSpaceIndex = maxSubstring.lastIndexOf(' ');

  // If there's no space (single long word), fall back to character truncation
  if (lastSpaceIndex === -1) {
    return truncate(str, length, omission);
  }

  // Truncate at the last word boundary
  return str.slice(0, lastSpaceIndex) + omission;
}

/**
 * Truncates text in the middle, keeping both the beginning and end visible.
 * Useful for file paths, URLs, or other strings where both ends are important.
 *
 * @param str - The string to truncate
 * @param length - The maximum length of the truncated string
 * @param omission - The string used to indicate omitted characters (default: '...')
 * @returns A string truncated in the middle
 *
 * @example
 * ```typescript
 * import { truncateMiddle } from 'datype';
 *
 * // File paths
 * truncateMiddle('/very/long/path/to/important/file.txt', 25);
 * // '/very/long/.../file.txt'
 *
 * // URLs
 * truncateMiddle('https://www.example.com/very/long/path/page.html', 35);
 * // 'https://www.example.com/.../page.html'
 *
 * // Email addresses
 * truncateMiddle('verylongemailaddress@example.com', 25);
 * // 'verylongemail...@example.com'
 *
 * // Custom omission
 * truncateMiddle('abcdefghijklmnopqrstuvwxyz', 15, '…');
 * // 'abcdef…tuvwxyz'
 * ```
 */
export function truncateMiddle(
  str: string,
  length: number,
  omission: string = '...'
): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (typeof length !== 'number' || !Number.isInteger(length) || length < 0) {
    throw new TypeError('Expected length to be a non-negative integer');
  }

  if (typeof omission !== 'string') {
    throw new TypeError('Expected omission to be a string');
  }

  // If string is already shorter than or equal to the limit, return as-is
  if (str.length <= length) {
    return str;
  }

  // If omission is longer than the limit, just return the omission truncated
  if (omission.length >= length) {
    return omission.slice(0, length);
  }

  // Calculate how much content we can keep (excluding omission)
  const contentLength = length - omission.length;

  // If there's no room for any content, just return omission
  if (contentLength <= 0) {
    return omission.slice(0, length);
  }

  // Split the available content length between start and end
  const startLength = Math.ceil(contentLength / 2);
  const endLength = contentLength - startLength;

  const start = str.slice(0, startLength);
  const end = endLength > 0 ? str.slice(-endLength) : '';

  return start + omission + end;
}
