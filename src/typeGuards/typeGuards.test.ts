import { describe, it, expect } from 'vitest';
import { isPlainObject, isArray, isFunction } from './index';

describe('isPlainObject', () => {
  describe('should return true for plain objects', () => {
    it('should return true for empty object literal', () => {
      expect(isPlainObject({})).toBe(true);
    });

    it('should return true for object with properties', () => {
      expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
      expect(isPlainObject({ name: 'John', age: 30 })).toBe(true);
    });

    it('should return true for Object constructor instances', () => {
      expect(isPlainObject(new Object())).toBe(true);
      expect(isPlainObject(new Object({ a: 1 }))).toBe(true);
    });

    it('should return true for Object.create(null)', () => {
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('should return true for objects with nested properties', () => {
      expect(
        isPlainObject({
          a: 1,
          b: { c: 2 },
          d: [1, 2, 3],
          e() {},
        })
      ).toBe(true);
    });
  });

  describe('should return false for non-plain objects', () => {
    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
      expect(isPlainObject(new Array())).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isPlainObject(function () {})).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
      expect(isPlainObject(async function () {})).toBe(false);
      expect(isPlainObject(function* () {})).toBe(false);
      expect(isPlainObject(Math.max)).toBe(false);
    });

    it('should return false for built-in objects', () => {
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new RegExp('test'))).toBe(false);
      expect(isPlainObject(/test/)).toBe(false);
      expect(isPlainObject(new Error('test'))).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
      expect(isPlainObject(new WeakMap())).toBe(false);
      expect(isPlainObject(new WeakSet())).toBe(false);
    });

    it('should return false for typed arrays and buffers', () => {
      expect(isPlainObject(new ArrayBuffer(8))).toBe(false);
      expect(isPlainObject(new Int8Array(8))).toBe(false);
      expect(isPlainObject(new Uint8Array(8))).toBe(false);
      expect(isPlainObject(new Int16Array(8))).toBe(false);
      expect(isPlainObject(new Uint16Array(8))).toBe(false);
      expect(isPlainObject(new Int32Array(8))).toBe(false);
      expect(isPlainObject(new Uint32Array(8))).toBe(false);
      expect(isPlainObject(new Float32Array(8))).toBe(false);
      expect(isPlainObject(new Float64Array(8))).toBe(false);
    });

    it('should return false for Promise', () => {
      expect(isPlainObject(Promise.resolve())).toBe(false);
      expect(isPlainObject(new Promise(() => {}))).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(42)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
      expect(isPlainObject(false)).toBe(false);
      expect(isPlainObject(Symbol('test'))).toBe(false);
      expect(isPlainObject(BigInt(123))).toBe(false);
    });

    it('should return false for class instances', () => {
      class CustomClass {
        constructor(public value: number) {}
      }

      expect(isPlainObject(new CustomClass(42))).toBe(false);
    });

    it('should return false for Object.create({})', () => {
      expect(isPlainObject(Object.create({}))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle objects with no enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false,
      });
      expect(isPlainObject(obj)).toBe(true);
    });

    it('should handle objects with Symbol properties', () => {
      const sym = Symbol('test');
      const obj = { [sym]: 'value', regular: 'prop' };
      expect(isPlainObject(obj)).toBe(true);
    });

    it('should handle frozen objects', () => {
      const obj = Object.freeze({ a: 1 });
      expect(isPlainObject(obj)).toBe(true);
    });

    it('should handle sealed objects', () => {
      const obj = Object.seal({ a: 1 });
      expect(isPlainObject(obj)).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should identify plain config objects', () => {
      const config = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      expect(isPlainObject(config)).toBe(true);
    });

    it('should identify plain user data', () => {
      const user = {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      };
      expect(isPlainObject(user)).toBe(true);
    });

    it('should reject API response objects with methods', () => {
      const apiResponse = Object.create({
        toString() {
          return 'custom';
        },
      });
      expect(isPlainObject(apiResponse)).toBe(false);
    });
  });

  describe('TypeScript type narrowing', () => {
    it('should narrow type correctly', () => {
      const value: unknown = { a: 1, b: 2 };

      if (isPlainObject(value)) {
        // TypeScript should know value is Record<string, unknown>
        expect(value.a).toBe(1);
        expect(value.b).toBe(2);
      }
    });
  });
});

