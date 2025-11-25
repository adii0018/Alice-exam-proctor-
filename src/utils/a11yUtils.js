/**
 * Accessibility utility functions for screen reader support
 */

/**
 * Announce a message to screen readers using aria-live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  // Create or get existing announcement container
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(announcer);
  } else {
    // Update priority if different
    announcer.setAttribute('aria-live', priority);
  }
  
  // Clear previous message
  announcer.textContent = '';
  
  // Set new message after a brief delay to ensure screen readers pick it up
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
  
  // Clear message after it's been announced
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
};

/**
 * Announce theme mode change
 * @param {string} mode - 'light' or 'dark'
 */
export const announceThemeModeChange = (mode) => {
  const message = `Theme changed to ${mode} mode`;
  announceToScreenReader(message, 'polite');
};

/**
 * Announce color scheme change
 * @param {string} scheme - Scheme name
 */
export const announceColorSchemeChange = (scheme) => {
  const schemeName = scheme.charAt(0).toUpperCase() + scheme.slice(1);
  const message = `Color scheme changed to ${schemeName}`;
  announceToScreenReader(message, 'polite');
};

/**
 * Announce accessibility setting change
 * @param {string} setting - Setting name
 * @param {boolean|string} value - New value
 */
export const announceAccessibilityChange = (setting, value) => {
  let message = '';
  
  switch (setting) {
    case 'highContrast':
      message = value ? 'High contrast mode enabled' : 'High contrast mode disabled';
      break;
    case 'fontSize':
      message = `Font size changed to ${value}`;
      break;
    case 'reducedMotion':
      message = value ? 'Reduced motion enabled' : 'Reduced motion disabled';
      break;
    default:
      message = `${setting} changed to ${value}`;
  }
  
  announceToScreenReader(message, 'polite');
};

/**
 * Add screen reader only text
 * @param {string} text - Text for screen readers
 * @returns {HTMLElement} Element with screen reader only text
 */
export const createSROnlyText = (text) => {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  span.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  return span;
};

/**
 * Get descriptive text for theme mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {string} Descriptive text
 */
export const getThemeModeDescription = (mode) => {
  return mode === 'dark'
    ? 'Dark mode: Light text on dark background for reduced eye strain in low light'
    : 'Light mode: Dark text on light background for optimal readability in bright conditions';
};

/**
 * Get descriptive text for color scheme
 * @param {string} scheme - Scheme name
 * @returns {string} Descriptive text
 */
export const getColorSchemeDescription = (scheme) => {
  const descriptions = {
    default: 'Default color scheme with blue primary colors',
    ocean: 'Ocean theme with calming blue and cyan tones',
    forest: 'Forest theme with natural green tones',
    sunset: 'Sunset theme with warm orange and pink tones',
    custom: 'Custom color scheme with user-defined colors'
  };
  
  return descriptions[scheme] || `${scheme} color scheme`;
};
