/**
 * Color manipulation utilities for theme system
 * Optimized with memoization for performance
 */

// Memoization cache for expensive calculations
const luminanceCache = new Map();
const contrastCache = new Map();

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color code (e.g., '#3b82f6' or '3b82f6')
 * @returns {{r: number, g: number, b: number}} RGB values (0-255)
 */
export const hexToRgb = (hex) => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Calculate relative luminance of a color (WCAG formula)
 * Memoized for performance
 * @param {string} hex - Hex color code
 * @returns {number} Relative luminance (0-1)
 */
export const getLuminance = (hex) => {
  // Check cache first
  if (luminanceCache.has(hex)) {
    return luminanceCache.get(hex);
  }
  
  const { r, g, b } = hexToRgb(hex);
  
  // Convert to 0-1 range
  const [rs, gs, bs] = [r, g, b].map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance
  const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  
  // Cache the result
  luminanceCache.set(hex, luminance);
  
  // Limit cache size to prevent memory leaks
  if (luminanceCache.size > 100) {
    const firstKey = luminanceCache.keys().next().value;
    luminanceCache.delete(firstKey);
  }
  
  return luminance;
};

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * Memoized for performance
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  // Create cache key
  const cacheKey = `${color1}:${color2}`;
  
  // Check cache first
  if (contrastCache.has(cacheKey)) {
    return contrastCache.get(cacheKey);
  }
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  // Cache the result
  contrastCache.set(cacheKey, ratio);
  
  // Limit cache size to prevent memory leaks
  if (contrastCache.size > 100) {
    const firstKey = contrastCache.keys().next().value;
    contrastCache.delete(firstKey);
  }
  
  return ratio;
};

/**
 * Validate contrast ratio against WCAG standards
 * Uses memoized contrast calculation
 * @param {string} textColor - Text color hex
 * @param {string} bgColor - Background color hex
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @returns {{passes: boolean, ratio: number, required: number}} Validation result
 */
export const validateContrast = (textColor, bgColor, level = 'AA') => {
  const ratio = getContrastRatio(textColor, bgColor);
  const required = level === 'AAA' ? 7 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio: parseFloat(ratio.toFixed(2)),
    required
  };
};

/**
 * Clear color calculation caches
 * Useful for testing or memory management
 */
export const clearColorCaches = () => {
  luminanceCache.clear();
  contrastCache.clear();
};

/**
 * Validate hex color format
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export const isValidHexColor = (color) => {
  return /^#?[0-9A-F]{6}$/i.test(color);
};

/**
 * Ensure hex color has # prefix
 * @param {string} color - Hex color with or without #
 * @returns {string} Hex color with # prefix
 */
export const normalizeHexColor = (color) => {
  return color.startsWith('#') ? color : `#${color}`;
};

/**
 * Convert RGB to hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
export const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
