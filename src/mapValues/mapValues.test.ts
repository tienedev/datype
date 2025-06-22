import { describe, it, expect } from 'vitest';
import { mapValues } from './index';

describe('mapValues', () => {
  describe('basic transformation', () => {
    it('should transform string values', () => {
      const obj = {
        firstName: 'john',
        lastName: 'doe',
        email: 'john@example.com',
      };

      const result = mapValues(obj, value => value.toUpperCase());

      expect(result).toEqual({
        firstName: 'JOHN',
        lastName: 'DOE',
        email: 'JOHN@EXAMPLE.COM',
      });

      // Original should be unchanged
      expect(obj.firstName).toBe('john');
    });

    it('should transform number values', () => {
      const scores = {
        alice: 85,
        bob: 92,
        charlie: 78,
        diana: 95,
      };

      const grades = mapValues(scores, score => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        return 'F';
      });

      expect(grades).toEqual({
        alice: 'B',
        bob: 'A',
        charlie: 'C',
        diana: 'A',
      });
    });

    it('should transform mixed value types', () => {
      const data = {
        id: 123,
        name: 'john',
        active: true,
        score: 85.5,
      };

      const result = mapValues(data, value => String(value));

      expect(result).toEqual({
        id: '123',
        name: 'john',
        active: 'true',
        score: '85.5',
      });
    });
  });

  describe('iterator function parameters', () => {
    it('should pass value, key, and object to iterator', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const calls: Array<{ value: any; key: any; object: any }> = [];

      mapValues(obj, (value, key, object) => {
        calls.push({ value, key, object });
        return value * 2;
      });

      expect(calls).toHaveLength(3);
      expect(calls[0]).toEqual({ value: 1, key: 'a', object: obj });
      expect(calls[1]).toEqual({ value: 2, key: 'b', object: obj });
      expect(calls[2]).toEqual({ value: 3, key: 'c', object: obj });
    });

    it('should use key information in transformation', () => {
      const config = {
        apiUrl: 'localhost',
        dbUrl: 'localhost',
        cacheUrl: 'redis://localhost',
      };

      const result = mapValues(config, (value, key) => {
        if (key === 'apiUrl' && value === 'localhost') {
          return 'https://api.production.com';
        }
        if (key === 'dbUrl' && value === 'localhost') {
          return 'postgresql://prod-db';
        }
        return value;
      });

      expect(result).toEqual({
        apiUrl: 'https://api.production.com',
        dbUrl: 'postgresql://prod-db',
        cacheUrl: 'redis://localhost',
      });
    });
  });

  describe('object transformation', () => {
    it('should transform object values', () => {
      const products = {
        laptop: { price: 1000, currency: 'USD' },
        phone: { price: 500, currency: 'USD' },
        tablet: { price: 300, currency: 'USD' },
      };

      const withTax = mapValues(products, product => ({
        ...product,
        priceWithTax: Math.round(product.price * 1.1),
        formattedPrice: `$${product.price}`,
      }));

      expect(withTax.laptop).toEqual({
        price: 1000,
        currency: 'USD',
        priceWithTax: 1100,
        formattedPrice: '$1000',
      });

      expect(withTax.phone).toEqual({
        price: 500,
        currency: 'USD',
        priceWithTax: 550,
        formattedPrice: '$500',
      });

      // Original should be unchanged
      expect(products.laptop).toEqual({ price: 1000, currency: 'USD' });
    });

    it('should transform nested objects', () => {
      const users = {
        admin: { name: 'John', permissions: ['read', 'write'] },
        user: { name: 'Jane', permissions: ['read'] },
      };

      const result = mapValues(users, user => ({
        ...user,
        displayName: user.name.toUpperCase(),
        canWrite: user.permissions.includes('write'),
      }));

      expect(result.admin.displayName).toBe('JOHN');
      expect(result.admin.canWrite).toBe(true);
      expect(result.user.displayName).toBe('JANE');
      expect(result.user.canWrite).toBe(false);
    });
  });

  describe('array transformation', () => {
    it('should transform array values', () => {
      const data = {
        numbers: [1, 2, 3],
        strings: ['a', 'b', 'c'],
        booleans: [true, false],
      };

      const result = mapValues(data, arr =>
        arr.map(item => String(item).toUpperCase())
      );

      expect(result).toEqual({
        numbers: ['1', '2', '3'],
        strings: ['A', 'B', 'C'],
        booleans: ['TRUE', 'FALSE'],
      });
    });

    it('should handle array methods in transformation', () => {
      const stats = {
        scores: [85, 92, 78, 95, 88],
        ratings: [4.2, 4.8, 3.9, 4.9],
        counts: [10, 25, 15, 30],
      };

      const summary = mapValues(stats, arr => ({
        average: arr.reduce((a, b) => a + b, 0) / arr.length,
        max: Math.max(...arr),
        min: Math.min(...arr),
        count: arr.length,
      }));

      expect(summary.scores.average).toBeCloseTo(87.6);
      expect(summary.scores.max).toBe(95);
      expect(summary.scores.min).toBe(78);
      expect(summary.ratings.count).toBe(4);
    });
  });

  describe('special property handling', () => {
    it('should handle symbol keys', () => {
      const sym1 = Symbol('key1');
      const sym2 = Symbol('key2');

      const obj = {
        regular: 'value',
        [sym1]: 'symbol1',
        [sym2]: 'symbol2',
      };

      const result = mapValues(obj, value => value.toUpperCase());

      expect(result.regular).toBe('VALUE');
      expect(result[sym1]).toBe('SYMBOL1');
      expect(result[sym2]).toBe('SYMBOL2');
    });

    it('should handle numeric string keys', () => {
      const obj = {
        '0': 'first',
        '1': 'second',
        '10': 'tenth',
        normal: 'regular',
      };

      const result = mapValues(obj, value => value.toUpperCase());

      expect(result['0']).toBe('FIRST');
      expect(result['1']).toBe('SECOND');
      expect(result['10']).toBe('TENTH');
      expect(result.normal).toBe('REGULAR');
    });

    it('should not include inherited properties', () => {
      const parent = { inherited: 'value' };
      const child = Object.create(parent);
      child.own = 'ownValue';

      const result = mapValues(child, value => value.toUpperCase());

      expect(result).toEqual({ own: 'OWNVALUE' });
      expect(Object.prototype.hasOwnProperty.call(result, 'inherited')).toBe(
        false
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const result = mapValues({}, value => value);
      expect(result).toEqual({});
    });

    it('should throw for null/undefined input', () => {
      expect(() => mapValues(null as any, x => x)).toThrow(
        'Expected object to be non-null'
      );
      expect(() => mapValues(undefined as any, x => x)).toThrow(
        'Expected object to be non-null'
      );
    });

    it('should throw for non-function iteratee', () => {
      expect(() => mapValues({}, 'not a function' as any)).toThrow(
        'Expected iteratee to be a function'
      );
      expect(() => mapValues({}, null as any)).toThrow(
        'Expected iteratee to be a function'
      );
    });

    it('should handle objects with undefined values', () => {
      const obj = {
        defined: 'value',
        undefined,
        null: null,
      };

      const result = mapValues(obj, value => value ?? 'default');

      expect(result).toEqual({
        defined: 'value',
        undefined: 'default',
        null: 'default',
      });
    });

    it('should preserve key types', () => {
      const obj = {
        stringKey: 1,
        123: 2,
        [Symbol('sym')]: 3,
      };

      const result = mapValues(obj, value => value * 2);

      expect(result.stringKey).toBe(2);
      expect(result[123]).toBe(4);
      expect(result['123']).toBe(4); // Numeric keys become strings
    });
  });

  describe('real-world use cases', () => {
    it('should normalize API response data', () => {
      const apiResponse = {
        user_id: '123',
        first_name: 'john',
        last_name: 'doe',
        email_address: 'JOHN@EXAMPLE.COM',
        is_active: 'true',
        last_login: '2023-01-01T00:00:00Z',
      };

      const normalized = mapValues(apiResponse, (value, key) => {
        if (key === 'email_address') {
          return value.toLowerCase();
        }
        if (key === 'is_active') {
          return value === 'true';
        }
        if (key === 'first_name' || key === 'last_name') {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (key === 'last_login') {
          return new Date(value);
        }
        return value;
      });

      expect(normalized.email_address).toBe('john@example.com');
      expect(normalized.is_active).toBe(true);
      expect(normalized.first_name).toBe('John');
      expect(normalized.last_login).toBeInstanceOf(Date);
    });

    it('should process form validation results', () => {
      const validationResults = {
        email: { isValid: true, message: '' },
        password: { isValid: false, message: 'Too short' },
        confirmPassword: { isValid: false, message: 'Does not match' },
        username: { isValid: true, message: '' },
      };

      const errorMessages = mapValues(validationResults, result =>
        result.isValid ? null : result.message
      );

      expect(errorMessages).toEqual({
        email: null,
        password: 'Too short',
        confirmPassword: 'Does not match',
        username: null,
      });
    });

    it('should transform configuration values', () => {
      const config = {
        port: '3000',
        host: 'localhost',
        ssl: 'true',
        workers: '4',
        timeout: '30000',
      };

      const typedConfig = mapValues(config, (value, key) => {
        if (key === 'port' || key === 'workers' || key === 'timeout') {
          return parseInt(value, 10);
        }
        if (key === 'ssl') {
          return value === 'true';
        }
        return value;
      });

      expect(typedConfig).toEqual({
        port: 3000,
        host: 'localhost',
        ssl: true,
        workers: 4,
        timeout: 30000,
      });
    });

    it('should calculate derived metrics', () => {
      const salesData = {
        january: { revenue: 10000, expenses: 7000 },
        february: { revenue: 12000, expenses: 8000 },
        march: { revenue: 15000, expenses: 9000 },
      };

      const withMetrics = mapValues(salesData, data => ({
        ...data,
        profit: data.revenue - data.expenses,
        margin: `${(((data.revenue - data.expenses) / data.revenue) * 100).toFixed(2)}%`,
      }));

      expect(withMetrics.january.profit).toBe(3000);
      expect(withMetrics.january.margin).toBe('30.00%');
      expect(withMetrics.march.profit).toBe(6000);
      expect(withMetrics.march.margin).toBe('40.00%');
    });
  });
});
