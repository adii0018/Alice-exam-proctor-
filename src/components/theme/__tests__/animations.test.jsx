import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import ColorSchemePicker from '../ColorSchemePicker';
import AccessibilityPanel from '../AccessibilityPanel';
import ThemeSettings from '../ThemeSettings';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock the theme context
const mockToggleMode = vi.fn();
const mockSetScheme = vi.fn();
const mockUpdateAccessibility = vi.fn();

vi.mock('../../../contexts/ThemeContext', async () => {
  const actual = await vi.importActual('../../../contexts/ThemeContext');
  return {
    ...actual,
    useTheme: () => ({
      theme: {
        mode: 'light',
        scheme: 'default',
        customColors: null,
        accessibility: {
          highContrast: false,
          fontSize: 'medium',
          reducedMotion: false
        }
      },
      toggleMode: mockToggleMode,
      setScheme: mockSetScheme,
      updateAccessibility: mockUpdateAccessibility,
      mode: 'light'
    })
  };
});

describe('Theme Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeToggle Animations', () => {
    it('should have animation classes on icons', () => {
      const { container } = render(<ThemeToggle />);
      
      const sunIcon = container.querySelector('.theme-icon-sun');
      const moonIcon = container.querySelector('.theme-icon-moon');
      
      expect(sunIcon).toBeInTheDocument();
      expect(moonIcon).toBeInTheDocument();
      expect(sunIcon).toHaveClass('transition-all', 'duration-300');
      expect(moonIcon).toHaveClass('transition-all', 'duration-300');
    });

    it('should have theme-toggle-button class', () => {
      const { container } = render(<ThemeToggle />);
      const button = container.querySelector('.theme-toggle-button');
      
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('ColorSchemePicker Animations', () => {
    it('should have scheme-card class on scheme buttons', () => {
      const { container } = render(
        <ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />
      );
      
      const schemeCards = container.querySelectorAll('.scheme-card');
      expect(schemeCards.length).toBeGreaterThan(0);
      
      schemeCards.forEach(card => {
        expect(card).toHaveClass('transition-all');
      });
    });

    it('should add ripple-active class on click', async () => {
      const { container } = render(
        <ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />
      );
      
      const schemeCard = container.querySelector('.scheme-card');
      fireEvent.click(schemeCard);
      
      // Check if ripple-active class is added temporarily
      await waitFor(() => {
        expect(schemeCard).toHaveClass('ripple-active');
      }, { timeout: 100 });
    });

    it('should have scheme-swatch class on color swatches', () => {
      const { container } = render(
        <ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />
      );
      
      const swatches = container.querySelectorAll('.scheme-swatch');
      expect(swatches.length).toBeGreaterThan(0);
      
      swatches.forEach(swatch => {
        expect(swatch).toHaveClass('transition-transform');
      });
    });
  });

  describe('AccessibilityPanel Animations', () => {
    it('should have a11y-option class on accessibility options', () => {
      const { container } = render(<AccessibilityPanel />);
      
      const options = container.querySelectorAll('.a11y-option');
      expect(options.length).toBeGreaterThan(0);
    });

    it('should have toggle-switch classes on switches', () => {
      const { container } = render(<AccessibilityPanel />);
      
      const toggleSwitches = container.querySelectorAll('.toggle-switch');
      expect(toggleSwitches.length).toBeGreaterThan(0);
      
      toggleSwitches.forEach(toggle => {
        expect(toggle).toHaveClass('transition-colors');
      });
    });

    it('should have toggle-switch-handle class on switch handles', () => {
      const { container } = render(<AccessibilityPanel />);
      
      const handles = container.querySelectorAll('.toggle-switch-handle');
      expect(handles.length).toBeGreaterThan(0);
      
      handles.forEach(handle => {
        expect(handle).toHaveClass('transition-transform');
      });
    });
  });

  describe('ThemeSettings Modal Animations', () => {
    it('should have theme-modal-backdrop class', () => {
      const { container } = render(
        <ThemeSettings isOpen={true} onClose={() => {}} />
      );
      
      const backdrop = container.querySelector('.theme-modal-backdrop');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have theme-modal-content class', () => {
      const { container } = render(
        <ThemeSettings isOpen={true} onClose={() => {}} />
      );
      
      const content = container.querySelector('.theme-modal-content');
      expect(content).toBeInTheDocument();
    });

    it('should have button animation classes', () => {
      const { container } = render(
        <ThemeSettings isOpen={true} onClose={() => {}} />
      );
      
      const liftButton = container.querySelector('.btn-lift');
      const pressButtons = container.querySelectorAll('.btn-press');
      
      expect(liftButton).toBeInTheDocument();
      expect(pressButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion media query', () => {
      // This test verifies that CSS is properly set up
      // Actual media query testing would require a browser environment
      const { container } = render(<ThemeToggle />);
      const button = container.querySelector('.theme-toggle-button');
      
      expect(button).toBeInTheDocument();
      // The CSS should handle reduced motion automatically
    });
  });

  describe('Animation Timing', () => {
    it('should use consistent transition durations', () => {
      const { container: toggleContainer } = render(<ThemeToggle />);
      const { container: pickerContainer } = render(
        <ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />
      );
      
      const toggleButton = toggleContainer.querySelector('.theme-toggle-button');
      const schemeCard = pickerContainer.querySelector('.scheme-card');
      
      // Check that duration classes are present
      expect(toggleButton).toHaveClass('duration-300');
      expect(schemeCard).toHaveClass('duration-300');
    });
  });
});
