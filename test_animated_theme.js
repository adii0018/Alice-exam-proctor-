// Animated Theme Button Test
console.log('🎨 Testing animated theme button...');

function testAnimatedTheme() {
  console.log('\n=== ANIMATED THEME BUTTON TEST ===');
  
  setTimeout(() => {
    // Find animated theme buttons
    const themeButtons = document.querySelectorAll('.palette-button');
    const themeContainers = document.querySelectorAll('.animated-theme-container');
    
    console.log('Found theme buttons:', themeButtons.length);
    console.log('Found theme containers:', themeContainers.length);
    
    themeButtons.forEach((button, index) => {
      const styles = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      console.log(`Theme Button ${index + 1}:`, {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        width: rect.width,
        height: rect.height,
        backgroundColor: styles.backgroundColor,
        position: styles.position,
        zIndex: styles.zIndex,
        isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.opacity !== '0'
      });
      
      // Test palette SVG
      const palette = button.querySelector('.palette');
      if (palette) {
        const paletteStyles = window.getComputedStyle(palette);
        console.log(`Palette SVG ${index + 1}:`, {
          width: paletteStyles.width,
          height: paletteStyles.height,
          transform: paletteStyles.transform
        });
      }
      
      // Test color drops
      const drops = button.querySelectorAll('.color-drop');
      console.log(`Color drops found: ${drops.length}`);
      
      drops.forEach((drop, dropIndex) => {
        const dropStyles = window.getComputedStyle(drop);
        console.log(`Drop ${dropIndex + 1}:`, {
          fill: dropStyles.fill,
          className: drop.className
        });
      });
      
      // Test hover animation
      console.log(`Testing hover animation for theme button ${index + 1}...`);
      
      // Simulate mouseenter
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      setTimeout(() => {
        const hoverStyles = window.getComputedStyle(button);
        const hoverPalette = button.querySelector('.palette');
        const hoverPaletteStyles = hoverPalette ? window.getComputedStyle(hoverPalette) : null;
        
        console.log(`Button ${index + 1} on hover:`, {
          backgroundColor: hoverStyles.backgroundColor,
          color: hoverStyles.color,
          transform: hoverStyles.transform,
          paletteTransform: hoverPaletteStyles ? hoverPaletteStyles.transform : 'N/A'
        });
        
        // Simulate mouseleave
        button.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      }, 500);
      
      // Test click functionality (dropdown)
      setTimeout(() => {
        console.log(`Testing dropdown for theme button ${index + 1}...`);
        
        // Simulate click to open dropdown
        button.click();
        
        setTimeout(() => {
          const dropdown = document.querySelector('.theme-dropdown');
          if (dropdown) {
            const dropdownStyles = window.getComputedStyle(dropdown);
            const dropdownRect = dropdown.getBoundingClientRect();
            
            console.log('Theme Dropdown:', {
              display: dropdownStyles.display,
              visibility: dropdownStyles.visibility,
              opacity: dropdownStyles.opacity,
              width: dropdownRect.width,
              height: dropdownRect.height,
              zIndex: dropdownStyles.zIndex,
              isVisible: dropdownRect.width > 0 && dropdownRect.height > 0
            });
            
            // Test theme options
            const options = dropdown.querySelectorAll('.theme-option');
            console.log(`Theme options found: ${options.length}`);
            
            options.forEach((option, optionIndex) => {
              const optionStyles = window.getComputedStyle(option);
              const colorPreview = option.querySelector('.theme-color-preview');
              const themeName = option.querySelector('.theme-name');
              
              console.log(`Option ${optionIndex + 1}:`, {
                text: themeName ? themeName.textContent : 'N/A',
                backgroundColor: optionStyles.backgroundColor,
                color: optionStyles.color,
                isActive: option.classList.contains('active'),
                previewColor: colorPreview ? window.getComputedStyle(colorPreview).backgroundColor : 'N/A'
              });
            });
            
            // Test selecting a theme
            if (options.length > 0) {
              console.log('Testing theme selection...');
              const firstOption = options[0];
              
              // Add test click listener
              const testClickHandler = (e) => {
                console.log('✅ Theme option clicked successfully!');
                console.log('Selected theme:', firstOption.querySelector('.theme-name')?.textContent);
                firstOption.removeEventListener('click', testClickHandler);
              };
              
              firstOption.addEventListener('click', testClickHandler);
              firstOption.click();
            }
          } else {
            console.log('❌ Theme dropdown not found after click');
          }
        }, 300);
      }, 1500);
    });
    
    // Test responsive behavior
    console.log('Testing responsive behavior...');
    
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      console.log('Current view: Desktop - Full button with text');
    } else if (screenWidth > 480) {
      console.log('Current view: Tablet - Compact button');
    } else {
      console.log('Current view: Mobile - Icon only');
    }
    
    return themeButtons.length > 0;
  }, 2000);
}

// Test theme switching functionality
function testThemeSwitching() {
  console.log('\n=== THEME SWITCHING TEST ===');
  
  setTimeout(() => {
    const themeButton = document.querySelector('.palette-button');
    if (!themeButton) {
      console.log('No theme button found for switching test');
      return;
    }
    
    // Open dropdown
    themeButton.click();
    
    setTimeout(() => {
      const options = document.querySelectorAll('.theme-option');
      if (options.length === 0) {
        console.log('No theme options found');
        return;
      }
      
      console.log('Testing theme switching sequence...');
      
      let currentIndex = 0;
      const switchTheme = () => {
        if (currentIndex < options.length) {
          const option = options[currentIndex];
          const themeName = option.querySelector('.theme-name')?.textContent;
          
          console.log(`Switching to: ${themeName}`);
          option.click();
          
          // Check if theme was applied
          setTimeout(() => {
            const body = document.body;
            const appliedTheme = Array.from(body.classList).find(cls => cls.startsWith('theme-'));
            console.log(`Applied theme class: ${appliedTheme || 'none'}`);
            
            currentIndex++;
            if (currentIndex < options.length) {
              // Open dropdown again for next theme
              setTimeout(() => {
                themeButton.click();
                setTimeout(switchTheme, 200);
              }, 500);
            } else {
              console.log('✅ Theme switching test completed');
            }
          }, 200);
        }
      };
      
      switchTheme();
    }, 300);
  }, 4000);
}

// Auto-run tests
testAnimatedTheme();
testThemeSwitching();

// Export for manual testing
window.testAnimatedTheme = testAnimatedTheme;
window.testThemeSwitching = testThemeSwitching;

console.log('🎨 Animated theme button test loaded. Results will appear in 2 seconds.');