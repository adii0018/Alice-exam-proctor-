# Implementation Plan

- [x] 1. Set up theme foundation and context

  - Create ThemeContext with state management for mode, scheme, custom colors, and accessibility settings
  - Implement ThemeProvider component to wrap the application
  - Create useTheme custom hook for consuming theme context
  - Add theme state initialization with localStorage fallback
  - _Requirements: 1.4, 5.5, 6.1_

- [x] 1.1 Create theme utility functions

  - Write color manipulation utilities (hex to RGB, luminance calculation)
  - Implement WCAG contrast ratio calculator
  - Create contrast validation function (AA and AAA levels)
  - Add color format validators
  - _Requirements: 3.3, 4.3_

- [x] 1.2 Define CSS variables and base styles

  - Create theme-variables.css with all CSS custom properties
  - Define variables for colors, font sizes, transitions, and spacing
  - Add data attributes for theme modes ([data-theme], [data-high-contrast])
  - Update index.css to import theme variables
  - _Requirements: 7.2, 7.3_

- [x] 1.3 Update Tailwind configuration

  - Extend Tailwind config to use CSS variables for colors
  - Add theme-aware color utilities
  - Configure font size and transition duration from CSS variables
  - _Requirements: 7.4_

- [x] 2. Implement dark/light mode toggle

  - [x] 2.1 Create ThemeToggle component

    - Build toggle button with sun/moon icon animation
    - Add keyboard accessibility (Enter/Space key support)
    - Implement smooth transition between modes
    - Add tooltip showing current mode
    - Style with Tailwind classes using theme colors
    - _Requirements: 1.1, 1.2, 1.6, 3.3_

  - [x] 2.2 Integrate system preference detection

    - Create useSystemTheme hook with prefers-color-scheme media query
    - Detect system theme on first visit
    - Listen for system preference changes
    - Apply system preference as default when no user preference exists
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

  - [x] 2.3 Implement theme persistence

    - Save theme mode to localStorage on change
    - Load saved theme on application mount
    - Apply theme to document root element
    - Update CSS variables when theme changes
    - _Requirements: 1.4, 1.5, 6.2_

- [x] 3. Create predefined color schemes

  - [x] 3.1 Define color scheme objects

    - Create default.js with default light/dark colors
    - Create ocean.js with ocean-themed colors
    - Create forest.js with forest-themed colors
    - Create sunset.js with sunset-themed colors
    - Export all schemes from index.js
    - _Requirements: 2.1, 2.4_

  - [x] 3.2 Build ColorSchemePicker component

    - Create grid layout for scheme cards
    - Display scheme preview with color swatches
    - Add selected state indicator
    - Implement hover preview effect
    - Handle scheme selection and apply to theme
    - _Requirements: 2.2, 2.3, 2.7_

  - [x] 3.3 Apply color schemes to CSS variables

    - Map scheme colors to CSS variable names
    - Update CSS variables when scheme changes
    - Ensure smooth transition between schemes
    - Persist selected scheme to localStorage
    - _Requirements: 2.5, 2.6_

- [x] 4. Build theme settings panel

  - [x] 4.1 Create ThemeSettings modal component

    - Build modal with sections for mode, schemes, and accessibility
    - Add close button and keyboard escape support
    - Implement responsive layout for mobile
    - Style with glassmorphism effect
    - _Requirements: 2.2, 3.1_

  - [x] 4.2 Add theme preview panel

    - Create live preview showing current theme
    - Display sample UI elements (buttons, cards, text)
    - Update preview in real-time as settings change
    - _Requirements: 4.5_

  - [x] 4.3 Integrate all theme controls

    - Add ThemeToggle for mode switching
    - Add ColorSchemePicker for scheme selection
    - Add accessibility controls section
    - Add save and reset buttons
    - Wire up all controls to theme context
    - _Requirements: 1.1, 2.1, 3.1_

- [x] 5. Implement custom color picker

  - [x] 5.1 Create CustomColorPicker component

    - Build color input fields for primary, secondary, accent, background, surface, and text colors
    - Add native color picker inputs
    - Display hex color values
    - Allow manual hex input with validation
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Add contrast validation

    - Calculate contrast ratios for text/background combinations
    - Display contrast ratio values
    - Show warning icon for insufficient contrast (< 4.5:1)
    - Highlight passing/failing combinations with color indicators
    - _Requirements: 4.3, 4.4_

  - [x] 5.3 Implement custom color persistence

    - Save custom colors to theme state
    - Persist custom colors to localStorage
    - Allow switching between custom and predefined schemes
    - _Requirements: 4.6, 4.7_

  - [x] 5.4 Add export/import functionality

    - Create export button to download theme as JSON
    - Implement import button to upload theme JSON
    - Validate imported theme structure
    - Apply imported theme to context
    - _Requirements: 4.8_

