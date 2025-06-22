/**
 * Converts a string to camelCase.
 *
 * @param str - The string to convert
 * @returns A new string in camelCase format
 *
 * @example
 * ```typescript
 * import { camelCase } from 'datype';
 *
 * camelCase('hello world'); // 'helloWorld'
 * camelCase('hello-world'); // 'helloWorld'
 * camelCase('hello_world'); // 'helloWorld'
 * camelCase('Hello World'); // 'helloWorld'
 * camelCase('HELLO WORLD'); // 'helloWorld'
 * ```
 */
export function camelCase(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join('');
}

/**
 * Converts a string to kebab-case.
 *
 * @param str - The string to convert
 * @returns A new string in kebab-case format
 *
 * @example
 * ```typescript
 * import { kebabCase } from 'datype';
 *
 * kebabCase('hello world'); // 'hello-world'
 * kebabCase('helloWorld'); // 'hello-world'
 * kebabCase('hello_world'); // 'hello-world'
 * kebabCase('Hello World'); // 'hello-world'
 * kebabCase('HELLO WORLD'); // 'hello-world'
 * ```
 */
export function kebabCase(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

/**
 * Converts a string to snake_case.
 *
 * @param str - The string to convert
 * @returns A new string in snake_case format
 *
 * @example
 * ```typescript
 * import { snakeCase } from 'datype';
 *
 * snakeCase('hello world'); // 'hello_world'
 * snakeCase('helloWorld'); // 'hello_world'
 * snakeCase('hello-world'); // 'hello_world'
 * snakeCase('Hello World'); // 'hello_world'
 * snakeCase('HELLO WORLD'); // 'hello_world'
 * ```
 */
export function snakeCase(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '');
}

/**
 * Converts a string to PascalCase.
 *
 * @param str - The string to convert
 * @returns A new string in PascalCase format
 *
 * @example
 * ```typescript
 * import { pascalCase } from 'datype';
 *
 * pascalCase('hello world'); // 'HelloWorld'
 * pascalCase('hello-world'); // 'HelloWorld'
 * pascalCase('hello_world'); // 'HelloWorld'
 * pascalCase('helloWorld'); // 'HelloWorld'
 * ```
 */
export function pascalCase(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return (
    str
      // Insert spaces before uppercase letters that follow lowercase letters or numbers
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      // Replace any sequence of non-alphanumeric characters with a space
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      // Trim whitespace
      .trim()
      // Split into words
      .split(/\s+/)
      // Filter out empty words
      .filter(word => word.length > 0)
      // Convert to PascalCase
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('')
  );
}

/**
 * Converts a string to CONSTANT_CASE (SCREAMING_SNAKE_CASE).
 *
 * @param str - The string to convert
 * @returns A new string in CONSTANT_CASE format
 *
 * @example
 * ```typescript
 * import { constantCase } from 'datype';
 *
 * constantCase('hello world'); // 'HELLO_WORLD'
 * constantCase('helloWorld'); // 'HELLO_WORLD'
 * constantCase('hello-world'); // 'HELLO_WORLD'
 * constantCase('Hello World'); // 'HELLO_WORLD'
 * ```
 */
export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase();
}

/**
 * Converts a string to dot.case.
 *
 * @param str - The string to convert
 * @returns A new string in dot.case format
 *
 * @example
 * ```typescript
 * import { dotCase } from 'datype';
 *
 * dotCase('hello world'); // 'hello.world'
 * dotCase('helloWorld'); // 'hello.world'
 * dotCase('hello-world'); // 'hello.world'
 * dotCase('hello_world'); // 'hello.world'
 * ```
 */
export function dotCase(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected first argument to be a string');
  }

  if (str.length === 0) {
    return str;
  }

  return (
    str
      // Insert dots before uppercase letters that follow lowercase letters or numbers
      .replace(/([a-z0-9])([A-Z])/g, '$1.$2')
      // Replace any sequence of non-alphanumeric characters with a dot
      .replace(/[^a-zA-Z0-9]+/g, '.')
      // Convert to lowercase
      .toLowerCase()
      // Remove leading/trailing dots
      .replace(/^\.+|\.+$/g, '')
  );
}