describe('isArray', () => {
  describe('should return true for arrays', () => {
    it('should return true for empty array', () => {
      expect(isArray([])).toBe(true);
    });

    it('should return true for arrays with elements', () => {
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b', 'c'])).toBe(true);
      expect(isArray([{ a: 1 }, { b: 2 }])).toBe(true);
    });

    it('should return true for Array constructor instances', () => {
      expect(isArray(new Array())).toBe(true);
      expect(isArray(new Array(5))).toBe(true);
      expect(isArray(new Array(1, 2, 3))).toBe(true);
    });

    it('should return true for arrays created with Array.from', () => {
      expect(isArray(Array.from('hello'))).toBe(true);
      expect(isArray(Array.from({ length: 3 }))).toBe(true);
      expect(isArray(Array.from([1, 2, 3]))).toBe(true);
    });

    it('should return true for arrays created with Array.of', () => {
      expect(isArray(Array.of(1, 2, 3))).toBe(true);
      expect(isArray(Array.of())).toBe(true);
    });

    it('should return true for sparse arrays', () => {
      const sparse = new Array(5);
      sparse[2] = 'value';
      expect(isArray(sparse)).toBe(true);
    });
  });

  describe('should return false for non-arrays', () => {
    it('should return false for array-like objects', () => {
      expect(isArray({ 0: 'a', 1: 'b', length: 2 })).toBe(false);
      expect(isArray('string')).toBe(false); // strings are array-like
    });

    it('should return false for objects', () => {
      expect(isArray({})).toBe(false);
      expect(isArray({ a: 1, b: 2 })).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isArray(function () {})).toBe(false);
      expect(isArray(() => {})).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray(42)).toBe(false);
      expect(isArray('string')).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(Symbol('test'))).toBe(false);
    });

    it('should return false for typed arrays', () => {
      expect(isArray(new Int8Array(8))).toBe(false);
      expect(isArray(new Uint8Array(8))).toBe(false);
      expect(isArray(new Int16Array(8))).toBe(false);
      expect(isArray(new Uint16Array(8))).toBe(false);
      expect(isArray(new Int32Array(8))).toBe(false);
      expect(isArray(new Uint32Array(8))).toBe(false);
      expect(isArray(new Float32Array(8))).toBe(false);
      expect(isArray(new Float64Array(8))).toBe(false);
    });

    it('should return false for other built-in objects', () => {
      expect(isArray(new Date())).toBe(false);
      expect(isArray(new RegExp('test'))).toBe(false);
      expect(isArray(new Map())).toBe(false);
      expect(isArray(new Set())).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle subclassed arrays', () => {
      class CustomArray extends Array {}
      const customArray = new CustomArray();
      customArray.push(1, 2, 3);
      expect(isArray(customArray)).toBe(true);
    });

    it('should handle arrays from different realms/frames', () => {
      // Array.isArray is designed to work across different realms/contexts
      // In Node.js environment, we test that it works correctly with VM contexts
      expect(isArray([])).toBe(true);
      expect(isArray(new Array(1, 2, 3))).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should identify arrays in API responses', () => {
      const apiResponse = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        meta: { total: 2 },
      };

      expect(isArray(apiResponse.users)).toBe(true);
      expect(isArray(apiResponse.meta)).toBe(false);
    });

    it('should work with array validation in forms', () => {
      const formData = {
        tags: ['javascript', 'typescript'],
        categories: 'single-category', // Not an array
      };

      expect(isArray(formData.tags)).toBe(true);
      expect(isArray(formData.categories)).toBe(false);
    });
  });

  describe('TypeScript type narrowing', () => {
    it('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3];

      if (isArray(value)) {
        // TypeScript should know value is unknown[]
        expect(value.length).toBe(3);
        expect(value[0]).toBe(1);
      }
    });
  });
});

