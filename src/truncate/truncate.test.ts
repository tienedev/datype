import { describe, it, expect } from 'vitest';
import { truncate, truncateWords, truncateMiddle } from './index';

describe('truncate', () => {
  describe('basic functionality', () => {
    it('should truncate strings longer than the limit', () => {
      expect(truncate('Hello world, this is a long string', 20)).toBe(
        'Hello world, this...'
      );
      expect(truncate('This is a test', 10)).toBe('This is...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should use default length of 30', () => {
      const longString = 'This is a very long string that should be truncated';
      expect(truncate(longString)).toBe('This is a very long string ...');
    });

    it('should use default omission of "..."', () => {
      expect(truncate('Hello world, this is a long string', 20)).toBe(
        'Hello world, this...'
      );
    });

    it('should handle custom omission strings', () => {
      expect(truncate('Hello world, this is a long string', 20, '…')).toBe(
        'Hello world, this i…'
      );
      expect(
        truncate('Hello world, this is a long string', 20, ' [more]')
      ).toBe('Hello world,  [more]');
      expect(truncate('Hello world, this is a long string', 20, '')).toBe(
        'Hello world, this is'
      );
    });

    it('should not truncate strings shorter than or equal to limit', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
      expect(truncate('Exactly 20 chars!!!!', 20)).toBe('Exactly 20 chars!!!!');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate('', 0)).toBe('');
    });

    it('should handle zero length', () => {
      expect(truncate('Hello world', 0)).toBe('');
      expect(truncate('Hello world', 0, 'x')).toBe('');
    });

    it('should handle omission longer than limit', () => {
      expect(truncate('Hello world', 5, '...........')).toBe('.....');
      expect(truncate('Hello world', 3, 'TRUNCATED')).toBe('TRU');
    });

    it('should handle omission equal to limit', () => {
      expect(truncate('Hello world', 3, '...')).toBe('...');
      expect(truncate('Hello world', 5, 'SHORT')).toBe('SHORT');
    });

    it('should handle very short limits', () => {
      expect(truncate('Hello world', 1)).toBe('.');
      expect(truncate('Hello world', 2)).toBe('..');
      expect(truncate('Hello world', 3)).toBe('...');
    });

    it('should handle single character strings', () => {
      expect(truncate('H', 5)).toBe('H');
      expect(truncate('H', 1)).toBe('H');
      expect(truncate('H', 0)).toBe('');
    });

    it('should handle multi-byte unicode characters', () => {
      expect(truncate('Café résumé naïve', 10)).toBe('Café ré...');
    });

    it('should handle whitespace-only strings', () => {
      expect(truncate('   ', 2)).toBe('..');
      expect(truncate('   ', 5)).toBe('   ');
      expect(truncate('\t\n\r', 2)).toBe('..');
    });
  });

  describe('error handling', () => {
    it('should throw for non-string input', () => {
      expect(() => truncate(null as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => truncate(undefined as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => truncate(123 as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => truncate([] as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
    });

    it('should throw for invalid length', () => {
      expect(() => truncate('test', -1)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncate('test', 1.5)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncate('test', NaN)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncate('test', Infinity)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncate('test', 'invalid' as any)).toThrow(
        'Expected length to be a non-negative integer'
      );
    });

    it('should throw for non-string omission', () => {
      expect(() => truncate('test', 10, null as any)).toThrow(
        'Expected omission to be a string'
      );
      expect(() => truncate('test', 10, 123 as any)).toThrow(
        'Expected omission to be a string'
      );
      expect(() => truncate('test', 10, [] as any)).toThrow(
        'Expected omission to be a string'
      );
    });
  });

  describe('real-world use cases', () => {
    it('should handle article titles', () => {
      const title =
        'Understanding Advanced TypeScript Utility Types and Their Practical Applications';
      expect(truncate(title, 50)).toBe(
        'Understanding Advanced TypeScript Utility Types...'
      );
      expect(truncate(title, 30)).toBe('Understanding Advanced Type...');
    });

    it('should handle product descriptions', () => {
      const description =
        'This is a premium product with advanced features and excellent quality that will meet all your needs';
      expect(truncate(description, 60, '... read more')).toBe(
        'This is a premium product with advanced feature... read more'
      );
    });

    it('should handle user comments', () => {
      const comment =
        'I really love this product! It has exceeded all my expectations and I would definitely recommend it to others.';
      expect(truncate(comment, 40)).toBe(
        'I really love this product! It has ex...'
      );
    });

    it('should handle file names', () => {
      const fileName = 'very_long_file_name_with_important_information.pdf';
      expect(truncate(fileName, 25)).toBe('very_long_file_name_wi...');
    });

    it('should handle breadcrumbs', () => {
      const breadcrumb = 'Home > Category > Subcategory > Product Name';
      expect(truncate(breadcrumb, 30)).toBe('Home > Category > Subcatego...');
    });
  });
});

describe('truncateWords', () => {
  describe('basic functionality', () => {
    it('should truncate at word boundaries', () => {
      expect(truncateWords('Hello world this is a test', 15)).toBe(
        'Hello world...'
      );
      expect(truncateWords('The quick brown fox jumps', 20)).toBe(
        'The quick brown...'
      );
    });

    it('should prefer word boundaries over character truncation', () => {
      // Regular truncate would cut in middle of word
      expect(truncate('Hello world this is a test', 15)).toBe(
        'Hello world ...'
      );
      // Word truncate keeps words whole
      expect(truncateWords('Hello world this is a test', 15)).toBe(
        'Hello world...'
      );
    });

    it('should handle strings with no spaces in limit', () => {
      // Falls back to character truncation when no word boundary found
      expect(truncateWords('Hello world', 5)).toBe('He...');
      expect(truncateWords('Supercalifragilisticexpialidocious', 15)).toBe(
        'Supercalifra...'
      );
    });

    it('should not truncate strings shorter than limit', () => {
      expect(truncateWords('Short text', 20)).toBe('Short text');
      expect(truncateWords('Hello world', 11)).toBe('Hello world');
    });
  });

  describe('edge cases', () => {
    it('should handle single long words', () => {
      expect(truncateWords('Antidisestablishmentarianism', 15)).toBe(
        'Antidisestab...'
      );
    });

    it('should handle multiple spaces', () => {
      expect(truncateWords('Hello   world   test', 15)).toBe('Hello  ...');
    });

    it('should handle leading/trailing spaces', () => {
      expect(truncateWords(' Hello world test ', 15)).toBe(' Hello...');
      expect(truncateWords('Hello world test   ', 15)).toBe('Hello world...');
    });

    it('should handle strings with only spaces', () => {
      expect(truncateWords('     ', 3)).toBe('...');
    });

    it('should handle empty strings', () => {
      expect(truncateWords('', 10)).toBe('');
    });
  });

  describe('custom omission', () => {
    it('should work with custom omission strings', () => {
      expect(truncateWords('Hello world this is a test', 15, '…')).toBe(
        'Hello world…'
      );
      expect(truncateWords('Hello world this is a test', 20, ' [more]')).toBe(
        'Hello world [more]'
      );
    });

    it('should handle empty omission', () => {
      expect(truncateWords('Hello world this is a test', 15, '')).toBe(
        'Hello world'
      );
    });
  });

  describe('error handling', () => {
    it('should throw for invalid inputs', () => {
      expect(() => truncateWords(null as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => truncateWords('test', -1)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncateWords('test', 10, null as any)).toThrow(
        'Expected omission to be a string'
      );
    });
  });

  describe('real-world use cases', () => {
    it('should handle article excerpts', () => {
      const article =
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt';
      expect(truncateWords(article, 40)).toBe('Lorem ipsum dolor sit amet...');
    });

    it('should handle news headlines', () => {
      const headline =
        'Breaking News Alert Major Development in Technology Sector Surprises Market Analysts';
      expect(truncateWords(headline, 50)).toBe(
        'Breaking News Alert Major Development in...'
      );
    });

    it('should handle product titles', () => {
      const title =
        'Premium Quality Wireless Bluetooth Headphones with Noise Cancellation Technology';
      expect(truncateWords(title, 45)).toBe(
        'Premium Quality Wireless Bluetooth...'
      );
    });
  });
});

describe('truncateMiddle', () => {
  describe('basic functionality', () => {
    it('should truncate in the middle keeping start and end', () => {
      expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', 15)).toBe(
        'abcdef...uvwxyz'
      );
      expect(truncateMiddle('Hello world this is a test', 20)).toBe(
        'Hello wor...s a test'
      );
    });

    it('should handle even and odd content lengths', () => {
      // Even content length: 12 chars for content, 6 start + 6 end
      expect(truncateMiddle('abcdefghijklmnopqr', 15)).toBe('abcdef...mnopqr');
      // Odd content length: 11 chars for content, 6 start + 5 end
      expect(truncateMiddle('abcdefghijklmnopqr', 14)).toBe('abcdef...nopqr');
    });

    it('should not truncate strings shorter than limit', () => {
      expect(truncateMiddle('Short text', 20)).toBe('Short text');
      expect(truncateMiddle('Exactly 15 chars!!', 19)).toBe(
        'Exactly 15 chars!!'
      );
    });

    it('should handle custom omission', () => {
      expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', 15, '…')).toBe(
        'abcdefg…tuvwxyz'
      );
      expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', 20, '[...]')).toBe(
        'abcdefgh[...]tuvwxyz'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle very short limits', () => {
      expect(truncateMiddle('Hello world', 3)).toBe('...');
      expect(truncateMiddle('Hello world', 4)).toBe('H...');
      expect(truncateMiddle('Hello world', 5)).toBe('H...d');
    });

    it('should handle omission longer than limit', () => {
      expect(truncateMiddle('Hello world', 5, '.........')).toBe('.....');
      expect(truncateMiddle('Hello world', 3, 'TRUNCATED')).toBe('TRU');
    });

    it('should handle empty strings', () => {
      expect(truncateMiddle('', 10)).toBe('');
      expect(truncateMiddle('', 0)).toBe('');
    });

    it('should handle zero length', () => {
      expect(truncateMiddle('Hello world', 0)).toBe('');
    });

    it('should handle single character strings', () => {
      expect(truncateMiddle('H', 5)).toBe('H');
      expect(truncateMiddle('H', 1)).toBe('H');
      expect(truncateMiddle('H', 0)).toBe('');
    });

    it('should handle equal start and end content', () => {
      expect(truncateMiddle('abcdefg', 6)).toBe('ab...g');
      expect(truncateMiddle('abcdef', 6)).toBe('abcdef');
    });
  });

  describe('error handling', () => {
    it('should throw for invalid inputs', () => {
      expect(() => truncateMiddle(null as any, 10)).toThrow(
        'Expected first argument to be a string'
      );
      expect(() => truncateMiddle('test', -1)).toThrow(
        'Expected length to be a non-negative integer'
      );
      expect(() => truncateMiddle('test', 10, null as any)).toThrow(
        'Expected omission to be a string'
      );
    });
  });

  describe('real-world use cases', () => {
    it('should handle file paths', () => {
      const path = '/very/long/path/to/some/important/file.txt';
      expect(truncateMiddle(path, 25)).toBe('/very/long/...nt/file.txt');

      const windowsPath =
        'C:\\Users\\Username\\Documents\\Projects\\MyProject\\src\\components\\Button.tsx';
      expect(truncateMiddle(windowsPath, 40)).toBe(
        'C:\\Users\\Username\\D...ponents\\Button.tsx'
      );
    });

    it('should handle URLs', () => {
      const url = 'https://www.example.com/very/long/path/to/page.html';
      expect(truncateMiddle(url, 35)).toBe(
        'https://www.exam...ath/to/page.html'
      );

      const longUrl =
        'https://api.service.com/v1/users/12345/profile/settings/notifications';
      expect(truncateMiddle(longUrl, 45)).toBe(
        'https://api.service.c...ettings/notifications'
      );
    });

    it('should handle email addresses', () => {
      const email = 'verylongemailaddress@verylongdomainname.com';
      expect(truncateMiddle(email, 25)).toBe('verylongema...ainname.com');

      const complexEmail =
        'user.with.very.long.name@company.organization.domain.com';
      expect(truncateMiddle(complexEmail, 35)).toBe(
        'user.with.very.l...ation.domain.com'
      );
    });

    it('should handle database connection strings', () => {
      const connectionString =
        'postgresql://username:password@localhost:5432/very_long_database_name';
      expect(truncateMiddle(connectionString, 45)).toBe(
        'postgresql://username...ry_long_database_name'
      );
    });

    it('should handle git commit hashes', () => {
      const commitHash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
      expect(truncateMiddle(commitHash, 15)).toBe('a1b2c3...r8s9t0');
    });

    it('should handle long identifiers', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(truncateMiddle(uuid, 20)).toBe('550e8400-...55440000');

      const longId = 'user_profile_settings_notification_preferences_id_12345';
      expect(truncateMiddle(longId, 30)).toBe('user_profile_s...nces_id_12345');
    });
  });

  describe('mathematical edge cases', () => {
    it('should handle odd total content lengths correctly', () => {
      // 13 total length, 3 for omission = 10 content
      // 10 content = 5 start + 5 end
      expect(truncateMiddle('abcdefghijklmnop', 13)).toBe('abcde...lmnop');
    });

    it('should handle even total content lengths correctly', () => {
      // 14 total length, 3 for omission = 11 content
      // 11 content = 6 start + 5 end (ceil for start)
      expect(truncateMiddle('abcdefghijklmnop', 14)).toBe('abcdef...lmnop');
    });

    it('should prioritize start when splitting odd content', () => {
      // Content length 9: start gets 5, end gets 4
      expect(truncateMiddle('abcdefghijklmnop', 12)).toBe('abcde...mnop');
    });
  });
});
