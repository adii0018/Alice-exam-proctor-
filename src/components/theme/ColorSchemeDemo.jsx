import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import ColorSchemePicker from './ColorSchemePicker';
import ThemeToggle from './ThemeToggle';

/**
 * Demo component to showcase color scheme functionality
 * This can be added to any page to test the color schemes
 */
const ColorSchemeDemo = () => {
  const { theme, setScheme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Theme Customization</h2>
        <ThemeToggle />
      </div>

      {/* Color Scheme Picker */}
      <ColorSchemePicker 
        currentScheme={theme.scheme} 
        onSchemeChange={setScheme}
      />

      {/* Demo UI Elements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Preview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="p-6 bg-surface border border-border rounded-lg">
            <h4 className="text-lg font-semibold text-text mb-2">Sample Card</h4>
            <p className="text-text-secondary mb-4">
              This is a preview of how your content will look with the selected theme.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Primary Button
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-surface border border-border rounded-lg">
            <h4 className="text-lg font-semibold text-text mb-2">Color Palette</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary"></div>
                <span className="text-text-secondary text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-secondary"></div>
                <span className="text-text-secondary text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-accent"></div>
                <span className="text-text-secondary text-sm">Accent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface border-l-4 border-error rounded">
            <p className="text-error font-semibold">Error</p>
          </div>
          <div className="p-4 bg-surface border-l-4 border-success rounded">
            <p className="text-success font-semibold">Success</p>
          </div>
          <div className="p-4 bg-surface border-l-4 border-warning rounded">
            <p className="text-warning font-semibold">Warning</p>
          </div>
          <div className="p-4 bg-surface border-l-4 border-info rounded">
            <p className="text-info font-semibold">Info</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeDemo;
