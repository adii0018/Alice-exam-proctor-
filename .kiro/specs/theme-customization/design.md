# Theme Customization System - Design Document

## Overview

The theme customization system will provide users with the ability to personalize the ETRIXX EXAM platform's appearance through dark/light modes, predefined color schemes, custom colors, and accessibility features. The system will be built using React Context API, CSS variables, and Tailwind CSS, ensuring seamless integration with the existing codebase.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           ThemeProvider (Context)                 │  │
│  │  - Theme State Management                         │  │
│  │  - Theme Persistence                              │  │
│  │  - System Preference Detection                    │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│         ┌────────────────┼────────────────┐             │
│         ▼                ▼                ▼             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  Theme   │    │  Theme   │    │  Theme   │         │
│  │  Toggle  │    │ Settings │    │  Sync    │         │
│  │ Component│    │   Page   │    │  Service │         │
│  └──────────┘    └──────────┘    └──────────┘         │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          ▼                               │
│              ┌───────────────────────┐                  │
│              │   CSS Variables       │                  │
│              │   (Applied to :root)  │                  │
│              └───────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  Local   │    │ Backend  │    │  System  │
  │ Storage  │    │   API    │    │  Prefs   │
  └──────────┘    └──────────┘    └──────────┘
```

### Component Structure

```
src/
├── contexts/
│   └── ThemeContext.jsx          # Theme state and logic
├── components/
│   ├── theme/
│   │   ├── ThemeToggle.jsx       # Dark/Light mode toggle button
│   │   ├── ThemeSettings.jsx     # Full theme settings panel
│   │   ├── ColorSchemePicker.jsx # Predefined scheme selector
│   │   ├── CustomColorPicker.jsx # Custom color creator
│   │   └── AccessibilityPanel.jsx# Accessibility options
│   └── ui/
│       └── ThemePreview.jsx      # Live theme preview
├── hooks/
│   ├── useTheme.js               # Theme context hook
│   └── useSystemTheme.js         # System preference detection
├── utils/
│   ├── themeUtils.js             # Theme helper functions
│   ├── colorUtils.js             # Color manipulation utilities
│   └── contrastChecker.js        # WCAG contrast validation
└── styles/
    ├── themes/
    │   ├── default.js            # Default color scheme
    │   ├── ocean.js              # Ocean color scheme
    │   ├── forest.js             # Forest color scheme
    │   └── sunset.js             # Sunset color scheme
    └── theme-variables.css       # CSS variable definitions
```

## Components and Interfaces

### 1. ThemeContext

**Purpose:** Centralized theme state management using React Context API

**State Structure:**
```javascript
{
  mode: 'light' | 'dark',
  scheme: 'default' | 'ocean' | 'forest' | 'sunset' | 'custom',
  customColors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#111827'
  },
  accessibility: {
    highContrast: false,
    fontSize: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'
    reducedMotion: false
  },
  systemPreference: 'light' | 'dark' | null
}
```

**Methods:**
```javascript
{
  toggleMode: () => void,
  setScheme: (scheme: string) => void,
  setCustomColors: (colors: object) => void,
  updateAccessibility: (settings: object) => void,
  resetTheme: () => void,
  syncTheme: () => Promise<void>
}
```

### 2. ThemeToggle Component

**Props:**
```typescript
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}
```

**Features:**
- Animated sun/moon icon transition
- Keyboard accessible (Space/Enter to toggle)
- Tooltip showing current mode
- Smooth color transition

### 3. ThemeSettings Component

**Props:**
```typescript
interface ThemeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Sections:**
- Mode selector (Dark/Light)
- Color scheme gallery
- Custom color picker
- Accessibility options
- Preview panel
- Save/Reset buttons

### 4. ColorSchemePicker Component

**Props:**
```typescript
interface ColorSchemePickerProps {
  currentScheme: string;
  onSchemeChange: (scheme: string) => void;
}
```

**Features:**
- Grid layout of scheme cards
- Live preview on hover
- Selected state indicator
- Scheme metadata (name, description)

### 5. CustomColorPicker Component

**Props:**
```typescript
interface CustomColorPickerProps {
  colors: CustomColors;
  onChange: (colors: CustomColors) => void;
}
```

**Features:**
- Color input for each theme variable
- Real-time contrast validation
- Warning for insufficient contrast
- Preview of selected colors
- Export/Import JSON functionality

## Data Models

### Theme Configuration

