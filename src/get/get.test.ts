import { describe, it, expect } from 'vitest';
import { get } from './index';

describe('get', () => {
  const testObj = {
    name: 'John',
    age: 30,
    profile: {
      email: 'john@example.com',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
      contacts: [
        { type: 'email', value: 'john@work.com' },
        { type: 'phone', value: '123-456-7890' },
      ],
    },
    hobbies: ['reading', 'gaming', 'cooking'],
    active: true,
    score: 0,
    data: null,
  };

  describe('basic property access', () => {
    it('should get top-level properties', () => {
      expect(get(testObj, 'name')).toBe('John');
      expect(get(testObj, 'age')).toBe(30);
      expect(get(testObj, 'active')).toBe(true);
      expect(get(testObj, 'score')).toBe(0);
    });

    it('should get nested properties', () => {
      expect(get(testObj, 'profile.email')).toBe('john@example.com');
      expect(get(testObj, 'profile.preferences.theme')).toBe('dark');
      expect(get(testObj, 'profile.preferences.notifications')).toBe(true);
    });

    it('should get deeply nested properties', () => {
      const deepObj = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };

      expect(get(deepObj, 'level1.level2.level3.level4.value')).toBe('deep');
    });
  });

  describe('array access', () => {
    it('should access array elements by index', () => {
      expect(get(testObj, 'hobbies.0')).toBe('reading');
      expect(get(testObj, 'hobbies.1')).toBe('gaming');
      expect(get(testObj, 'hobbies.2')).toBe('cooking');
    });

    it('should access nested array elements', () => {
      expect(get(testObj, 'profile.contacts.0.type')).toBe('email');
      expect(get(testObj, 'profile.contacts.0.value')).toBe('john@work.com');
      expect(get(testObj, 'profile.contacts.1.type')).toBe('phone');
      expect(get(testObj, 'profile.contacts.1.value')).toBe('123-456-7890');
    });

    it('should handle out-of-bounds array access', () => {
      expect(get(testObj, 'hobbies.10')).toBeUndefined();
      expect(get(testObj, 'profile.contacts.5.type')).toBeUndefined();
    });
  });

  describe('non-existent paths', () => {
    it('should return undefined for non-existent top-level properties', () => {
      expect(get(testObj, 'nonexistent')).toBeUndefined();
      expect(get(testObj, 'missing')).toBeUndefined();
    });

    it('should return undefined for non-existent nested properties', () => {
      expect(get(testObj, 'profile.missing')).toBeUndefined();
      expect(get(testObj, 'profile.preferences.missing')).toBeUndefined();
      expect(get(testObj, 'missing.nested.path')).toBeUndefined();
    });

    it('should return undefined when accessing properties on null/undefined', () => {
      expect(get(testObj, 'data.property')).toBeUndefined();
      expect(get(testObj, 'missing.nested.property')).toBeUndefined();
    });
  });

  describe('default values', () => {
    it('should return default value for non-existent properties', () => {
      expect(get(testObj, 'missing', 'default')).toBe('default');
      expect(get(testObj, 'profile.missing', 'default')).toBe('default');
      expect(get(testObj, 'missing.nested.path', 'default')).toBe('default');
    });

    it('should return actual value instead of default when property exists', () => {
      expect(get(testObj, 'name', 'default')).toBe('John');
      expect(get(testObj, 'profile.email', 'default')).toBe('john@example.com');
      expect(get(testObj, 'score', 'default')).toBe(0);
      expect(get(testObj, 'active', false)).toBe(true);
    });

    it('should handle various default value types', () => {
      expect(get(testObj, 'missing', null)).toBeNull();
      expect(get(testObj, 'missing', 0)).toBe(0);
      expect(get(testObj, 'missing', false)).toBe(false);
      expect(get(testObj, 'missing', [])).toEqual([]);
      expect(get(testObj, 'missing', {})).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined objects', () => {
      expect(get(null, 'any.path')).toBeUndefined();
      expect(get(undefined, 'any.path')).toBeUndefined();
      expect(get(null, 'any.path', 'default')).toBe('default');
      expect(get(undefined, 'any.path', 'default')).toBe('default');
    });

    it('should handle empty path', () => {
      expect(get(testObj, '')).toBeUndefined();
      expect(get(testObj, '', 'default')).toBe('default');
    });

    it('should handle invalid path types', () => {
      expect(get(testObj, null as any)).toBeUndefined();
      expect(get(testObj, undefined as any)).toBeUndefined();
      expect(get(testObj, 123 as any)).toBeUndefined();
    });

    it('should handle primitive values as objects', () => {
      // Our implementation treats primitives as objects only for the first level
      // For nested access, primitives don't support property access
      expect(get('string', 'length')).toBe(6);
      expect(get(123, 'toString')).toBeDefined();
      expect(get(true, 'valueOf')).toBeDefined();

      // But nested access on primitives should return undefined
      expect(get('string', 'length.invalid')).toBeUndefined();
      expect(get(123, 'toString.invalid')).toBeUndefined();
    });

    it('should handle objects with numeric keys', () => {
      const numericObj = {
        '0': 'first',
        '1': 'second',
        '10': 'tenth',
      };

      expect(get(numericObj, '0')).toBe('first');
      expect(get(numericObj, '1')).toBe('second');
      expect(get(numericObj, '10')).toBe('tenth');
    });

    it('should handle mixed array and object access', () => {
      const mixedObj = {
        users: [
          { name: 'Alice', contacts: { email: 'alice@example.com' } },
          { name: 'Bob', contacts: { email: 'bob@example.com' } },
        ],
      };

      expect(get(mixedObj, 'users.0.name')).toBe('Alice');
      expect(get(mixedObj, 'users.0.contacts.email')).toBe('alice@example.com');
      expect(get(mixedObj, 'users.1.name')).toBe('Bob');
      expect(get(mixedObj, 'users.1.contacts.email')).toBe('bob@example.com');
    });
  });

  describe('real-world use cases', () => {
    it('should handle API response structure', () => {
      const apiResponse = {
        status: 'success',
        data: {
          user: {
            id: 1,
            profile: {
              personal: {
                firstName: 'John',
                lastName: 'Doe',
              },
              professional: {
                company: 'Acme Corp',
                position: 'Developer',
              },
            },
            permissions: ['read', 'write'],
          },
        },
        meta: {
          timestamp: '2023-01-01T00:00:00Z',
          requestId: 'req-123',
        },
      };

      expect(get(apiResponse, 'data.user.profile.personal.firstName')).toBe(
        'John'
      );
      expect(get(apiResponse, 'data.user.permissions.0')).toBe('read');
      expect(get(apiResponse, 'data.user.profile.professional.company')).toBe(
        'Acme Corp'
      );
      expect(get(apiResponse, 'meta.requestId')).toBe('req-123');
      expect(
        get(apiResponse, 'data.user.profile.personal.middleName', 'N/A')
      ).toBe('N/A');
    });

    it('should handle configuration objects', () => {
      const config = {
        app: {
          name: 'MyApp',
          version: '1.0.0',
          features: {
            auth: {
              providers: ['google', 'github'],
              settings: {
                timeout: 5000,
                retries: 3,
              },
            },
            ui: {
              theme: 'dark',
              components: ['navbar', 'sidebar', 'footer'],
            },
          },
        },
      };

      expect(get(config, 'app.features.auth.providers.0')).toBe('google');
      expect(get(config, 'app.features.auth.settings.timeout')).toBe(5000);
      expect(get(config, 'app.features.ui.components.1')).toBe('sidebar');
      expect(get(config, 'app.features.payments.enabled', false)).toBe(false);
    });
  });
});
