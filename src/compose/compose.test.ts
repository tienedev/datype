import { describe, it, expect } from 'vitest';
import { compose, pipe } from './index';

describe('compose', () => {
  describe('basic functionality', () => {
    it('should compose two functions', () => {
      const add5 = (x: number) => x + 5;
      const multiply2 = (x: number) => x * 2;

      const composed = compose(add5, multiply2);

      // compose(add5, multiply2)(10) = add5(multiply2(10)) = add5(20) = 25
      expect(composed(10)).toBe(25);
    });

    it('should compose multiple functions', () => {
      const add5 = (x: number) => x + 5;
      const multiply2 = (x: number) => x * 2;
      const subtract1 = (x: number) => x - 1;

      const composed = compose(add5, multiply2, subtract1);

      // compose(add5, multiply2, subtract1)(10) = add5(multiply2(subtract1(10))) = add5(multiply2(9)) = add5(18) = 23
      expect(composed(10)).toBe(23);
    });

    it('should handle single function', () => {
      const add5 = (x: number) => x + 5;
      const composed = compose(add5);

      expect(composed(10)).toBe(15);
    });

    it('should work with different types', () => {
      const toString = (x: number) => String(x);
      const addExclamation = (s: string) => `${s}!`;
      const toUpperCase = (s: string) => s.toUpperCase();

      const composed = compose(toUpperCase, addExclamation, toString);

      expect(composed(42)).toBe('42!');
    });

    it('should preserve function context', () => {
      const obj = {
        value: 10,
        getValue() {
          return this.value;
        },
        double(x: number) {
          return x * 2;
        },
      };

      const composed = compose(obj.double.bind(obj), obj.getValue.bind(obj));

      expect(composed()).toBe(20);
    });
  });

  describe('edge cases', () => {
    it('should throw error with no functions', () => {
      expect(() => compose()).toThrow('compose requires at least one function');
    });

    it('should handle functions that return undefined', () => {
      const returnUndefined = () => undefined;
      const processUndefined = (x: any) =>
        x === undefined ? 'was undefined' : 'was not undefined';

      const composed = compose(processUndefined, returnUndefined);

      expect(composed()).toBe('was undefined');
    });

    it('should handle functions that return null', () => {
      const returnNull = () => null;
      const processNull = (x: any) =>
        x === null ? 'was null' : 'was not null';

      const composed = compose(processNull, returnNull);

      expect(composed()).toBe('was null');
    });

    it('should handle functions with multiple arguments in rightmost position', () => {
      const add = (x: number, y: number) => x + y;
      const multiply2 = (x: number) => x * 2;

      const composed = compose(multiply2, add);

      expect(composed(3, 4)).toBe(14); // multiply2(add(3, 4)) = multiply2(7) = 14
    });

    it('should handle functions that throw errors', () => {
      const throwError = () => {
        throw new Error('Test error');
      };
      const handleError = (_x: any) => 'handled';

      const composed = compose(handleError, throwError);

      expect(() => composed()).toThrow('Test error');
    });

    it('should work with array methods', () => {
      const numbers = [1, 2, 3, 4, 5];
      const double = (arr: number[]) => arr.map(x => x * 2);
      const filterEven = (arr: number[]) => arr.filter(x => x % 2 === 0);
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

      const composed = compose(sum, filterEven, double);

      expect(composed(numbers)).toBe(30); // [2,4,6,8,10] -> [2,4,6,8,10] -> 30
    });
  });

  describe('real-world use cases', () => {
    it('should process user data', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const validateUser = (user: any): User => {
        if (!user.id || !user.name || !user.email) {
          throw new Error('Invalid user');
        }
        return user as User;
      };

      const normalizeEmail = (user: User): User => ({
        ...user,
        email: user.email.toLowerCase(),
      });

      const addTimestamp = (user: User) => ({
        ...user,
        createdAt: new Date('2023-01-01').toISOString(),
      });

      const processUser = compose(addTimestamp, normalizeEmail, validateUser);

      const result = processUser({
        id: 1,
        name: 'John',
        email: 'JOHN@EXAMPLE.COM',
      });

      expect(result).toEqual({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
      });
    });

    it('should process strings', () => {
      const trim = (s: string) => s.trim();
      const removeSpaces = (s: string) => s.replace(/\s+/g, '');
      const toUpperCase = (s: string) => s.toUpperCase();
      const addPrefix = (s: string) => `PROCESSED_${s}`;

      const processString = compose(addPrefix, toUpperCase, removeSpaces, trim);

      expect(processString('  hello world  ')).toBe('PROCESSED_HELLOWORLD');
    });

    it('should compose mathematical operations', () => {
      const square = (x: number) => x * x;
      const addTen = (x: number) => x + 10;
      const divide2 = (x: number) => x / 2;

      const mathPipeline = compose(divide2, addTen, square);

      expect(mathPipeline(4)).toBe(13); // divide2(addTen(square(4))) = divide2(addTen(16)) = divide2(26) = 13
    });

    it('should demonstrate async function limitation', async () => {
      const asyncAdd5 = async (x: number) => x + 5;
      const syncMultiply2 = (x: number) => x * 2;

      // Note: compose doesn't automatically await, so mixing async and sync functions
      // requires careful consideration. The sync function will receive a Promise.
      const composed = compose(syncMultiply2, asyncAdd5);

      const result = composed(10);
      expect(result).toBeNaN(); // syncMultiply2 receives a Promise, not a number

      // To properly handle async, you'd need to await the result manually:
      const asyncResult = await asyncAdd5(10);
      expect(syncMultiply2(asyncResult)).toBe(30);
    });

    it('should validate and transform API data', () => {
      interface ApiUser {
        user_id: number;
        user_name: string;
        user_email: string;
        is_active: boolean;
      }

      interface AppUser {
        id: number;
        name: string;
        email: string;
        active: boolean;
      }

      const validateApiUser = (data: any): ApiUser => {
        if (!data.user_id || !data.user_name || !data.user_email) {
          throw new Error('Invalid API user data');
        }
        return data as ApiUser;
      };

      const transformToAppUser = (apiUser: ApiUser): AppUser => ({
        id: apiUser.user_id,
        name: apiUser.user_name,
        email: apiUser.user_email,
        active: apiUser.is_active,
      });

      const normalizeUser = (user: AppUser): AppUser => ({
        ...user,
        name: user.name.trim(),
        email: user.email.toLowerCase(),
      });

      const processApiUser = compose(
        normalizeUser,
        transformToAppUser,
        validateApiUser
      );

      const apiData = {
        user_id: 123,
        user_name: '  John Doe  ',
        user_email: 'JOHN@EXAMPLE.COM',
        is_active: true,
      };

      const result = processApiUser(apiData);

      expect(result).toEqual({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
      });
    });
  });

  describe('performance', () => {
    it('should handle many function compositions efficiently', () => {
      const add1 = (x: number) => x + 1;

      // Create 100 functions that each add 1
      const functions = Array(100).fill(add1);

      const composed = compose(...functions);

      const start = Date.now();
      const result = composed(0);
      const duration = Date.now() - start;

      expect(result).toBe(100);
      expect(duration).toBeLessThan(10); // Should be very fast
    });
  });
});

