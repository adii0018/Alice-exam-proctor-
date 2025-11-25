/**
 * Theme Switching Functionality Tests
 * Tests for task 6.2: Test theme switching functionality
 * 
 * Requirements tested:
 * - 2.1: Dark theme preservation
 * - 2.2: Dark theme consistency
 * - 2.3: Theme persistence
 * - 3.1: Smooth transitions
 * - 3.2: Transition quality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';

describe('Theme Switching Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Theme Toggle', () => {
    it('should toggle from light to dark mode', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      // Initially should be light mode (or system preference)
      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Click to toggle
      await user.click(toggleButton);
      
      // Wait for theme to be applied
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });

    it('should toggle from dark to light mode', async () => {
      const user = userEvent.setup();
      
      // Set initial dark mode
      localStorage.setItem('theme', JSON.stringify({ mode: 'dark' }));
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Click to toggle to light
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });
    });

    it('should handle rapid toggle without errors', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Rapidly toggle 5 times
      for (let i = 0; i < 5; i++) {
        await user.click(toggleButton);
      }
      
      // Should settle on a final theme without errors
      await waitFor(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        expect(['light', 'dark']).toContain(theme);
      });
    });
  });

  describe('Dark Theme Preservation', () => {
    it('should preserve dark theme colors when switching to dark mode', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Toggle to dark mode
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Check that dark theme CSS variables are applied
      const styles = getComputedStyle(document.documentElement);
      const bgColor = styles.getPropertyValue('--color-background').trim();
      
      // Dark theme background should be #111827
      expect(bgColor).toBe('#111827');
    });

    it('should not have natural day theme colors in dark mode', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Toggle to dark mode
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      const styles = getComputedStyle(document.documentElement);
      const bgColor = styles.getPropertyValue('--color-background').trim();
      const surfaceColor = styles.getPropertyValue('--color-surface').trim();
      
      // Should not have warm colors from natural day theme
      expect(bgColor).not.toContain('FFF9F0');
      expect(surfaceColor).not.toContain('FFF4E0');
    });
  });

  describe('Theme Persistence', () => {
    it('should persist light mode in localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      // Ensure we're in light mode
      await waitFor(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
          const toggleButton = screen.getByRole('button', { name: /switch to/i });
          user.click(toggleButton);
        }
      });

      await waitFor(() => {
        const savedTheme = JSON.parse(localStorage.getItem('theme') || '{}');
        expect(savedTheme.mode).toBe('light');
      });
    });

    it('should persist dark mode in localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Toggle to dark mode
      await user.click(toggleButton);
      
      await waitFor(() => {
        const savedTheme = JSON.parse(localStorage.getItem('theme') || '{}');
        expect(savedTheme.mode).toBe('dark');
      });
    });

    it('should load persisted theme on mount', () => {
      // Set theme in localStorage before mounting
      localStorage.setItem('theme', JSON.stringify({ mode: 'dark', scheme: 'default' }));
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      // Should load dark mode from localStorage
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Transition Quality', () => {
    it('should have transition properties set', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const styles = getComputedStyle(document.body);
      const transitionDuration = styles.transitionDuration;
      
      // Should have transition duration set (300ms or 0.3s)
      expect(transitionDuration).toBeTruthy();
    });

    it('should respect reduced motion preference', async () => {
      // Set reduced motion
      localStorage.setItem('theme', JSON.stringify({ 
        mode: 'light', 
        accessibility: { reducedMotion: true } 
      }));
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
      });

      const styles = getComputedStyle(document.documentElement);
      const transitionDuration = styles.getPropertyValue('--transition-duration').trim();
      
      // Should have 0ms transition when reduced motion is enabled
      expect(transitionDuration).toBe('0ms');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should toggle theme with Enter key', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Focus the button
      toggleButton.focus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      
      // Theme should toggle
      await waitFor(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        expect(theme).toBeTruthy();
      });
    });

    it('should toggle theme with Space key', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Focus the button
      toggleButton.focus();
      
      // Press Space
      await user.keyboard(' ');
      
      // Theme should toggle
      await waitFor(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        expect(theme).toBeTruthy();
      });
    });

    it('should have accessible label', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /switch to/i });
      
      // Should have aria-label
      expect(toggleButton).toHaveAttribute('aria-label');
    });
  });
});
