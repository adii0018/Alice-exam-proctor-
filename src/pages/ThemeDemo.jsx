import { useState } from 'react';
import { ThemeToggle, ThemeSettingsButton } from '../components/theme';
import { useTheme } from '../hooks/useTheme';

/**
 * ThemeDemo Page
 * A demonstration page for testing theme customization features
 */
const ThemeDemo = () => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background transition-colors duration-theme">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">Theme Customization Demo</h1>
              <p className="text-sm text-text-secondary mt-1">
                Test all theme features and accessibility options
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle size="md" showLabel />
              <ThemeSettingsButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Theme Info */}
          <div className="p-6 bg-surface rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text mb-4">Current Theme</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Mode:</span>
                <span className="text-text font-medium capitalize">{theme.mode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Scheme:</span>
                <span className="text-text font-medium capitalize">{theme.scheme}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">High Contrast:</span>
                <span className="text-text font-medium">
                  {theme.accessibility.highContrast ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Font Size:</span>
                <span className="text-text font-medium capitalize">
                  {theme.accessibility.fontSize}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Reduced Motion:</span>
                <span className="text-text font-medium">
                  {theme.accessibility.reducedMotion ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="p-6 bg-surface rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text mb-4">Interactive Elements</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-theme shadow-md hover:shadow-lg"
                >
                  Count: {count}
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surface-hover transition-all duration-theme"
                >
                  Reset
                </button>
              </div>

              <input
                type="text"
                placeholder="Type something..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-theme"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="demo-checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="demo-checkbox" className="text-text">
                  Sample checkbox
                </label>
              </div>
            </div>
          </div>

          {/* Sample Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-success bg-opacity-10 border border-success rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-success">Success</h3>
              </div>
              <p className="text-sm text-text-secondary">
                This is a success message card with themed colors
              </p>
            </div>

            <div className="p-6 bg-warning bg-opacity-10 border border-warning rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-warning">Warning</h3>
              </div>
              <p className="text-sm text-text-secondary">
                This is a warning message card with themed colors
              </p>
            </div>

            <div className="p-6 bg-error bg-opacity-10 border border-error rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-error">Error</h3>
              </div>
              <p className="text-sm text-text-secondary">
                This is an error message card with themed colors
              </p>
            </div>
          </div>

          {/* Typography Samples */}
          <div className="lg:col-span-2 p-6 bg-surface rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text mb-4">Typography</h2>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-text">Heading 1</h1>
              <h2 className="text-3xl font-bold text-text">Heading 2</h2>
              <h3 className="text-2xl font-semibold text-text">Heading 3</h3>
              <p className="text-base text-text">
                This is regular body text. The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-text-secondary">
                This is secondary text with reduced emphasis.
              </p>
              <p className="text-xs text-text-secondary">
                This is small text for captions and labels.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-primary bg-opacity-10 border border-primary rounded-xl">
          <h3 className="text-lg font-semibold text-primary mb-2">
            How to Test
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Click the theme toggle to switch between light and dark modes</li>
            <li>• Click "Theme Settings" to open the full customization panel</li>
            <li>• Try different color schemes (Default, Ocean, Forest, Sunset)</li>
            <li>• Test accessibility features like high contrast and font size</li>
            <li>• Enable reduced motion to see animations disabled</li>
            <li>• All changes are saved automatically to localStorage</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ThemeDemo;
