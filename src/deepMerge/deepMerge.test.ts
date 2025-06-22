/**
 * Tests for deepMerge function
 */

import { deepMerge } from './index';
import { describe, it, expect } from 'vitest';

describe('deepMerge', () => {
  describe('Basic functionality', () => {
    it('should merge two simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).not.toBe(target); // Immutability check
    });

    it('should return a copy when no sources provided', () => {
      const target = { a: 1, b: 2 };
      const result = deepMerge(target);

      expect(result).toEqual(target);
      expect(result).not.toBe(target); // Immutability check
    });

    it('should handle multiple sources', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      const source3 = { d: 4 };
      const result = deepMerge(target, source1, source2, source3);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });
  });

  describe('Deep merging', () => {
    it('should merge nested objects deeply', () => {
      const target = {
        api: { url: '/api', timeout: 5000 },
        user: { name: 'John' },
      };
      const source = {
        api: { timeout: 10000, retries: 3 },
        user: { age: 30 },
      };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        api: { url: '/api', timeout: 10000, retries: 3 },
        user: { name: 'John', age: 30 },
      });
    });

    it('should handle deeply nested structures', () => {
      const target = {
        level1: {
          level2: {
            level3: { a: 1, b: 2 },
          },
        },
      };
      const source = {
        level1: {
          level2: {
            level3: { b: 3, c: 4 },
          },
        },
      };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        level1: {
          level2: {
            level3: { a: 1, b: 3, c: 4 },
          },
        },
      });
    });
  });

  describe('Array handling', () => {
    it('should concatenate arrays', () => {
      const target = { features: ['auth', 'dashboard'] };
      const source = { features: ['analytics', 'reporting'] };
      const result = deepMerge(target, source);

      expect(result.features).toEqual([
        'auth',
        'dashboard',
        'analytics',
        'reporting',
      ]);
    });

    it('should handle arrays in nested objects', () => {
      const target = {
        config: {
          plugins: ['plugin1', 'plugin2'],
          settings: { debug: true },
        },
      };
      const source = {
        config: {
          plugins: ['plugin3'],
          settings: { verbose: false },
        },
      };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        config: {
          plugins: ['plugin1', 'plugin2', 'plugin3'],
          settings: { debug: true, verbose: false },
        },
      });
    });

    it('should replace non-array with array', () => {
      const target = { value: 'string' };
      const source = { value: [1, 2, 3] };
      const result = deepMerge(target, source);

      expect(result.value).toEqual([1, 2, 3]);
    });

    it('should replace array with non-array', () => {
      const target = { value: [1, 2, 3] };
      const source = { value: 'string' };
      const result = deepMerge(target, source);

      expect(result.value).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should handle null and undefined values', () => {
      const target = { a: null, b: undefined, c: 1 };
      const source = { a: 'value', b: 'value', d: null };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 'value', b: 'value', c: 1, d: null });
    });

    it('should handle Date objects', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-12-31');
      const target = { created: date1 };
      const source = { created: date2 };
      const result = deepMerge(target, source);

      expect(result.created).toBe(date2);
      expect(result.created).toBeInstanceOf(Date);
    });

    it('should handle RegExp objects', () => {
      const regex1 = /test1/g;
      const regex2 = /test2/i;
      const target = { pattern: regex1 };
      const source = { pattern: regex2 };
      const result = deepMerge(target, source);

      expect(result.pattern).toBe(regex2);
      expect(result.pattern).toBeInstanceOf(RegExp);
    });

    it('should handle functions', () => {
      const fn1 = () => 'test1';
      const fn2 = () => 'test2';
      const target = { callback: fn1 };
      const source = { callback: fn2 };
      const result = deepMerge(target, source);

      expect(result.callback).toBe(fn2);
      expect(typeof result.callback).toBe('function');
    });

    it('should skip non-object sources', () => {
      const target = { a: 1 };
      // Test avec des types invalides passés via any (justifié pour tester la robustesse)
      const invalidSources = [null, undefined, 'string', 123] as any[];
      const validSource = { b: 2 };

      const result = deepMerge(target, ...invalidSources, validSource);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty objects', () => {
      const target = {};
      const source = { a: 1, b: { c: 2 } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    it('should throw error for non-object target', () => {
      const invalidTargets = [null, 'string', 123, []] as any[];

      invalidTargets.forEach(invalidTarget => {
        expect(() => deepMerge(invalidTarget)).toThrow(
          'Target must be a plain object'
        );
      });
    });
  });

  describe('Immutability', () => {
    it('should not mutate the target object', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };
      const originalTarget = JSON.parse(JSON.stringify(target));

      deepMerge(target, source);

      expect(target).toEqual(originalTarget);
    });

    it('should not mutate source objects', () => {
      const target = { a: 1 };
      const source = { b: { c: 2 } };
      const originalSource = JSON.parse(JSON.stringify(source));

      deepMerge(target, source);

      expect(source).toEqual(originalSource);
    });

    it('should create new nested objects', () => {
      const target = { nested: { a: 1 } };
      const source = { nested: { b: 2 } };
      const result = deepMerge(target, source);

      expect(result.nested).not.toBe(target.nested);
      expect(result.nested).not.toBe(source.nested);
    });
  });

  describe('TypeScript integration with preserved types', () => {
    interface AppConfig {
      appName: string;
      api: {
        url: string;
        timeout: number;
        headers?: Record<string, string>;
      };
      features: string[];
      debug: boolean;
    }

    it('should preserve types perfectly without casting', () => {
      const defaultOptions: AppConfig = {
        appName: 'My Awesome App',
        api: {
          url: '/api/v1',
          timeout: 5000,
        },
        features: ['auth', 'dashboard'],
        debug: false,
      };

      const userOptions = {
        api: {
          timeout: 10000,
          headers: {
            'X-Custom-Header': 'foobar',
          },
        },
        features: ['analytics'],
      } as const;

      const devOptions = {
        api: {
          url: 'http://localhost:3000/dev/api',
        },
        debug: true,
      } as const;

      const finalConfig = deepMerge(defaultOptions, userOptions, devOptions);

      expect(finalConfig).toEqual({
        appName: 'My Awesome App',
        api: {
          url: 'http://localhost:3000/dev/api',
          timeout: 10000,
          headers: { 'X-Custom-Header': 'foobar' },
        },
        features: ['auth', 'dashboard', 'analytics'],
        debug: true,
      });

      // Types should be inferred without casting - this is the goal!
      // Note: In tests we still need assertions due to the complexity of the merged type
      // But in real usage, TypeScript would infer these perfectly
      const apiUrl = finalConfig.api.url; // Should be typed as string
      const isDebug = finalConfig.debug; // Should be typed as boolean
      const featureList = finalConfig.features; // Should be typed as array

      expect(typeof apiUrl).toBe('string');
      expect(typeof isDebug).toBe('boolean');
      expect(Array.isArray(featureList)).toBe(true);
    });

    it('should demonstrate perfect type preservation with simple objects', () => {
      const target = {
        name: 'John',
        age: 30,
        settings: {
          theme: 'dark' as const,
          notifications: true,
        },
      };

      const source = {
        age: 31,
        settings: {
          notifications: false,
          language: 'fr' as const,
        },
      };

      const result = deepMerge(target, source);

      // These should be perfectly typed without any casting
      expect(result.name).toBe('John'); // string
      expect(result.age).toBe(31); // number
      expect(result.settings.theme).toBe('dark'); // 'dark'
      expect(result.settings.notifications).toBe(false); // boolean
      expect(result.settings.language).toBe('fr'); // 'fr'
    });
  });

  describe('Advanced features', () => {
    it('should handle array merge strategies', () => {
      const target = { items: [1, 2] };
      const source = { items: [3, 4] };

      // Default behavior (concat)
      const concatResult = deepMerge(target, source);
      expect(concatResult.items).toEqual([1, 2, 3, 4]);

      // Replace strategy
      const replaceResult = deepMerge(target, source, {
        arrayMergeStrategy: 'replace',
      });
      expect(replaceResult.items).toEqual([3, 4]);
    });

    it('should prevent infinite recursion with maxDepth', () => {
      const target = { a: { b: { c: { d: 1 } } } };
      const source = { a: { b: { c: { d: 2, e: 3 } } } };

      // Should work with sufficient depth
      const result = deepMerge(target, source, { maxDepth: 5 });
      expect(result.a.b.c.d).toBe(2);
      expect(result.a.b.c.e).toBe(3);

      // Should throw with insufficient depth
      expect(() => deepMerge(target, source, { maxDepth: 2 })).toThrow(
        'Maximum merge depth (2) exceeded'
      );
    });

    it('should handle circular references gracefully', () => {
      const target: any = { a: 1 };
      target.self = target;

      const source = { b: 2 };

      const result = deepMerge(target, source);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      // Our implementation detects circular references and handles them safely
      // The circular reference is preserved but controlled by the WeakSet mechanism
      expect(result.self).toBeDefined();
      expect(result.self.a).toBe(1);
    });

    it('should handle Object.create(null) objects', () => {
      const target = Object.create(null);
      target.a = 1;

      const source = Object.create(null);
      source.b = 2;

      const result = deepMerge(target, source);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
    });

    it('should be performant with large objects', () => {
      const target: any = {};
      const source: any = {};

      // Create large objects
      for (let i = 0; i < 1000; i++) {
        target[`prop${i}`] = { value: i, nested: { deep: i * 2 } };
        source[`prop${i}`] = { value: i + 1000, nested: { deep: i * 3 } };
      }

      const start = performance.now();
      const result = deepMerge(target, source);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should be fast
      expect(result.prop500.value).toBe(1500); // Source value
      expect(result.prop500.nested.deep).toBe(1500); // Source value
    });
  });

  describe('Type testing demonstrations', () => {
    it('should preserve literal types', () => {
      const target = {
        theme: 'dark' as const,
        size: 'large' as const,
      };

      const source = {
        theme: 'light' as const,
        enabled: true,
      };

      const result = deepMerge(target, source);

      // TypeScript should infer these as literal types
      expect(result.theme).toBe('light');
      expect(result.size).toBe('large');
      expect(result.enabled).toBe(true);
    });

    it('should handle complex nested type inference', () => {
      interface Config {
        api: {
          url: string;
          retries: number;
        };
        features: {
          auth: boolean;
          logging: {
            level: 'debug' | 'info' | 'error';
            format: string;
          };
        };
      }

      const defaultConfig: Config = {
        api: { url: '/api', retries: 3 },
        features: {
          auth: false,
          logging: { level: 'info', format: 'json' },
        },
      };

      const overrides = {
        api: { retries: 5 },
        features: {
          auth: true,
          logging: { level: 'debug' as const },
        },
      };

      const result = deepMerge(defaultConfig, overrides);

      // All these should be properly typed
      expect(result.api.url).toBe('/api');
      expect(result.api.retries).toBe(5);
      expect(result.features.auth).toBe(true);
      expect(result.features.logging.level).toBe('debug');
      expect(result.features.logging.format).toBe('json');
    });
  });
});
