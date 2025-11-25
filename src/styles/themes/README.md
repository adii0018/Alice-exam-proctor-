# Color Schemes

This directory contains predefined color schemes for the ETRIXX EXAM platform.

## Available Schemes

### 1. Default
Classic blue theme with balanced contrast. Suitable for general use.

### 2. Ocean
Cool blue and teal colors inspired by the sea. Great for a calming, professional look.

### 3. Forest
Natural greens and earth tones. Perfect for users who prefer warmer, nature-inspired colors.

### 4. Sunset
Warm oranges and purples like a sunset sky. Vibrant and energetic color palette.

## Structure

Each color scheme file exports an object with the following structure:

```javascript
{
  name: 'Scheme Name',
  id: 'scheme-id',
  description: 'Brief description',
  light: {
    primary: '#hex',
    secondary: '#hex',
    accent: '#hex',
    background: '#hex',
    surface: '#hex',
    text: '#hex',
    textSecondary: '#hex',
    border: '#hex',
    error: '#hex',
    success: '#hex',
    warning: '#hex',
    info: '#hex'
  },
  dark: {
    // Same structure as light
  }
}
```

## Usage

Import and use color schemes in your components:

```javascript
import { colorSchemes } from './styles/themes';
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { setScheme } = useTheme();
  
  return (
    <button onClick={() => setScheme('ocean')}>
      Switch to Ocean Theme
    </button>
  );
}
```

## Adding New Schemes

1. Create a new file in `src/styles/themes/` (e.g., `midnight.js`)
2. Export a scheme object following the structure above
3. Import and add it to `src/styles/themes/index.js`
4. Update the validation in `src/utils/themeUtils.js` to include the new scheme ID

## CSS Variables

Color schemes are automatically applied as CSS variables:

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-surface`
- `--color-text`
- `--color-text-secondary`
- `--color-border`
- `--color-error`
- `--color-success`
- `--color-warning`
- `--color-info`

These can be used in your CSS/Tailwind classes via the configured theme colors.
