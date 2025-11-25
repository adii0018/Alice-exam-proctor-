// Animated Theme Button - Cool palette animation with color drops
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedThemeButton.css';

const AnimatedThemeButton = ({ currentTheme, onThemeChange, className = '', style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'theme-ocean', name: '🌊 Ocean Blue', color: '#3b82f6' },
    { id: 'theme-forest', name: '🌲 Forest Green', color: '#10b981' },
    { id: 'theme-sunset', name: '🌅 Sunset Orange', color: '#f59e0b' },
    { id: 'theme-galaxy', name: '🌌 Purple Galaxy', color: '#8b5cf6' },
    { id: 'theme-rose', name: '🌹 Rose Gold', color: '#ec4899' },
    { id: 'theme-dark', name: '🌙 Dark Mode', color: '#1f2937' }
  ];

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  const handleThemeSelect = (themeId) => {
    console.log('🎨 Theme selected:', themeId);
    onThemeChange(themeId);
    setIsOpen(false);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎨 Theme button clicked, current state:', isOpen);
    const newState = !isOpen;
    setIsOpen(newState);
    console.log('🎨 New state will be:', newState);
    
    // Emergency DOM manipulation if React state fails
    setTimeout(() => {
      const container = e.target.closest('.animated-theme-container');
      if (container) {
        const simpleDropdown = container.querySelector('.theme-dropdown-simple');
        if (simpleDropdown) {
          if (newState) {
            simpleDropdown.style.display = 'block';
            simpleDropdown.style.visibility = 'visible';
            simpleDropdown.style.opacity = '1';
            simpleDropdown.classList.add('visible');
            simpleDropdown.classList.remove('hidden');
            console.log('🎨 Forced dropdown visible via DOM');
          } else {
            simpleDropdown.style.display = 'none';
            simpleDropdown.style.visibility = 'hidden';
            simpleDropdown.style.opacity = '0';
            simpleDropdown.classList.add('hidden');
            simpleDropdown.classList.remove('visible');
            console.log('🎨 Forced dropdown hidden via DOM');
          }
        }
      }
    }, 50);
  };

  return (
    <div className={`animated-theme-container ${className}`} style={style}>
      <motion.button
        className="palette-button"
        onClick={handleButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 47 47" className="palette">
          <path 
            strokeWidth={2} 
            stroke="black" 
            d="M23.5 46C11.0736 46 1 35.9264 1 23.5C1 11.0736 11.0736 1 23.5 1C35.9264 1 46 11.0736 46 23.5C46 24.2461 45.7117 24.7823 45.1652 25.2415C44.5763 25.7365 43.6859 26.1372 42.5263 26.4835C41.3771 26.8267 40.0662 27.0884 38.6848 27.3617L38.6142 27.3757C37.275 27.6407 35.8737 27.9179 34.5961 28.2889C32.0955 29.015 29.5022 30.2591 29.1333 33.106C28.9574 34.463 29.3233 36.0257 30.2167 37.8342C31.0026 39.425 32.2278 41.2689 33.9671 43.4224C30.8413 45.0683 27.2807 46 23.5 46Z" 
          />
          <circle fill="none" className="color-drop drop1" strokeWidth={2} stroke="black" r="3.5" cy="13.5" cx="33.5" />
          <circle fill="none" className="color-drop drop2" strokeWidth={2} stroke="black" r="3.5" cy="10.5" cx="20.5" />
          <circle fill="none" className="color-drop drop3" strokeWidth={2} stroke="black" r="3.5" cy="18.5" cx="10.5" />
          <circle fill="none" className="color-drop drop4" strokeWidth={2} stroke="black" r="3.5" cy="31.5" cx="11.5" />
        </svg>
        <span className="theme-button-text">Themes</span>
      </motion.button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                style={{ '--theme-color': theme.color }}
              >
                <div 
                  className="theme-color-preview" 
                  style={{ backgroundColor: theme.color }}
                />
                <span className="theme-name">{theme.name}</span>
                {currentTheme === theme.id && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeTheme"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Dropdown (always render when open) */}
      <div 
        className={`theme-dropdown-simple ${isOpen ? 'visible' : 'hidden'}`}
        style={{ 
          display: isOpen ? 'block' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0
        }}
      >
        {themes.map((theme) => (
          <button
            key={`simple-${theme.id}`}
            className={`theme-option-simple ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            <div 
              className="theme-color-preview-simple" 
              style={{ backgroundColor: theme.color }}
            />
            <span>{theme.name}</span>
            {currentTheme === theme.id && <span> ✓</span>}
          </button>
        ))}
      </div>

      {/* Debug Info */}
      <div className="theme-debug-info">
        State: {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="theme-backdrop" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AnimatedThemeButton;