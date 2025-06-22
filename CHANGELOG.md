# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release preparation

## [0.1.0] - 2025-06-21

### Added

- 🎯 **Object Utilities**

  - `deepMerge` - Deep merge objects with perfect TypeScript inference
  - `pick` - Extract specific properties from objects
  - `omit` - Exclude specific properties from objects
  - `mapKeys` - Transform object keys with custom functions
  - `mapValues` - Transform object values with custom functions
  - `cloneDeep` - Create deep clones with circular reference protection
  - `get` - Safely access nested object properties
  - `set` - Safely set nested object properties
  - `groupBy` - Group array elements by a key function

- 🔍 **Validation Utilities**

  - `isEmpty` - Check if values are empty (null, undefined, empty arrays/objects)
  - `isEqual` - Deep equality comparison with NaN/±0 handling

- 🎭 **String Utilities**

  - `slugify` - Convert strings to URL-friendly slugs

- ⚡ **Performance Utilities**
  - `debounce` - Delay function execution with leading/trailing options
  - `throttle` - Limit function execution frequency

### Features

- 🌳 **Perfect tree-shaking** - Import only what you need
- 🎯 **Advanced TypeScript** - Perfect type inference and safety
- 🔒 **Immutable by design** - All functions return new objects
- 🛡️ **Circular reference protection** - Safe handling of complex objects
- ⚡ **High performance** - Optimized algorithms and early returns
- 📦 **Multiple export formats** - ESM, CJS, and individual function imports
- 🧪 **Comprehensive testing** - 96%+ test coverage
- 📚 **Full documentation** - JSDoc comments and usage examples

### Technical Details

- TypeScript 5+ support
- Node.js 18+ required
- Zero dependencies
- ESM-first with CJS fallback
- Strict TypeScript configuration
- Comprehensive test suite with Vitest
- Automated CI/CD with GitHub Actions

[Unreleased]: https://github.com/tienedev/datype/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tienedev/datype/releases/tag/v0.1.0
