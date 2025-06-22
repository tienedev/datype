/**
 * Transforms a function that takes multiple arguments into a sequence of functions,
 * each taking a single argument (currying).
 *
 * @param fn - The function to curry
 * @returns A curried version of the function
 *
 * @example
 * ```typescript
 * import { curry } from 'datype';
 *
 * // Basic currying
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 *
 * // All these produce the same result
 * console.log(add(1, 2, 3)); // 6
 * console.log(curriedAdd(1)(2)(3)); // 6
 * console.log(curriedAdd(1, 2)(3)); // 6
 * console.log(curriedAdd(1)(2, 3)); // 6
 * console.log(curriedAdd(1, 2, 3)); // 6
 *
 * // Partial application
 * const add5 = curriedAdd(5);
 * const add5And3 = add5(3);
 * console.log(add5And3(2)); // 10
 *
 * // String manipulation
 * const replace = (search: string, replacement: string, text: string) =>
 *   text.replace(search, replacement);
 *
 * const curriedReplace = curry(replace);
 * const removeSpaces = curriedReplace(' ', '');
 * const replaceHello = curriedReplace('hello');
 *
 * console.log(removeSpaces('hello world')); // 'helloworld'
 * console.log(replaceHello('hi', 'hello world')); // 'hi world'
 *
 * // Array operations
 * const map = <T, U>(fn: (item: T) => U, array: T[]) => array.map(fn);
 * const curriedMap = curry(map);
 *
 * const double = (x: number) => x * 2;
 * const doubleArray = curriedMap(double);
 *
 * console.log(doubleArray([1, 2, 3])); // [2, 4, 6]
 *
 * // Filter operations
 * const filter = <T>(predicate: (item: T) => boolean, array: T[]) =>
 *   array.filter(predicate);
 * const curriedFilter = curry(filter);
 *
 * const isEven = (x: number) => x % 2 === 0;
 * const filterEvens = curriedFilter(isEven);
 *
 * console.log(filterEvens([1, 2, 3, 4, 5])); // [2, 4]
 *
 * // Real-world example: API request builder
 * const makeRequest = (method: string, url: string, data: any) => ({
 *   method,
 *   url,
 *   data
 * });
 *
 * const curriedRequest = curry(makeRequest);
 * const post = curriedRequest('POST');
 * const postToApi = post('/api/users');
 *
 * const newUser = postToApi({ name: 'John', email: 'john@example.com' });
 * // { method: 'POST', url: '/api/users', data: { name: 'John', email: 'john@example.com' } }
 * ```
 */
export function curry<T extends (...args: any[]) => any>(fn: T): Curried<T> {
  const curried = (...args: any[]): any => {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };

  return curried as Curried<T>;
}

// Type definitions for proper TypeScript support
// Pragmatic curry type that prioritizes usability over strict typing
type Curried<T extends (...args: any[]) => any> = T & ((...args: any[]) => any);
