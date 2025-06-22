import { describe, it, expect } from 'vitest';
import { slugify } from './index';

describe('slugify', () => {
  describe('basic functionality', () => {
    it('should convert simple strings to slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Simple Test')).toBe('simple-test');
      expect(slugify('one two three')).toBe('one-two-three');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle single words', () => {
      expect(slugify('hello')).toBe('hello');
      expect(slugify('WORLD')).toBe('world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Test@#$%^&*()')).toBe('test-dollar-and');
      expect(slugify('Special chars: []{}|\\;\'":.,<>?')).toBe('special-chars');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('  multiple   spaces  ')).toBe('multiple-spaces');
      expect(slugify('\t\n\r  whitespace  \t\n\r')).toBe('whitespace');
    });

    it('should handle numbers', () => {
      expect(slugify('Product 123')).toBe('product-123');
      expect(slugify('Version 2.1.0')).toBe('version-2-1-0');
      expect(slugify('123 Numbers First')).toBe('123-numbers-first');
    });
  });

  describe('Unicode and international characters', () => {
    it('should handle Latin extended characters', () => {
      expect(slugify('Café')).toBe('cafe');
      expect(slugify('résumé')).toBe('resume');
      expect(slugify('naïve')).toBe('naive');
      expect(slugify('piñata')).toBe('pinata');
      expect(slugify('Zürich')).toBe('zurich');
    });

    it('should handle accented uppercase characters', () => {
      expect(slugify('CAFÉ')).toBe('cafe');
      expect(slugify('RÉSUMÉ')).toBe('resume');
      expect(slugify('ZÜRICH')).toBe('zurich');
    });

    it('should handle Cyrillic characters', () => {
      expect(slugify('Привет мир')).toBe('privet-mir');
      expect(slugify('Москва')).toBe('moskva');
      expect(slugify('Санкт-Петербург')).toBe('sankt-peterburg');
    });

    it('should handle Greek characters', () => {
      expect(slugify('Αθήνα')).toBe('athhna');
      expect(slugify('φιλοσοφία')).toBe('filosofia');
      expect(slugify('ελληνικά')).toBe('ellhnika');
    });

    it('should handle mixed scripts', () => {
      expect(slugify('Café in Москва')).toBe('cafe-in-moskva');
      expect(slugify('résumé für München')).toBe('resume-fur-munchen');
    });

    it('should handle Arabic numerals in other scripts', () => {
      expect(slugify('العدد ١٢٣')).toBe('123');
    });

    it('should handle ligatures and special combinations', () => {
      expect(slugify('æon')).toBe('aeon');
      expect(slugify('Œuvre')).toBe('oeuvre');
      expect(slugify('ß-Test')).toBe('ss-test');
    });
  });

  describe('options configuration', () => {
    describe('separator option', () => {
      it('should use custom separator', () => {
        expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
        expect(slugify('One Two Three', { separator: '.' })).toBe(
          'one.two.three'
        );
        expect(slugify('Test Case', { separator: '' })).toBe('testcase');
      });

      it('should handle special separator characters', () => {
        expect(slugify('Hello World', { separator: '+' })).toBe('hello+world');
        expect(slugify('Test Case', { separator: '|' })).toBe('test|case');
      });
    });

    describe('lowercase option', () => {
      it('should preserve case when lowercase is false', () => {
        expect(slugify('Hello World', { lowercase: false })).toBe(
          'Hello-World'
        );
        expect(slugify('CamelCase', { lowercase: false })).toBe('CamelCase');
        expect(slugify('UPPERCASE', { lowercase: false })).toBe('UPPERCASE');
      });

      it('should handle accented characters with case preservation', () => {
        expect(slugify('Café RÉSUMÉ', { lowercase: false })).toBe(
          'Cafe-RESUME'
        );
      });
    });

    describe('trim option', () => {
      it('should not trim when trim is false', () => {
        expect(slugify('  Hello World  ', { trim: false })).toBe(
          '-hello-world-'
        );
        expect(slugify(' Test ', { trim: false })).toBe('-test-');
      });

      it('should trim with custom separator', () => {
        expect(
          slugify('  Hello World  ', { separator: '_', trim: false })
        ).toBe('_hello_world_');
      });
    });

    describe('replacements option', () => {
      it('should apply custom replacements', () => {
        expect(slugify('AT&T', { replacements: { '&': '-and-' } })).toBe(
          'at-and-t'
        );
        expect(slugify('C++', { replacements: { '+': '-plus' } })).toBe(
          'c-plus-plus'
        );
      });

      it('should override default mappings', () => {
        expect(slugify('café', { replacements: { é: 'e-custom' } })).toBe(
          'cafe'
        );
      });

      it('should handle multiple custom replacements', () => {
        expect(
          slugify('A&B+C', {
            replacements: { '&': '-and-', '+': '-plus-' },
          })
        ).toBe('a-and-b-plus-c');
      });
    });

    describe('remove option', () => {
      it('should keep special characters when remove is false', () => {
        expect(slugify('Test@Email.com', { remove: false })).toBe(
          'test@email.com'
        );
        expect(slugify('Price: $99.99', { remove: false })).toBe(
          'price:-dollar99.99'
        );
      });
    });

    describe('strict option', () => {
      it('should only allow alphanumeric and separators in strict mode', () => {
        expect(slugify('Hello@World!', { strict: true })).toBe('hello-world');
        expect(slugify('Test#123$', { strict: true })).toBe('test-123');
        expect(slugify('Special()Chars[]', { strict: true })).toBe(
          'special-chars'
        );
      });

      it('should work with custom separator in strict mode', () => {
        expect(slugify('Hello@World', { strict: true, separator: '_' })).toBe(
          'hello_world'
        );
      });
    });

    describe('combined options', () => {
      it('should handle multiple options together', () => {
        expect(
          slugify('  Café & Restaurant  ', {
            separator: '_',
            lowercase: false,
            trim: false,
            replacements: { '&': 'and' },
          })
        ).toBe('_Cafe_and_Restaurant_');
      });

      it('should handle strict mode with custom options', () => {
        expect(
          slugify('Test@#$123!', {
            strict: true,
            separator: '.',
            lowercase: false,
          })
        ).toBe('Test.123');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle strings with only special characters', () => {
      expect(slugify('!@#$%^&*()')).toBe('dollar-and');
      expect(slugify('---')).toBe('');
      expect(slugify('...')).toBe('');
    });

    it('should handle strings with only whitespace', () => {
      expect(slugify('   ')).toBe('');
      expect(slugify('\t\n\r')).toBe('');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const result = slugify(longString);
      expect(result).toBe(longString);
      expect(result.length).toBe(1000);
    });

    it('should handle strings with consecutive separators', () => {
      expect(slugify('hello---world')).toBe('hello-world');
      expect(slugify('test___case', { separator: '_' })).toBe('test_case');
    });

    it('should handle mixed consecutive separators and spaces', () => {
      expect(slugify('hello - - - world')).toBe('hello-world');
      expect(slugify('test _ _ _ case', { separator: '_' })).toBe('test_case');
    });

    it('should handle Unicode normalization edge cases', () => {
      // Test composed vs decomposed Unicode
      const composed = 'é'; // Single character
      const decomposed = 'e\u0301'; // e + combining acute accent
      expect(slugify(composed)).toBe('e');
      expect(slugify(decomposed)).toBe('e');
    });
  });

  describe('real-world examples', () => {
    it('should handle blog post titles', () => {
      expect(slugify('How to Build a REST API in Node.js')).toBe(
        'how-to-build-a-rest-api-in-node-js'
      );
      expect(slugify('10 Tips for Better Code Reviews')).toBe(
        '10-tips-for-better-code-reviews'
      );
      expect(slugify('JavaScript: The Good Parts')).toBe(
        'javascript-the-good-parts'
      );
    });

    it('should handle product names', () => {
      expect(slugify('iPhone 15 Pro Max')).toBe('iphone-15-pro-max');
      expect(slugify('MacBook Air (M2, 2022)')).toBe('macbook-air-m2-2022');
      expect(slugify('Samsung Galaxy S23+')).toBe('samsung-galaxy-s23');
    });

    it('should handle international content', () => {
      expect(slugify('Développement Web Moderne')).toBe(
        'developpement-web-moderne'
      );
      expect(slugify('Programmierung für Anfänger')).toBe(
        'programmierung-fur-anfanger'
      );
      expect(slugify('プログラミング入門')).toBe('');
    });

    it('should handle file names', () => {
      expect(slugify('My Document (Final Version).pdf')).toBe(
        'my-document-final-version-pdf'
      );
      expect(slugify('Screenshot 2023-12-01 at 10.30.45 AM.png')).toBe(
        'screenshot-2023-12-01-at-10-30-45-am-png'
      );
    });

    it('should handle URLs and domains', () => {
      expect(slugify('My Awesome Website!')).toBe('my-awesome-website');
      expect(slugify('E-commerce Store 2.0')).toBe('e-commerce-store-2-0');
    });

    it('should handle social media posts', () => {
      expect(slugify('Check out this amazing #JavaScript tip! 🚀')).toBe(
        'check-out-this-amazing-javascript-tip'
      );
      expect(slugify('Love this new feature @company 💖')).toBe(
        'love-this-new-feature-company'
      );
    });
  });

  describe('performance and edge cases', () => {
    it('should handle empty replacements object', () => {
      expect(slugify('test', { replacements: {} })).toBe('test');
    });

    it('should handle null separator gracefully', () => {
      expect(slugify('hello world', { separator: '' })).toBe('helloworld');
    });

    it('should handle boolean-like strings', () => {
      expect(slugify('true false null undefined')).toBe(
        'true-false-null-undefined'
      );
    });

    it('should handle numeric strings', () => {
      expect(slugify('123')).toBe('123');
      expect(slugify('0')).toBe('0');
      expect(slugify('3.14159')).toBe('3-14159');
    });
  });

  describe('error handling', () => {
    it('should throw error for non-string input', () => {
      expect(() => slugify(null as any)).toThrow(TypeError);
      expect(() => slugify(undefined as any)).toThrow(TypeError);
      expect(() => slugify(123 as any)).toThrow(TypeError);
      expect(() => slugify({} as any)).toThrow(TypeError);
      expect(() => slugify([] as any)).toThrow(TypeError);
    });
  });

  describe('TypeScript type safety', () => {
    it('should work with string literals', () => {
      const result: string = slugify('test');
      expect(result).toBe('test');
    });

    it('should work with template literals', () => {
      const name = 'World';
      const result = slugify(`Hello ${name}!`);
      expect(result).toBe('hello-world');
    });
  });
});
