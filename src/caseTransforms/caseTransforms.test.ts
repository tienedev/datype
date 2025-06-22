import { describe, it, expect } from 'vitest';
import {
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  constantCase,
  dotCase,
} from './index';

describe('camelCase', () => {
  describe('basic functionality', () => {
    it('should convert space-separated words to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('foo bar baz')).toBe('fooBarBaz');
      expect(camelCase('one two three')).toBe('oneTwoThree');
    });

    it('should convert hyphen-separated words to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('foo-bar-baz')).toBe('fooBarBaz');
      expect(camelCase('background-color')).toBe('backgroundColor');
    });

    it('should convert underscore-separated words to camelCase', () => {
      expect(camelCase('hello_world')).toBe('helloWorld');
      expect(camelCase('foo_bar_baz')).toBe('fooBarBaz');
      expect(camelCase('user_id')).toBe('userId');
    });

    it('should handle mixed case input', () => {
      expect(camelCase('Hello World')).toBe('helloWorld');
      expect(camelCase('HELLO WORLD')).toBe('helloWorld');
      expect(camelCase('hELLo WoRLd')).toBe('hElloWoRld');
    });

    it('should handle already camelCase strings', () => {
      expect(camelCase('helloWorld')).toBe('helloWorld');
      expect(camelCase('fooBarBaz')).toBe('fooBarBaz');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(camelCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(camelCase('hello')).toBe('hello');
      expect(camelCase('HELLO')).toBe('hello');
      expect(camelCase('Hello')).toBe('hello');
    });

    it('should handle multiple separators', () => {
      expect(camelCase('hello---world')).toBe('helloWorld');
      expect(camelCase('foo___bar')).toBe('fooBar');
      expect(camelCase('hello   world')).toBe('helloWorld');
    });

    it('should handle numbers', () => {
      expect(camelCase('version 2')).toBe('version2');
      expect(camelCase('test-123')).toBe('test123');
      expect(camelCase('item_1_name')).toBe('item1Name');
    });

    it('should handle special characters', () => {
      expect(camelCase('hello@world')).toBe('helloWorld');
      expect(camelCase('foo#bar')).toBe('fooBar');
      expect(camelCase('test!case')).toBe('testCase');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => camelCase(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => camelCase(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => camelCase(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });
});

describe('kebabCase', () => {
  describe('basic functionality', () => {
    it('should convert space-separated words to kebab-case', () => {
      expect(kebabCase('hello world')).toBe('hello-world');
      expect(kebabCase('foo bar baz')).toBe('foo-bar-baz');
      expect(kebabCase('one two three')).toBe('one-two-three');
    });

    it('should convert camelCase to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('fooBarBaz')).toBe('foo-bar-baz');
      expect(kebabCase('backgroundColor')).toBe('background-color');
    });

    it('should convert underscore-separated words to kebab-case', () => {
      expect(kebabCase('hello_world')).toBe('hello-world');
      expect(kebabCase('foo_bar_baz')).toBe('foo-bar-baz');
      expect(kebabCase('user_id')).toBe('user-id');
    });

    it('should handle mixed case input', () => {
      expect(kebabCase('Hello World')).toBe('hello-world');
      expect(kebabCase('HELLO WORLD')).toBe('hello-world');
      expect(kebabCase('hELLo WoRLd')).toBe('h-el-lo-wo-r-ld');
    });

    it('should handle already kebab-case strings', () => {
      expect(kebabCase('hello-world')).toBe('hello-world');
      expect(kebabCase('foo-bar-baz')).toBe('foo-bar-baz');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(kebabCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(kebabCase('hello')).toBe('hello');
      expect(kebabCase('HELLO')).toBe('hello');
      expect(kebabCase('Hello')).toBe('hello');
    });

    it('should handle numbers', () => {
      expect(kebabCase('version2')).toBe('version2');
      expect(kebabCase('test123')).toBe('test123');
      expect(kebabCase('item1Name')).toBe('item1-name');
    });

    it('should handle consecutive uppercase letters', () => {
      expect(kebabCase('XMLParser')).toBe('xml-parser');
      expect(kebabCase('HTMLElement')).toBe('html-element');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => kebabCase(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => kebabCase(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => kebabCase(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });
});

describe('snakeCase', () => {
  describe('basic functionality', () => {
    it('should convert space-separated words to snake_case', () => {
      expect(snakeCase('hello world')).toBe('hello_world');
      expect(snakeCase('foo bar baz')).toBe('foo_bar_baz');
      expect(snakeCase('one two three')).toBe('one_two_three');
    });

    it('should convert camelCase to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('fooBarBaz')).toBe('foo_bar_baz');
      expect(snakeCase('backgroundColor')).toBe('background_color');
    });

    it('should convert kebab-case to snake_case', () => {
      expect(snakeCase('hello-world')).toBe('hello_world');
      expect(snakeCase('foo-bar-baz')).toBe('foo_bar_baz');
      expect(snakeCase('user-id')).toBe('user_id');
    });

    it('should handle mixed case input', () => {
      expect(snakeCase('Hello World')).toBe('hello_world');
      expect(snakeCase('HELLO WORLD')).toBe('hello_world');
    });

    it('should handle already snake_case strings', () => {
      expect(snakeCase('hello_world')).toBe('hello_world');
      expect(snakeCase('foo_bar_baz')).toBe('foo_bar_baz');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(snakeCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(snakeCase('hello')).toBe('hello');
      expect(snakeCase('HELLO')).toBe('hello');
      expect(snakeCase('Hello')).toBe('hello');
    });

    it('should handle numbers', () => {
      expect(snakeCase('version2')).toBe('version2');
      expect(snakeCase('test123')).toBe('test123');
      expect(snakeCase('item1Name')).toBe('item1_name');
    });

    it('should handle consecutive uppercase letters', () => {
      expect(snakeCase('XMLParser')).toBe('xml_parser');
      expect(snakeCase('HTMLElement')).toBe('html_element');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => snakeCase(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => snakeCase(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => snakeCase(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });
});

describe('pascalCase', () => {
  describe('basic functionality', () => {
    it('should convert space-separated words to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('foo bar baz')).toBe('FooBarBaz');
      expect(pascalCase('one two three')).toBe('OneTwoThree');
    });

    it('should convert hyphen-separated words to PascalCase', () => {
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('foo-bar-baz')).toBe('FooBarBaz');
      expect(pascalCase('background-color')).toBe('BackgroundColor');
    });

    it('should convert underscore-separated words to PascalCase', () => {
      expect(pascalCase('hello_world')).toBe('HelloWorld');
      expect(pascalCase('foo_bar_baz')).toBe('FooBarBaz');
      expect(pascalCase('user_id')).toBe('UserId');
    });

    it('should convert camelCase to PascalCase', () => {
      expect(pascalCase('helloWorld')).toBe('HelloWorld');
      expect(pascalCase('fooBarBaz')).toBe('FooBarBaz');
    });

    it('should handle mixed case input', () => {
      expect(pascalCase('Hello World')).toBe('HelloWorld');
      expect(pascalCase('HELLO WORLD')).toBe('HelloWorld');
      expect(pascalCase('hELLo WoRLd')).toBe('HElloWoRld');
    });

    it('should handle already PascalCase strings', () => {
      expect(pascalCase('HelloWorld')).toBe('HelloWorld');
      expect(pascalCase('FooBarBaz')).toBe('FooBarBaz');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(pascalCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(pascalCase('hello')).toBe('Hello');
      expect(pascalCase('HELLO')).toBe('Hello');
      expect(pascalCase('Hello')).toBe('Hello');
    });

    it('should handle numbers', () => {
      expect(pascalCase('version 2')).toBe('Version2');
      expect(pascalCase('test-123')).toBe('Test123');
      expect(pascalCase('item_1_name')).toBe('Item1Name');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => pascalCase(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => pascalCase(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => pascalCase(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });
});

describe('constantCase', () => {
  describe('basic functionality', () => {
    it('should convert to CONSTANT_CASE', () => {
      expect(constantCase('hello world')).toBe('HELLO_WORLD');
      expect(constantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(constantCase('hello-world')).toBe('HELLO_WORLD');
      expect(constantCase('hello_world')).toBe('HELLO_WORLD');
    });

    it('should handle already CONSTANT_CASE strings', () => {
      expect(constantCase('HELLO_WORLD')).toBe('HELLO_WORLD');
      expect(constantCase('FOO_BAR_BAZ')).toBe('FOO_BAR_BAZ');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(constantCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(constantCase('hello')).toBe('HELLO');
      expect(constantCase('HELLO')).toBe('HELLO');
    });

    it('should handle numbers', () => {
      expect(constantCase('version2')).toBe('VERSION2');
      expect(constantCase('test123')).toBe('TEST123');
    });
  });
});

describe('dotCase', () => {
  describe('basic functionality', () => {
    it('should convert to dot.case', () => {
      expect(dotCase('hello world')).toBe('hello.world');
      expect(dotCase('helloWorld')).toBe('hello.world');
      expect(dotCase('hello-world')).toBe('hello.world');
      expect(dotCase('hello_world')).toBe('hello.world');
    });

    it('should handle already dot.case strings', () => {
      expect(dotCase('hello.world')).toBe('hello.world');
      expect(dotCase('foo.bar.baz')).toBe('foo.bar.baz');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(dotCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(dotCase('hello')).toBe('hello');
      expect(dotCase('HELLO')).toBe('hello');
    });

    it('should handle numbers', () => {
      expect(dotCase('version2')).toBe('version2');
      expect(dotCase('test123')).toBe('test123');
      expect(dotCase('item1Name')).toBe('item1.name');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => dotCase(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => dotCase(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => dotCase(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });
});

describe('real-world use cases', () => {
  describe('API data transformation', () => {
    it('should convert API field names', () => {
      const apiFields = [
        'first_name',
        'last_name',
        'email_address',
        'phone_number',
      ];
      const camelCased = apiFields.map(camelCase);

      expect(camelCased).toEqual([
        'firstName',
        'lastName',
        'emailAddress',
        'phoneNumber',
      ]);
    });

    it('should convert JavaScript properties to API format', () => {
      const jsFields = ['firstName', 'lastName', 'emailAddress', 'phoneNumber'];
      const snakeCased = jsFields.map(snakeCase);

      expect(snakeCased).toEqual([
        'first_name',
        'last_name',
        'email_address',
        'phone_number',
      ]);
    });
  });

  describe('CSS property conversion', () => {
    it('should convert CSS properties to camelCase', () => {
      const cssProps = [
        'background-color',
        'font-size',
        'margin-top',
        'border-radius',
      ];
      const camelCased = cssProps.map(camelCase);

      expect(camelCased).toEqual([
        'backgroundColor',
        'fontSize',
        'marginTop',
        'borderRadius',
      ]);
    });

    it('should convert camelCase to CSS properties', () => {
      const jsProps = [
        'backgroundColor',
        'fontSize',
        'marginTop',
        'borderRadius',
      ];
      const kebabCased = jsProps.map(kebabCase);

      expect(kebabCased).toEqual([
        'background-color',
        'font-size',
        'margin-top',
        'border-radius',
      ]);
    });
  });

  describe('file and URL naming', () => {
    it('should convert to kebab-case for URLs', () => {
      const pageNames = ['About Us', 'Contact Info', 'Privacy Policy'];
      const urlFriendly = pageNames.map(kebabCase);

      expect(urlFriendly).toEqual([
        'about-us',
        'contact-info',
        'privacy-policy',
      ]);
    });

    it('should convert to snake_case for filenames', () => {
      const fileNames = ['User Profile', 'Settings Page', 'Admin Panel'];
      const fileNameFriendly = fileNames.map(snakeCase);

      expect(fileNameFriendly).toEqual([
        'user_profile',
        'settings_page',
        'admin_panel',
      ]);
    });
  });

  describe('component naming', () => {
    it('should convert to PascalCase for React components', () => {
      const componentNames = [
        'user profile',
        'navigation bar',
        'footer section',
      ];
      const pascalCased = componentNames.map(pascalCase);

      expect(pascalCased).toEqual([
        'UserProfile',
        'NavigationBar',
        'FooterSection',
      ]);
    });
  });

  describe('environment variables', () => {
    it('should convert to CONSTANT_CASE for env vars', () => {
      const configKeys = ['api url', 'database host', 'jwt secret'];
      const envVars = configKeys.map(constantCase);

      expect(envVars).toEqual(['API_URL', 'DATABASE_HOST', 'JWT_SECRET']);
    });
  });
});