- [x] 6. Implement accessibility features

  - [x] 6.1 Create AccessibilityPanel component

    - Build panel with high contrast toggle
    - Add font size selector (Small, Medium, Large, Extra Large)
    - Add reduced motion toggle
    - Style with clear labels and descriptions
    - _Requirements: 3.1, 3.8_

  - [x] 6.2 Implement high contrast mode

    - Define high contrast CSS variables
    - Apply [data-high-contrast] attribute to root
    - Ensure 7:1 contrast ratio for all text
    - Update borders and focus indicators
    - _Requirements: 3.2_

  - [x] 6.3 Add font size controls

    - Update --font-size-base CSS variable based on selection
    - Apply font size to all text elements
    - Ensure responsive scaling
    - Test readability at all sizes
    - _Requirements: 3.8_

  - [x] 6.4 Implement reduced motion support

    - Detect prefers-reduced-motion system preference
    - Add [data-reduced-motion] attribute to root
    - Set --transition-duration to 0ms when enabled
    - Disable animations and transitions
    - _Requirements: 3.5_

  - [x] 6.5 Add keyboard navigation support

    - Ensure all theme controls are keyboard accessible
    - Add visible focus indicators (3px outline)
    - Support Tab navigation through settings
    - Add ARIA labels to all controls
    - _Requirements: 3.3, 3.4_

  - [x] 6.6 Implement screen reader support

    - Add ARIA labels and descriptions
    - Announce theme changes with aria-live regions
    - Provide text alternatives for icons
    - Test with screen readers (NVDA, JAWS)
    - _Requirements: 3.7_

-

- [x] 7. Add theme sync to backend

  - [x] 7.1 Create backend API endpoints

    - Implement GET /api/user/theme endpoint
    - Implement POST /api/user/theme endpoint
    - Add theme validation on backend
    - Store theme in user document
    - _Requirements: 6.1, 6.2_

  - [x] 7.2 Implement theme sync service

    - Create syncTheme function with debouncing (2 seconds)
    - Handle sync success and failure
    - Retry failed syncs up to 3 times
    - Show sync status indicator
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 7.3 Load theme from backend on login

    - Fetch user theme after authentication
    - Apply backend theme over localStorage
    - Handle fetch failures gracefully
    - Merge with local changes if conflicts exist

    - _Requirements: 6.2, 6.3_

- [x] 8. Update existing components for theming

  - [x] 8.1 Update navigation components

    - Replace hardcoded colors with theme variables
    - Update StudentDashboard navigation
    - Update TeacherDashboard navigation
    - Add ThemeToggle to navigation bar
    - _Requirements: 1.3, 7.1_

  - [x] 8.2 Update form components

    - Apply theme colors to LoginForm
    - Apply theme colors to RegisterForm
    - Apply theme colors to QuizCreator
    - Ensure proper contrast for inputs
    - _Requirements: 7.4_

  - [x] 8.3 Update card and modal components

    - Apply theme to QuizList cards
    - Apply theme to QuizResults cards
    - Apply theme to modal backgrounds
    - Update shadows and borders
    - _Requirements: 7.4_

  - [x] 8.4 Update proctoring components

    - Apply theme to CameraProctor
    - Apply theme to FlagMonitor
    - Apply theme to AudioTimeline
    - Ensure visibility in both modes
    - _Requirements: 7.6_

  - [x] 8.5 Update dashboard components

    - Apply theme to QuizStatistics charts
    - Apply theme to NotificationCenter
    - Apply theme to ProfilePage
    - Update background effects (StarfieldBackground, ParticleBackground)
    - _Requirements: 7.5_

- [x] 9. Add theme toggle to main navigation

  - Update App.jsx to wrap with ThemeProvider
  - Add ThemeToggle button to navigation bars
  - Position toggle in top-right corner
  - Ensure visibility on all pages
  - _Requirements: 1.1, 1.7_

- [x] 10. Add theme settings to profile page

  - Add "Theme Settings" section to ProfilePage
  - Include mode toggle, scheme picker, and accessibility options
  - Add "Advanced Settings" button to open full ThemeSettings modal
  - Show current theme preview
  - _Requirements: 2.1, 3.1, 4.1_

- [x] 11. Optimize theme performance


  - Batch CSS variable updates using requestAnimationFrame
  - Memoize color calculations in utility functions
  - Lazy load ThemeSettings modal
  - Cache contrast validation results
  - Minimize repaints during theme changes
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 12. Add theme animations and transitions






  - Create smooth color transition animations (300ms)
  - Add fade-in effect for theme settings modal
  - Animate sun/moon icon in ThemeToggle
  - Add ripple effect on scheme selection
  - Respect reduced motion preference
  - _Requirements: 1.6, 8.4_

- [x] 13. Write comprehensive tests







  - [x] 13.1 Unit tests for theme utilities


    - Test contrast ratio calculation
    - Test color format validation
    - Test luminance calculation
    - Test theme persistence functions


  - [x] 13.2 Component tests


    - Test ThemeToggle rendering and interaction
    - Test ColorSchemePicker selection
    - Test CustomColorPicker validation
    - Test AccessibilityPanel updates


  - [x] 13.3 Integration tests

    - Test theme persistence flow
    - Test system preference detection
    - Test backend sync
    - Test theme application to components

- [x] 14. Create documentation





  - Write user guide for theme customization
  - Document keyboard shortcuts
  - Create accessibility features guide
  - Add developer documentation for adding new themes
  - _Requirements: 3.1, 3.3_