```javascript
const themeConfig = {
  id: 'user_theme_123',
  userId: 'user_456',
  mode: 'dark',
  scheme: 'ocean',
  customColors: null,
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false
  },
  createdAt: '2025-10-28T10:00:00Z',
  updatedAt: '2025-10-28T12:30:00Z'
};
```

### Color Scheme Definition

```javascript
const colorScheme = {
  name: 'Ocean',
  id: 'ocean',
  light: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#14b8a6',
    background: '#f0f9ff',
    surface: '#e0f2fe',
    text: '#0c4a6e',
    textSecondary: '#075985',
    border: '#bae6fd',
    error: '#dc2626',
    success: '#059669',
    warning: '#d97706'
  },
  dark: {
    primary: '#38bdf8',
    secondary: '#22d3ee',
    accent: '#2dd4bf',
    background: '#0c4a6e',
    surface: '#075985',
    text: '#f0f9ff',
    textSecondary: '#bae6fd',
    border: '#0369a1',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24'
  }
};
```

## CSS Variables Implementation

### Variable Naming Convention

```css
:root {
  /* Mode-based colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #10b981;
  
  /* Semantic colors */
  --color-background: #ffffff;
  --color-surface: #f3f4f6;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  
  /* State colors */
  --color-error: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
  
  /* Accessibility */
  --font-size-base: 16px;
  --transition-duration: 300ms;
  --focus-outline: 3px solid var(--color-primary);
}

[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-border: #374151;
}

[data-high-contrast="true"] {
  --color-text: #000000;
  --color-background: #ffffff;
  --color-border: #000000;
}

[data-font-size="large"] {
  --font-size-base: 18px;
}

[data-font-size="xlarge"] {
  --font-size-base: 20px;
}

[data-reduced-motion="true"] {
  --transition-duration: 0ms;
}
```

### Tailwind Integration

Update `tailwind.config.js` to use CSS variables:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
      },
      transitionDuration: {
        theme: 'var(--transition-duration)',
      }
    }
  }
};
```

## Theme Persistence Strategy

### Local Storage (Immediate)

```javascript
// Save to localStorage immediately on change
const saveToLocalStorage = (theme) => {
  localStorage.setItem('theme', JSON.stringify(theme));
};

