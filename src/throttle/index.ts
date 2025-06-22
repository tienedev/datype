/**
 * Options for configuring throttle behavior
 */
export interface ThrottleOptions {
  /**
   * If true, the function is called on the leading edge of the wait period.
   * @default true
   */
  leading?: boolean;

  /**
   * If true, the function is called on the trailing edge of the wait period.
   * @default true
   */
  trailing?: boolean;
}

/**
 * Throttled function interface with additional control methods
 */
export interface ThrottledFunction<TArgs extends readonly unknown[], TReturn> {
  /**
   * Call the throttled function
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
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 * The throttled function comes with a `cancel` method to cancel delayed `func` invocations and
 * a `flush` method to immediately invoke them.
 *
 * @template TArgs - The argument types of the function
 * @template TReturn - The return type of the function
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Options object to configure throttle behavior
 * @returns A new throttled function with cancel, flush, and pending methods
 *
 * @example
 * ```typescript
 * import { throttle } from 'datype';
 *
 * // Basic throttling - limits execution to once per 300ms
 * const throttledScroll = throttle((event: Event) => {
 *   console.log('Scroll event processed');
 *   updateScrollPosition();
 * }, 300);
 *
 * window.addEventListener('scroll', throttledScroll);
 *
 * // API rate limiting - ensure function is called at most once per second
 * const throttledApiCall = throttle(async (data: any) => {
 *   return await fetch('/api/data', {
 *     method: 'POST',
 *     body: JSON.stringify(data)
 *   });
 * }, 1000);
 *
 * // Leading edge only - execute immediately, then ignore subsequent calls
 * const buttonClickHandler = throttle(() => {
 *   console.log('Button clicked!');
 * }, 1000, { leading: true, trailing: false });
 *
 * // Trailing edge only - wait for quiet period, then execute with latest args
 * const searchHandler = throttle((query: string) => {
 *   performSearch(query);
 * }, 300, { leading: false, trailing: true });
 *
 * // Control methods
 * const throttled = throttle(() => console.log('Hello'), 1000);
 * throttled.cancel();   // Cancel pending execution
 * throttled.flush();    // Execute immediately
 * throttled.pending();  // Check if execution is pending
 * ```
 */
export function throttle<TArgs extends readonly unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<TArgs, TReturn> {
  const { leading = true, trailing = true } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: TArgs | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let result: TReturn | undefined;

  // Validate inputs
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  if (wait < 0) {
    throw new RangeError('Wait time must be non-negative');
  }

  function invokeFunc(time: number): TReturn {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func(...args);
    return result;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastInvoke = time - lastInvokeTime;

    // First call or enough time has passed since last invoke
    return lastCallTime === undefined || timeSinceLastInvoke >= wait;
  }

  function leadingEdge(time: number): TReturn | undefined {
    lastInvokeTime = time;

    // Start the timer for the trailing edge
    if (trailing) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    return leading ? invokeFunc(time) : result;
  }

  function _remainingWait(time: number): number {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return wait - timeSinceLastInvoke;
  }

  function timerExpired(): void {
    const time = Date.now();

    // Always invoke trailing edge when timer expires
    trailingEdge(time);
  }

  function trailingEdge(time: number): TReturn | undefined {
    timeoutId = undefined;

    // Only invoke if we have lastArgs which means throttled was called
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

    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
  }

  function flush(): TReturn | undefined {
    if (timeoutId === undefined) {
      return result;
    }

    const time = Date.now();
    return trailingEdge(time);
  }

  function pending(): boolean {
    return timeoutId !== undefined;
  }

  function throttled(...args: TArgs): TReturn | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(time);
      }
    }

    // Start trailing timer if not already running and trailing is enabled
    if (timeoutId === undefined && trailing) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  throttled.cancel = cancel;
  throttled.flush = flush;
  throttled.pending = pending;

  return throttled;
}
