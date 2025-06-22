import { describe, it, expect } from 'vitest';
import { mapKeys, keyTransformers } from './index';

describe('mapKeys', () => {
  describe('basic key transformation', () => {
    it('should transform string keys', () => {
      const obj = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      };

      const result = mapKeys(obj, key => key.toUpperCase());

      expect(result).toEqual({
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
        EMAILADDRESS: 'john@example.com',
      });

      // Original should be unchanged
      expect(obj.firstName).toBe('John');
    });

    it('should transform keys with prefixes', () => {
      const data = {
        name: 'John',
        age: 30,
        active: true,
      };

      const result = mapKeys(data, key => `user_${key}`);

      expect(result).toEqual({
        user_name: 'John',
        user_age: 30,
        user_active: true,
      });
    });

    it('should transform keys with suffixes', () => {
      const metrics = {
        cpu: 45,
        memory: 78,
        disk: 23,
      };

      const result = mapKeys(metrics, key => `${key}_usage`);

      expect(result).toEqual({
        cpu_usage: 45,
        memory_usage: 78,
        disk_usage: 23,
      });
    });
  });

  describe('iterator function parameters', () => {
    it('should pass key, value, and object to iterator', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const calls: Array<{ key: any; value: any; object: any }> = [];

      mapKeys(obj, (key, value, object) => {
        calls.push({ key, value, object });
        return `new_${key}`;
      });

      expect(calls).toHaveLength(3);
      expect(calls[0]).toEqual({ key: 'a', value: 1, object: obj });
      expect(calls[1]).toEqual({ key: 'b', value: 2, object: obj });
      expect(calls[2]).toEqual({ key: 'c', value: 3, object: obj });
    });

    it('should use value information in key transformation', () => {
      const config = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
      };

      const result = mapKeys(config, (key, value) => {
        const type = typeof value === 'string' ? 'str' : 'num';
        return `${type}_${key}`;
      });

      expect(result).toEqual({
        str_apiUrl: 'https://api.example.com',
        num_timeout: 5000,
        num_retries: 3,
      });
    });
  });

  describe('case conversion', () => {
    it('should convert snake_case to camelCase', () => {
      const apiData = {
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      };

      const result = mapKeys(apiData, key =>
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      );

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '123-456-7890',
      });
    });

    it('should convert camelCase to snake_case', () => {
      const jsData = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '123-456-7890',
      };

      const result = mapKeys(jsData, key =>
        key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      );

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      });
    });

    it('should handle mixed case normalization', () => {
      const messyData = {
        'First Name': 'John',
        LAST_NAME: 'Doe',
        'Email-Address': 'john@example.com',
        'phone.number': '123-456-7890',
      };

      const result = mapKeys(messyData, key =>
        key.toLowerCase().replace(/[-\s.]/g, '_')
      );

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      });
    });
  });

  describe('key transformer helpers', () => {
    it('should convert to camelCase using helper', () => {
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      };

      const result = mapKeys(data, keyTransformers.toCamelCase);

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      });
    });

    it('should convert to snake_case using helper', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      };

      const result = mapKeys(data, keyTransformers.toSnakeCase);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      });
    });

    it('should convert to kebab-case using helper', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      };

      const result = mapKeys(data, keyTransformers.toKebabCase);

      expect(result).toEqual({
        'first-name': 'John',
        'last-name': 'Doe',
        'email-address': 'john@example.com',
      });
    });

    it('should add prefix using helper', () => {
      const data = { name: 'John', age: 30 };
      const result = mapKeys(data, keyTransformers.addPrefix('user_'));

      expect(result).toEqual({
        user_name: 'John',
        user_age: 30,
      });
    });

    it('should add suffix using helper', () => {
      const data = { cpu: 45, memory: 78 };
      const result = mapKeys(data, keyTransformers.addSuffix('_percent'));

      expect(result).toEqual({
        cpu_percent: 45,
        memory_percent: 78,
      });
    });

    it('should normalize keys using helper', () => {
      const messyData = {
        'First Name!': 'John',
        LAST_NAME: 'Doe',
        'Email-Address@domain': 'john@example.com',
      };

      const result = mapKeys(messyData, keyTransformers.normalize);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address_domain: 'john@example.com',
      });
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

      const result = mapKeys(obj, (key, _value) => {
        if (typeof key === 'symbol') {
          return Symbol(`transformed_${key.description}`);
        }
        return `transformed_${key}`;
      });

      const resultKeys = Object.getOwnPropertySymbols(result);
      expect(result.transformed_regular).toBe('value');
      expect(resultKeys).toHaveLength(2);
      expect(resultKeys[0].description).toBe('transformed_key1');
      expect(resultKeys[1].description).toBe('transformed_key2');
    });

    it('should handle numeric string keys', () => {
      const obj = {
        '0': 'first',
        '1': 'second',
        '10': 'tenth',
        normal: 'regular',
      };

      const result = mapKeys(obj, key => `item_${key}`);

      expect(result).toEqual({
        item_0: 'first',
        item_1: 'second',
        item_10: 'tenth',
        item_normal: 'regular',
      });
    });

    it('should not include inherited properties', () => {
      const parent = { inherited: 'value' };
      const child = Object.create(parent);
      child.own = 'ownValue';

      const result = mapKeys(child, key => `new_${String(key)}`);

      expect(result).toEqual({ new_own: 'ownValue' });
      expect(
        Object.prototype.hasOwnProperty.call(result, 'new_inherited')
      ).toBe(false);
    });
  });

  describe('key collision handling', () => {
    it('should handle key collisions (last one wins)', () => {
      const obj = {
        firstName: 'John',
        first_name: 'Jane',
      };

      const result = mapKeys(obj, _key => 'name');

      expect(result).toEqual({ name: 'Jane' }); // Last one wins
    });

    it('should handle multiple keys mapping to same result', () => {
      const data = {
        user_id: 1,
        userId: 2,
        'user-id': 3,
      };

      const result = mapKeys(data, _key => 'id');

      expect(result).toEqual({ id: 3 }); // Last processed wins
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const result = mapKeys({}, key => `new_${key}`);
      expect(result).toEqual({});
    });

    it('should throw for null/undefined input', () => {
      expect(() => mapKeys(null as any, key => key)).toThrow(
        'Expected object to be non-null'
      );
      expect(() => mapKeys(undefined as any, key => key)).toThrow(
        'Expected object to be non-null'
      );
    });

    it('should throw for non-function iteratee', () => {
      expect(() => mapKeys({}, 'not a function' as any)).toThrow(
        'Expected iteratee to be a function'
      );
      expect(() => mapKeys({}, null as any)).toThrow(
        'Expected iteratee to be a function'
      );
    });

    it('should handle objects with undefined values', () => {
      const obj = {
        defined: 'value',
        undefined,
        null: null,
      };

      const result = mapKeys(obj, key => `new_${key}`);

      expect(result).toEqual({
        new_defined: 'value',
        new_undefined: undefined,
        new_null: null,
      });
    });

    it('should handle non-string key transformations', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapKeys(obj, (key, value) => value * 10);

      expect(result).toEqual({
        10: 1,
        20: 2,
        30: 3,
      });
    });
  });

  describe('real-world use cases', () => {
    it('should normalize API response keys', () => {
      const apiResponse = {
        'user-id': '123',
        first_name: 'John',
        lastName: 'Doe',
        'Email Address': 'john@example.com',
        'phone.number': '123-456-7890',
      };

      const normalized = mapKeys(apiResponse, key =>
        key
          .toLowerCase()
          .replace(/[-\s.]/g, '_')
          .replace(/[^a-z0-9_]/g, '')
      );

      expect(normalized).toEqual({
        user_id: '123',
        first_name: 'John',
        lastname: 'Doe',
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      });
    });

    it('should transform form field names', () => {
      const formData = {
        'user[name]': 'John',
        'user[email]': 'john@example.com',
        'preferences[theme]': 'dark',
        'preferences[notifications]': 'true',
      };

      const flattened = mapKeys(formData, key =>
        key.replace(/\[|\]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
      );

      expect(flattened).toEqual({
        user_name: 'John',
        user_email: 'john@example.com',
        preferences_theme: 'dark',
        preferences_notifications: 'true',
      });
    });

    it('should add namespacing to configuration', () => {
      const config = {
        host: 'localhost',
        port: 3000,
        ssl: true,
        timeout: 5000,
      };

      const namespaced = mapKeys(config, (key, value) => {
        const section = typeof value === 'boolean' ? 'security' : 'server';
        return `app_${section}_${key}`;
      });

      expect(namespaced).toEqual({
        app_server_host: 'localhost',
        app_server_port: 3000,
        app_security_ssl: true,
        app_server_timeout: 5000,
      });
    });

    it('should prepare data for different API formats', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '123-456-7890',
      };

      // Convert to REST API format (snake_case)
      const restFormat = mapKeys(userData, keyTransformers.toSnakeCase);

      // Convert to GraphQL format (camelCase - already is)
      const graphqlFormat = mapKeys(userData, key => key);

      // Convert to legacy system format (uppercase with underscores)
      const legacyFormat = mapKeys(userData, key =>
        keyTransformers.toSnakeCase(key).toUpperCase()
      );

      expect(restFormat).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      });

      expect(graphqlFormat).toEqual(userData);

      expect(legacyFormat).toEqual({
        FIRST_NAME: 'John',
        LAST_NAME: 'Doe',
        EMAIL_ADDRESS: 'john@example.com',
        PHONE_NUMBER: '123-456-7890',
      });
    });
  });

  describe('TypeScript types', () => {
    it('should preserve type safety', () => {
      const obj = { name: 'John', age: 30 } as const;

      const result = mapKeys(obj, key => `prefix_${key}`);

      // TypeScript should infer the correct types
      expect(result).toEqual({
        prefix_name: 'John',
        prefix_age: 30,
      });
    });
  });

  describe('keyTransformers helpers', () => {
    it('should convert snake_case to camelCase', () => {
      const { toCamelCase } = keyTransformers;
      expect(toCamelCase('first_name')).toBe('firstName');
      expect(toCamelCase('last_name_suffix')).toBe('lastNameSuffix');
      expect(toCamelCase('simple')).toBe('simple');
    });

    it('should convert camelCase to snake_case', () => {
      const { toSnakeCase } = keyTransformers;
      expect(toSnakeCase('firstName')).toBe('first_name');
      expect(toSnakeCase('lastNameSuffix')).toBe('last_name_suffix');
      expect(toSnakeCase('simple')).toBe('simple');
    });

    it('should convert to kebab-case', () => {
      const { toKebabCase } = keyTransformers;
      expect(toKebabCase('firstName')).toBe('first-name');
      expect(toKebabCase('lastNameSuffix')).toBe('last-name-suffix');
      expect(toKebabCase('simple')).toBe('simple');
    });

    it('should convert to lowercase', () => {
      const { toLowerCase } = keyTransformers;
      expect(toLowerCase('FIRST_NAME')).toBe('first_name');
      expect(toLowerCase('CamelCase')).toBe('camelcase');
    });

    it('should convert to uppercase', () => {
      const { toUpperCase } = keyTransformers;
      expect(toUpperCase('first_name')).toBe('FIRST_NAME');
      expect(toUpperCase('camelCase')).toBe('CAMELCASE');
    });

    it('should add prefix to key', () => {
      const { addPrefix } = keyTransformers;
      const prefixer = addPrefix('user_');
      expect(prefixer('name')).toBe('user_name');
      expect(prefixer('age')).toBe('user_age');
    });

    it('should add suffix to key', () => {
      const { addSuffix } = keyTransformers;
      const suffixer = addSuffix('_field');
      expect(suffixer('name')).toBe('name_field');
      expect(suffixer('age')).toBe('age_field');
    });

    it('should normalize keys', () => {
      const { normalize } = keyTransformers;
      expect(normalize('First Name')).toBe('first_name');
      expect(normalize('LAST-NAME')).toBe('last_name');
      expect(normalize('Email-Address!!!')).toBe('email_address');
      expect(normalize('___test___')).toBe('test');
      expect(normalize('multiple   spaces')).toBe('multiple_spaces');
    });
  });
});
