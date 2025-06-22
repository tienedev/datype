import { describe, it, expect } from 'vitest';
import { set } from './index';

describe('set', () => {
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
  };

  describe('basic property setting', () => {
    it('should set top-level properties', () => {
      const result = set(testObj, 'name', 'Jane');

      expect(result.name).toBe('Jane');
      expect(testObj.name).toBe('John'); // Original unchanged
      expect(result.age).toBe(30); // Other properties preserved
    });

    it('should set nested properties', () => {
      const result = set(testObj, 'profile.email', 'jane@example.com');

      expect(result.profile.email).toBe('jane@example.com');
      expect(testObj.profile.email).toBe('john@example.com'); // Original unchanged
      expect(result.profile.preferences.theme).toBe('dark'); // Other nested properties preserved
    });

    it('should set deeply nested properties', () => {
      const result = set(testObj, 'profile.preferences.theme', 'light');

      expect(result.profile.preferences.theme).toBe('light');
      expect(testObj.profile.preferences.theme).toBe('dark'); // Original unchanged
      expect(result.profile.preferences.notifications).toBe(true); // Sibling properties preserved
    });
  });

  describe('array modification', () => {
    it('should modify array elements', () => {
      const result = set(testObj, 'hobbies.0', 'writing');

      expect(result.hobbies[0]).toBe('writing');
      expect(testObj.hobbies[0]).toBe('reading'); // Original unchanged
      expect(result.hobbies[1]).toBe('gaming'); // Other elements preserved
    });

    it('should modify nested array objects', () => {
      const result = set(testObj, 'profile.contacts.0.value', 'jane@work.com');

      expect(result.profile.contacts[0].value).toBe('jane@work.com');
      expect(testObj.profile.contacts[0].value).toBe('john@work.com'); // Original unchanged
      expect(result.profile.contacts[0].type).toBe('email'); // Other properties preserved
    });

    it('should extend arrays when setting higher indices', () => {
      const result = set(testObj, 'hobbies.5', 'traveling');

      expect(result.hobbies[5]).toBe('traveling');
      expect(result.hobbies.length).toBe(6);
      expect(result.hobbies[3]).toBeUndefined(); // Sparse array
      expect(result.hobbies[4]).toBeUndefined();
    });
  });

  describe('creating new paths', () => {
    it('should create new top-level properties', () => {
      const result = set(testObj, 'newProp', 'newValue');

      expect(result.newProp).toBe('newValue');
      expect(Object.prototype.hasOwnProperty.call(testObj, 'newProp')).toBe(
        false
      ); // Original unchanged
    });

    it('should create new nested properties', () => {
      const result = set(testObj, 'profile.location', 'New York');

      expect(result.profile.location).toBe('New York');
      expect(
        Object.prototype.hasOwnProperty.call(testObj.profile, 'location')
      ).toBe(false); // Original unchanged
    });

    it('should create deep nested paths', () => {
      const result = set(testObj, 'profile.settings.display.brightness', 80);

      expect(result.profile.settings.display.brightness).toBe(80);
      expect(
        Object.prototype.hasOwnProperty.call(testObj.profile, 'settings')
      ).toBe(false); // Original unchanged
    });

    it('should create array paths', () => {
      const result = set(testObj, 'profile.tags.0', 'developer');

      expect(result.profile.tags).toEqual(['developer']);
      expect(Array.isArray(result.profile.tags)).toBe(true);
      expect(
        Object.prototype.hasOwnProperty.call(testObj.profile, 'tags')
      ).toBe(false); // Original unchanged
    });

    it('should create mixed array and object paths', () => {
      const result = set(testObj, 'profile.workHistory.0.company', 'Acme Corp');

      expect(result.profile.workHistory[0].company).toBe('Acme Corp');
      expect(Array.isArray(result.profile.workHistory)).toBe(true);
      expect(typeof result.profile.workHistory[0]).toBe('object');
    });
  });

  describe('immutability', () => {
    it('should not mutate the original object', () => {
      const original = {
        user: {
          name: 'John',
          details: {
            age: 30,
            hobbies: ['reading'],
          },
        },
      };

      const result = set(original, 'user.details.age', 31);

      expect(original.user.details.age).toBe(30);
      expect(result.user.details.age).toBe(31);
      expect(original.user.details.hobbies).toBe(result.user.details.hobbies); // Unchanged references preserved
    });

    it('should preserve unchanged nested references', () => {
      const result = set(testObj, 'name', 'Jane');

      // Changed path creates new references
      expect(result).not.toBe(testObj);

      // Unchanged nested objects should preserve references for performance
      expect(result.profile.preferences).toBe(testObj.profile.preferences);
      expect(result.hobbies).toBe(testObj.hobbies);
    });

    it('should create new references for changed paths only', () => {
      const result = set(testObj, 'profile.preferences.theme', 'light');

      // Changed path creates new references
      expect(result.profile).not.toBe(testObj.profile);
      expect(result.profile.preferences).not.toBe(testObj.profile.preferences);

      // Unchanged nested objects preserve references
      expect(result.profile.contacts).toBe(testObj.profile.contacts);
      expect(result.hobbies).toBe(testObj.hobbies);
    });
  });

  describe('array handling', () => {
    it('should handle array as root object', () => {
      const arr = [1, 2, 3];
      const result = set(arr, '0', 10);

      expect(result[0]).toBe(10);
      expect(arr[0]).toBe(1); // Original unchanged
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle nested arrays', () => {
      const nested = {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      };

      const result = set(nested, 'matrix.0.1', 20);

      expect(result.matrix[0][1]).toBe(20);
      expect(nested.matrix[0][1]).toBe(2); // Original unchanged
    });
  });

  describe('edge cases', () => {
    it('should throw for null/undefined objects', () => {
      expect(() => set(null, 'any.path', 'value')).toThrow(
        'Cannot set property on null or undefined'
      );
      expect(() => set(undefined, 'any.path', 'value')).toThrow(
        'Cannot set property on null or undefined'
      );
    });

    it('should throw for invalid paths', () => {
      expect(() => set(testObj, '', 'value')).toThrow(
        'Path must be a non-empty string'
      );
      expect(() => set(testObj, null as any, 'value')).toThrow(
        'Path must be a non-empty string'
      );
      expect(() => set(testObj, undefined as any, 'value')).toThrow(
        'Path must be a non-empty string'
      );
    });

    it('should handle setting undefined and null values', () => {
      const result1 = set(testObj, 'name', undefined);
      const result2 = set(testObj, 'age', null);

      expect(result1.name).toBeUndefined();
      expect(result2.age).toBeNull();
    });

    it('should handle numeric string keys', () => {
      const obj = {
        '0': 'first',
        '1': 'second',
      };

      const result = set(obj, '0', 'updated');

      expect(result['0']).toBe('updated');
      expect(obj['0']).toBe('first'); // Original unchanged
    });

    it('should handle objects with array-like properties', () => {
      const obj = {
        length: 3,
        '0': 'a',
        '1': 'b',
        '2': 'c',
      };

      const result = set(obj, '0', 'updated');

      expect(result['0']).toBe('updated');
      expect(obj['0']).toBe('a'); // Original unchanged
    });
  });

  describe('real-world use cases', () => {
    it('should handle form state updates', () => {
      const formState = {
        user: {
          personal: {
            firstName: '',
            lastName: '',
          },
          contact: {
            email: '',
            phone: '',
          },
        },
        validation: {
          errors: [],
          isValid: false,
        },
      };

      const step1 = set(formState, 'user.personal.firstName', 'John');
      const step2 = set(step1, 'user.personal.lastName', 'Doe');
      const step3 = set(step2, 'user.contact.email', 'john@example.com');

      expect(step3.user.personal.firstName).toBe('John');
      expect(step3.user.personal.lastName).toBe('Doe');
      expect(step3.user.contact.email).toBe('john@example.com');
      expect(formState.user.personal.firstName).toBe(''); // Original unchanged
    });

    it('should handle configuration updates', () => {
      const config = {
        app: {
          name: 'MyApp',
          features: {
            auth: {
              enabled: true,
              providers: ['email'],
            },
          },
        },
      };

      const updated = set(config, 'app.features.auth.providers.1', 'google');

      expect(updated.app.features.auth.providers).toEqual(['email', 'google']);
      expect(config.app.features.auth.providers).toEqual(['email']); // Original unchanged
    });

    it('should handle API response modifications', () => {
      const apiResponse = {
        data: {
          users: [
            { id: 1, name: 'John', active: true },
            { id: 2, name: 'Jane', active: false },
          ],
        },
        meta: {
          total: 2,
          page: 1,
        },
      };

      const updated = set(apiResponse, 'data.users.1.active', true);

      expect(updated.data.users[1].active).toBe(true);
      expect(apiResponse.data.users[1].active).toBe(false); // Original unchanged
    });
  });
});
