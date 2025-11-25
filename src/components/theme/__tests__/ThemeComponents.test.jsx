/**
 * Component tests for theme components
 * Tests rendering, interaction, and accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import ColorSchemePicker from '../ColorSchemePicker';
import CustomColorPicker from '../CustomColorPicker';
import AccessibilityPanel from '../AccessibilityPanel';

// Mock theme context
const mockToggleMode = vi.fn();
const mockSetScheme = vi.fn();
const mockSetCustomColors = vi.fn();
const mockUpdateAccessibility = vi.fn();

const mockTheme = {
  mode: 'light',
  scheme: 'default',
  customColors: null,
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false
  }
};

vi.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    mode: mockTheme.mode,
    toggleMode: mockToggleMode
  })
}));

vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: mockTheme,
    mode: mockTheme.mode,
    setScheme: mockSetScheme,
    setCustomColors: mockSetCustomColors,
    updateAccessibility: mockUpdateAccessibility
  })
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show correct aria-label for light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should call toggleMode when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggleMode).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard Enter key', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockToggleMode).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard Space key', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });
    expect(mockToggleMode).toHaveBeenCalledTimes(1);
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<ThemeToggle size="sm" />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('w-8', 'h-8');

    rerender(<ThemeToggle size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('w-12', 'h-12');
  });

  it('should show label when showLabel is true', () => {
    render(<ThemeToggle showLabel={true} />);
    expect(screen.getByText('Light')).toBeInTheDocument();
  });
});

describe('ColorSchemePicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render color scheme options', () => {
    render(<ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />);
    expect(screen.getByText('Color Schemes')).toBeInTheDocument();
  });

  it('should display all available schemes', () => {
    render(<ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
    expect(screen.getByText('Forest')).toBeInTheDocument();
    expect(screen.getByText('Sunset')).toBeInTheDocument();
  });

  it('should mark current scheme as selected', () => {
    render(<ColorSchemePicker currentScheme="ocean" onSchemeChange={mockSetScheme} />);
    const oceanButton = screen.getByRole('radio', { name: /ocean/i });
    expect(oceanButton).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onSchemeChange when scheme is clicked', () => {
    render(<ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />);
    const oceanButton = screen.getByRole('radio', { name: /ocean/i });
    fireEvent.click(oceanButton);
    expect(mockSetScheme).toHaveBeenCalledWith('ocean');
  });

  it('should have proper ARIA attributes', () => {
    render(<ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />);
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'color-scheme-heading');
  });

  it('should show color swatches for each scheme', () => {
    const { container } = render(
      <ColorSchemePicker currentScheme="default" onSchemeChange={mockSetScheme} />
    );
    const swatches = container.querySelectorAll('.scheme-swatch');
    expect(swatches.length).toBeGreaterThan(0);
  });
});

describe('CustomColorPicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render custom color picker', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Custom Colors')).toBeInTheDocument();
  });

  it('should display color input fields', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Accent')).toBeInTheDocument();
  });

  it('should show contrast validation section', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText(/Contrast Validation/i)).toBeInTheDocument();
  });

  it('should have export button', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Export Theme')).toBeInTheDocument();
  });

  it('should have import button', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Import Theme')).toBeInTheDocument();
  });

  it('should have apply button', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Apply Custom Colors')).toBeInTheDocument();
  });

  it('should have reset button', () => {
    render(<CustomColorPicker />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should call setCustomColors when apply is clicked', () => {
    render(<CustomColorPicker />);
    const applyButton = screen.getByText('Apply Custom Colors');
    fireEvent.click(applyButton);
    expect(mockSetCustomColors).toHaveBeenCalled();
  });
});

describe('AccessibilityPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render accessibility options', () => {
    render(<AccessibilityPanel />);
    expect(screen.getByText('High Contrast Mode')).toBeInTheDocument();
    expect(screen.getByText('Font Size')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });

  it('should render high contrast toggle', () => {
    render(<AccessibilityPanel />);
    const toggle = screen.getByRole('switch', { name: /high contrast/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('should call updateAccessibility when high contrast is toggled', () => {
    render(<AccessibilityPanel />);
    const toggle = screen.getByRole('switch', { name: /high contrast/i });
    fireEvent.click(toggle);
    expect(mockUpdateAccessibility).toHaveBeenCalledWith({ highContrast: true });
  });

  it('should render font size options', () => {
    render(<AccessibilityPanel />);
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('Extra Large')).toBeInTheDocument();
  });

  it('should call updateAccessibility when font size is changed', () => {
    render(<AccessibilityPanel />);
    const largeButton = screen.getByRole('button', { name: /Set font size to Large/i });
    fireEvent.click(largeButton);
    expect(mockUpdateAccessibility).toHaveBeenCalledWith({ fontSize: 'large' });
  });

  it('should render reduced motion toggle', () => {
    render(<AccessibilityPanel />);
    const toggle = screen.getByRole('switch', { name: /reduced motion/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('should call updateAccessibility when reduced motion is toggled', () => {
    render(<AccessibilityPanel />);
    const toggle = screen.getByRole('switch', { name: /reduced motion/i });
    fireEvent.click(toggle);
    expect(mockUpdateAccessibility).toHaveBeenCalledWith({ reducedMotion: true });
  });

  it('should have proper ARIA live region for announcements', () => {
    const { container } = render(<AccessibilityPanel />);
    const liveRegion = container.querySelector('[role="status"][aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('should mark current font size as selected', () => {
    render(<AccessibilityPanel />);
    const mediumButton = screen.getByRole('button', { name: /Set font size to Medium/i });
    expect(mediumButton).toHaveAttribute('aria-pressed', 'true');
  });
});
