import { useState, useRef } from 'react';
import { colorSchemes } from '../../styles/themes';
import { useTheme } from '../../hooks/useTheme';
import { getColorSchemeDescription } from '../../utils/a11yUtils';

const ColorSchemePicker = ({ currentScheme, onSchemeChange }) => {
  const { mode } = useTheme();
  const [hoveredScheme, setHoveredScheme] = useState(null);
  const [rippleScheme, setRippleScheme] = useState(null);

  const schemes = Object.values(colorSchemes);

  const getSchemeColors = (scheme) => {
    const colors = scheme[mode];
    return [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.background,
      colors.surface
    ];
  };

  const handleSchemeClick = (schemeId) => {
    // Trigger ripple effect
    setRippleScheme(schemeId);
    setTimeout(() => setRippleScheme(null), 600);
    
    // Change scheme
    onSchemeChange(schemeId);
  };

  return (
    <div className="space-y-4" role="region" aria-label="Color scheme selection">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text" id="color-scheme-heading">
          Color Schemes
        </h3>
        <span className="text-sm text-text-secondary" aria-live="polite">
          {schemes.find(s => s.id === currentScheme)?.name || 'Default'}
        </span>
      </div>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        role="radiogroup"
        aria-labelledby="color-scheme-heading"
      >
        {schemes.map((scheme) => {
          const isSelected = currentScheme === scheme.id;
          const isHovered = hoveredScheme === scheme.id;
          const colors = getSchemeColors(scheme);

          return (
            <button
              key={scheme.id}
              onClick={() => handleSchemeClick(scheme.id)}
              onMouseEnter={() => setHoveredScheme(scheme.id)}
              onMouseLeave={() => setHoveredScheme(null)}
              className={`
                scheme-card relative p-4 rounded-lg border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-primary bg-surface shadow-lg scale-105 scheme-card-selected' 
                  : 'border-border bg-surface hover:border-primary hover:shadow-md'
                }
                ${isHovered && !isSelected ? 'scale-102' : ''}
                ${rippleScheme === scheme.id ? 'ripple-active' : ''}
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              `}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${scheme.name} color scheme. ${getColorSchemeDescription(scheme.id)}`}
              aria-describedby={`scheme-desc-${scheme.id}`}
              type="button"
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  <span className="sr-only">Selected</span>
                </div>
              )}

              {/* Scheme info */}
              <div className="mb-3">
                <h4 className="text-base font-semibold text-text mb-1">
                  {scheme.name}
                </h4>
                <p className="text-xs text-text-secondary" id={`scheme-desc-${scheme.id}`}>
                  {scheme.description}
                </p>
              </div>

              {/* Color swatches */}
              <div className="flex gap-1.5" role="presentation" aria-hidden="true">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`
                      scheme-swatch flex-1 h-10 rounded transition-transform duration-300
                      ${isHovered ? 'scale-105' : ''}
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Hover preview effect */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 bg-primary opacity-5 rounded-lg pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current scheme info */}
      <div className="mt-4 p-3 bg-surface rounded-lg border border-border">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text">Current scheme:</span>{' '}
          {schemes.find(s => s.id === currentScheme)?.description || 'Classic blue theme with balanced contrast'}
        </p>
      </div>
    </div>
  );
};

export default ColorSchemePicker;