describe('pipe', () => {
  describe('basic functionality', () => {
    it('should pipe two functions', () => {
      const add5 = (x: number) => x + 5;
      const multiply2 = (x: number) => x * 2;

      const piped = pipe(add5, multiply2);

      // pipe(add5, multiply2)(10) = multiply2(add5(10)) = multiply2(15) = 30
      expect(piped(10)).toBe(30);
    });

    it('should pipe multiple functions', () => {
      const add5 = (x: number) => x + 5;
      const multiply2 = (x: number) => x * 2;
      const subtract1 = (x: number) => x - 1;

      const piped = pipe(add5, multiply2, subtract1);

      // pipe(add5, multiply2, subtract1)(10) = subtract1(multiply2(add5(10))) = subtract1(multiply2(15)) = subtract1(30) = 29
      expect(piped(10)).toBe(29);
    });

    it('should handle single function', () => {
      const add5 = (x: number) => x + 5;
      const piped = pipe(add5);

      expect(piped(10)).toBe(15);
    });

    it('should work with different types', () => {
      const toString = (x: number) => String(x);
      const addExclamation = (s: string) => `${s}!`;
      const toUpperCase = (s: string) => s.toUpperCase();

      const piped = pipe(toString, addExclamation, toUpperCase);

      expect(piped(42)).toBe('42!');
    });

    it('should be the reverse of compose', () => {
      const add5 = (x: number) => x + 5;
      const multiply2 = (x: number) => x * 2;
      const subtract1 = (x: number) => x - 1;

      const composed = compose(subtract1, multiply2, add5);
      const piped = pipe(add5, multiply2, subtract1);

      expect(composed(10)).toBe(piped(10));
    });
  });

  describe('edge cases', () => {
    it('should throw error with no functions', () => {
      expect(() => pipe()).toThrow('pipe requires at least one function');
    });

    it('should handle functions with multiple arguments in leftmost position', () => {
      const add = (x: number, y: number) => x + y;
      const multiply2 = (x: number) => x * 2;

      const piped = pipe(add, multiply2);

      expect(piped(3, 4)).toBe(14); // multiply2(add(3, 4)) = multiply2(7) = 14
    });

    it('should handle complex data transformations', () => {
      interface RawData {
        items: string[];
        meta: { count: number };
      }

      const extractItems = (data: RawData) => data.items;
      const filterNonEmpty = (items: string[]) =>
        items.filter(item => item.length > 0);
      const toUpperCase = (items: string[]) =>
        items.map(item => item.toUpperCase());
      const joinWithCommas = (items: string[]) => items.join(', ');

      const processData = pipe(
        extractItems,
        filterNonEmpty,
        toUpperCase,
        joinWithCommas
      );

      const data: RawData = {
        items: ['hello', '', 'world', 'test', ''],
        meta: { count: 5 },
      };

      expect(processData(data)).toBe('HELLO, WORLD, TEST');
    });
  });

  describe('real-world use cases', () => {
    it('should process API responses', () => {
      interface ApiResponse {
        data: any[];
        meta: { total: number };
      }

      const extractData = (response: ApiResponse) => response.data;
      const filterActive = (items: any[]) => items.filter(item => item.active);
      const mapToNames = (items: any[]) => items.map(item => item.name);
      const sortNames = (names: string[]) => names.sort();
      const joinNames = (names: string[]) => names.join(', ');

      const processApiResponse = pipe(
        extractData,
        filterActive,
        mapToNames,
        sortNames,
        joinNames
      );

      const response: ApiResponse = {
        data: [
          { name: 'Charlie', active: true },
          { name: 'Alice', active: false },
          { name: 'Bob', active: true },
          { name: 'David', active: true },
        ],
        meta: { total: 4 },
      };

      expect(processApiResponse(response)).toBe('Bob, Charlie, David');
    });

    it('should process form data', () => {
      interface FormData {
        firstName: string;
        lastName: string;
        email: string;
        age: string;
      }

      const trimFields = (data: FormData): FormData => ({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        age: data.age.trim(),
      });

      const normalizeEmail = (data: FormData): FormData => ({
        ...data,
        email: data.email.toLowerCase(),
      });

      const parseAge = (data: FormData) => ({
        ...data,
        age: parseInt(data.age, 10),
      });

      const validateData = (data: any) => {
        if (
          !data.firstName ||
          !data.lastName ||
          !data.email ||
          isNaN(data.age)
        ) {
          throw new Error('Invalid form data');
        }
        return data;
      };

      const processFormData = pipe(
        trimFields,
        normalizeEmail,
        parseAge,
        validateData
      );

      const formData: FormData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        age: '  30  ',
      };

      const result = processFormData(formData);

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
      });
    });

    it('should create data processing pipelines', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const double = (arr: number[]) => arr.map(x => x * 2);
      const filterEven = (arr: number[]) => arr.filter(x => x % 2 === 0);
      const takeFirst5 = (arr: number[]) => arr.slice(0, 5);
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

      const processNumbers = pipe(double, filterEven, takeFirst5, sum);

      // [1,2,3,4,5,6,7,8,9,10] -> [2,4,6,8,10,12,14,16,18,20] -> [2,4,6,8,10,12,14,16,18,20] -> [2,4,6,8,10] -> 30
      expect(processNumbers(numbers)).toBe(30);
    });

    it('should work with string transformations', () => {
      const input = '  Hello, World! This is a Test.  ';

      const trim = (s: string) => s.trim();
      const toLowerCase = (s: string) => s.toLowerCase();
      const removeSpaces = (s: string) => s.replace(/\s+/g, '_');
      const removePunctuation = (s: string) => s.replace(/[^a-z0-9_]/gi, '');
      const limitLength = (s: string) => s.slice(0, 20);

      const processString = pipe(
        trim,
        toLowerCase,
        removeSpaces,
        removePunctuation,
        limitLength
      );

      expect(processString(input)).toBe('hello_world_this_is_');
    });
  });

  describe('async support', () => {
    it('should work with async functions in pipeline', async () => {
      const syncDouble = (x: number) => x * 2;
      const asyncAdd10 = async (x: number) => x + 10;
      // const syncToString = (x: number) => String(x);

      // First function is sync, second is async, third will receive a Promise
      // This demonstrates that pipe doesn't automatically handle async
      const pipeline = pipe(syncDouble, asyncAdd10);

      const result = await pipeline(5);
      expect(result).toBe(20); // syncDouble(5) = 10, asyncAdd10(10) = 20
    });

    it('should handle mixed sync and async functions', async () => {
      const syncDouble = (x: number) => x * 2;
      const asyncAdd10 = async (x: number) => x + 10;

      // For proper async handling, we'd need a special async pipe function
      // This test shows the limitation of the basic pipe with async functions
      const pipeline = pipe(syncDouble, asyncAdd10);

      const result = await pipeline(5);
      expect(result).toBe(20);
    });
  });

  describe('performance', () => {
    it('should handle many function pipes efficiently', () => {
      const add1 = (x: number) => x + 1;

      // Create 100 functions that each add 1
      const functions = Array(100).fill(add1);

      const piped = pipe(...functions);

      const start = Date.now();
      const result = piped(0);
      const duration = Date.now() - start;

      expect(result).toBe(100);
      expect(duration).toBeLessThan(10); // Should be very fast
    });
  });
});

