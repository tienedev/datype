# datype

<div align="center">

**A modern, TypeScript-first utility library with perfect type inference and zero dependencies.**

[![npm version](https://img.shields.io/npm/v/datype.svg)](https://www.npmjs.com/package/datype)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://codecov.io/gh/tienedev/datype/branch/main/graph/badge.svg)](https://codecov.io/gh/tienedev/datype)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/datype)](https://bundlephobia.com/package/datype)
[![GitHub Stars](https://img.shields.io/github/stars/tienedev/datype)](https://github.com/tienedev/datype)

[Installation](#installation) • [API Reference](#api-reference)

</div>

## Why datype?

**datype** is built for the modern TypeScript ecosystem. Unlike traditional utility libraries, every function is designed with TypeScript-first principles, providing perfect type inference without manual type annotations.

```typescript
import { deepMerge, pick, groupBy } from '@tienedev/datype';

// ✨ Perfect type inference - no manual typing needed
const config = deepMerge(
  { api: { timeout: 5000 }, features: ['auth'] },
  { api: { retries: 3 }, debug: true }
);
// Type: { api: { timeout: number; retries: number }; features: string[]; debug: boolean }

const users = [
  { name: 'Alice', role: 'admin', age: 32 },
  { name: 'Bob', role: 'user', age: 28 },
];

// Type-safe property selection
const publicData = pick(users[0], ['name', 'role']);
// Type: { name: string; role: string }

// Smart grouping with automatic type inference
const byRole = groupBy(users, 'role');
// Type: Record<string, { name: string; role: string; age: number }[]>
```

## Features

- 🎯 **TypeScript-first** - Pragmatic typing that prioritizes usability
- 📦 **Tree-shakable** - Optimal bundle size by design
- 🔒 **Immutable** - All operations return new objects/arrays
- ⚡ **Modern** - Built for ES2020+ environments
- 🛡️ **Zero dependencies** - No external dependencies
- 📊 **Lightweight** - ~5KB gzipped for the full library

## Installation

```bash
npm install @tienedev/datype
```

```bash
yarn add @tienedev/datype
```

```bash
pnpm add @tienedev/datype
```

## Quick Start

```typescript
import {
  deepMerge,
  pick,
  omit,
  get,
  set,
  debounce,
  throttle,
  isEmpty,
  isEqual,
  groupBy,
  mapValues,
  slugify,
} from '@tienedev/datype';

// 🏗️ Object manipulation
const merged = deepMerge(defaults, userConfig);
const subset = pick(user, ['id', 'name', 'email']);
const cleaned = omit(data, ['password', 'secret']);

// 🔍 Safe property access
const value = get(obj, 'nested.deep.property', 'default');
const updated = set(obj, 'nested.new.path', 'value');

// ⚡ Performance optimization
const debouncedSave = debounce(saveToAPI, 300);
const throttledScroll = throttle(onScroll, 16);

// ✅ Validation and comparison
if (isEmpty(formData.email)) {
  /* handle empty */
}
if (isEqual(prevState, newState)) {
  /* skip update */
}

// 📊 Data transformation
const grouped = groupBy(items, 'category');
const transformed = mapValues(obj, value => value.toString());
const slug = slugify('Hello World!'); // 'hello-world'
```

## API Reference

### Object Utilities

#### `deepMerge<T, U>(target: T, source: U, options?: DeepMergeOptions): DeepMergeResult<T, U>`

Deep merge objects with intelligent type inference and configurable array handling.

```typescript
const defaults = { api: { timeout: 5000 }, features: ['auth'] };
const config = { api: { retries: 3 }, features: ['logging'], debug: true };

// Merge with array concatenation (default)
const result = deepMerge(defaults, config);
// { api: { timeout: 5000, retries: 3 }, features: ['auth', 'logging'], debug: true }

// Merge with array replacement
const result2 = deepMerge(defaults, config, { arrayMerge: 'replace' });
// { api: { timeout: 5000, retries: 3 }, features: ['logging'], debug: true }
```

#### `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`

Extract specific properties with perfect type safety.

```typescript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
};
const safeUser = pick(user, ['id', 'name', 'email']);
// Type: { id: number; name: string; email: string }
```

#### `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`

Exclude specific properties with type safety.

```typescript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
};
const publicUser = omit(user, ['password']);
// Type: { id: number; name: string; email: string }
```

#### `get<T>(obj: T, path: string, defaultValue?: any): any`

Safe nested property access with dot notation.

```typescript
const data = { user: { profile: { name: 'Alice' } } };

get(data, 'user.profile.name'); // 'Alice'
get(data, 'user.profile.age', 25); // 25 (default)
get(data, 'nonexistent.path'); // undefined
```

#### `set<T>(obj: T, path: string, value: any): any`

Immutably set nested properties with flexible return typing.

```typescript
const obj = { a: { b: 1 } };
const updated = set(obj, 'a.c', 2);
// { a: { b: 1, c: 2 } }
// Original obj is unchanged
```

#### `mapValues<T, U>(obj: Record<string, T>, iteratee: (value: T, key: string) => U): Record<string, U>`

Transform all object values.

```typescript
const scores = { alice: '95', bob: '87', charlie: '92' };
const numeric = mapValues(scores, score => parseInt(score, 10));
// { alice: 95, bob: 87, charlie: 92 }
```

#### `mapKeys<T>(obj: Record<string, T>, iteratee: (key: string) => string): Record<string, T>`

Transform all object keys with built-in transformers.

```typescript
import { mapKeys, keyTransformers } from '@tienedev/datype';

const apiData = { user_name: 'Alice', user_email: 'alice@example.com' };
const camelCased = mapKeys(apiData, keyTransformers.camelCase);
// { userName: 'Alice', userEmail: 'alice@example.com' }

// Available transformers: camelCase, kebabCase, snakeCase, pascalCase, constantCase, dotCase
```

### Array Utilities

#### `chunk<T>(array: T[], size: number): T[][]`

Split array into chunks of specified size.

```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunked = chunk(numbers, 3);
// [[1, 2, 3], [4, 5, 6], [7, 8]]
```

#### `flatten(array: any[]): any[]` / `flattenDeep(array: any[]): any[]`

Flatten nested arrays.

```typescript
const nested = [1, [2, 3], [4, [5, 6]]];

flatten(nested); // [1, 2, 3, 4, [5, 6]]
flattenDeep(nested); // [1, 2, 3, 4, 5, 6]
```

#### `uniq<T>(array: T[]): T[]` / `uniqBy<T>(array: T[], iteratee: (item: T) => any): T[]`

Remove duplicates.

```typescript
const numbers = [1, 2, 2, 3, 3, 3];
uniq(numbers); // [1, 2, 3]

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
];
uniqBy(users, user => user.id); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### `compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[]`

Remove falsy values.

```typescript
const mixed = [1, null, 2, undefined, 3, false, 4, '', 5];
compact(mixed); // [1, 2, 3, 4, 5]
```

### Function Utilities

#### `debounce<T extends (...args: any[]) => any>(func: T, delay: number, options?: DebounceOptions): DebouncedFunction<T>`

Delay function execution until calls stop.

```typescript
const searchAPI = debounce(
  (query: string) => {
    console.log('Searching:', query);
  },
  300,
  {
    leading: false, // Don't execute on leading edge
    trailing: true, // Execute on trailing edge
    maxWait: 1000, // Force execution after 1s
  }
);

// Rapid calls - only last one executes
searchAPI('java');
searchAPI('javascript');
searchAPI('javascript tutorial'); // This will execute after 300ms

// Control methods
searchAPI.cancel(); // Cancel pending execution
searchAPI.flush(); // Execute immediately
```

#### `throttle<T extends (...args: any[]) => any>(func: T, delay: number, options?: ThrottleOptions): ThrottledFunction<T>`

Limit function execution frequency.

```typescript
const onScroll = throttle(
  () => {
    console.log('Scroll position:', window.scrollY);
  },
  100,
  {
    leading: true, // Execute immediately on first call
    trailing: true, // Execute once more after calls stop
  }
);

window.addEventListener('scroll', onScroll);
```

#### `once<T extends (...args: any[]) => any>(func: T): T`

Ensure function executes only once.

```typescript
const initialize = once(() => {
  console.log('App initialized');
  // expensive setup code
});

initialize(); // "App initialized"
initialize(); // Nothing happens
initialize(); // Nothing happens
```

### Advanced Function Utilities

#### `compose<T>(...functions: Function[]): (value: T) => any`

Compose functions right-to-left.

```typescript
const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const square = (x: number) => x * x;

const transform = compose(square, double, addOne);
transform(3); // square(double(addOne(3))) = square(8) = 64
```

#### `pipe<T>(...functions: Function[]): (value: T) => any`

Compose functions left-to-right.

```typescript
const transform = pipe(addOne, double, square);
transform(3); // square(double(addOne(3))) = 64
```

#### `curry<T extends (...args: any[]) => any>(func: T): T & ((...args: any[]) => any)`

Transform function to support flexible partial application with pragmatic typing.

```typescript
const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

// All equivalent:
curriedAdd(1, 2, 3); // 6
curriedAdd(1)(2, 3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2)(3); // 6

// Partial application
const add5 = curriedAdd(5);
add5(2, 3); // 10
```

### Validation Utilities

#### `isEmpty(value: any): boolean`

Check if value is empty.

```typescript
isEmpty([]); // true
isEmpty({}); // true
isEmpty(''); // true
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty(0); // false
isEmpty(false); // false
isEmpty([1]); // false
isEmpty({ a: 1 }); // false
```

#### `isEqual(a: any, b: any): boolean`

Deep equality comparison with circular reference support.

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

obj1 === obj2; // false
isEqual(obj1, obj2); // true

// Handles complex types
isEqual([1, 2, 3], [1, 2, 3]); // true
isEqual(new Date('2023-01-01'), new Date('2023-01-01')); // true
isEqual(/abc/g, /abc/g); // true
```

#### `cloneDeep<T>(value: T): T`

Create deep clone with circular reference protection.

```typescript
const original = {
  user: { name: 'Alice' },
  items: [1, 2, { nested: true }],
};

const clone = cloneDeep(original);
clone.user.name = 'Bob';
console.log(original.user.name); // 'Alice' (unchanged)
```

### String Utilities

#### `slugify(text: string, options?: SlugifyOptions): string`

Convert text to URL-friendly slug.

```typescript
slugify('Hello World!'); // 'hello-world'
slugify('Café & Crème'); // 'cafe-and-creme'
slugify('TypeScript is Awesome!', {
  separator: '_',
  maxLength: 20,
}); // 'typescript_is_awesome'
```

#### String Case Transformers

```typescript
import {
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  constantCase,
} from '@tienedev/datype';

camelCase('hello-world'); // 'helloWorld'
kebabCase('HelloWorld'); // 'hello-world'
snakeCase('helloWorld'); // 'hello_world'
pascalCase('hello-world'); // 'HelloWorld'
constantCase('helloWorld'); // 'HELLO_WORLD'
```

#### `capitalize(text: string): string`

Capitalize first letter of each word.

```typescript
capitalize('hello world'); // 'Hello World'
capitalize('HELLO WORLD'); // 'Hello World'
capitalize('hello-world'); // 'Hello-World'
```

#### Text Truncation

```typescript
import { truncate, truncateWords, truncateMiddle } from '@tienedev/datype';

truncate('This is a long text', 10); // 'This is a…'
truncateWords('One two three four five', 3); // 'One two three…'
truncateMiddle('very-long-filename.txt', 15); // 'very-lo…ame.txt'
```

### Data Organization

#### `groupBy<T>(array: T[], iteratee: string | ((item: T) => any)): Record<string, T[]>`

Group array elements.

```typescript
const users = [
  { name: 'Alice', role: 'admin', age: 30 },
  { name: 'Bob', role: 'user', age: 25 },
  { name: 'Charlie', role: 'admin', age: 35 },
];

// Group by property
const byRole = groupBy(users, 'role');
// { admin: [Alice, Charlie], user: [Bob] }

// Group by function
const byAgeGroup = groupBy(users, user =>
  user.age >= 30 ? 'senior' : 'junior'
);
// { senior: [Alice, Charlie], junior: [Bob] }
```

### Type Guards

```typescript
import { isPlainObject, isArray, isFunction } from '@tienedev/datype';

isPlainObject({}); // true
isPlainObject([]); // false
isPlainObject(new Date()); // false

isArray([]); // true
isArray('string'); // false

isFunction(() => {}); // true
isFunction('string'); // false
```

## Import Strategies

**datype** is optimized for tree-shaking. Choose the import style that fits your needs:

```typescript
// 1. Named imports (recommended for most projects)
import { deepMerge, pick, debounce } from '@tienedev/datype';

// 2. Individual imports (maximum tree-shaking)
import { deepMerge } from 'datype/deepMerge';

// 3. Wildcard import (when using many functions)
import * as dt from '@tienedev/datype';
const result = dt.deepMerge(obj1, obj2);
```

## TypeScript Configuration

**datype** uses pragmatic TypeScript types that prioritize developer experience. For optimal type inference, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

> **Philosophy**: We believe TypeScript should enhance productivity, not hinder it. Our types are designed to be permissive where needed while maintaining essential type safety.

## Bundle Size

**datype** is designed for optimal bundle size. Import only what you need:

| Import                          | Bundle Impact |
| ------------------------------- | ------------- |
| `import { pick }`               | ~200 bytes    |
| `import { deepMerge }`          | ~800 bytes    |
| `import { debounce, throttle }` | ~600 bytes    |
| Full library                    | ~5KB gzipped  |

## Browser Support

- **Modern browsers**: Chrome 80+, Firefox 72+, Safari 13+, Edge 80+
- **Node.js**: 14.0+
- **TypeScript**: 4.5+

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for:

- Development setup
- Code standards
- Testing requirements
- Pull request process

## License

[MIT](LICENSE) © [Etienne Brun](https://github.com/tienedev)

---

<div align="center">

**Built with ❤️ for the TypeScript community**

[Report Bug](https://github.com/tienedev/datype/issues) • [Request Feature](https://github.com/tienedev/datype/issues) • [Documentation](https://github.com/tienedev/datype)

</div>
