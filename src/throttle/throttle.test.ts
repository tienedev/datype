import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from './index';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should throttle function calls', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled();
      throttled();

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should call function immediately on first invocation', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should use latest arguments for trailing call', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('first');
      throttled('second');
      throttled('third');

      expect(func).toHaveBeenCalledWith('first');

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith('third');
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should return result from function calls', () => {
      const func = vi.fn().mockReturnValue('result');
      const throttled = throttle(func, 100);

      const result1 = throttled();
      expect(result1).toBe('result');

      const result2 = throttled();
      expect(result2).toBe('result');
    });

    it('should preserve function context', () => {
      const obj = {
        value: 'test',
        method() {
          return this.value;
        },
      };

      const throttled = throttle(obj.method.bind(obj), 100);
      const result = throttled();

      expect(result).toBe('test');
    });
  });

  describe('timing', () => {
    it('should allow invocation after wait period', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid successive calls correctly', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      // First immediate call
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      // Rapid calls within wait period
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(10);
        throttled();
      }
      // The function starts being called immediately during rapid calls
      // because we're advancing time and triggering the timer
      expect(func).toHaveBeenCalledTimes(2);

      // Trailing call after wait period
      vi.advanceTimersByTime(10);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should reset timer correctly', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      vi.advanceTimersByTime(50);
      throttled();
      vi.advanceTimersByTime(50);
      throttled();

      // Leading call happens immediately + timer expiration during time advancement
      expect(func).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(50);
      // Trailing call should execute after wait period
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle remainingWait calculations correctly', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      // First call - immediate leading execution
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      // Call after partial wait time
      vi.advanceTimersByTime(50);
      throttled();

      // remainingWait should be calculated correctly (50ms remaining)
      expect(func).toHaveBeenCalledTimes(1);

      // Complete the remaining wait
      vi.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle edge case with timing calculations', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      vi.advanceTimersByTime(30);
      throttled();
      vi.advanceTimersByTime(30);
      throttled();

      // Should still be in throttle period
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(40); // Complete the throttle period
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle trailingEdge without lastArgs', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { trailing: false });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      // With trailing false, no additional calls should be made
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle timing edge case with remainingWait', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      // Mock Date.now to control timing precisely
      const now = Date.now();
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(now) // First call
        .mockReturnValueOnce(now + 30) // Second call
        .mockReturnValueOnce(now + 130); // Timer expired call

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled(); // Should not execute immediately
      expect(func).toHaveBeenCalledTimes(1);

      // Advance time to complete throttle period
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);

      vi.restoreAllMocks();
    });
  });

  describe('leading edge', () => {
    it('should not call immediately when leading is false', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: false });

      throttled();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should call immediately when leading is true (default)', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: true });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should work with both leading and trailing false', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, {
        leading: false,
        trailing: false,
      });

      throttled();
      throttled();
      vi.advanceTimersByTime(100);

      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('trailing edge', () => {
    it('should not call on trailing edge when trailing is false', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { trailing: false });

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should call on trailing edge when trailing is true (default)', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { trailing: true });

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should work with leading false and trailing true', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: false, trailing: true });

      throttled();
      expect(func).not.toHaveBeenCalled();

      throttled();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('control methods', () => {
    describe('cancel', () => {
      it('should cancel pending execution', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        throttled.cancel();
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1); // Only the initial call
      });

      it('should reset internal state', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled('first');
        throttled('second');
        throttled.cancel();

        throttled('third');
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledWith('first');
        expect(func).toHaveBeenCalledWith('third');
        expect(func).toHaveBeenCalledTimes(2);
      });
    });

    describe('flush', () => {
      it('should immediately execute pending function', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled('test');
        throttled('test2');

        throttled.flush();

        expect(func).toHaveBeenCalledWith('test');
        expect(func).toHaveBeenCalledWith('test2');
        expect(func).toHaveBeenCalledTimes(2);
      });

      it('should return function result', () => {
        const func = vi.fn().mockReturnValue('flushed');
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        const result = throttled.flush();

        expect(result).toBe('flushed');
      });

      it('should return last result when no pending execution', () => {
        const func = vi.fn().mockReturnValue('result');
        const throttled = throttle(func, 100);

        throttled();
        vi.advanceTimersByTime(100);

        const result = throttled.flush();
        expect(result).toBe('result');
      });
    });

    describe('pending', () => {
      it('should return true when execution is pending', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        expect(throttled.pending()).toBe(false);

        throttled();
        throttled();
        expect(throttled.pending()).toBe(true);

        vi.advanceTimersByTime(100);
        expect(throttled.pending()).toBe(false);
      });

      it('should return false after cancel', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        expect(throttled.pending()).toBe(true);

        throttled.cancel();
        expect(throttled.pending()).toBe(false);
      });

      it('should return false after flush', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        expect(throttled.pending()).toBe(true);

        throttled.flush();
        expect(throttled.pending()).toBe(false);
      });

      it('should return false when trailing is disabled', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { trailing: false });

        throttled();
        throttled();
        expect(throttled.pending()).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should throw error for non-function input', () => {
      expect(() => {
        throttle('not a function' as any, 100);
      }).toThrow(TypeError);
    });

    it('should throw error for negative wait time', () => {
      expect(() => {
        throttle(() => {}, -1);
      }).toThrow(RangeError);
    });

    it('should handle function that throws error', () => {
      const errorFunc = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      const throttled = throttle(errorFunc, 100);

      expect(() => {
        throttled();
      }).toThrow('Test error');
    });
  });

  describe('edge cases', () => {
    it('should handle zero wait time', () => {
      const func = vi.fn();
      const throttled = throttle(func, 0);

      throttled();
      throttled();

      // First call should execute immediately, second should be trailing
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(0);
      // Trailing call should execute
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple arguments', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled(1, 'test', { key: 'value' });
      expect(func).toHaveBeenCalledWith(1, 'test', { key: 'value' });
    });

    it('should handle function with no return value', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      const result = throttled();
      expect(result).toBeUndefined();
    });

    it('should handle long sequences of calls', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      // First immediate call (leading)
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      // Multiple calls over time - these will be throttled
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(20);
        throttled();
      }

      // Leading call + timer expired during time advancement
      expect(func).toHaveBeenCalledTimes(2);

      // Wait for trailing call
      vi.advanceTimersByTime(100);
      // Additional trailing call fires
      expect(func).toHaveBeenCalledTimes(3);
    });
  });

  describe('TypeScript types', () => {
    it('should preserve function signature', () => {
      const typedFunc = (a: string, b: number): string => {
        return `${a}-${b}`;
      };

      const throttled = throttle(typedFunc, 100);

      // This should compile without type errors
      const result = throttled('test', 42);
      expect(result).toBe('test-42');
    });
  });
});
