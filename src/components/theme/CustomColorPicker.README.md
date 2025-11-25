# CustomColorPicker Component

A comprehensive color customization component that allows users to create and manage custom color themes with real-time contrast validation and import/export functionality.

## Features

### 1. Color Input Fields
- **Native color picker**: Visual color selection for all theme colors
- **Hex input**: Manual hex color entry with validation
- **Organized groups**: Colors grouped by category (Brand, Background, Text, UI)
- **Real-time validation**: Instant feedback on invalid hex values

### 2. Contrast Validation (WCAG AA)
- **Automatic calculation**: Real-time contrast ratio calculation
- **Visual indicators**: Green checkmark for passing, yellow warning for failing
- **Multiple combinations**: Validates text/background, text/surface, and button contrasts
- **Accessibility warning**: Alert when contrast ratios don't meet WCAG AA standards (4.5:1)

### 3. Color Persistence
- **Auto-save**: Custom colors automatically saved to localStorage
- **Theme state**: Integrated with ThemeContext for app-wide application
- **Scheme switching**: Easy switching between custom and predefined schemes
- **Current status**: Visual indicator when using custom colors

### 4. Export/Import Functionality
- **Export**: Download custom theme as JSON file
- **Import**: Upload and apply theme JSON files
- **Validation**: Comprehensive validation of imported theme structure
- **Error handling**: User-friendly error messages for invalid imports

### 5. Additional Features
- **Load from scheme**: Quick-load colors from predefined schemes as starting point
- **Reset**: One-click reset to default colors
- **Responsive**: Works on desktop and mobile devices
- **Keyboard accessible**: Full keyboard navigation support

## Usage

### Basic Usage

```jsx
import CustomColorPicker from './components/theme/CustomColorPicker';

function MyComponent() {
  return (
    <CustomColorPicker 
      onClose={() => console.log('Picker closed')} 
    />
  );
}
```

### In ThemeSettings Modal

The CustomColorPicker is integrated into the ThemeSettings modal and can be toggled with the "Custom Colors" button:

```jsx
import ThemeSettings from './components/theme/ThemeSettings';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Theme Settings</button>
      <ThemeSettings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

## Color Structure

The component manages the following color properties:

```javascript
{
  // Brand Colors
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#10b981',
  
  // Background Colors
  background: '#ffffff',
  surface: '#f3f4f6',
  
  // Text Colors
  text: '#111827',
  textSecondary: '#6b7280',
  
  // UI Colors
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6'
}
```

## Contrast Validation

The component validates the following contrast combinations:
- Text on Background
- Text on Surface
- Secondary Text on Background
- Secondary Text on Surface
- Primary Button Text (white on primary color)

All combinations must meet WCAG AA standards (4.5:1 ratio) for optimal accessibility.

## Export Format

Exported theme files follow this structure:

```json
{
  "name": "Custom Theme",
  "version": "1.0",
  "exportedAt": "2025-10-28T12:00:00.000Z",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    // ... all color properties
  },
  "mode": "light"
}
```

## Import Validation

When importing a theme, the component validates:
1. Valid JSON structure
2. Presence of `colors` object
3. All required color keys present
4. All color values are valid hex codes

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClose | function | No | Callback function called when user closes the picker |

## Dependencies

- `useTheme` hook from `../../hooks/useTheme`
- `colorUtils` from `../../utils/colorUtils`
- `colorSchemes` from `../../styles/themes`

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Visual contrast indicators
- Screen reader friendly error messages
- Focus management

## Browser Support

- Modern browsers with CSS custom properties support
- Native color input support (fallback to text input in older browsers)
- File API for import/export functionality
