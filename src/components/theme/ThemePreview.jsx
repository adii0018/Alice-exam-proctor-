import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';

/**
 * ThemePreview Component
 * Displays a live preview of the current theme with sample UI elements
 */
const ThemePreview = () => {
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);

  // Trigger animation when theme changes
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [theme.mode, theme.scheme, theme.customColors]);

  return (
    <div className={`space-y-4 ${isUpdating ? 'theme-preview-update' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Live Preview</h3>
        <span className="text-xs text-text-secondary px-2 py-1 bg-surface rounded border border-border">
          {theme.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </span>
      </div>

      <div className="p-5 bg-surface rounded-xl border border-border space-y-4">
        {/* Sample Card */}
        <div className="p-4 bg-background rounded-lg border border-border shadow-sm">
          <h4 className="text-base font-semibold text-text mb-2">
            Sample Card
          </h4>
          <p className="text-sm text-text-secondary mb-3">
            This is how your content will look with the current theme settings.
          </p>
          
          {/* Sample Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              className="
                px-3 py-1.5 rounded-lg
                bg-primary text-white
                text-sm font-medium
                transition-all duration-theme
                shadow-sm hover:shadow-md
              "
              type="button"
              disabled
            >
              Primary
            </button>
            <button
              className="
                px-3 py-1.5 rounded-lg
                bg-secondary text-white
                text-sm font-medium
                transition-all duration-theme
                shadow-sm hover:shadow-md
              "
              type="button"
              disabled
            >
              Secondary
            </button>
            <button
              className="
                px-3 py-1.5 rounded-lg
                bg-surface border border-border
                text-text
                text-sm font-medium
                transition-all duration-theme
              "
              type="button"
              disabled
            >
              Outline
            </button>
          </div>
        </div>

        {/* Sample Form Elements */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-text mb-3">
            Form Elements
          </h4>
          
          <div className="space-y-3">
            {/* Input */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="
                  w-full px-3 py-2 rounded-lg
                  bg-surface border border-border
                  text-text placeholder-text-secondary
                  text-sm
                  transition-all duration-theme
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                "
                disabled
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="preview-checkbox"
                className="
                  w-4 h-4 rounded
                  border-border
                  text-primary
                  focus:ring-2 focus:ring-primary
                "
                defaultChecked
                disabled
              />
              <label
                htmlFor="preview-checkbox"
                className="text-sm text-text"
              >
                Sample checkbox
              </label>
            </div>

            {/* Radio */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="preview-radio"
                name="preview-radio"
                className="
                  w-4 h-4
                  border-border
                  text-primary
                  focus:ring-2 focus:ring-primary
                "
                defaultChecked
                disabled
              />
              <label
                htmlFor="preview-radio"
                className="text-sm text-text"
              >
                Sample radio button
              </label>
            </div>
          </div>
        </div>

        {/* Sample Alert/Badge */}
        <div className="space-y-2">
          <div className="p-3 bg-success bg-opacity-10 border border-success rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-success flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs text-success font-medium">
                Success message
              </span>
            </div>
          </div>

          <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-warning flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-xs text-warning font-medium">
                Warning message
              </span>
            </div>
          </div>

          <div className="p-3 bg-error bg-opacity-10 border border-error rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-error flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-xs text-error font-medium">
                Error message
              </span>
            </div>
          </div>
        </div>

        {/* Sample Text Hierarchy */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-text mb-2">
            Text Hierarchy
          </h4>
          <p className="text-sm text-text mb-2">
            Regular text with normal weight
          </p>
          <p className="text-sm text-text-secondary mb-2">
            Secondary text for less emphasis
          </p>
          <p className="text-xs text-text-secondary">
            Small text for captions and labels
          </p>
        </div>

        {/* Color Palette Display */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-text mb-3">
            Color Palette
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="w-full h-10 rounded bg-primary mb-1"></div>
              <span className="text-xs text-text-secondary">Primary</span>
            </div>
            <div className="text-center">
              <div className="w-full h-10 rounded bg-secondary mb-1"></div>
              <span className="text-xs text-text-secondary">Secondary</span>
            </div>
            <div className="text-center">
              <div className="w-full h-10 rounded bg-accent mb-1"></div>
              <span className="text-xs text-text-secondary">Accent</span>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 bg-surface rounded-lg border border-border">
          <p className="text-xs text-text-secondary text-center">
            Preview updates in real-time as you change settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
