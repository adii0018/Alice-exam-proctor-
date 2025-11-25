import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import ColorSchemePicker from './ColorSchemePicker';
import ThemePreview from './ThemePreview';
import AccessibilityPanel from './AccessibilityPanel';
import CustomColorPicker from './CustomColorPicker';

/**
 * ThemeSettings Modal Component
 * A comprehensive modal for customizing theme settings including mode, color schemes, and accessibility
 */
const ThemeSettings = ({ isOpen, onClose }) => {
  const { theme, setScheme, resetTheme } = useTheme();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all theme settings to default?')) {
      resetTheme();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm theme-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-settings-title"
    >
      <div
        ref={modalRef}
        className="
          relative w-full max-w-4xl max-h-[90vh] overflow-hidden
          bg-background border border-border rounded-2xl shadow-2xl
          backdrop-blur-xl bg-opacity-95
          theme-modal-content
          flex flex-col
        "
        style={{
          background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2
              id="theme-settings-title"
              className="text-2xl font-bold text-text"
            >
              Theme Settings
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Customize your experience with themes and accessibility options
            </p>
          </div>
          
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="
              w-10 h-10 rounded-lg
              bg-surface hover:bg-surface-hover
              border border-border
              flex items-center justify-center
              transition-all duration-theme
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              group
            "
            aria-label="Close theme settings"
            type="button"
          >
            <svg
              className="w-5 h-5 text-text-secondary group-hover:text-text transition-colors"
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
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mode Section */}
              <section className="p-5 bg-surface rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Theme Mode
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text mb-1">
                      Current mode: <span className="font-semibold text-primary capitalize">{theme.mode}</span>
                    </p>
                    <p className="text-xs text-text-secondary">
                      Switch between light and dark appearance
                    </p>
                  </div>
                  <ThemeToggle size="lg" showLabel />
                </div>
              </section>

              {/* Color Schemes Section */}
              <section className="p-5 bg-surface rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    Color Schemes
                  </h3>
                  <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90 transition-opacity"
                  >
                    {showCustomPicker ? 'Show Presets' : 'Custom Colors'}
                  </button>
                </div>
                {showCustomPicker ? (
                  <CustomColorPicker onClose={() => setShowCustomPicker(false)} />
                ) : (
                  <ColorSchemePicker
                    currentScheme={theme.scheme}
                    onSchemeChange={setScheme}
                  />
                )}
              </section>

              {/* Accessibility Section */}
              <section className="p-5 bg-surface rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Accessibility
                </h3>
                <AccessibilityPanel />
              </section>
            </div>

            {/* Right Column - Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-0">
                <ThemePreview />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface bg-opacity-50">
          <button
            onClick={handleReset}
            className="
              btn-press
              px-4 py-2 rounded-lg
              bg-surface hover:bg-surface-hover
              border border-border
              text-text-secondary hover:text-text
              text-sm font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
            type="button"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="
                btn-lift btn-press
                px-6 py-2 rounded-lg
                bg-primary hover:bg-primary-hover
                text-white
                text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                shadow-lg hover:shadow-xl
              "
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
