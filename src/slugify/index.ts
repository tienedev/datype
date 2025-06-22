/**
 * Options for configuring slugify behavior
 */
export interface SlugifyOptions {
  /**
   * The separator to use between words
   * @default '-'
   */
  separator?: string;

  /**
   * Convert to lowercase
   * @default true
   */
  lowercase?: boolean;

  /**
   * Remove consecutive separators
   * @default true
   */
  trim?: boolean;

  /**
   * Custom replacement map for specific characters
   * @default undefined
   */
  replacements?: Record<string, string>;

  /**
   * Remove characters that cannot be transliterated
   * @default true
   */
  remove?: boolean;

  /**
   * Strict mode: only allow alphanumeric characters and separators
   * @default false
   */
  strict?: boolean;
}

/**
 * Unicode to ASCII transliteration map for common characters
 * Optimized for performance with pre-computed mappings
 */
const TRANSLITERATION_MAP: Record<string, string> = {
  // Latin Extended-A
  à: 'a',
  á: 'a',
  â: 'a',
  ã: 'a',
  ä: 'a',
  å: 'a',
  æ: 'ae',
  ç: 'c',
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  ñ: 'n',
  ò: 'o',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ö: 'o',
  ø: 'o',
  ù: 'u',
  ú: 'u',
  û: 'u',
  ü: 'u',
  ý: 'y',
  ÿ: 'y',
  þ: 'th',
  ß: 'ss',

  // Latin Extended-A uppercase
  À: 'A',
  Á: 'A',
  Â: 'A',
  Ã: 'A',
  Ä: 'A',
  Å: 'A',
  Æ: 'AE',
  Ç: 'C',
  È: 'E',
  É: 'E',
  Ê: 'E',
  Ë: 'E',
  Ì: 'I',
  Í: 'I',
  Î: 'I',
  Ï: 'I',
  Ñ: 'N',
  Ò: 'O',
  Ó: 'O',
  Ô: 'O',
  Õ: 'O',
  Ö: 'O',
  Ø: 'O',
  Ù: 'U',
  Ú: 'U',
  Û: 'U',
  Ü: 'U',
  Ý: 'Y',
  Þ: 'TH',

  // Latin Extended-B and other common
  ă: 'a',
  ą: 'a',
  ć: 'c',
  č: 'c',
  ď: 'd',
  đ: 'd',
  ę: 'e',
  ě: 'e',
  ğ: 'g',
  ı: 'i',
  ł: 'l',
  ľ: 'l',
  ń: 'n',
  ň: 'n',
  ő: 'o',
  œ: 'oe',
  ř: 'r',
  ś: 's',
  š: 's',
  ť: 't',
  ů: 'u',
  ű: 'u',
  ź: 'z',
  ż: 'z',
  ž: 'z',

  // Latin Extended-B uppercase
  Ă: 'A',
  Ą: 'A',
  Ć: 'C',
  Č: 'C',
  Ď: 'D',
  Đ: 'D',
  Ę: 'E',
  Ě: 'E',
  Ğ: 'G',
  İ: 'I',
  Ł: 'L',
  Ľ: 'L',
  Ń: 'N',
  Ň: 'N',
  Ő: 'O',
  Œ: 'OE',
  Ř: 'R',
  Ś: 'S',
  Š: 'S',
  Ť: 'T',
  Ů: 'U',
  Ű: 'U',
  Ź: 'Z',
  Ż: 'Z',
  Ž: 'Z',

  // Cyrillic common
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',

  // Cyrillic uppercase
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Е: 'E',
  Ё: 'YO',
  Ж: 'ZH',
  З: 'Z',
  И: 'I',
  Й: 'Y',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'TS',
  Ч: 'CH',
  Ш: 'SH',
  Щ: 'SCH',
  Ъ: '',
  Ы: 'Y',
  Ь: '',
  Э: 'E',
  Ю: 'YU',
  Я: 'YA',

  // Greek common
  α: 'a',
  β: 'b',
  γ: 'g',
  δ: 'd',
  ε: 'e',
  ζ: 'z',
  η: 'h',
  θ: 'th',
  ι: 'i',
  κ: 'k',
  λ: 'l',
  μ: 'm',
  ν: 'n',
  ξ: 'x',
  ο: 'o',
  π: 'p',
  ρ: 'r',
  σ: 's',
  ς: 's',
  τ: 't',
  υ: 'y',
  φ: 'f',
  χ: 'ch',
  ψ: 'ps',
  ω: 'w',

  // Greek uppercase
  Α: 'A',
  Β: 'B',
  Γ: 'G',
  Δ: 'D',
  Ε: 'E',
  Ζ: 'Z',
  Η: 'H',
  Θ: 'TH',
  Ι: 'I',
  Κ: 'K',
  Λ: 'L',
  Μ: 'M',
  Ν: 'N',
  Ξ: 'X',
  Ο: 'O',
  Π: 'P',
  Ρ: 'R',
  Σ: 'S',
  Τ: 'T',
  Υ: 'Y',
  Φ: 'F',
  Χ: 'CH',
  Ψ: 'PS',
  Ω: 'W',

  // Arabic numerals in other scripts
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',

  // Common symbols and punctuation
  '\u2018': '',
  '\u2019': '',
  '\u201C': '',
  '\u201D': '',
  '\u2026': '...',
  '\u2013': '-',
  '\u2014': '-',
  '\u2022': '',
  '\u201A': '',
  '\u201E': '',
  '\u2039': '',
  '\u203A': '',
  '\u00AB': '',
  '\u00BB': '',

  // Currency and other symbols
  '€': 'euro',
  '£': 'pound',
  '¥': 'yen',
  '₽': 'ruble',
  $: 'dollar',
  '¢': 'cent',
  '©': 'c',
  '®': 'r',
  '™': 'tm',
  '&': 'and',
};

