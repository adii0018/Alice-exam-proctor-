# Theme Components

This directory contains all theme-related components for the ETRIXX EXAM platform's theme customization system.

## Components

### ThemeSettings
The main modal component for comprehensive theme customization.

**Usage:**
```jsx
import { ThemeSettings } from '../components/theme';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Settings</button>
      <ThemeSettings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

**Features:**
- Dark/Light mode toggle
- Color scheme selection (Default, Ocean, Forest, Sunset)
- Accessibility controls (high contrast, font size, reduced motion)
- Live preview panel
- Keyboard navigation (Escape to close)
- Click outside to close
- Glassmorphism styling

### ThemeSettingsButton
A convenient button component that includes the ThemeSettings modal.

**Usage:**
```jsx
import { ThemeSettingsButton } from '../components/theme';

function MyComponent() {
  return <ThemeSettingsButton />;
}
```

### ThemeToggle
A simple toggle button for switching between light and dark modes.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `showLabel`: boolean (default: false)
- `className`: string (optional)

**Usage:**
```jsx
import { ThemeToggle } from '../components/theme';

function MyComponent() {
  return <ThemeToggle size="lg" showLabel />;
}
```

### ThemePreview
A live preview component showing how the current theme looks.

**Usage:**
```jsx
import { ThemePreview } from '../components/theme';

function MyComponent() {
  return <ThemePreview />;
}
```

**Features:**
- Real-time updates as theme changes
- Sample UI elements (buttons, cards, forms)
- Color palette display
- Alert/message previews

### ColorSchemePicker
A grid of color scheme cards for selecting predefined themes.

**Props:**
- `currentScheme`: string (current scheme ID)
- `onSchemeChange`: function (callback when scheme changes)

**Usage:**
```jsx
import { ColorSchemePicker } from '../components/theme';
import { useTheme } from '../../hooks/useTheme';

function MyComponent() {
  const { theme, setScheme } = useTheme();
  
  return (
    <ColorSchemePicker
      currentScheme={theme.scheme}
      onSchemeChange={setScheme}
    />
  );
}
```

### AccessibilityPanel
Controls for accessibility features.

**Usage:**
```jsx
import { AccessibilityPanel } from '../components/theme';

function MyComponent() {
  return <AccessibilityPanel />;
}
```

**Features:**
- High contrast mode toggle
- Font size selector (Small, Medium, Large, Extra Large)
- Reduced motion toggle
- Clear labels and descriptions

## Theme Context

All components use the `useTheme` hook to access theme state and methods.

**Available Methods:**
```javascript
const {
  theme,              // Current theme object
  mode,               // 'light' | 'dark'
  scheme,             // Current color scheme ID
  systemPreference,   // System theme preference
  toggleMode,         // Toggle between light/dark
  setMode,            // Set specific mode
  setScheme,          // Set color scheme
  setCustomColors,    // Set custom colors
  updateAccessibility,// Update accessibility settings
  resetTheme,         // Reset to default
  syncTheme           // Sync to backend (placeholder)
} = useTheme();
```

## Testing

A demo page is available at `src/pages/ThemeDemo.jsx` to test all theme features.

To add it to your routes:
```jsx
import ThemeDemo from './pages/ThemeDemo';

<Route path="/theme-demo" element={<ThemeDemo />} />
```

## Keyboard Accessibility

All components support keyboard navigation:
- **Tab**: Navigate between controls
- **Enter/Space**: Activate buttons and toggles
- **Escape**: Close modal (ThemeSettings)
- All interactive elements have visible focus indicators

## Screen Reader Support

- All components include proper ARIA labels
- Theme changes are announced via aria-live regions
- Icons have text alternatives
- Semantic HTML structure

## Responsive Design

All components are fully responsive:
- Mobile: Single column layout
- Tablet: Optimized spacing
- Desktop: Multi-column layout with preview panel

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- CSS variables required (all modern browsers)
