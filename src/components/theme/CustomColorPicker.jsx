import { useState, useEffect, useMemo } from 'react';
import { isValidHexColor, normalizeHexColor, validateContrast } from '../../utils/colorUtils';
import { useTheme } from '../../hooks/useTheme';
import { colorSchemes } from '../../styles/themes';

const ContrastIndicator = ({ ratio, passes }) => {
  return (
    <div className={`flex items-center gap-1 text-xs ${passes ? 'text-success' : 'text-warning'}`}>
      {passes ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      <span>{ratio.toFixed(2)}:1</span>
    </div>
  );
};

const ColorInput = ({ label, value, onChange, error }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    if (isValidHexColor(localValue)) {
      onChange(normalizeHexColor(localValue));
    } else {
      setLocalValue(value); // Reset to valid value
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded border-2 border-border cursor-pointer"
          title={`Pick ${label.toLowerCase()}`}
        />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="#000000"
          maxLength={7}
          className={`flex-1 px-3 py-2 rounded border-2 ${
            error ? 'border-error' : 'border-border'
          } bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary`}
        />
      </div>
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
};

const CustomColorPicker = ({ onClose }) => {
  const { theme, setCustomColors } = useTheme();
  
  // Initialize with current custom colors or default light colors
  const [colors, setColors] = useState(() => {
    if (theme.scheme === 'custom' && theme.customColors) {
      return theme.customColors;
    }
    return colorSchemes.default[theme.mode];
  });

  const [errors, setErrors] = useState({});

  // Memoize contrast calculations to avoid unnecessary recalculations
  // This significantly improves performance when colors change
  const contrastResults = useMemo(() => {
    const results = {};
    
    // Text on background
    results.textBackground = validateContrast(colors.text, colors.background);
    
    // Text on surface
    results.textSurface = validateContrast(colors.text, colors.surface);
    
    // Text secondary on background
    results.textSecondaryBackground = validateContrast(colors.textSecondary, colors.background);
    
    // Text secondary on surface
    results.textSecondarySurface = validateContrast(colors.textSecondary, colors.surface);
    
    // Primary on background (for buttons)
    results.primaryButton = validateContrast('#ffffff', colors.primary);
    
    return results;
  }, [colors.text, colors.background, colors.surface, colors.textSecondary, colors.primary]);

  const handleColorChange = (key, value) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const validateColors = () => {
    const newErrors = {};

    // Validate hex format
    Object.entries(colors).forEach(([key, value]) => {
      if (!isValidHexColor(value)) {
        newErrors[key] = 'Invalid hex color format';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = () => {
    if (validateColors()) {
      setCustomColors(colors);
      if (onClose) onClose();
    }
  };

  const handleReset = () => {
    const defaultColors = colorSchemes.default[theme.mode];
    setColors(defaultColors);
    setErrors({});
  };

  const handleLoadFromScheme = (schemeName) => {
    const schemeData = colorSchemes[schemeName];
    if (schemeData) {
      setColors(schemeData[theme.mode]);
      setErrors({});
    }
  };

  const handleExport = () => {
    const themeExport = {
      name: 'Custom Theme',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      colors: colors,
      mode: theme.mode
    };

    const dataStr = JSON.stringify(themeExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `etrixx-theme-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        
        // Validate structure
        if (!imported.colors || typeof imported.colors !== 'object') {
          alert('Invalid theme file: missing colors object');
          return;
        }

        // Validate required color keys
        const requiredKeys = ['primary', 'secondary', 'accent', 'background', 'surface', 'text'];
        const hasAllKeys = requiredKeys.every(key => key in imported.colors);
        
        if (!hasAllKeys) {
          alert('Invalid theme file: missing required color properties');
          return;
        }

        // Validate hex colors
        const allValid = Object.values(imported.colors).every(color => 
          typeof color === 'string' && isValidHexColor(color)
        );

        if (!allValid) {
          alert('Invalid theme file: some colors are not valid hex values');
          return;
        }

        // Apply imported colors
        setColors(imported.colors);
        setErrors({});
        
      } catch (error) {
        alert('Failed to import theme: invalid JSON file');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    // Reset input so same file can be imported again
    event.target.value = '';
  };

  // Color groups for better organization
  const colorGroups = [
    {
      title: 'Brand Colors',
      colors: [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'accent', label: 'Accent' }
      ]
    },
    {
      title: 'Background Colors',
      colors: [
        { key: 'background', label: 'Background' },
        { key: 'surface', label: 'Surface' }
      ]
    },
    {
      title: 'Text Colors',
      colors: [
        { key: 'text', label: 'Text' },
        { key: 'textSecondary', label: 'Text Secondary' }
      ]
    },
    {
      title: 'UI Colors',
      colors: [
        { key: 'border', label: 'Border' },
        { key: 'error', label: 'Error' },
        { key: 'success', label: 'Success' },
        { key: 'warning', label: 'Warning' },
        { key: 'info', label: 'Info' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Custom Colors</h3>
        <div className="flex gap-2">
          <select
            onChange={(e) => handleLoadFromScheme(e.target.value)}
            className="px-3 py-1 text-sm rounded bg-surface text-text border border-border hover:bg-border transition-colors cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Load from scheme...</option>
            {Object.entries(colorSchemes).map(([key, scheme]) => (
              <option key={key} value={key}>
                {scheme.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm rounded bg-surface text-text-secondary hover:bg-border transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {theme.scheme === 'custom' && (
        <div className="flex items-center gap-2 p-3 rounded bg-primary bg-opacity-10 border border-primary text-primary text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>You are currently using custom colors. Changes will be saved automatically.</span>
        </div>
      )}

      <div className="space-y-6">
        {colorGroups.map(group => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              {group.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.colors.map(({ key, label }) => (
                <ColorInput
                  key={key}
                  label={label}
                  value={colors[key]}
                  onChange={(value) => handleColorChange(key, value)}
                  error={errors[key]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contrast Validation Section */}
      <div className="space-y-3 p-4 rounded-lg bg-surface border border-border">
        <h4 className="text-sm font-semibold text-text flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contrast Validation (WCAG AA: 4.5:1)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Text on Background:</span>
            <ContrastIndicator 
              ratio={contrastResults.textBackground?.ratio || 0}
              passes={contrastResults.textBackground?.passes || false}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Text on Surface:</span>
            <ContrastIndicator 
              ratio={contrastResults.textSurface?.ratio || 0}
              passes={contrastResults.textSurface?.passes || false}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Secondary Text on Background:</span>
            <ContrastIndicator 
              ratio={contrastResults.textSecondaryBackground?.ratio || 0}
              passes={contrastResults.textSecondaryBackground?.passes || false}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Secondary Text on Surface:</span>
            <ContrastIndicator 
              ratio={contrastResults.textSecondarySurface?.ratio || 0}
              passes={contrastResults.textSecondarySurface?.passes || false}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Primary Button Text:</span>
            <ContrastIndicator 
              ratio={contrastResults.primaryButton?.ratio || 0}
              passes={contrastResults.primaryButton?.passes || false}
            />
          </div>
        </div>
        {Object.values(contrastResults).some(result => !result.passes) && (
          <div className="flex items-start gap-2 p-3 rounded bg-warning bg-opacity-10 border border-warning text-warning">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">Insufficient Contrast Detected</p>
              <p className="text-xs mt-1">Some color combinations don't meet WCAG AA standards (4.5:1). This may affect readability for users with visual impairments.</p>
            </div>
          </div>
        )}
      </div>

      {/* Export/Import Section */}
      <div className="flex gap-3 p-4 rounded-lg bg-surface border border-border">
        <button
          onClick={handleExport}
          className="flex-1 px-4 py-2 rounded bg-background text-text border border-border hover:bg-border transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Theme
        </button>
        <label className="flex-1 px-4 py-2 rounded bg-background text-text border border-border hover:bg-border transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Theme
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 rounded bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Apply Custom Colors
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface text-text hover:bg-border transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomColorPicker;
