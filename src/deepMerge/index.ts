// Type definitions
export type IsPlainObject<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
    ? T extends readonly unknown[]
      ? false
      : T extends (...args: never[]) => unknown
        ? false
        : T extends Date
          ? false
          : T extends RegExp
            ? false
            : true
    : false;

export type DeepMergeResult<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? IsPlainObject<T[K]> extends true
        ? IsPlainObject<U[K]> extends true
          ? DeepMergeResult<T[K], U[K]>
          : U[K]
        : T[K] extends readonly unknown[]
          ? U[K] extends readonly unknown[]
            ? [...T[K], ...U[K]]
            : U[K]
          : U[K]
      : T[K]
    : K extends keyof U
      ? U[K]
      : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeableObject = Record<string, any>;

function isPlainObject(obj: unknown): obj is MergeableObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  if (Array.isArray(obj)) {
    return false;
  }

  if (obj instanceof Date || obj instanceof RegExp) {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
}

export interface DeepMergeOptions {
  arrayMergeStrategy?: 'concat' | 'replace';
  maxDepth?: number;
}

const DEFAULT_OPTIONS: Required<DeepMergeOptions> = {
  arrayMergeStrategy: 'concat',
  maxDepth: 50,
};
function mergeInternal<T extends MergeableObject>(
  target: T,
  sources: MergeableObject[],
  options: Required<DeepMergeOptions>,
  depth = 0,
  seen = new WeakSet()
): T {
  if (depth > options.maxDepth) {
    throw new Error(`Maximum merge depth (${options.maxDepth}) exceeded`);
  }

  if (seen.has(target)) {
    return target;
  }
  seen.add(target);

  const result = { ...target };

  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[key] =
          options.arrayMergeStrategy === 'concat'
            ? [...targetValue, ...sourceValue]
            : sourceValue;
      } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[key] = mergeInternal(
          targetValue,
          [sourceValue],
          options,
          depth + 1,
          seen
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[key] = sourceValue;
      }
    }
  }

  seen.delete(target);
  return result;
}

/**
 * Deeply merges properties from multiple source objects into a target object.
 * Nested objects are merged recursively. Arrays are concatenated by default.
 *
 * @template T - The type of the initial target object
 * @param target - The target object to merge properties into (will not be mutated)
 * @param sources - One or more source objects whose properties will be merged
 * @returns A new object resulting from the merge, ensuring immutability
 *
 * @example
 * ```typescript
 * import { deepMerge } from 'modash';
 *
 * const config = deepMerge(
 *   { api: { url: '/api', timeout: 5000 }, features: ['auth'] },
 *   { api: { timeout: 10000 }, features: ['dashboard'] }
 * );
 * // Result: { api: { url: '/api', timeout: 10000 }, features: ['auth', 'dashboard'] }
 * ```
 */
export function deepMerge<T extends MergeableObject>(target: T): T;
export function deepMerge<T extends MergeableObject, U extends MergeableObject>(
  target: T,
  source: U
): DeepMergeResult<T, U>;
export function deepMerge<
  T extends MergeableObject,
  U extends MergeableObject,
  V extends MergeableObject,
>(target: T, source1: U, source2: V): DeepMergeResult<DeepMergeResult<T, U>, V>;

export function deepMerge<T extends MergeableObject>(
  target: T,
  options: DeepMergeOptions
): T;
export function deepMerge<T extends MergeableObject, U extends MergeableObject>(
  target: T,
  source: U,
  options: DeepMergeOptions
): DeepMergeResult<T, U>;
export function deepMerge<T extends MergeableObject>(
  target: T,
  ...sourcesAndOptions: Array<MergeableObject | DeepMergeOptions>
): T;
export function deepMerge<T extends MergeableObject>(
  target: T,
  ...sourcesAndOptions: Array<MergeableObject | DeepMergeOptions>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!isPlainObject(target)) {
    throw new TypeError('Target must be a plain object');
  }

  if (sourcesAndOptions.length === 0) {
    return { ...target };
  }

  let options: DeepMergeOptions = {};
  let sources: MergeableObject[] = [];

  const lastArg = sourcesAndOptions[sourcesAndOptions.length - 1];
  if (
    lastArg &&
    typeof lastArg === 'object' &&
    ('arrayMergeStrategy' in lastArg || 'maxDepth' in lastArg)
  ) {
    options = lastArg as DeepMergeOptions;
    sources = sourcesAndOptions.slice(0, -1) as MergeableObject[];
  } else {
    sources = sourcesAndOptions as MergeableObject[];
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  return mergeInternal(target, sources, mergedOptions);
}
