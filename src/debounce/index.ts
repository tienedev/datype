/**
 * Options for configuring debounce behavior
 */
export interface DebounceOptions {
  /**
   * If true, the function is called on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean;

  /**
   * If true, the function is called on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;

  /**
   * Maximum time the function can be delayed before it's invoked.
   * If specified, the function will be called at most once per `maxWait` milliseconds.
   */
  maxWait?: number;
}

/**
 * Debounced function interface with additional control methods
 */
export interface DebouncedFunction<TArgs extends readonly unknown[], TReturn> {
  /**
   * Call the debounced function
   */
  (...args: TArgs): TReturn | undefined;

  /**
   * Cancel any pending execution
   */
  cancel(): void;

  /**
   * Immediately execute the function with the last provided arguments
   */
  flush(): TReturn | undefined;

  /**
   * Check if there's a pending execution
   */
  pending(): boolean;
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @template TArgs - The argument types of the function
 * @template TReturn - The return type of the function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Options object to configure debounce behavior
 * @returns A new debounced function with cancel, flush, and pending methods
 *
 * @example
 * ```typescript
 * import { debounce } from 'datype';
 *
 * // Basic debouncing - delays execution until 300ms after last call
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 *   return fetchSearchResults(query);
 * }, 300);
 *
 * // Only the last call will execute after 300ms
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc'); // Only this will execute
 *
 * // Leading edge execution - executes immediately on first call
 * const leadingDebounce = debounce(() => {
 *   console.log('Button clicked!');
 * }, 1000, { leading: true, trailing: false });
 *
 * // Control methods
 * const debounced = debounce(() => console.log('Hello'), 1000);
 * debounced.cancel();        // Cancel pending execution
 * debounced.flush();         // Execute immediately
 * debounced.pending();       // Check if execution is pending
 *
 * // Maximum wait time - ensures function is called at most once per maxWait
 * const maxWaitDebounce = debounce(updateUI, 100, { maxWait: 1000 });
 * ```
 */
export function debounce<TArgs extends readonly unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<TArgs, TReturn> {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: TArgs | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let result: TReturn | undefined;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  if (wait < 0) {
    throw new RangeError('Wait time must be non-negative');
  }

  if (maxWait !== undefined && maxWait < wait) {
    throw new RangeError('maxWait must be greater than or equal to wait');
  }

  function invokeFunc(time: number): TReturn {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func(...args);
    return result;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function leadingEdge(time: number): TReturn | undefined {
    lastInvokeTime = time;

    timeoutId = setTimeout(timerExpired, wait);

    if (maxWait !== undefined) {
      maxTimeoutId = setTimeout(maxTimerExpired, maxWait);
    }

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
    } else {
      // Restart the timer
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }
  }

  function maxTimerExpired(): void {
    const time = Date.now();
    if (lastArgs !== undefined) {
      // Clear the regular timer when maxWait fires
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      trailingEdge(time);
    }
  }

  function trailingEdge(time: number): TReturn | undefined {
    timeoutId = undefined;
    maxTimeoutId = undefined;

    // Only invoke if we have lastArgs which means debounced was called
    if (trailing && lastArgs !== undefined) {
      return invokeFunc(time);
    }

    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = undefined;
    }

    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
  }

  function flush(): TReturn | undefined {
    if (timeoutId === undefined && maxTimeoutId === undefined) {
      return result;
    }

    // Clear all timers and invoke with current args if any
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = undefined;
    }

    const time = Date.now();
    if (lastArgs !== undefined) {
      return invokeFunc(time);
    }

    return result;
  }

  function pending(): boolean {
    return timeoutId !== undefined || maxTimeoutId !== undefined;
  }

  function debounced(...args: TArgs): TReturn | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined && maxTimeoutId === undefined) {
        return leadingEdge(time);
      }
      if (maxTimeoutId !== undefined) {
        // Handle maxWait timeout - clear existing timers and reset
        clearTimeout(timeoutId);
        clearTimeout(maxTimeoutId);
        timeoutId = undefined;
        maxTimeoutId = undefined;
        return invokeFunc(time);
      }
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    if (maxWait !== undefined && maxTimeoutId === undefined) {
      maxTimeoutId = setTimeout(maxTimerExpired, maxWait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}
