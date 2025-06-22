import { describe, it, expect } from 'vitest';
import { curry } from './index';

describe('curry', () => {
  describe('basic functionality', () => {
    it('should curry a simple function with 2 parameters', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      expect(curriedAdd(2)(3)).toBe(5);
      expect(curriedAdd(2, 3)).toBe(5);
    });

    it('should curry a function with 3 parameters', () => {
      const add3 = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd3 = curry(add3);

      expect(curriedAdd3(1)(2)(3)).toBe(6);
      expect(curriedAdd3(1, 2)(3)).toBe(6);
      expect(curriedAdd3(1)(2, 3)).toBe(6);
      expect(curriedAdd3(1, 2, 3)).toBe(6);
    });

    it('should curry a function with 4 parameters', () => {
      const add4 = (a: number, b: number, c: number, d: number) =>
        a + b + c + d;
      const curriedAdd4 = curry(add4);

      expect(curriedAdd4(1)(2)(3)(4)).toBe(10);
      expect(curriedAdd4(1, 2)(3, 4)).toBe(10);
      expect(curriedAdd4(1)(2, 3, 4)).toBe(10);
      expect(curriedAdd4(1, 2, 3, 4)).toBe(10);
    });

    it('should handle functions with no parameters', () => {
      const getValue = () => 42;
      const curriedGetValue = curry(getValue);

      expect(curriedGetValue()).toBe(42);
    });

    it('should handle functions with one parameter', () => {
      const double = (x: number) => x * 2;
      const curriedDouble = curry(double);

      expect(curriedDouble(5)).toBe(10);
    });
  });

  describe('partial application', () => {
    it('should allow partial application step by step', () => {
      const multiply = (a: number, b: number, c: number) => a * b * c;
      const curriedMultiply = curry(multiply);

      const multiplyBy2 = curriedMultiply(2);
      const multiplyBy2And3 = multiplyBy2(3);

      expect(multiplyBy2And3(4)).toBe(24); // 2 * 3 * 4
    });

    it('should allow reuse of partially applied functions', () => {
      const concat = (a: string, b: string, c: string) => a + b + c;
      const curriedConcat = curry(concat);

      const addHello = curriedConcat('Hello');
      const addSpace = addHello(' ');

      expect(addSpace('World')).toBe('Hello World');
      expect(addSpace('Universe')).toBe('Hello Universe');
    });

    it('should support different partial application patterns', () => {
      const divide = (a: number, b: number, c: number) => a / b / c;
      const curriedDivide = curry(divide);

      // Different ways to apply the same arguments
      const divideBy2 = curriedDivide(100, 2);
      const divideBy2And5 = curriedDivide(100)(2, 5);
      const stepByStep = curriedDivide(100)(2)(5);

      expect(divideBy2(5)).toBe(10); // 100 / 2 / 5
      expect(divideBy2And5).toBe(10);
      expect(stepByStep).toBe(10);
    });
  });

  describe('different data types', () => {
    it('should work with string operations', () => {
      const replace = (search: string, replacement: string, text: string) =>
        text.replace(search, replacement);

      const curriedReplace = curry(replace);
      const removeSpaces = curriedReplace(' ', '');
      const replaceHello = curriedReplace('hello');

      expect(removeSpaces('hello world')).toBe('helloworld');
      expect(replaceHello('hi', 'hello there')).toBe('hi there');
    });

    it('should work with array operations', () => {
      const slice = <T>(start: number, end: number, array: T[]) =>
        array.slice(start, end);
      const curriedSlice = curry(slice);

      const takeFirst3 = curriedSlice(0, 3);
      const skip2Take3 = curriedSlice(2, 5);

      expect(takeFirst3([1, 2, 3, 4, 5])).toEqual([1, 2, 3]);
      expect(skip2Take3([1, 2, 3, 4, 5, 6])).toEqual([3, 4, 5]);
    });

    it('should work with object operations', () => {
      const setProperty = <T>(key: string, value: any, obj: T) => ({
        ...obj,
        [key]: value,
      });

      const curriedSetProperty = curry(setProperty);
      const setName = curriedSetProperty('name');
      const setAge = curriedSetProperty('age');

      const person = { id: 1 };
      expect(setName('John', person)).toEqual({ id: 1, name: 'John' });
      expect(setAge(30, person)).toEqual({ id: 1, age: 30 });
    });

    it('should work with boolean operations', () => {
      const and = (a: boolean, b: boolean, c: boolean) => a && b && c;
      const curriedAnd = curry(and);

      const andTrue = curriedAnd(true);

      expect(andTrue(true, true)).toBe(true);
      expect(andTrue(true, false)).toBe(false);
      expect(andTrue(false, true)).toBe(false);
    });
  });

  describe('functional programming patterns', () => {
    it('should work with map operations', () => {
      const map = <T, U>(fn: (item: T) => U, array: T[]) => array.map(fn);
      const curriedMap = curry(map);

      const double = (x: number) => x * 2;
      const square = (x: number) => x * x;

      const doubleArray = curriedMap(double);
      const squareArray = curriedMap(square);

      expect(doubleArray([1, 2, 3])).toEqual([2, 4, 6]);
      expect(squareArray([1, 2, 3])).toEqual([1, 4, 9]);
    });

    it('should work with filter operations', () => {
      const filter = <T>(predicate: (item: T) => boolean, array: T[]) =>
        array.filter(predicate);
      const curriedFilter = curry(filter);

      const isEven = (x: number) => x % 2 === 0;
      const isPositive = (x: number) => x > 0;

      const filterEvens = curriedFilter(isEven);
      const filterPositive = curriedFilter(isPositive);

      expect(filterEvens([1, 2, 3, 4, 5])).toEqual([2, 4]);
      expect(filterPositive([-2, -1, 0, 1, 2])).toEqual([1, 2]);
    });

    it('should work with reduce operations', () => {
      const reduce = <T, U>(
        fn: (acc: U, item: T) => U,
        initial: U,
        array: T[]
      ) => array.reduce(fn, initial);

      const curriedReduce = curry(reduce);

      const sum = (acc: number, x: number) => acc + x;
      const sumArray = curriedReduce(sum, 0);

      expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should enable function composition', () => {
      const add = (a: number, b: number) => a + b;
      const multiply = (a: number, b: number) => a * b;

      const curriedAdd = curry(add);
      const curriedMultiply = curry(multiply);

      const add5 = curriedAdd(5);
      const multiplyBy3 = curriedMultiply(3);

      const processNumber = (x: number) => multiplyBy3(add5(x));

      expect(processNumber(10)).toBe(45); // (10 + 5) * 3
    });
  });

  describe('real-world use cases', () => {
    it('should work for API request builders', () => {
      const makeRequest = (method: string, url: string, data: any) => ({
        method,
        url,
        data,
        timestamp: Date.now(),
      });

      const curriedRequest = curry(makeRequest);
      const post = curriedRequest('POST');
      const get = curriedRequest('GET');

      const postToUsers = post('/api/users');
      const getUserProfile = get('/api/profile');

      const newUser = postToUsers({ name: 'John', email: 'john@example.com' });
      const profileRequest = getUserProfile(null);

      expect(newUser.method).toBe('POST');
      expect(newUser.url).toBe('/api/users');
      expect(newUser.data).toEqual({ name: 'John', email: 'john@example.com' });

      expect(profileRequest.method).toBe('GET');
      expect(profileRequest.url).toBe('/api/profile');
      expect(profileRequest.data).toBeNull();
    });

    it('should work for validation functions', () => {
      const validateField = (
        fieldName: string,
        validator: (value: any) => boolean,
        value: any
      ) => ({
        field: fieldName,
        isValid: validator(value),
        value,
      });

      const curriedValidate = curry(validateField);

      const isEmail = (value: string) => /@/.test(value);
      const isNumber = (value: any) => typeof value === 'number';
      const isRequired = (value: any) =>
        value !== null && value !== undefined && value !== '';

      const validateEmail = curriedValidate('email', isEmail);
      const validateAge = curriedValidate('age', isNumber);
      const validateName = curriedValidate('name', isRequired);

      expect(validateEmail('john@example.com')).toEqual({
        field: 'email',
        isValid: true,
        value: 'john@example.com',
      });

      expect(validateAge('not a number')).toEqual({
        field: 'age',
        isValid: false,
        value: 'not a number',
      });

      expect(validateName('')).toEqual({
        field: 'name',
        isValid: false,
        value: '',
      });
    });

    it('should work for formatting functions', () => {
      const formatCurrency = (
        currency: string,
        locale: string,
        amount: number
      ) =>
        new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        }).format(amount);

      const curriedFormat = curry(formatCurrency);
      const formatUSD = curriedFormat('USD');
      const formatEUR = curriedFormat('EUR');

      const formatUSDforUS = formatUSD('en-US');
      const formatEURforDE = formatEUR('de-DE');

      expect(formatUSDforUS(123.45)).toBe('$123.45');
      // Currency formatting can vary by environment, so we'll check it contains the expected parts
      const eurFormat = formatEURforDE(123.45);
      expect(eurFormat).toContain('123,45');
      expect(eurFormat).toContain('€');
    });

    it('should work for database query builders', () => {
      interface Query {
        table: string;
        where: Record<string, any>;
        limit: number;
      }

      const buildQuery = (
        table: string,
        where: Record<string, any>,
        limit: number
      ): Query => ({
        table,
        where,
        limit,
      });

      const curriedQuery = curry(buildQuery);
      const queryUsers = curriedQuery('users');
      const queryActiveUsers = queryUsers({ active: true });

      const activeUsersTop10 = queryActiveUsers(10);
      const activeUsersTop5 = queryActiveUsers(5);

      expect(activeUsersTop10).toEqual({
        table: 'users',
        where: { active: true },
        limit: 10,
      });

      expect(activeUsersTop5).toEqual({
        table: 'users',
        where: { active: true },
        limit: 5,
      });
    });

    it('should work for event handling', () => {
      const handleEvent = (
        eventType: string,
        selector: string,
        handler: (...args: any[]) => any
      ) => ({
        type: eventType,
        selector,
        handler,
      });

      const curriedHandleEvent = curry(handleEvent);
      const onClick = curriedHandleEvent('click');
      const onButtonClick = onClick('button');

      const buttonHandler = () => console.log('Button clicked');
      const linkHandler = () => console.log('Link clicked');

      const onLinkClick = onClick('a');

      expect(onButtonClick(buttonHandler)).toEqual({
        type: 'click',
        selector: 'button',
        handler: buttonHandler,
      });

      expect(onLinkClick(linkHandler)).toEqual({
        type: 'click',
        selector: 'a',
        handler: linkHandler,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle functions with rest parameters', () => {
      // Note: curry works based on function.length, which doesn't include rest params
      const sum = (a: number, b: number, ...rest: number[]) =>
        a + b + rest.reduce((acc, val) => acc + val, 0);

      const curriedSum = curry(sum);

      // Since sum.length is 2, curry will consider it satisfied with 2 args
      expect(curriedSum(1, 2)).toBe(3);
      expect(curriedSum(1)(2)).toBe(3);
    });

    it('should handle functions that return functions', () => {
      const createAdder = (a: number, b: number) => (c: number) => a + b + c;
      const curriedCreateAdder = curry(createAdder);

      const adder = curriedCreateAdder(1, 2);
      expect(typeof adder).toBe('function');
      expect(adder(3)).toBe(6);

      const partialAdder = curriedCreateAdder(1);
      const adder2 = partialAdder(2);
      expect(adder2(3)).toBe(6);
    });

    it('should handle functions with default parameters', () => {
      // Note: Functions with default parameters have function.length equal to required parameters only
      const greet = (greeting: string, name: string = 'World') =>
        `${greeting}, ${name}!`;

      const curriedGreet = curry(greet);

      // greet.length is 1 (only greeting is required), so curry is satisfied with 1 argument
      expect(curriedGreet('Hello')).toBe('Hello, World!');
      expect(curriedGreet('Hello', 'John')).toBe('Hello, John!');
    });

    it('should preserve this context when possible', () => {
      const obj = {
        multiplier: 10,
        multiply(a: number, b: number) {
          return (a + b) * this.multiplier;
        },
      };

      // Curry doesn't preserve 'this' context automatically
      const curriedMultiply = curry(obj.multiply.bind(obj));

      expect(curriedMultiply(2, 3)).toBe(50); // (2 + 3) * 10
      expect(curriedMultiply(2)(3)).toBe(50);
    });
  });

  describe('performance', () => {
    it('should be reasonably efficient', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd = curry(add);

      const start = Date.now();

      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        curriedAdd(i)(i + 1)(i + 2);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50); // Should be reasonably fast
    });

    it('should handle complex partial applications', () => {
      const complexOperation = (
        a: number,
        b: string,
        c: boolean,
        d: number[],
        e: object
      ) => ({
        a,
        b,
        c,
        d,
        e,
        result: a + b.length + (c ? 1 : 0) + d.length + Object.keys(e).length,
      });

      const curriedComplex = curry(complexOperation);

      const step1 = curriedComplex(5);
      const step2 = step1('hello');
      const step3 = step2(true);
      const step4 = step3([1, 2, 3]);
      const result = step4({ x: 1, y: 2 });

      expect(result.result).toBe(16); // 5 + 5 + 1 + 3 + 2
    });
  });
});