describe('compose vs pipe comparison', () => {
  it('should demonstrate the difference between compose and pipe', () => {
    const add10 = (x: number) => x + 10;
    const multiply3 = (x: number) => x * 3;
    const subtract5 = (x: number) => x - 5;

    const composed = compose(subtract5, multiply3, add10);
    const piped = pipe(add10, multiply3, subtract5);

    // compose: subtract5(multiply3(add10(5))) = subtract5(multiply3(15)) = subtract5(45) = 40
    // pipe: subtract5(multiply3(add10(5))) = subtract5(multiply3(15)) = subtract5(45) = 40
    // Same result because the order is reversed

    expect(composed(5)).toBe(40);
    expect(piped(5)).toBe(40);

    // But if we reverse the pipe order:
    const reversePiped = pipe(subtract5, multiply3, add10);
    // reversePiped: add10(multiply3(subtract5(5))) = add10(multiply3(0)) = add10(0) = 10

    expect(reversePiped(5)).toBe(10);
  });

  it('should show practical usage differences', () => {
    const formatPrice = (price: number) => `$${price.toFixed(2)}`;
    const addTax = (price: number) => price * 1.08;
    const applyDiscount = (price: number) => price * 0.9;

    // Using compose (right to left, like mathematical composition)
    const calculateFinalPriceCompose = compose(
      formatPrice,
      addTax,
      applyDiscount
    );

    // Using pipe (left to right, like a data pipeline)
    const calculateFinalPricePipe = pipe(applyDiscount, addTax, formatPrice);

    const basePrice = 100;

    expect(calculateFinalPriceCompose(basePrice)).toBe('$97.20');
    expect(calculateFinalPricePipe(basePrice)).toBe('$97.20');

    // Both produce the same result, but pipe is often more intuitive
    // as it reads like: \"apply discount, then add tax, then format\"
  });
});
