# Accessibility Features Documentation

## Overview

The theme customization system includes comprehensive accessibility features that comply with WCAG 2.1 Level AA standards. All features support keyboard navigation and screen readers.

## Implemented Features

### 1. High Contrast Mode

**Purpose**: Enhances visibility for users with visual impairments by ensuring a minimum 7:1 contrast ratio (WCAG AAA compliance).

**Features**:
- Black text on white background (light mode)
- White text on black background (dark mode)
- Enhanced borders (2px width)
- Stronger focus indicators (4px outline)
- Improved shadows for depth perception

**Activation**: Toggle the "High Contrast Mode" switch in the Accessibility Panel.

**CSS Implementation**: Applied via `[data-high-contrast="true"]` attribute on the root element.

### 2. Font Size Controls

**Purpose**: Allows users to adjust text size for better readability.

**Options**:
- Small (14px base)
- Medium (16px base) - Default
- Large (18px base)
- Extra Large (20px base)

**Features**:
- All text elements scale proportionally
- Headings, buttons, inputs, and body text all adjust
- Responsive scaling maintains layout integrity

**Activation**: Select desired size from the Font Size selector in the Accessibility Panel.

**CSS Implementation**: Applied via `[data-font-size]` attribute with responsive scaling for all text elements.

### 3. Reduced Motion

**Purpose**: Minimizes animations and transitions for users who experience discomfort from motion.

**Features**:
- Disables all animations
- Sets transition duration to 0.01ms
- Respects system `prefers-reduced-motion` preference
- Automatically detects and applies system preference

**Activation**: 
- Toggle the "Reduced Motion" switch in the Accessibility Panel
- Automatically enabled if system preference is set

**CSS Implementation**: Applied via `[data-reduced-motion="true"]` attribute.

### 4. Keyboard Navigation

**Purpose**: Ensures all theme controls are accessible without a mouse.

**Features**:
- All interactive elements are keyboard accessible
- Visible focus indicators (3px outline)
- Tab navigation through all settings
- Enter/Space key support for toggles and buttons
- Enhanced focus styles in high contrast mode (4px outline)

**Usage**:
- Press `Tab` to navigate between controls
- Press `Enter` or `Space` to activate buttons and toggles
- Press `Escape` to close the theme settings modal
- Use arrow keys in radio groups (color scheme picker)

**CSS Implementation**: Enhanced focus styles with `*:focus-visible` selectors.

### 5. Screen Reader Support

**Purpose**: Provides comprehensive information to screen reader users.

**Features**:
- ARIA labels on all interactive elements
- ARIA live regions for announcing changes
- Descriptive text alternatives for icons
- Role attributes for semantic structure
- Screen reader only text for additional context

**Announcements**:
- Theme mode changes: "Theme changed to [mode] mode"
- Color scheme changes: "Color scheme changed to [scheme]"
- Accessibility settings: "[Setting] enabled/disabled" or "Font size changed to [size]"

**Implementation**:
- `announceToScreenReader()` utility function
- ARIA live regions with `role="status"` and `aria-live="polite"`
- `.sr-only` CSS class for screen reader only content
- Comprehensive ARIA labels and descriptions

### 6. Additional Accessibility Features

**Focus Management**:
- Modal automatically focuses close button on open
- Focus trapped within modal when open
- Focus returns to trigger element on close

**Color Contrast Validation**:
- Custom color picker validates contrast ratios
- Warnings displayed for insufficient contrast
- WCAG AA (4.5:1) and AAA (7:1) compliance checking

**Semantic HTML**:
- Proper heading hierarchy
- Semantic landmarks (regions, status)
- Button elements for interactive controls
- Form labels associated with inputs

## Testing Recommendations

### Keyboard Navigation Testing
1. Navigate through all theme controls using only Tab key
2. Verify all interactive elements are reachable
3. Confirm focus indicators are clearly visible
4. Test activation with Enter and Space keys

### Screen Reader Testing
Recommended screen readers:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

Test scenarios:
1. Navigate through theme settings
2. Toggle theme mode and verify announcement
3. Select color scheme and verify announcement
4. Change accessibility settings and verify announcements
5. Verify all controls have descriptive labels

### High Contrast Testing
1. Enable high contrast mode
2. Verify all text is clearly readable
3. Check focus indicators are visible
4. Confirm borders and UI elements are distinct

### Reduced Motion Testing
1. Enable reduced motion
2. Verify animations are disabled
3. Test theme switching (should be instant)
4. Confirm smooth functionality without motion

## Browser Compatibility

All accessibility features are supported in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Graceful degradation for older browsers:
- CSS variables fallback to default theme
- Media queries fallback to light mode
- Focus styles use standard outline

## WCAG 2.1 Compliance

The theme system meets the following WCAG 2.1 criteria:

**Level A**:
- 1.1.1 Non-text Content (ARIA labels for icons)
- 2.1.1 Keyboard (Full keyboard accessibility)
- 2.4.7 Focus Visible (Enhanced focus indicators)
- 4.1.2 Name, Role, Value (ARIA attributes)

**Level AA**:
- 1.4.3 Contrast (Minimum 4.5:1 ratio)
- 1.4.11 Non-text Contrast (3:1 for UI components)
- 2.4.3 Focus Order (Logical tab order)

**Level AAA**:
- 1.4.6 Contrast (Enhanced 7:1 ratio in high contrast mode)
- 2.3.3 Animation from Interactions (Reduced motion support)

## Developer Guidelines

### Adding New Theme Controls

When adding new theme-related controls:

1. **Add ARIA labels**: Use `aria-label` or `aria-labelledby`
2. **Support keyboard**: Ensure Tab navigation and Enter/Space activation
3. **Announce changes**: Use `announceToScreenReader()` utility
4. **Test focus**: Verify focus indicators are visible
5. **Validate contrast**: Check color combinations meet WCAG standards

### Example Implementation

```jsx
import { announceToScreenReader } from '../../utils/a11yUtils';

const MyThemeControl = () => {
  const handleChange = (value) => {
    // Update theme
    updateTheme(value);
    
    // Announce to screen readers
    announceToScreenReader(`Setting changed to ${value}`, 'polite');
  };
  
  return (
    <button
      onClick={handleChange}
      aria-label="Descriptive label for screen readers"
      className="focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Control Label
    </button>
  );
};
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Keyboard Accessibility Guide](https://webaim.org/techniques/keyboard/)

## Support

For accessibility issues or questions, please refer to the main project documentation or contact the development team.
