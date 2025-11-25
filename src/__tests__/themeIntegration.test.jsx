/**
 * Integration tests for theme system
 * Tests theme persistence, system preference detection, backend sync, and theme application
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';
import ColorSchemePicker from '../components/theme/ColorSchemePicker';
import AccessibilityPanel from '../components/theme/AccessibilityPanel';
import * as themeService from '../services/themeService';

// Mock the theme service
vi.mock('../services/themeService', () => ({
  syncThemeToBackend: vi.fn().mockResolvedValue({ success: true }),
  getSyncStatus: vi.fn().mockReturnValue({
    inProgress: false,
    retryCount: 0,
    maxRetries: 3
  }),
  loadThemeFromBackend: vi.fn().mockResolvedValue(null),
  mergeThemeWithLocal: vi.fn((backend, local) => backend || local)
}));

// Mock performance utils
vi.mock('../utils/performanceUtils', () => ({
  batchRAF: (fn) => fn,
  themePerformanceMonitor: {
    start: vi.fn(),
    end: vi.fn()
  }
}));

// Mock a11y utils
vi.mock('../utils/a11yUtils', () => ({
  announceThemeModeChange: vi.fn(),
  announceColorSchemeChange: vi.fn(),
  announceAccessibilityChange: vi.fn(),
  getColorSchemeDescription: vi.fn((id) => `${id} color scheme`)
}));

describe('Theme Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-scheme');
    document.documentElement.removeAttribute('data-high-contrast');
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.removeAttribute('data-reduced-motion');
    
    // Clear all mocks
    vi.clearAllMocks();
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Theme Persistence Flow', () => {
    it('should save theme to localStorage when changed', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const saved = localStorage.getItem('etrixx_theme');
        expect(saved).toBeTruthy();
        const theme = JSON.parse(saved);
        expect(theme.mode).toBe('dark');
      });
    });

    it('should load theme from localStorage on mount', () => {
      const savedTheme = {
        mode: 'dark',
        scheme: 'ocean',
        customColors: null,
        accessibility: {
          highContrast: false,
          fontSize: 'medium',
          reducedMotion: false
        }
      };
      
      localStorage.setItem('etrixx_theme', JSON.stringify(savedTheme));

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should persist color scheme changes', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ColorSchemePicker currentScheme="default" onSchemeChange={() => {}} />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const oceanButton = screen.getByRole('radio', { name: /ocean/i });
      fireEvent.click(oceanButton);

      await waitFor(() => {
        const saved = localStorage.getItem('etrixx_theme');
        const theme = JSON.parse(saved);
        expect(theme.scheme).toBe('ocean');
      });
    });

    it('should persist accessibility settings', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <AccessibilityPanel />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const highContrastToggle = screen.getByRole('switch', { name: /high contrast/i });
      fireEvent.click(highContrastToggle);

      await waitFor(() => {
        const saved = localStorage.getItem('etrixx_theme');
        const theme = JSON.parse(saved);
        expect(theme.accessibility.highContrast).toBe(true);
      });
    });
  });

  describe('System Preference Detection', () => {
    it('should detect dark mode system preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn()
        }))
      });

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should detect light mode system preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn()
        }))
      });

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

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

      const TestComponent = () => (
        <ThemeProvider>
          <AccessibilityPanel />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const reducedMotionToggle = screen.getByRole('switch', { name: /reduced motion/i });
      expect(reducedMotionToggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should listen for system preference changes', async () => {
      let mediaQueryListener;
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          addEventListener: vi.fn((event, handler) => {
            if (query === '(prefers-color-scheme: dark)') {
              mediaQueryListener = handler;
            }
          }),
          removeEventListener: vi.fn()
        }))
      });

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      // Simulate system preference change
      if (mediaQueryListener) {
        act(() => {
          mediaQueryListener({ matches: true });
        });
      }

      await waitFor(() => {
        const saved = localStorage.getItem('etrixx_theme');
        if (saved) {
          const theme = JSON.parse(saved);
          expect(theme.mode).toBe('dark');
        }
      });
    });
  });

  describe('Backend Sync', () => {
    it('should sync theme to backend when changed', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(themeService.syncThemeToBackend).toHaveBeenCalled();
      });
    });

    it('should handle sync failures gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
      themeService.syncThemeToBackend.mockRejectedValueOnce(new Error('Network error'));

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Theme sync error:', expect.any(Error));
      });
    });

    it('should load theme from backend on mount when authenticated', async () => {
      localStorage.setItem('token', 'fake-token');
      
      const backendTheme = {
        mode: 'dark',
        scheme: 'ocean',
        customColors: null,
        accessibility: {
          highContrast: true,
          fontSize: 'large',
          reducedMotion: false
        }
      };
      
      themeService.loadThemeFromBackend.mockResolvedValueOnce(backendTheme);

      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      // Theme should be applied from backend
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });
  });

  describe('Theme Application to Components', () => {
    it('should apply theme mode to document', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
            resolve();
          });
        });
      });
    });

    it('should apply color scheme to document', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ColorSchemePicker currentScheme="default" onSchemeChange={() => {}} />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const oceanButton = screen.getByRole('radio', { name: /ocean/i });
      fireEvent.click(oceanButton);

      await waitFor(() => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-scheme')).toBe('ocean');
            resolve();
          });
        });
      });
    });

    it('should apply accessibility settings to document', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <AccessibilityPanel />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const highContrastToggle = screen.getByRole('switch', { name: /high contrast/i });
      fireEvent.click(highContrastToggle);

      await waitFor(() => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
            resolve();
          });
        });
      });
    });

    it('should apply font size to document', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <AccessibilityPanel />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const largeButton = screen.getByRole('button', { name: /Set font size to Large/i });
      fireEvent.click(largeButton);

      await waitFor(() => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
            resolve();
          });
        });
      });
    });

    it('should apply reduced motion to document', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <AccessibilityPanel />
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      const reducedMotionToggle = screen.getByRole('switch', { name: /reduced motion/i });
      fireEvent.click(reducedMotionToggle);

      await waitFor(() => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
            resolve();
          });
        });
      });
    });
  });

  describe('Complete Theme Flow', () => {
    it('should handle complete theme customization flow', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <div>
            <ThemeToggle />
            <ColorSchemePicker currentScheme="default" onSchemeChange={() => {}} />
            <AccessibilityPanel />
          </div>
        </ThemeProvider>
      );

      render(<TestComponent />);
      
      // Toggle to dark mode
      const toggleButton = screen.getByRole('button', { name: /Switch to dark mode/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(localStorage.getItem('etrixx_theme')).toBeTruthy();
      });

      // Change color scheme
      const oceanButton = screen.getByRole('radio', { name: /ocean/i });
      fireEvent.click(oceanButton);

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('etrixx_theme'));
        expect(saved.scheme).toBe('ocean');
      });

      // Enable high contrast
      const highContrastToggle = screen.getByRole('switch', { name: /high contrast/i });
      fireEvent.click(highContrastToggle);

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('etrixx_theme'));
        expect(saved.accessibility.highContrast).toBe(true);
      });

      // Change font size
      const largeButton = screen.getByRole('button', { name: /Set font size to Large/i });
      fireEvent.click(largeButton);

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('etrixx_theme'));
        expect(saved.accessibility.fontSize).toBe('large');
      });

      // Verify all settings are persisted
      const finalTheme = JSON.parse(localStorage.getItem('etrixx_theme'));
      expect(finalTheme).toMatchObject({
        mode: 'dark',
        scheme: 'ocean',
        accessibility: {
          highContrast: true,
          fontSize: 'large'
        }
      });

      // Verify backend sync was called
      expect(themeService.syncThemeToBackend).toHaveBeenCalled();
    });
  });
});
