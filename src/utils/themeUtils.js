/**
 * Theme utility functions - yahan saare theme related functions hain
 * Theme save karna, load karna, apply karna sab yahan hota hai
 */

import { colorSchemes } from '../styles/themes'; // Color schemes import karte hain

const THEME_STORAGE_KEY = 'etrixx_theme'; // localStorage mein theme save karne ke liye key

/**
 * Default theme configuration - yeh default settings hain
 * DARK MODE MEIN LOCK HAI - sirf dark mode use kar sakte hain
 */
export const DEFAULT_THEME = {
  mode: 'dark', // Hamesha dark mode (locked)
  scheme: 'default', // Default color scheme
  customColors: null, // Custom colors nahi hain
  accessibility: { // Accessibility settings
    highContrast: false, // High contrast off
    fontSize: 'medium', // Medium font size
    reducedMotion: false // Reduced motion off
  }
};

/**
 * Theme ko localStorage mein save karne wala function
 * @param {object} theme - Theme configuration object
 */
export const saveThemeToStorage = (theme) => {
  try {
    // Theme ko JSON string banaa kar localStorage mein save kar dete hain
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Theme save nahi hua localStorage mein:', error);
  }
};

/**
 * Load theme from localStorage
 * @returns {object|null} Theme configuration or null if not found
 */
export const loadThemeFromStorage = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return null;
  }
};

/**
 * Clear theme from localStorage
 */
export const clearThemeFromStorage = () => {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear theme from localStorage:', error);
  }
};

/**
 * Apply color scheme CSS variables to document
 * Optimized with batched updates using requestAnimationFrame
 * @param {object} theme - Theme configuration
 */
const applyColorScheme = (theme) => {
  const root = document.documentElement;
  const { scheme, mode, customColors } = theme;
  
  let colors;
  
  // Use custom colors if scheme is 'custom'
  if (scheme === 'custom' && customColors) {
    colors = customColors;
  } else {
    // Get colors from predefined scheme
    const schemeData = colorSchemes[scheme] || colorSchemes.default;
    colors = schemeData[mode];
  }
  
  // Batch CSS variable updates using requestAnimationFrame
  // This minimizes repaints and improves performance
  if (colors) {
    requestAnimationFrame(() => {
      // Batch all style updates together
      Object.entries(colors).forEach(([key, value]) => {
        // Convert camelCase to kebab-case (e.g., textSecondary -> text-secondary)
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--color-${cssVarName}`, value);
      });
    });
  }
};

/**
 * Theme ko document mein apply karne wala function - smooth transitions ke saath
 * Performance optimize kiya gaya hai batched updates ke saath
 * @param {object} theme - Theme configuration
 */
export const applyThemeToDocument = (theme) => {
  const root = document.documentElement; // HTML root element
  
  // Theme transition ke time visual glitches prevent karte hain
  // Transitioning class add kar dete hain animations coordinate karne ke liye
  root.classList.add('theme-transitioning');
  
  // Saare DOM updates ko batch mein karte hain requestAnimationFrame use kar ke
  // Yeh ensure karta hai ki saare changes ek hi frame mein ho, repaints kam ho
  requestAnimationFrame(() => {
    // Theme mode apply karte hain
    root.setAttribute('data-theme', theme.mode);
    
    // Color scheme apply karte hain
    root.setAttribute('data-scheme', theme.scheme);
    
    // Accessibility settings apply karte hain
    root.setAttribute('data-high-contrast', theme.accessibility.highContrast);
    root.setAttribute('data-font-size', theme.accessibility.fontSize);
    root.setAttribute('data-reduced-motion', theme.accessibility.reducedMotion);
    
    // Color scheme CSS variables apply karte hain
    applyColorScheme(theme);
    
    // Transition complete hone ke baad transitioning class remove kar dete hain
    // 300ms CSS transition duration ke match mein
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 300);
  });
};

/**
 * Detect system theme preference
 * ALWAYS RETURNS DARK - Theme locked
 * @returns {string} Always 'dark'
 */
export const getSystemThemePreference = () => {
  return 'dark'; // Always return dark mode
};

/**
 * Detect system reduced motion preference
 * @returns {boolean} True if user prefers reduced motion
 */
export const getSystemReducedMotionPreference = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Merge theme with defaults
 * @param {object} theme - Partial theme configuration
 * @returns {object} Complete theme configuration
 */
export const mergeWithDefaults = (theme) => {
  return {
    ...DEFAULT_THEME,
    ...theme,
    accessibility: {
      ...DEFAULT_THEME.accessibility,
      ...(theme?.accessibility || {})
    }
  };
};

/**
 * Validate theme object structure
 * @param {object} theme - Theme to validate
 * @returns {boolean} True if valid
 */
export const isValidTheme = (theme) => {
  if (!theme || typeof theme !== 'object') return false;
  
  const validModes = ['light', 'dark'];
  const validSchemes = ['default', 'ocean', 'forest', 'sunset', 'custom'];
  const validFontSizes = ['small', 'medium', 'large', 'xlarge'];
  
  return (
    validModes.includes(theme.mode) &&
    validSchemes.includes(theme.scheme) &&
    (!theme.accessibility || (
      typeof theme.accessibility.highContrast === 'boolean' &&
      validFontSizes.includes(theme.accessibility.fontSize) &&
      typeof theme.accessibility.reducedMotion === 'boolean'
    ))
  );
};
