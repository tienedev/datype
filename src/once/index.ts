/**
 * Creates a function that can only be called once. Subsequent calls return the result of the first call.
 *
 * @param fn - The function to restrict to one execution
 * @returns A new function that can only be called once
 *
 * @example
 * ```typescript
 * import { once } from 'datype';
 *
 * // Basic usage
 * const sayHello = once(() => {
 *   console.log('Hello!');
 *   return 'greeting';
 * });
 *
 * sayHello(); // logs "Hello!" and returns "greeting"
 * sayHello(); // returns "greeting" without logging
 * sayHello(); // returns "greeting" without logging
 *
 * // With parameters
 * const addOnce = once((a: number, b: number) => {
 *   console.log(`Adding ${a} + ${b}`);
 *   return a + b;
 * });
 *
 * addOnce(2, 3); // logs "Adding 2 + 3" and returns 5
 * addOnce(4, 5); // returns 5 without logging (ignores new arguments)
 *
 * // Expensive computation
 * const expensiveCalculation = once(() => {
 *   console.log('Performing expensive calculation...');
 *   // Simulate expensive work
 *   let result = 0;
 *   for (let i = 0; i < 1000000; i++) {
 *     result += Math.random();
 *   }
 *   return result;
 * });
 *
 * const result1 = expensiveCalculation(); // Does the calculation
 * const result2 = expensiveCalculation(); // Returns cached result
 * console.log(result1 === result2); // true
 *
 * // Event handler that should only run once
 * const handleFirstClick = once((event: Event) => {
 *   console.log('First click detected!');
 *   // Remove event listener or show modal, etc.
 * });
 *
 * button.addEventListener('click', handleFirstClick);
 *
 * // Initialization function
 * const initialize = once(() => {
 *   console.log('Initializing application...');
 *   // Setup code that should only run once
 *   return { initialized: true };
 * });
 *
 * // Real-world example: lazy loading
 * const loadConfig = once(async () => {
 *   console.log('Loading configuration...');
 *   const response = await fetch('/api/config');
 *   return response.json();
 * });
 *
 * // Multiple calls will return the same Promise
 * const config1 = await loadConfig(); // Makes API call
 * const config2 = await loadConfig(); // Returns same Promise result
 * ```
 */
export function once<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  let called = false;
  let result: TReturn;
  let hasError = false;
  let error: unknown;

  return function onceFn(...args: TArgs): TReturn {
    if (!called) {
      called = true;
      try {
        result = fn(...args);
      } catch (err) {
        hasError = true;
        error = err;
        throw err;
      }
    }

    if (hasError) {
      throw error;
    }

    return result;
  };
}
