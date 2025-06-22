import { describe, it, expect, vi } from 'vitest';
import { once } from './index';

describe('once', () => {
  describe('basic functionality', () => {
    it('should call the function only once', () => {
      const mockFn = vi.fn(() => 'result');
      const onceFn = once(mockFn);

      const result1 = onceFn();
      const result2 = onceFn();
      const result3 = onceFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(result3).toBe('result');
    });

    it('should return the same result on subsequent calls', () => {
      let counter = 0;
      const incrementCounter = once(() => ++counter);

      expect(incrementCounter()).toBe(1);
      expect(incrementCounter()).toBe(1);
      expect(incrementCounter()).toBe(1);
      expect(counter).toBe(1);
    });

    it('should work with functions that have parameters', () => {
      const mockFn = vi.fn((a: number, b: number) => a + b);
      const onceFn = once(mockFn);

      const result1 = onceFn(2, 3);
      const result2 = onceFn(4, 5); // Different args, but function won't be called again
      const result3 = onceFn(6, 7);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(2, 3);
      expect(result1).toBe(5);
      expect(result2).toBe(5); // Same result as first call
      expect(result3).toBe(5);
    });

    it('should work with functions that return different types', () => {
      const stringFn = once(() => 'hello');
      const numberFn = once(() => 42);
      const objectFn = once(() => ({ key: 'value' }));
      const arrayFn = once(() => [1, 2, 3]);

      expect(stringFn()).toBe('hello');
      expect(stringFn()).toBe('hello');

      expect(numberFn()).toBe(42);
      expect(numberFn()).toBe(42);

      const obj1 = objectFn();
      const obj2 = objectFn();
      expect(obj1).toBe(obj2); // Same reference
      expect(obj1).toEqual({ key: 'value' });

      const arr1 = arrayFn();
      const arr2 = arrayFn();
      expect(arr1).toBe(arr2); // Same reference
      expect(arr1).toEqual([1, 2, 3]);
    });
  });

  describe('edge cases', () => {
    it('should work with functions that return undefined', () => {
      const mockFn = vi.fn(() => undefined);
      const onceFn = once(mockFn);

      const result1 = onceFn();
      const result2 = onceFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
    });

    it('should work with functions that return null', () => {
      const mockFn = vi.fn(() => null);
      const onceFn = once(mockFn);

      const result1 = onceFn();
      const result2 = onceFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    it('should work with functions that return false or 0', () => {
      const falseFn = once(() => false);
      const zeroFn = once(() => 0);

      expect(falseFn()).toBe(false);
      expect(falseFn()).toBe(false);

      expect(zeroFn()).toBe(0);
      expect(zeroFn()).toBe(0);
    });

    it('should handle functions that throw errors', () => {
      const errorFn = once(() => {
        throw new Error('Test error');
      });

      expect(() => errorFn()).toThrow('Test error');
      expect(() => errorFn()).toThrow('Test error'); // Should throw again
    });

    it('should handle async functions', async () => {
      const mockAsyncFn = vi.fn(async () => 'async result');
      const onceAsyncFn = once(mockAsyncFn);

      const result1 = await onceAsyncFn();
      const result2 = await onceAsyncFn();

      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
      expect(result1).toBe('async result');
      expect(result2).toBe('async result');
    });

    it('should preserve function context when bound', () => {
      const obj = {
        value: 42,
        getValue() {
          return this.value;
        },
      };

      const onceFn = once(obj.getValue.bind(obj));

      expect(onceFn()).toBe(42);
      expect(onceFn()).toBe(42);
    });

    it('should work with arrow functions', () => {
      const mockFn = vi.fn(() => 'arrow result');
      const onceFn = once(mockFn);

      expect(onceFn()).toBe('arrow result');
      expect(onceFn()).toBe('arrow result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with generator functions', () => {
      function* generator() {
        yield 1;
        yield 2;
        return 3;
      }

      const onceGenerator = once(generator);

      const gen1 = onceGenerator();
      const gen2 = onceGenerator();

      expect(gen1).toBe(gen2); // Same generator instance
      expect(gen1.next().value).toBe(1);
      expect(gen2.next().value).toBe(2); // Continues from previous state
    });
  });

  describe('real-world use cases', () => {
    it('should work for initialization functions', () => {
      const initializationSteps: string[] = [];

      const initialize = once(() => {
        initializationSteps.push('step 1: setup');
        initializationSteps.push('step 2: configure');
        initializationSteps.push('step 3: ready');
        return { initialized: true, timestamp: Date.now() };
      });

      const result1 = initialize();
      const result2 = initialize();
      const result3 = initialize();

      expect(initializationSteps).toHaveLength(3);
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1.initialized).toBe(true);
    });

    it('should work for expensive calculations', () => {
      const expensiveCalculation = once(() => {
        // Simulate expensive work
        let result = 0;
        for (let i = 0; i < 100; i++) {
          result += i;
        }
        return result;
      });

      const start1 = Date.now();
      const result1 = expensiveCalculation();
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      const result2 = expensiveCalculation();
      const duration2 = Date.now() - start2;

      expect(result1).toBe(result2);
      expect(result1).toBe(4950); // Sum of 0 to 99
      expect(duration2).toBeLessThanOrEqual(duration1 + 1); // Second call should be at least as fast (with 1ms tolerance)
    });

    it('should work for event handlers', () => {
      const events: string[] = [];

      const handleFirstClick = once((event: { type: string }) => {
        events.push(`First ${event.type} handled`);
        return 'handled';
      });

      const result1 = handleFirstClick({ type: 'click' });
      const result2 = handleFirstClick({ type: 'click' });
      const result3 = handleFirstClick({ type: 'dblclick' }); // Different event type

      expect(events).toEqual(['First click handled']);
      expect(result1).toBe('handled');
      expect(result2).toBe('handled');
      expect(result3).toBe('handled');
    });

    it('should work for API calls', async () => {
      const apiCalls: string[] = [];

      const fetchUserData = once(async (userId: number) => {
        apiCalls.push(`Fetching user ${userId}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 10));
        return { id: userId, name: `User ${userId}` };
      });

      const promise1 = fetchUserData(123);
      const promise2 = fetchUserData(456); // Different userId, but won't call again
      const promise3 = fetchUserData(789);

      const result1 = await promise1;
      const result2 = await promise2;
      const result3 = await promise3;

      expect(apiCalls).toEqual(['Fetching user 123']);
      expect(result1).toEqual({ id: 123, name: 'User 123' });
      expect(result2).toEqual({ id: 123, name: 'User 123' }); // Same as first call
      expect(result3).toEqual({ id: 123, name: 'User 123' });
    });

    it('should work for configuration loading', () => {
      let configLoaded = false;

      const loadConfig = once(() => {
        if (configLoaded) {
          throw new Error('Config already loaded');
        }
        configLoaded = true;
        return {
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          features: ['feature1', 'feature2'],
        };
      });

      const config1 = loadConfig();
      const config2 = loadConfig();
      const config3 = loadConfig();

      expect(config1).toBe(config2);
      expect(config2).toBe(config3);
      expect(configLoaded).toBe(true);
      expect(config1.apiUrl).toBe('https://api.example.com');
    });

    it('should work for singleton pattern', () => {
      class Database {
        constructor(public connectionString: string) {}
      }

      const createDatabase = once(() => {
        return new Database('postgresql://localhost:5432/mydb');
      });

      const db1 = createDatabase();
      const db2 = createDatabase();
      const db3 = createDatabase();

      expect(db1).toBe(db2);
      expect(db2).toBe(db3);
      expect(db1.connectionString).toBe('postgresql://localhost:5432/mydb');
    });
  });

  describe('TypeScript type inference', () => {
    it('should maintain correct return types', () => {
      const stringFn = once(() => 'hello');
      const numberFn = once(() => 42);
      const booleanFn = once(() => true);

      // TypeScript should infer these correctly
      const str: string = stringFn();
      const num: number = numberFn();
      const bool: boolean = booleanFn();

      expect(typeof str).toBe('string');
      expect(typeof num).toBe('number');
      expect(typeof bool).toBe('boolean');
    });

    it('should maintain parameter types', () => {
      const addNumbers = once((a: number, b: number) => a + b);
      const joinStrings = once((str1: string, str2: string) => str1 + str2);

      // TypeScript should enforce parameter types
      expect(addNumbers(2, 3)).toBe(5);
      expect(joinStrings('hello', 'world')).toBe('helloworld');
    });

    it('should work with generic functions', () => {
      function createOnceFunction<T>(value: T) {
        return once(() => value);
      }

      const onceString = createOnceFunction('test');
      const onceNumber = createOnceFunction(123);
      const onceArray = createOnceFunction([1, 2, 3]);

      expect(onceString()).toBe('test');
      expect(onceNumber()).toBe(123);
      expect(onceArray()).toEqual([1, 2, 3]);
    });
  });

  describe('performance', () => {
    it('should be efficient for repeated calls', () => {
      const heavyComputation = once(() => {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += Math.sqrt(i);
        }
        return result;
      });

      // First call
      const start1 = Date.now();
      const result1 = heavyComputation();
      const duration1 = Date.now() - start1;

      // Subsequent calls should be much faster
      const start2 = Date.now();
      const result2 = heavyComputation();
      const duration2 = Date.now() - start2;

      expect(result1).toBe(result2);
      expect(duration2).toBeLessThan(5); // Should be nearly instant
      expect(duration1).toBeGreaterThan(duration2);
    });

    it('should handle many once functions efficiently', () => {
      const onceFunctions = Array.from({ length: 1000 }, (_, i) =>
        once(() => i * 2)
      );

      const start = Date.now();
      const results = onceFunctions.map(fn => fn());
      const duration = Date.now() - start;

      expect(results).toHaveLength(1000);
      expect(results[0]).toBe(0);
      expect(results[999]).toBe(1998);
      expect(duration).toBeLessThan(50); // Should be fast
    });
  });
});
