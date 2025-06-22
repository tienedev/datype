import { describe, it, expect } from 'vitest';
import { merge } from './index';

describe('merge', () => {
  describe('basic functionality', () => {
    it('should merge two simple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = merge(obj1, obj2 as any);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge multiple objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const obj4 = { d: 4 };

      expect(merge(obj1, obj2 as any, obj3 as any, obj4 as any)).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
    });

    it('should handle empty objects', () => {
      expect(merge({})).toEqual({});
      expect(merge({}, {})).toEqual({});
      expect(merge({ a: 1 }, {})).toEqual({ a: 1 });
      expect(merge({}, { a: 1 })).toEqual({ a: 1 });
    });

    it('should handle no arguments', () => {
      expect(merge()).toEqual({});
    });

    it('should return a new object', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = merge(obj1, obj2 as any);

      expect(result).not.toBe(obj1);
      expect(result).not.toBe(obj2);
    });

    it('should not modify original objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const originalObj1 = { ...obj1 };
      const originalObj2 = { ...obj2 };

      merge(obj1, obj2 as any);

      expect(obj1).toEqual(originalObj1);
      expect(obj2).toEqual(originalObj2);
    });
  });

  describe('property overriding', () => {
    it('should override properties from left to right', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { b: 'two', c: 'three' };
      const obj3 = { c: 'THREE' };

      expect(merge(obj1, obj2, obj3)).toEqual({ a: 1, b: 'two', c: 'THREE' });
    });

    it('should handle different value types', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 'string' };
      const obj3 = { a: true };
      const obj4 = { a: null };
      const obj5 = { a: undefined };

      expect(merge(obj1, obj2)).toEqual({ a: 'string' });
      expect(merge(obj1, obj3)).toEqual({ a: true });
      expect(merge(obj1, obj4)).toEqual({ a: null });
      expect(merge(obj1, obj5)).toEqual({ a: undefined });
    });

    it('should handle function properties', () => {
      const func1 = () => 'first';
      const func2 = () => 'second';

      const obj1 = { fn: func1 };
      const obj2 = { fn: func2 };

      const result = merge(obj1, obj2);
      expect(result.fn).toBe(func2);
      expect(result.fn()).toBe('second');
    });
  });

  describe('shallow merge behavior', () => {
    it('should replace nested objects completely', () => {
      const obj1 = {
        nested: { a: 1, b: 2, c: 3 },
        simple: 'value1',
      };
      const obj2 = {
        nested: { x: 10 },
        simple: 'value2',
      };

      const result = merge(obj1, obj2);

      expect(result).toEqual({
        nested: { x: 10 },
        simple: 'value2',
      });

      // Original nested object should not be modified
      expect(obj1.nested).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should replace arrays completely', () => {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: ['a', 'b'] };

      expect(merge(obj1, obj2)).toEqual({ arr: ['a', 'b'] });
    });

    it('should handle mixed nested types', () => {
      const obj1 = {
        data: { type: 'object', value: 1 },
        list: [1, 2, 3],
        fn: () => 'original',
      };
      const obj2 = {
        data: 'string',
        list: { length: 0 },
        fn: [1, 2, 3],
      };

      const result = merge(obj1, obj2);
      expect(result.data).toBe('string');
      expect(result.list).toEqual({ length: 0 });
      expect(result.fn).toEqual([1, 2, 3]);
    });
  });

  describe('special property handling', () => {
    it('should include Symbol properties', () => {
      const sym1 = Symbol('key1');
      const sym2 = Symbol('key2');
      const sym3 = Symbol('key3');

      const obj1 = {
        [sym1]: 'value1',
        regular: 'prop1',
      };
      const obj2 = {
        [sym2]: 'value2',
        [sym1]: 'overridden',
        regular: 'prop2',
      };
      const obj3 = {
        [sym3]: 'value3',
      };

      const result = merge(obj1, obj2, obj3);

      expect(result[sym1]).toBe('overridden');
      expect(result[sym2]).toBe('value2');
      expect(result[sym3]).toBe('value3');
      expect(result.regular).toBe('prop2');
    });

    it('should ignore non-enumerable properties', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };

      Object.defineProperty(obj1, 'hidden1', {
        value: 'secret1',
        enumerable: false,
      });

      Object.defineProperty(obj2, 'hidden2', {
        value: 'secret2',
        enumerable: false,
      });

      const result = merge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toHaveProperty('hidden1');
      expect(result).not.toHaveProperty('hidden2');
    });

    it('should ignore non-enumerable Symbol properties', () => {
      const sym = Symbol('hidden');
      const obj = { visible: 'prop' };

      Object.defineProperty(obj, sym, {
        value: 'secret',
        enumerable: false,
      });

      const result = merge({}, obj);

      expect(result).toEqual({ visible: 'prop' });
      expect(result[sym]).toBeUndefined();
    });

    it('should handle getters and setters', () => {
      const obj1 = {
        _value: 1,
        get value() {
          return this._value;
        },
        set value(val) {
          this._value = val;
        },
      };

      const obj2 = { other: 'prop' };

      const result = merge(obj1, obj2);

      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('_value');
      expect(result).toHaveProperty('other');
      expect(result.value).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined gracefully', () => {
      const obj = { a: 1 };

      expect(merge(obj, null)).toEqual({ a: 1 });
      expect(merge(obj, undefined)).toEqual({ a: 1 });
      expect(merge(null, obj)).toEqual({ a: 1 });
      expect(merge(undefined, obj)).toEqual({ a: 1 });
      expect(merge(null, undefined)).toEqual({});
    });

    it('should handle non-object values gracefully', () => {
      const obj = { a: 1 };

      expect(merge(obj, 'string' as any)).toEqual({ a: 1 });
      expect(merge(obj, 42 as any)).toEqual({ a: 1 });
      expect(merge(obj, true as any)).toEqual({ a: 1 });
      expect(merge('string' as any, obj)).toEqual({ a: 1 });
    });

    it('should handle objects with prototype properties', () => {
      function Parent() {
        this.parentProp = 'parent';
      }
      Parent.prototype.prototypeProp = 'prototype';

      function Child() {
        Parent.call(this);
        this.childProp = 'child';
      }
      Child.prototype = Object.create(Parent.prototype);

      const child = new Child() as any;
      const other = { other: 'prop' };

      const result = merge(child, other);

      // Should only include own enumerable properties
      expect(result).toEqual({
        parentProp: 'parent',
        childProp: 'child',
        other: 'prop',
      });
      expect(result).not.toHaveProperty('prototypeProp');
    });

    it('should handle circular references in properties', () => {
      const obj1: any = { a: 1 };
      const obj2: any = { b: 2 };

      obj1.circular = obj1;
      obj2.circular = obj2;

      const result = merge(obj1, obj2);

      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result.circular).toBe(obj2); // Should be obj2's circular reference
    });

    it('should handle objects with many properties', () => {
      const obj1: Record<string, number> = {};
      const obj2: Record<string, number> = {};

      // Create objects with many properties
      for (let i = 0; i < 1000; i++) {
        obj1[`prop${i}`] = i;
        obj2[`prop${i + 1000}`] = i + 1000;
      }

      obj2.prop0 = 999; // Override one property

      const result = merge(obj1, obj2);

      expect(Object.keys(result)).toHaveLength(2000); // 1000 from obj1 + 1000 from obj2 (prop0 is overridden but still counts as 1)
      expect(result.prop0).toBe(999); // Should be overridden
      expect(result.prop999).toBe(999);
      expect(result.prop1000).toBe(1000);
      expect(result.prop1999).toBe(1999);
    });
  });

  describe('real-world use cases', () => {
    it('should merge configuration objects', () => {
      const defaultConfig = {
        timeout: 5000,
        retries: 3,
        headers: { 'Content-Type': 'application/json' },
        debug: false,
      };

      const userConfig = {
        timeout: 10000,
        headers: { Authorization: 'Bearer token' },
        cache: true,
      };

      const config = merge(defaultConfig, userConfig);

      expect(config).toEqual({
        timeout: 10000,
        retries: 3,
        headers: { Authorization: 'Bearer token' }, // Completely replaced
        debug: false,
        cache: true,
      });
    });

    it('should merge API response data', () => {
      const baseData = {
        id: 1,
        type: 'user',
        attributes: { name: 'John', email: 'john@example.com' },
        relationships: { posts: [] },
      };

      const updateData = {
        attributes: { name: 'John Doe', active: true },
        meta: { updated: '2023-01-01' },
      };

      const result = merge(baseData, updateData);

      expect(result).toEqual({
        id: 1,
        type: 'user',
        attributes: { name: 'John Doe', active: true }, // Completely replaced
        relationships: { posts: [] },
        meta: { updated: '2023-01-01' },
      });
    });

    it('should merge form data', () => {
      const initialForm = {
        name: '',
        email: '',
        preferences: { theme: 'light', notifications: true },
        errors: {},
      };

      const formUpdate = {
        name: 'John Doe',
        preferences: { theme: 'dark' }, // This will replace the entire preferences object
        errors: { email: 'Invalid email' },
      };

      const updatedForm = merge(initialForm, formUpdate);

      expect(updatedForm).toEqual({
        name: 'John Doe',
        email: '',
        preferences: { theme: 'dark' }, // notifications is lost because it's shallow merge
        errors: { email: 'Invalid email' },
      });
    });

    it('should merge component props', () => {
      const defaultProps = {
        size: 'medium',
        variant: 'primary',
        disabled: false,
        className: 'btn',
        style: { margin: '10px' },
        onClick: () => console.log('default'),
      };

      const userProps = {
        size: 'large',
        variant: 'secondary',
        className: 'btn custom',
        style: { color: 'red' }, // This replaces the entire style object
        onHover: () => console.log('hover'),
      };

      const finalProps = merge(defaultProps, userProps);

      expect(finalProps).toEqual({
        size: 'large',
        variant: 'secondary',
        disabled: false,
        className: 'btn custom',
        style: { color: 'red' }, // margin is lost
        onClick: expect.any(Function),
        onHover: expect.any(Function),
      });
    });

    it('should merge database query options', () => {
      const baseQuery = {
        table: 'users',
        select: ['id', 'name'],
        where: { active: true },
        limit: 10,
      };

      const queryUpdate = {
        select: ['id', 'name', 'email'],
        where: { role: 'admin' }, // This replaces the entire where clause
        orderBy: 'created_at',
      };

      const query = merge(baseQuery, queryUpdate);

      expect(query).toEqual({
        table: 'users',
        select: ['id', 'name', 'email'],
        where: { role: 'admin' }, // active: true is lost
        limit: 10,
        orderBy: 'created_at',
      });
    });
  });

  describe('TypeScript type inference', () => {
    it('should maintain type safety with known object types', () => {
      interface Config {
        timeout: number;
        debug: boolean;
        apiUrl?: string;
      }

      const defaultConfig: Config = {
        timeout: 5000,
        debug: false,
      };

      const userConfig: Partial<Config> = {
        timeout: 10000,
        apiUrl: 'https://api.example.com',
      };

      const result = merge(defaultConfig, userConfig);

      // TypeScript should know these properties exist
      expect(result.timeout).toBe(10000);
      expect(result.debug).toBe(false);
      expect(result.apiUrl).toBe('https://api.example.com');
    });
  });

  describe('performance considerations', () => {
    it('should handle large objects efficiently', () => {
      const largeObj1: Record<string, number> = {};
      const largeObj2: Record<string, number> = {};

      // Create large objects
      for (let i = 0; i < 10000; i++) {
        largeObj1[`key${i}`] = i;
        largeObj2[`key${i + 5000}`] = i + 5000; // Some overlap
      }

      const start = Date.now();
      const result = merge(largeObj1, largeObj2);
      const duration = Date.now() - start;

      expect(Object.keys(result)).toHaveLength(15000); // 10000 + 10000 - 5000 overlapping
      expect(duration).toBeLessThan(100); // Should be reasonably fast
    });
  });
});
