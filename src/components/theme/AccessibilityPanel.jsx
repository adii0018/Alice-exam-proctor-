import { useTheme } from '../../hooks/useTheme';

/**
 * AccessibilityPanel Component
 * Controls for accessibility features including high contrast, font size, and reduced motion
 */
const AccessibilityPanel = () => {
  const { theme, updateAccessibility } = useTheme();
  const { accessibility } = theme;

  const fontSizes = [
    { value: 'small', label: 'Small', size: '14px' },
    { value: 'medium', label: 'Medium', size: '16px' },
    { value: 'large', label: 'Large', size: '18px' },
    { value: 'xlarge', label: 'Extra Large', size: '20px' }
  ];

  const handleToggle = (setting) => {
    updateAccessibility({ [setting]: !accessibility[setting] });
  };

  const handleFontSizeChange = (fontSize) => {
    updateAccessibility({ fontSize });
  };

  return (
    <div className="space-y-4">
      {/* High Contrast Mode */}
      <div className="a11y-option flex items-center justify-between p-4 bg-background rounded-lg border border-border">
        <div className="flex-1">
          <label
            htmlFor="high-contrast-toggle"
            className="block text-sm font-medium text-text mb-1 cursor-pointer"
          >
            High Contrast Mode
          </label>
          <p className="text-xs text-text-secondary">
            Increases contrast ratio to 7:1 for better visibility
          </p>
        </div>
        <button
          id="high-contrast-toggle"
          onClick={() => handleToggle('highContrast')}
          className={`
            toggle-switch relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${accessibility.highContrast ? 'bg-primary' : 'bg-border'}
          `}
          role="switch"
          aria-checked={accessibility.highContrast}
          aria-label="Toggle high contrast mode"
          type="button"
        >
          <span
            className={`
              toggle-switch-handle inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform duration-200
              ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Font Size Selector */}
      <div className="a11y-option p-4 bg-background rounded-lg border border-border">
        <label className="block text-sm font-medium text-text mb-3">
          Font Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => handleFontSizeChange(size.value)}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all duration-theme
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  accessibility.fontSize === size.value
                    ? 'border-primary bg-primary bg-opacity-10 text-primary font-semibold'
                    : 'border-border bg-surface text-text hover:border-primary hover:bg-surface-hover'
                }
              `}
              aria-label={`Set font size to ${size.label}`}
              aria-pressed={accessibility.fontSize === size.value}
              type="button"
            >
              <div className="text-center">
                <div className="text-sm font-medium">{size.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {size.size}
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Current size: <span className="font-medium text-text capitalize">{accessibility.fontSize}</span>
        </p>
      </div>

      {/* Reduced Motion */}
      <div className="a11y-option flex items-center justify-between p-4 bg-background rounded-lg border border-border">
        <div className="flex-1">
          <label
            htmlFor="reduced-motion-toggle"
            className="block text-sm font-medium text-text mb-1 cursor-pointer"
          >
            Reduced Motion
          </label>
          <p className="text-xs text-text-secondary">
            Minimizes animations and transitions for comfort
          </p>
        </div>
        <button
          id="reduced-motion-toggle"
          onClick={() => handleToggle('reducedMotion')}
          className={`
            toggle-switch relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${accessibility.reducedMotion ? 'bg-primary' : 'bg-border'}
          `}
          role="switch"
          aria-checked={accessibility.reducedMotion}
          aria-label="Toggle reduced motion"
          type="button"
        >
          <span
            className={`
              toggle-switch-handle inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform duration-200
              ${accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Accessibility Info */}
      <div className="p-4 bg-surface rounded-lg border border-border" role="region" aria-label="Accessibility information">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-text mb-1">
              Accessibility Features
            </h4>
            <p className="text-xs text-text-secondary">
              These settings help make the platform more comfortable and accessible.
              All features support keyboard navigation and screen readers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Screen reader announcements container */}
      <div
        id="accessibility-announcements"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};

export default AccessibilityPanel;
