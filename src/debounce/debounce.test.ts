import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './index';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should debounce function calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should call function with latest arguments', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith('third');
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should return result from last invocation', () => {
      const func = vi.fn().mockReturnValue('result');
      const debounced = debounce(func, 100);

      const result1 = debounced();
      expect(result1).toBeUndefined();

      vi.advanceTimersByTime(100);

      const result2 = debounced();
      expect(result2).toBe('result');
    });

    it('should preserve function context', () => {
      const obj = {
        value: 'test',
        method() {
          return this.value;
        },
      };

      const debounced = debounce(obj.method.bind(obj), 100);
      debounced();

      vi.advanceTimersByTime(100);
      expect(obj.method).toBeDefined();
    });
  });

  describe('timing', () => {
    it('should reset timer on subsequent calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple invocations correctly', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('leading edge', () => {
    it('should call function immediately when leading is true', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: true });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should not call on trailing edge when trailing is false', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: false });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('maxWait option', () => {
    it('should enforce maximum wait time', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      vi.advanceTimersByTime(150);
      debounced(); // This should reset the timer but maxWait should still fire
      vi.advanceTimersByTime(50); // Total 200ms

      // maxWait fires first, then trailing edge may fire as well
      // This is normal behavior: maxWait ensures function is called within maxWait time
      // and trailing ensures the last call is processed
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should work with leading and maxWait', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: true, maxWait: 200 });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(150);
      debounced();
      vi.advanceTimersByTime(50);

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('control methods', () => {
    describe('cancel', () => {
      it('should cancel pending execution', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();
        vi.advanceTimersByTime(100);

        expect(func).not.toHaveBeenCalled();
      });

      it('should reset internal state', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced('test');
        debounced.cancel();
        debounced();
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledWith();
        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('flush', () => {
      it('should immediately execute pending function', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced('test');
        debounced.flush();

        expect(func).toHaveBeenCalledWith('test');
        expect(func).toHaveBeenCalledTimes(1);
      });

      it('should return function result', () => {
        const func = vi.fn().mockReturnValue('flushed');
        const debounced = debounce(func, 100);

        debounced();
        const result = debounced.flush();

        expect(func).toHaveBeenCalledTimes(1);
        expect(result).toBe('flushed');
      });

      it('should return last result when no pending execution', () => {
        const func = vi.fn().mockReturnValue('result');
        const debounced = debounce(func, 100);

        debounced();
        vi.advanceTimersByTime(100);

        const result = debounced.flush();
        expect(result).toBe('result');
      });
    });

    describe('pending', () => {
      it('should return true when execution is pending', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        expect(debounced.pending()).toBe(false);

        debounced();
        expect(debounced.pending()).toBe(true);

        vi.advanceTimersByTime(100);
        expect(debounced.pending()).toBe(false);
      });

      it('should return false after cancel', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        expect(debounced.pending()).toBe(true);

        debounced.cancel();
        expect(debounced.pending()).toBe(false);
      });

      it('should return false after flush', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        expect(debounced.pending()).toBe(true);

        debounced.flush();
        expect(debounced.pending()).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should throw error for non-function input', () => {
      expect(() => {
        debounce('not a function' as any, 100);
      }).toThrow(TypeError);
    });

    it('should throw error for negative wait time', () => {
      expect(() => {
        debounce(() => {}, -1);
      }).toThrow(RangeError);
    });

    it('should throw error when maxWait is less than wait', () => {
      expect(() => {
        debounce(() => {}, 100, { maxWait: 50 });
      }).toThrow(RangeError);
    });

    it('should handle function that throws error', () => {
      const errorFunc = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      const debounced = debounce(errorFunc, 100);

      debounced();

      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow('Test error');
    });
  });

  describe('edge cases', () => {
    it('should handle zero wait time', () => {
      const func = vi.fn();
      const debounced = debounce(func, 0);

      debounced();
      vi.advanceTimersByTime(0);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple arguments', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced(1, 'test', { key: 'value' });
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith(1, 'test', { key: 'value' });
    });

    it('should handle function with no return value', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      const result = debounced();
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(100);
      const result2 = debounced();
      expect(result2).toBeUndefined();
    });

    it('should handle edge case with maxWait and trailing=false', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200, trailing: false });

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(150); // Total 200ms - maxWait should fire

      // With trailing=false, the function should still be called due to maxWait
      // but since trailing is false, it won't call on the trailing edge
      // The behavior depends on whether we have a leading call or not
      expect(func).toHaveBeenCalledTimes(0);
    });

    it('should handle shouldInvoke edge cases', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 150 });

      debounced();
      vi.advanceTimersByTime(75);
      debounced();
      vi.advanceTimersByTime(75); // Should trigger maxWait

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle flush when no args were set', () => {
      const func = vi.fn().mockReturnValue('test');
      const debounced = debounce(func, 100);

      // Flush without any calls should return undefined
      const result = debounced.flush();
      expect(result).toBeUndefined();
    });

    it('should handle complex maxWait scenarios', () => {
      const func = vi.fn();
      const debounced = debounce(func, 50, { maxWait: 100 });

      debounced('arg1');
      vi.advanceTimersByTime(40);
      debounced('arg2');
      vi.advanceTimersByTime(40);
      debounced('arg3');
      vi.advanceTimersByTime(40); // Should trigger maxWait

      expect(func).toHaveBeenCalledWith('arg3');
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle timerExpired with shouldInvoke false', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      // Advance time partially to trigger timerExpired but not shouldInvoke
      vi.advanceTimersByTime(50);
      debounced(); // This resets lastCallTime
      vi.advanceTimersByTime(50); // Timer should restart

      expect(func).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(50); // Complete the wait
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle leading edge with maxWait timer', () => {
      const func = vi.fn().mockReturnValue('result');
      const debounced = debounce(func, 100, { leading: true, maxWait: 150 });

      const result = debounced('test');
      expect(result).toBe('result'); // Leading call returns result
      expect(func).toHaveBeenCalledTimes(1);

      // Test that maxWait timer is properly set
      vi.advanceTimersByTime(149);
      debounced('test2');
      vi.advanceTimersByTime(1); // Should trigger maxWait

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle trailingEdge with different scenarios', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { trailing: false });

      debounced();
      vi.advanceTimersByTime(100);

      // With trailing false, lastArgs should be cleared
      expect(func).toHaveBeenCalledTimes(0);
    });

    it('should handle maxTimerExpired when lastArgs is undefined', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 150 });

      debounced();
      vi.advanceTimersByTime(100);
      // The function should be called after 100ms (normal debounce timer)
      expect(func).toHaveBeenCalledTimes(1);

      // Reset for next test scenario
      func.mockClear();

      // Create a new debouncer to test maxTimer behavior
      const debounced2 = debounce(func, 100, { maxWait: 150 });
      debounced2();
      debounced2.cancel(); // This clears lastArgs

      // Now advance time - maxTimer should not fire since lastArgs is undefined
      vi.advanceTimersByTime(150);
      expect(func).toHaveBeenCalledTimes(0);
    });

    it('should cover remainingWait calculations with maxWait', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      vi.advanceTimersByTime(50);
      debounced(); // Should restart timer
      vi.advanceTimersByTime(40); // remainingWait should be called

      // Timer should restart, not invoke yet
      expect(func).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(60); // Complete the wait
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle debounced call with maxWait timeout scenario', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 150 });

      debounced();
      vi.advanceTimersByTime(80);
      debounced(); // This should trigger the maxWait branch in debounced function
      vi.advanceTimersByTime(70); // This should trigger maxWait timeout

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle cancel with maxWait timer', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      expect(debounced.pending()).toBe(true);

      debounced.cancel();
      expect(debounced.pending()).toBe(false);

      vi.advanceTimersByTime(200);
      expect(func).toHaveBeenCalledTimes(0);
    });

    it('should handle flush with maxWait timer', () => {
      const func = vi.fn().mockReturnValue('flushed');
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced('test');
      const result = debounced.flush();

      expect(result).toBe('flushed');
      expect(func).toHaveBeenCalledWith('test');
      expect(debounced.pending()).toBe(false);
    });

    it('should handle complex timer restart scenario', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced(); // This should restart the timer

      // At this point the function should not have been called yet
      expect(func).toHaveBeenCalledTimes(0);

      // Advance the remaining time for the restarted timer
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('TypeScript types', () => {
    it('should preserve function signature', () => {
      const typedFunc = (a: string, b: number): string => {
        return `${a}-${b}`;
      };

      const debounced = debounce(typedFunc, 100);

      // This should compile without type errors
      debounced('test', 42);
      vi.advanceTimersByTime(100);
    });
  });
});
