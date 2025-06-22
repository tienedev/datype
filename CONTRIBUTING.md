# Contributing to datype

We welcome contributions to make datype even better! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/datype.git
   cd datype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to verify setup**
   ```bash
   npm test
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── functionName/
│   ├── index.ts          # Main implementation
│   └── functionName.test.ts # Comprehensive tests
├── categories/           # Barrel exports by category
│   ├── objects.ts
│   ├── performance.ts
│   ├── strings.ts
│   └── validation.ts
├── utils/
│   └── types.ts         # Shared TypeScript types
└── index.ts            # Main entry point
```

## Development Guidelines

### Code Style

- **TypeScript-first**: Everything must have perfect type inference
- **Immutability**: All functions return new objects/arrays
- **Performance**: Optimize for common cases, handle edge cases
- **Zero dependencies**: No external dependencies allowed
- **ES2020+**: Use modern JavaScript features

### Function Implementation Checklist

When adding a new function:

1. **Create the function directory**: `src/functionName/`
2. **Implement with TypeScript excellence**:
   - Advanced type inference
   - JSDoc documentation with examples
   - Input validation and error handling
   - Circular reference protection (if applicable)
   - Performance optimization

3. **Write comprehensive tests**:
   - All happy paths
   - Edge cases and error conditions
   - Real-world use cases
   - TypeScript type testing
   - Aim for 95%+ coverage

4. **Update exports**:
   - Add to `src/index.ts`
   - Add to appropriate category in `src/categories/`
   - Export types if applicable

5. **Documentation**:
   - Update README.md with function description
   - Add usage examples
   - Update CLAUDE.md for future AI assistance

### TypeScript Standards

```typescript
// ✅ Good: Advanced type inference
export function pick<T, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  // Implementation with perfect types
}

// ❌ Bad: Manual typing required
export function pick(obj: any, keys: string[]): any {
  // Poor TypeScript experience
}
```

### Testing Standards

```typescript
// ✅ Comprehensive test structure
describe('functionName', () => {
  describe('basic functionality', () => {
    it('should handle common use case', () => {
      // Test implementation
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined input', () => {
      // Edge case testing
    });
  });

  describe('real-world use cases', () => {
    it('should work with API responses', () => {
      // Real usage scenarios
    });
  });
});
```

## Contribution Process

### 1. Choose What to Work On

- Check existing issues for bugs or feature requests
- Look at `FUNCTIONS_ROADMAP.md` for planned utilities
- Propose new utilities via GitHub issues first

### 2. Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/function-name
   ```

2. **Implement your changes**
   - Follow the guidelines above
   - Run tests frequently: `npm test`
   - Check TypeScript: `npm run typecheck`

3. **Ensure quality**
   ```bash
   npm run quality  # Runs lint, typecheck, format-check, test
   ```

4. **Build and verify**
   ```bash
   npm run build
   ```

### 3. Submitting Changes

1. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add mapKeys function with case conversion helpers"
   git commit -m "fix: handle edge case in deepMerge circular references"
   git commit -m "docs: update README with advanced examples"
   ```

2. **Push and create PR**
   ```bash
   git push origin feature/function-name
   ```

3. **Create Pull Request**
   - Describe what you've implemented
   - Include examples of usage
   - Reference any related issues
   - Ensure CI passes

## Code Review Process

All contributions go through code review:

1. **Automated checks**: CI runs tests, linting, type checking
2. **Manual review**: Maintainers review code quality, design, tests
3. **Feedback**: Address any requested changes
4. **Merge**: Once approved, changes are merged

## What We Look For

### ✅ Great Contributions

- **Perfect TypeScript**: Advanced type inference, no `any` types
- **Comprehensive tests**: Edge cases, real-world scenarios, 95%+ coverage
- **Performance optimized**: Fast paths, circular reference protection
- **Well documented**: Clear JSDoc, examples, usage patterns
- **Follows patterns**: Consistent with existing codebase

### ❌ Needs Improvement

- Manual typing required (poor TypeScript experience)
- Missing edge case tests
- Performance not considered
- Breaking existing patterns
- Missing documentation

## Priority Functions

Current high-priority functions to implement:

1. **Array utilities**: `chunk`, `flatten`, `uniq`, `compact`
2. **String utilities**: `capitalize`, `camelCase`, `kebabCase`
3. **Type utilities**: `isPlainObject`, `isArray`, `isFunction`
4. **Advanced utilities**: `pipe`, `compose`, `curry`, `once`

See `FUNCTIONS_ROADMAP.md` for complete list and details.

## Getting Help

- **Questions**: Open a GitHub issue with "question" label
- **Bugs**: Open a GitHub issue with bug report template
- **Feature requests**: Open a GitHub issue with feature template
- **Documentation**: Submit PR for any unclear documentation

## Performance Considerations

- **Benchmark critical functions**: Compare vs lodash/ramda when applicable
- **Tree-shaking**: Ensure functions can be imported individually
- **Bundle size**: Keep individual functions small and focused
- **Memory usage**: Consider memory allocation patterns

## Release Process

Releases follow semantic versioning:

- **Patch**: Bug fixes, performance improvements
- **Minor**: New functions, non-breaking feature additions  
- **Major**: Breaking changes (rare, avoid when possible)

## Community

- Be respectful and constructive in discussions
- Help others in issues and PRs
- Share ideas for improvements
- Celebrate great contributions

Thank you for contributing to datype! 🚀