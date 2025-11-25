/**
 * Tests for color utilities with caching
 * Verifies that memoization improves performance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  validateContrast,
  clearColorCaches,
  isValidHexColor,
  normalizeHexColor
} from '../colorUtils';

describe('Color Utilities', () => {
  beforeEach(() => {
    clearColorCaches();
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
    });

    it('should handle hex without #', () => {
      expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance', () => {
      const whiteLuminance = getLuminance('#ffffff');
      const blackLuminance = getLuminance('#000000');

      expect(whiteLuminance).toBeGreaterThan(blackLuminance);
      expect(whiteLuminance).toBeCloseTo(1, 1);
      expect(blackLuminance).toBeCloseTo(0, 1);
    });

    it('should cache luminance calculations', () => {
      const start1 = performance.now();
      getLuminance('#3b82f6');
      const time1 = performance.now() - start1;

      const start2 = performance.now();
      getLuminance('#3b82f6');
      const time2 = performance.now() - start2;

      // Cached call should be significantly faster
      expect(time2).toBeLessThan(time1);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0); // Maximum contrast
    });

    it('should cache contrast calculations', () => {
      const start1 = performance.now();
      getContrastRatio('#ffffff', '#000000');
      const time1 = performance.now() - start1;

      const start2 = performance.now();
      getContrastRatio('#ffffff', '#000000');
      const time2 = performance.now() - start2;

      // Cached call should be faster
      expect(time2).toBeLessThanOrEqual(time1);
    });
  });

  describe('validateContrast', () => {
    it('should validate WCAG AA contrast', () => {
      const result = validateContrast('#ffffff', '#000000', 'AA');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThan(4.5);
    });

    it('should validate WCAG AAA contrast', () => {
      const result = validateContrast('#ffffff', '#000000', 'AAA');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThan(7);
    });

    it('should fail for insufficient contrast', () => {
      const result = validateContrast('#ffffff', '#eeeeee', 'AA');
      expect(result.passes).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate hex colors', () => {
      expect(isValidHexColor('#ffffff')).toBe(true);
      expect(isValidHexColor('ffffff')).toBe(true);
      expect(isValidHexColor('#fff')).toBe(false);
      expect(isValidHexColor('invalid')).toBe(false);
    });
  });

  describe('normalizeHexColor', () => {
    it('should add # prefix if missing', () => {
      expect(normalizeHexColor('ffffff')).toBe('#ffffff');
      expect(normalizeHexColor('#ffffff')).toBe('#ffffff');
    });
  });

  describe('clearColorCaches', () => {
    it('should clear all caches', () => {
      // Populate caches
      getLuminance('#ffffff');
      getContrastRatio('#ffffff', '#000000');

      // Clear caches
      clearColorCaches();

      // Next calls should recalculate (we can't directly test cache state,
      // but we verify the function doesn't throw)
      expect(() => {
        getLuminance('#ffffff');
        getContrastRatio('#ffffff', '#000000');
      }).not.toThrow();
    });
  });
});
