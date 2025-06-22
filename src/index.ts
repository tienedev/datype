/**
 * datype - TypeScript-native utility library with perfect type inference
 * @module
 */

// Core utilities
export { deepMerge } from './deepMerge/index';
export { pick } from './pick/index';
export { omit } from './omit/index';
export { get } from './get/index';
export { set } from './set/index';
export { mapValues } from './mapValues/index';
export { mapKeys, keyTransformers } from './mapKeys/index';

// Validation and comparison
export { isEmpty } from './isEmpty/index';
export { isEqual } from './isEqual/index';
export { cloneDeep } from './cloneDeep/index';

// Array utilities
export { chunk } from './chunk/index';
export { flatten, flattenDeep, flattenDepth } from './flatten/index';
export { uniq, uniqBy, uniqByProperty } from './uniq/index';
export { compact, compactBy, compactWith } from './compact/index';

// Function utilities
export { debounce } from './debounce/index';
export { throttle } from './throttle/index';
export { once } from './once/index';

// String utilities
export { slugify } from './slugify/index';

// Data organization
export { groupBy } from './groupBy/index';

// Advanced utilities
export { merge } from './merge/index';
export { compose, pipe } from './compose/index';
export { curry } from './curry/index';
export { capitalize } from './capitalize/index';
export { camelCase, kebabCase, snakeCase, pascalCase, constantCase, dotCase } from './caseTransforms/index';
export { truncate, truncateWords, truncateMiddle } from './truncate/index';
export { isPlainObject, isArray, isFunction } from './typeGuards/index';

// Type exports
export type { DeepMergeResult, MergeableObject } from './deepMerge/index';
export type { DeepMergeOptions } from './deepMerge/index';
export type { DebounceOptions, DebouncedFunction } from './debounce/index';
export type { ThrottleOptions, ThrottledFunction } from './throttle/index';
export type { SlugifyOptions } from './slugify/index';
export type { GroupByIterator, GroupByResult } from './groupBy/index';