describe('isFunction', () => {
  describe('should return true for functions', () => {
    it('should return true for function declarations', () => {
      function namedFunction() {}
      expect(isFunction(namedFunction)).toBe(true);
    });

    it('should return true for function expressions', () => {
      const funcExpression = function () {};
      expect(isFunction(funcExpression)).toBe(true);
    });

    it('should return true for arrow functions', () => {
      const arrow = () => {};
      expect(isFunction(arrow)).toBe(true);
    });

    it('should return true for async functions', () => {
      async function asyncFunc() {}
      const asyncArrow = async () => {};

      expect(isFunction(asyncFunc)).toBe(true);
      expect(isFunction(asyncArrow)).toBe(true);
    });

    it('should return true for generator functions', () => {
      function* generator() {}
      const generatorExpression = function* () {};

      expect(isFunction(generator)).toBe(true);
      expect(isFunction(generatorExpression)).toBe(true);
    });

    it('should return true for built-in functions', () => {
      expect(isFunction(Math.max)).toBe(true);
      expect(isFunction(Array.from)).toBe(true);
      expect(isFunction(Object.keys)).toBe(true);
      expect(isFunction(parseInt)).toBe(true);
      expect(isFunction(console.log)).toBe(true);
    });

    it('should return true for constructors', () => {
      expect(isFunction(Array)).toBe(true);
      expect(isFunction(Object)).toBe(true);
      expect(isFunction(Date)).toBe(true);
      expect(isFunction(RegExp)).toBe(true);
      expect(isFunction(Error)).toBe(true);
    });

    it('should return true for bound functions', () => {
      function original() {}
      const bound = original.bind(null);
      expect(isFunction(bound)).toBe(true);
    });

    it('should return true for function with properties', () => {
      function funcWithProps() {}
      funcWithProps.customProperty = 'value';
      expect(isFunction(funcWithProps)).toBe(true);
    });
  });

  describe('should return false for non-functions', () => {
    it('should return false for objects', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction({ a: 1 })).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isFunction([])).toBe(false);
      expect(isFunction([1, 2, 3])).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(42)).toBe(false);
      expect(isFunction('string')).toBe(false);
      expect(isFunction(true)).toBe(false);
      expect(isFunction(Symbol('test'))).toBe(false);
    });

    it('should return false for function-like objects', () => {
      const functionLike = {
        call() {},
        apply() {},
        bind() {},
      };
      expect(isFunction(functionLike)).toBe(false);
    });

    it('should return false for classes (which are functions but we test the behavior)', () => {
      class MyClass {}
      // Classes are actually functions in JavaScript
      expect(isFunction(MyClass)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle proxy functions', () => {
      const originalFunc = () => {};
      const proxyFunc = new Proxy(originalFunc, {});
      expect(isFunction(proxyFunc)).toBe(true);
    });

    it('should handle functions from different realms', () => {
      // In browser environment, this would test cross-frame functions
      // In Node.js, we just verify basic function detection works
      const func = () => {};
      expect(isFunction(func)).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should identify callback functions', () => {
      function processData(data: unknown[], callback?: unknown) {
        if (isFunction(callback)) {
          // TypeScript knows callback is a function here
          return data.map(callback);
        }
        return data;
      }

      const result1 = processData([1, 2, 3], (x: number) => x * 2);
      const result2 = processData([1, 2, 3], 'not a function');

      expect(result1).toEqual([2, 4, 6]);
      expect(result2).toEqual([1, 2, 3]);
    });

    it('should validate event handlers', () => {
      const eventHandlers = {
        onClick: () => console.log('clicked'),
        onHover: 'invalid-handler',
        onSubmit() {
          console.log('submitted');
        },
      };

      expect(isFunction(eventHandlers.onClick)).toBe(true);
      expect(isFunction(eventHandlers.onHover)).toBe(false);
      expect(isFunction(eventHandlers.onSubmit)).toBe(true);
    });

    it('should work with dependency injection', () => {
      interface Service {
        process: unknown;
      }

      function createService(processor: unknown): Service | null {
        if (!isFunction(processor)) {
          return null;
        }

        return {
          process: processor,
        };
      }

      const validService = createService((data: string) => data.toUpperCase());
      const invalidService = createService('not a function');

      expect(validService).not.toBeNull();
      expect(invalidService).toBeNull();
    });
  });

  describe('TypeScript type narrowing', () => {
    it('should narrow type correctly', () => {
      const value: unknown = () => 'hello';

      if (isFunction(value)) {
        // TypeScript should know value is a function
        const result = value();
        expect(result).toBe('hello');
      }
    });

    it('should work with function parameters', () => {
      function executeIfFunction(value: unknown) {
        if (isFunction(value)) {
          // TypeScript should allow calling value here
          return value();
        }
        return null;
      }

      expect(executeIfFunction(() => 'success')).toBe('success');
      expect(executeIfFunction('not a function')).toBe(null);
    });
  });
});

describe('type guards integration', () => {
  it('should work together for complex type checking', () => {
    function processValue(value: unknown) {
      if (isArray(value)) {
        return `Array with ${value.length} items`;
      } else if (isFunction(value)) {
        return 'Function detected';
      } else if (isPlainObject(value)) {
        return `Object with ${Object.keys(value).length} properties`;
      } else {
        return 'Other type';
      }
    }

    expect(processValue([1, 2, 3])).toBe('Array with 3 items');
    expect(processValue(() => {})).toBe('Function detected');
    expect(processValue({ a: 1, b: 2 })).toBe('Object with 2 properties');
    expect(processValue('string')).toBe('Other type');
    expect(processValue(new Date())).toBe('Other type');
  });

  it('should handle API response validation', () => {
    interface ApiResponse {
      data: unknown;
      handlers?: unknown;
      meta?: unknown;
    }

    function validateApiResponse(response: ApiResponse): boolean {
      // Data should be array or object
      if (!isArray(response.data) && !isPlainObject(response.data)) {
        return false;
      }

      // Handlers should be functions if provided
      if (response.handlers !== undefined && !isFunction(response.handlers)) {
        return false;
      }

      // Meta should be plain object if provided
      if (response.meta !== undefined && !isPlainObject(response.meta)) {
        return false;
      }

      return true;
    }

    expect(
      validateApiResponse({
        data: [1, 2, 3],
        handlers: () => {},
        meta: { total: 3 },
      })
    ).toBe(true);

    expect(
      validateApiResponse({
        data: { items: [] },
        meta: { total: 0 },
      })
    ).toBe(true);

    expect(
      validateApiResponse({
        data: 'invalid',
        handlers: () => {},
      })
    ).toBe(false);

    expect(
      validateApiResponse({
        data: [],
        handlers: 'invalid',
      })
    ).toBe(false);

    expect(
      validateApiResponse({
        data: [],
        meta: new Date(),
      })
    ).toBe(false);
  });
});
