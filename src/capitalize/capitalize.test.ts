import { describe, it, expect } from 'vitest';
import { capitalize } from './index';

describe('capitalize', () => {
  describe('basic functionality', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('hELLO wORLD')).toBe('Hello world');
    });

    it('should handle single characters', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('Z')).toBe('Z');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('World')).toBe('World');
    });

    it('should handle mixed case strings', () => {
      expect(capitalize('hELLo')).toBe('Hello');
      expect(capitalize('WoRlD')).toBe('World');
      expect(capitalize('jAvAsCrIpT')).toBe('Javascript');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle strings with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
      expect(capitalize('test123')).toBe('Test123');
      expect(capitalize('123TEST')).toBe('123test');
    });

    it('should handle strings with special characters', () => {
      expect(capitalize('!hello')).toBe('!hello');
      expect(capitalize('@WORLD')).toBe('@world');
      expect(capitalize('#test')).toBe('#test');
    });

    it('should handle strings starting with spaces', () => {
      expect(capitalize(' hello')).toBe(' hello');
      expect(capitalize('  WORLD')).toBe('  world');
    });

    it('should handle strings with only spaces', () => {
      expect(capitalize(' ')).toBe(' ');
      expect(capitalize('   ')).toBe('   ');
    });

    it('should handle strings with only numbers', () => {
      expect(capitalize('123')).toBe('123');
      expect(capitalize('456789')).toBe('456789');
    });

    it('should handle strings with only special characters', () => {
      expect(capitalize('!!!')).toBe('!!!');
      expect(capitalize('@#$')).toBe('@#$');
    });
  });

  describe('unicode support', () => {
    it('should handle accented characters', () => {
      expect(capitalize('ñoño')).toBe('Ñoño');
      expect(capitalize('été')).toBe('Été');
      expect(capitalize('naïve')).toBe('Naïve');
    });

    it('should handle non-Latin characters', () => {
      expect(capitalize('москва')).toBe('Москва');
      expect(capitalize('北京')).toBe('北京');
      expect(capitalize('тест')).toBe('Тест');
    });

    it('should handle emoji and symbols', () => {
      expect(capitalize('😀hello')).toBe('😀hello');
      expect(capitalize('αβγδ')).toBe('Αβγδ');
    });

    it('should handle combining characters', () => {
      expect(capitalize('café')).toBe('Café');
      expect(capitalize('résumé')).toBe('Résumé');
    });
  });

  describe('whitespace handling', () => {
    it('should handle leading whitespace', () => {
      expect(capitalize(' hello')).toBe(' hello');
      expect(capitalize('\thello')).toBe('\thello');
      expect(capitalize('\nhello')).toBe('\nhello');
    });

    it('should handle internal whitespace', () => {
      expect(capitalize('hello world')).toBe('Hello world');
      expect(capitalize('multiple   spaces')).toBe('Multiple   spaces');
      expect(capitalize('tab\tseparated')).toBe('Tab\tseparated');
    });

    it('should handle trailing whitespace', () => {
      expect(capitalize('hello ')).toBe('Hello ');
      expect(capitalize('world\t')).toBe('World\t');
      expect(capitalize('test\n')).toBe('Test\n');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => capitalize(null as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => capitalize(undefined as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => capitalize(123 as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => capitalize([] as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => capitalize({} as any)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => capitalize(true as any)).toThrow(
        'Expected first argument to be a string'
      );
    });
  });

  describe('immutability', () => {
    it('should not modify the original string', () => {
      const original = 'hello world';
      const result = capitalize(original);

      expect(original).toBe('hello world');
      expect(result).toBe('Hello world');
    });
  });

  describe('real-world use cases', () => {
    it('should work with user names', () => {
      const names = ['john', 'JANE', 'bob', 'ALICE'];
      const capitalized = names.map(capitalize);

      expect(capitalized).toEqual(['John', 'Jane', 'Bob', 'Alice']);
    });

    it('should work with form input normalization', () => {
      const userInputs = [
        'jOhN dOe',
        'JANE SMITH',
        'bob wilson',
        'ALICE JOHNSON',
      ];

      const normalized = userInputs.map(capitalize);

      expect(normalized).toEqual([
        'John doe',
        'Jane smith',
        'Bob wilson',
        'Alice johnson',
      ]);
    });

    it('should work with product names', () => {
      const products = ['iPHONE 15', 'macBOOK pro', 'APPLE watch', 'airPODS'];

      const formatted = products.map(capitalize);

      expect(formatted).toEqual([
        'Iphone 15',
        'Macbook pro',
        'Apple watch',
        'Airpods',
      ]);
    });

    it('should work with city names', () => {
      const cities = ['new york', 'LOS ANGELES', 'ChIcAgO', 'HOUSTON'];

      const formatted = cities.map(capitalize);

      expect(formatted).toEqual([
        'New york',
        'Los angeles',
        'Chicago',
        'Houston',
      ]);
    });

    it('should work with status messages', () => {
      const statuses = [
        'loading...',
        'SUCCESS!',
        'ERROR: failed to load',
        'COMPLETED successfully',
      ];

      const formatted = statuses.map(capitalize);

      expect(formatted).toEqual([
        'Loading...',
        'Success!',
        'Error: failed to load',
        'Completed successfully',
      ]);
    });

    it('should work with file names', () => {
      const files = ['readme.txt', 'INDEX.HTML', 'CONFIG.json', 'package.JSON'];

      const formatted = files.map(capitalize);

      expect(formatted).toEqual([
        'Readme.txt',
        'Index.html',
        'Config.json',
        'Package.json',
      ]);
    });
  });

  describe('performance', () => {
    it('should handle long strings efficiently', () => {
      const longString = 'a'.repeat(10000);
      const result = capitalize(longString);

      expect(result.charAt(0)).toBe('A');
      expect(result.length).toBe(10000);
      expect(result.slice(1)).toBe('a'.repeat(9999));
    });

    it('should handle repeated calls efficiently', () => {
      const testString = 'hello world';

      for (let i = 0; i < 1000; i++) {
        const result = capitalize(testString);
        expect(result).toBe('Hello world');
      }
    });
  });

  describe('TypeScript types', () => {
    it('should return string type', () => {
      const result = capitalize('test');

      // TypeScript should infer string type
      expect(typeof result).toBe('string');
    });

    it('should work with string literals', () => {
      const literal = 'hello' as const;
      const result = capitalize(literal);

      expect(result).toBe('Hello');
      expect(typeof result).toBe('string');
    });

    it('should work with template literals', () => {
      const name = 'world';
      const template = `hello ${name}`;
      const result = capitalize(template);

      expect(result).toBe('Hello world');
    });
  });
});