// Load from localStorage on mount
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('theme');
  return saved ? JSON.parse(saved) : null;
};
```

### Backend Sync (Debounced)

```javascript
// Sync to backend after 2 seconds of inactivity
const syncToBackend = debounce(async (theme) => {
  try {
    await api.post('/api/user/theme', theme);
  } catch (error) {
    console.error('Theme sync failed:', error);
  }
}, 2000);
```

### Priority Order

1. User's saved preference (from backend)
2. Local storage (if not logged in or sync failed)
3. System preference (first visit)
4. Default theme (fallback)

## System Preference Detection

```javascript
const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState(null);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return systemTheme;
};
```

## Accessibility Implementation

### Contrast Validation

```javascript
// WCAG 2.1 contrast ratio calculation
const getContrastRatio = (color1, color2) => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const validateContrast = (textColor, bgColor, level = 'AA') => {
  const ratio = getContrastRatio(textColor, bgColor);
  const required = level === 'AAA' ? 7 : 4.5;
  return {
    passes: ratio >= required,
    ratio: ratio.toFixed(2),
    required
  };
};
```

### Keyboard Navigation

```javascript
// Theme toggle keyboard support
const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleTheme();
  }
};
```

### Screen Reader Support

```javascript
// Announce theme changes
const announceThemeChange = (mode) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `Theme changed to ${mode} mode`;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};
```

## API Endpoints

### Get User Theme
```
GET /api/user/theme
Response: {
  mode: 'dark',
  scheme: 'ocean',
  customColors: null,
  accessibility: {...}
}
```

### Update User Theme
```
POST /api/user/theme
Body: {
  mode: 'dark',
  scheme: 'ocean',
  customColors: null,
  accessibility: {...}
}
Response: { success: true }
```

### Export Theme
```
GET /api/user/theme/export
Response: JSON file download
```

### Import Theme
```
POST /api/user/theme/import
Body: FormData with JSON file
Response: { success: true, theme: {...} }
```

## Error Handling

### Theme Load Failure
```javascript
try {
  const theme = await loadTheme();
  applyTheme(theme);
} catch (error) {
  console.error('Failed to load theme:', error);
  // Fallback to default theme
  applyTheme(DEFAULT_THEME);
  toast.error('Failed to load your theme. Using default.');
}
```

### Sync Failure
```javascript
try {
  await syncTheme(theme);
} catch (error) {
  console.error('Theme sync failed:', error);
  // Continue using local storage
  toast.warning('Theme saved locally. Will sync when online.');
}
```

### Invalid Custom Colors
```javascript
const validateCustomColors = (colors) => {
  const errors = [];
  
  // Check contrast ratios
  const textBgContrast = getContrastRatio(colors.text, colors.background);
  if (textBgContrast < 4.5) {
    errors.push('Text and background contrast is too low');
  }
  
  // Validate hex format
  Object.entries(colors).forEach(([key, value]) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
      errors.push(`Invalid color format for ${key}`);
    }
  });
  
  return errors;
};
```

## Testing Strategy

### Unit Tests

1. **Theme Context Tests**
   - Theme state initialization
   - Mode toggle functionality
   - Scheme switching
   - Custom color updates
   - Accessibility settings

2. **Utility Function Tests**
   - Contrast ratio calculation
   - Color format validation
   - Luminance calculation
   - Theme persistence

3. **Component Tests**
   - ThemeToggle rendering and interaction
   - ColorSchemePicker selection
   - CustomColorPicker validation
   - AccessibilityPanel updates

### Integration Tests

1. **Theme Persistence**
   - Save to localStorage
   - Load from localStorage
   - Sync to backend
   - Handle sync failures

2. **System Preference**
   - Detect system theme
   - Apply on first visit
   - Update on system change
   - Override with user preference

3. **Accessibility**
   - Keyboard navigation
   - Screen reader announcements
   - High contrast mode
   - Font size changes

### E2E Tests

1. **User Flow**
   - Toggle dark/light mode
   - Select color scheme
   - Create custom colors
   - Enable accessibility features
   - Verify persistence across sessions

2. **Cross-Browser**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
   - CSS variable support
   - Media query support

## Performance Considerations

### Optimization Strategies

1. **CSS Variable Updates**
   - Batch updates to minimize repaints
   - Use `requestAnimationFrame` for smooth transitions
   - Avoid layout thrashing

2. **Lazy Loading**
   - Load theme settings panel on demand
   - Defer non-critical theme assets
   - Code-split theme utilities

3. **Caching**
   - Cache theme CSS in service worker
   - Memoize color calculations
   - Cache contrast validation results

4. **Debouncing**
   - Debounce backend sync (2 seconds)
   - Debounce custom color updates (500ms)
   - Throttle system preference checks

### Performance Metrics

- Theme switch: < 100ms
- CSS variable update: < 50ms
- Backend sync: < 2 seconds
- Initial load: < 200ms

## Migration Strategy

### Phase 1: Foundation (Week 1)
- Create ThemeContext and provider
- Implement basic dark/light toggle
- Add CSS variables to existing styles
- Update App.jsx to use ThemeProvider

### Phase 2: Color Schemes (Week 2)
- Implement predefined color schemes
- Create ColorSchemePicker component
- Add theme persistence (localStorage)
- Update all components to use theme colors

### Phase 3: Customization (Week 3)
- Build CustomColorPicker
- Add contrast validation
- Implement theme export/import
- Add backend sync

### Phase 4: Accessibility (Week 4)
- Implement high contrast mode
- Add font size controls
- Add reduced motion support
- Ensure WCAG compliance

### Phase 5: Polish (Week 5)
- Add animations and transitions
- Optimize performance
- Add comprehensive tests
- Update documentation

## Security Considerations

1. **Input Validation**
   - Sanitize custom color inputs
   - Validate hex color format
   - Prevent CSS injection

2. **Storage Security**
   - Don't store sensitive data in theme config
   - Validate theme data from backend
   - Handle malformed theme data gracefully

3. **API Security**
   - Authenticate theme sync requests
   - Rate limit theme updates
   - Validate theme data on backend

## Browser Compatibility

### Supported Features
- CSS Variables (all modern browsers)
- prefers-color-scheme media query (95%+ support)
- localStorage (universal support)
- CSS transitions (universal support)

### Fallbacks
- Graceful degradation for older browsers
- Static theme for browsers without CSS variable support
- Default theme if system preference unavailable

## Documentation

### User Documentation
- Theme settings guide
- Accessibility features explanation
- Custom color creation tutorial
- Keyboard shortcuts reference

### Developer Documentation
- Theme context API reference
- CSS variable naming conventions
- Adding new color schemes
- Testing theme components
