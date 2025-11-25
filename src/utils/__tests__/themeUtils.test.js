/**
 * Unit tests for theme utilities
 * Tests theme persistence, validation, and application functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  DEFAULT_THEME,
  saveThemeToStorage,
  loadThemeFromStorage,
  clearThemeFromStorage,
  applyThemeToDocument,
  getSystemThemePreference,
  getSystemReducedMotionPreference,
  mergeWithDefaults,
  isValidTheme
} from '../themeUtils';

describe('Theme Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-scheme');
    document.documentElement.removeAttribute('data-high-contrast');
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Theme Persistence', () => {
    describe('saveThemeToStorage', () => {
      it('should save theme to localStorage', () => {
        const theme = { ...DEFAULT_THEME, mode: 'dark' };
        saveThemeToStorage(theme);
        
        const saved = localStorage.getItem('etrixx_theme');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved)).toEqual(theme);
      });

      it('should handle localStorage errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Storage full');
        });
        
        expect(() => saveThemeToStorage(DEFAULT_THEME)).not.toThrow();
        expect(consoleSpy).toHaveBeenCalled();
      });
    });

    describe('loadThemeFromStorage', () => {
      it('should load theme from localStorage', () => {
        const theme = { ...DEFAULT_THEME, mode: 'dark' };
        localStorage.setItem('etrixx_theme', JSON.stringify(theme));
        
        const loaded = loadThemeFromStorage();
        expect(loaded).toEqual(theme);
      });

      it('should return null if no theme is saved', () => {
        const loaded = loadThemeFromStorage();
        expect(loaded).toBeNull();
      });

      it('should handle invalid JSON gracefully', () => {
        localStorage.setItem('etrixx_theme', 'invalid json');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
        
        const loaded = loadThemeFromStorage();
        expect(loaded).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
      });
    });

    describe('clearThemeFromStorage', () => {
      it('should remove theme from localStorage', () => {
        localStorage.setItem('etrixx_theme', JSON.stringify(DEFAULT_THEME));
        clearThemeFromStorage();
        
        expect(localStorage.getItem('etrixx_theme')).toBeNull();
      });

      it('should handle errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
          throw new Error('Storage error');
        });
        
        expect(() => clearThemeFromStorage()).not.toThrow();
        expect(consoleSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Theme Application', () => {
    describe('applyThemeToDocument', () => {
      it('should apply theme mode to document', () => {
        const theme = { ...DEFAULT_THEME, mode: 'dark' };
        applyThemeToDocument(theme);
        
        // Wait for requestAnimationFrame
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
            resolve();
          });
        });
      });

      it('should apply color scheme to document', () => {
        const theme = { ...DEFAULT_THEME, scheme: 'ocean' };
        applyThemeToDocument(theme);
        
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-scheme')).toBe('ocean');
            resolve();
          });
        });
      });

      it('should apply accessibility settings', () => {
        const theme = {
          ...DEFAULT_THEME,
          accessibility: {
            highContrast: true,
            fontSize: 'large',
            reducedMotion: true
          }
        };
        applyThemeToDocument(theme);
        
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
            expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
            expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
            resolve();
          });
        });
      });
    });
  });

  describe('System Preferences', () => {
    describe('getSystemThemePreference', () => {
      it('should detect dark mode preference', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
          }))
        });
        
        expect(getSystemThemePreference()).toBe('dark');
      });

      it('should detect light mode preference', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
          }))
        });
        
        expect(getSystemThemePreference()).toBe('light');
      });
    });

    describe('getSystemReducedMotionPreference', () => {
      it('should detect reduced motion preference', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
          }))
        });
        
        expect(getSystemReducedMotionPreference()).toBe(true);
      });

      it('should return false when no preference', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
          }))
        });
        
        expect(getSystemReducedMotionPreference()).toBe(false);
      });
    });
  });

  describe('Theme Validation', () => {
    describe('isValidTheme', () => {
      it('should validate correct theme', () => {
        expect(isValidTheme(DEFAULT_THEME)).toBe(true);
      });

      it('should validate theme with dark mode', () => {
        const theme = { ...DEFAULT_THEME, mode: 'dark' };
        expect(isValidTheme(theme)).toBe(true);
      });

      it('should validate theme with different scheme', () => {
        const theme = { ...DEFAULT_THEME, scheme: 'ocean' };
        expect(isValidTheme(theme)).toBe(true);
      });

      it('should reject invalid mode', () => {
        const theme = { ...DEFAULT_THEME, mode: 'invalid' };
        expect(isValidTheme(theme)).toBe(false);
      });

      it('should reject invalid scheme', () => {
        const theme = { ...DEFAULT_THEME, scheme: 'invalid' };
        expect(isValidTheme(theme)).toBe(false);
      });

      it('should reject invalid font size', () => {
        const theme = {
          ...DEFAULT_THEME,
          accessibility: { ...DEFAULT_THEME.accessibility, fontSize: 'invalid' }
        };
        expect(isValidTheme(theme)).toBe(false);
      });

      it('should reject non-object theme', () => {
        expect(isValidTheme(null)).toBe(false);
        expect(isValidTheme('string')).toBe(false);
        expect(isValidTheme(123)).toBe(false);
      });
    });

    describe('mergeWithDefaults', () => {
      it('should merge partial theme with defaults', () => {
        const partial = { mode: 'dark' };
        const merged = mergeWithDefaults(partial);
        
        expect(merged.mode).toBe('dark');
        expect(merged.scheme).toBe(DEFAULT_THEME.scheme);
        expect(merged.accessibility).toEqual(DEFAULT_THEME.accessibility);
      });

      it('should merge partial accessibility settings', () => {
        const partial = {
          mode: 'light',
          accessibility: { highContrast: true }
        };
        const merged = mergeWithDefaults(partial);
        
        expect(merged.accessibility.highContrast).toBe(true);
        expect(merged.accessibility.fontSize).toBe(DEFAULT_THEME.accessibility.fontSize);
        expect(merged.accessibility.reducedMotion).toBe(DEFAULT_THEME.accessibility.reducedMotion);
      });

      it('should handle empty theme object', () => {
        const merged = mergeWithDefaults({});
        expect(merged).toEqual(DEFAULT_THEME);
      });
    });
  });
});