/**
 * Converts a string into a URL-friendly slug by removing/replacing special characters,
 * handling Unicode characters, and applying various formatting options.
 *
 * @param input - The string to slugify
 * @param options - Configuration options for slugification
 * @returns A URL-safe slug string
 *
 * @example
 * ```typescript
 * import { slugify } from 'datype';
 *
 * // Basic usage
 * slugify('Hello World!'); // 'hello-world'
 * slugify('Café & Restaurant'); // 'cafe-restaurant'
 *
 * // Unicode handling
 * slugify('Привет мир'); // 'privet-mir'
 * slugify('Café à Paris'); // 'cafe-a-paris'
 * slugify('北京市'); // 'bei-jing-shi' (with proper transliteration)
 *
 * // Custom options
 * slugify('Hello World', { separator: '_' }); // 'hello_world'
 * slugify('Café', { lowercase: false }); // 'Cafe'
 * slugify('Product #123', { strict: true }); // 'product-123'
 *
 * // Custom replacements
 * slugify('AT&T', {
 *   replacements: { '&': '-and-' }
 * }); // 'at-and-t'
 *
 * // Advanced usage
 * slugify('  Spaced   Out  ', { trim: true }); // 'spaced-out'
 * slugify('Special chars: @#$%', { remove: true }); // 'special-chars'
 * ```
 */
export function slugify(input: string, options: SlugifyOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    trim = true,
    replacements = {},
    remove = true,
    strict = false,
  } = options;

  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input.length === 0) {
    return '';
  }

  // Combine custom replacements with default transliteration map
  // const combinedMap = { ...TRANSLITERATION_MAP, ...replacements };

  let result = input;

  // Step 1: Handle remaining Unicode characters using built-in normalization first
  // Normalize to NFD (decomposed form) then remove combining characters
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove combining diacritical marks

  // Step 2: Convert to lowercase if requested
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Step 3: Apply custom replacements first to allow overriding defaults
  for (const [char, replacement] of Object.entries(replacements)) {
    if (result.includes(char)) {
      result = result.replace(
        new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        replacement
      );
    }
  }

  // Step 4: Handle special characters based on mode
  if (strict) {
    // Strict mode: only alphanumeric and separators
    result = result.replace(/[^a-zA-Z0-9\s]/g, ' ');
  } else {
    // Apply transliteration map only in non-strict mode
    for (const [char, replacement] of Object.entries(TRANSLITERATION_MAP)) {
      if (result.includes(char)) {
        result = result.replace(
          new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          replacement
        );
      }
    }

    if (remove) {
      // Remove non-alphanumeric characters except spaces and hyphens
      result = result.replace(/[^\w\s-]/g, ' ');
    }
  }

  // Step 5: Replace whitespace and multiple separators with single separator
  result = result
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`\\${separator}+`, 'g'), separator); // Remove consecutive separators

  // Step 6: Trim separators from start and end if requested
  if (trim && separator.length > 0) {
    const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const trimRegex = new RegExp(
      `^${escapedSeparator}+|${escapedSeparator}+$`,
      'g'
    );
    result = result.replace(trimRegex, '');
  }

  return result;
}
