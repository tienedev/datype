/**
 * Creates a function that is the composition of the provided functions.
 * Each function consumes the return value of the function that follows it.
 * The rightmost function can accept multiple arguments; the remaining functions must be unary.
 *
 * @param functions - The functions to compose
 * @returns A new function that is the composition of the provided functions
 *
 * @example
 * ```typescript
 * import { compose } from 'datype';
 *
 * // Basic composition
 * const add5 = (x: number) => x + 5;
 * const multiply2 = (x: number) => x * 2;
 * const subtract1 = (x: number) => x - 1;
 *
 * const composed = compose(add5, multiply2, subtract1);
 * composed(10); // add5(multiply2(subtract1(10))) = add5(multiply2(9)) = add5(18) = 23
 *
 * // String processing pipeline
 * const toUpperCase = (s: string) => s.toUpperCase();
 * const addExclamation = (s: string) => s + '!';
 * const trim = (s: string) => s.trim();
 *
 * const processString = compose(toUpperCase, addExclamation, trim);
 * processString('  hello world  '); // 'HELLO WORLD!'
 *
 * // With type transformations
 * const toString = (x: number) => String(x);
 * const parseFloat = (s: string) => parseFloat(s);
 * const addOne = (x: number) => x + 1;
 *
 * const processNumber = compose(toString, addOne, parseFloat);
 * processNumber('42.5'); // '43.5'
 *
 * // Single function
 * const identity = compose(add5);
 * identity(10); // 15
 *
 * // Real-world example: data transformation
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const validateUser = (user: any): User => {
 *   if (!user.id || !user.name || !user.email) {
 *     throw new Error('Invalid user');
 *   }
 *   return user as User;
 * };
 *
 * const normalizeEmail = (user: User): User => ({
 *   ...user,
 *   email: user.email.toLowerCase()
 * });
 *
 * const addTimestamp = (user: User) => ({
 *   ...user,
 *   createdAt: new Date().toISOString()
 * });
 *
 * const processUser = compose(addTimestamp, normalizeEmail, validateUser);
 * const result = processUser({ id: 1, name: 'John', email: 'JOHN@EXAMPLE.COM' });
 * // { id: 1, name: 'John', email: 'john@example.com', createdAt: '...' }
 * ```
 */
export function compose<T>(
  ...functions: ((...args: any[]) => any)[]
): (...args: any[]) => T {
  if (functions.length === 0) {
    throw new Error('compose requires at least one function');
  }

  if (functions.length === 1) {
    return functions[0] as (...args: any[]) => T;
  }

  return (...args: any[]): T => {
    // Start with the rightmost function and work left
    let result = functions[functions.length - 1]!(...args);

    for (let i = functions.length - 2; i >= 0; i--) {
      result = functions[i]!(result);
    }

    return result;
  };
}

/**
 * Creates a function that is the composition of the provided functions.
 * Each function consumes the return value of the function that precedes it.
 * The leftmost function can accept multiple arguments; the remaining functions must be unary.
 * This is the reverse of compose - functions are applied from left to right.
 *
 * @param functions - The functions to pipe
 * @returns A new function that is the composition of the provided functions applied left to right
 *
 * @example
 * ```typescript
 * import { pipe } from 'datype';
 *
 * // Basic pipe (left to right)
 * const add5 = (x: number) => x + 5;
 * const multiply2 = (x: number) => x * 2;
 * const subtract1 = (x: number) => x - 1;
 *
 * const piped = pipe(add5, multiply2, subtract1);
 * piped(10); // subtract1(multiply2(add5(10))) = subtract1(multiply2(15)) = subtract1(30) = 29
 *
 * // String processing pipeline (more intuitive order)
 * const trim = (s: string) => s.trim();
 * const addExclamation = (s: string) => s + '!';
 * const toUpperCase = (s: string) => s.toUpperCase();
 *
 * const processString = pipe(trim, addExclamation, toUpperCase);
 * processString('  hello world  '); // 'HELLO WORLD!'
 *
 * // Data processing pipeline
 * interface ApiResponse {
 *   data: any[];
 *   meta: { total: number };
 * }
 *
 * const extractData = (response: ApiResponse) => response.data;
 * const filterActive = (items: any[]) => items.filter(item => item.active);
 * const mapToNames = (items: any[]) => items.map(item => item.name);
 * const sortNames = (names: string[]) => names.sort();
 *
 * const processApiResponse = pipe(extractData, filterActive, mapToNames, sortNames);
 *
 * const response = {
 *   data: [
 *     { name: 'Charlie', active: true },
 *     { name: 'Alice', active: false },
 *     { name: 'Bob', active: true }
 *   ],
 *   meta: { total: 3 }
 * };
 *
 * processApiResponse(response); // ['Bob', 'Charlie']
 *
 * // Async operations (functions can return promises)
 * const fetchUser = async (id: number) => ({ id, name: `User ${id}` });
 * const formatUser = (user: any) => `${user.name} (ID: ${user.id})`;
 *
 * const processUserId = pipe(fetchUser, formatUser);
 * // Note: this would need to be awaited since fetchUser returns a Promise
 * ```
 */
export function pipe<T>(
  ...functions: ((...args: any[]) => any)[]
): (...args: any[]) => T {
  if (functions.length === 0) {
    throw new Error('pipe requires at least one function');
  }

  if (functions.length === 1) {
    return functions[0] as (...args: any[]) => T;
  }

  return (...args: any[]): T => {
    // Start with the leftmost function and work right
    let result = functions[0]!(...args);

    for (let i = 1; i < functions.length; i++) {
      result = functions[i]!(result);
    }

    return result;
  };
}
