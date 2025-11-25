// Debug Theme Button - Check if dropdown is working
console.log('🔍 Debug: Theme button dropdown test');

// Wait for page to load
setTimeout(() => {
  console.log('🔍 Looking for theme buttons...');
  
  const paletteButtons = document.querySelectorAll('.palette-button');
  const themeContainers = document.querySelectorAll('.animated-theme-container');
  
  console.log('Found palette buttons:', paletteButtons.length);
  console.log('Found theme containers:', themeContainers.length);
  
  if (paletteButtons.length > 0) {
    const button = paletteButtons[0];
    
    console.log('🔍 Button found, testing click...');
    
    // Add click listener to see if it's working
    button.addEventListener('click', (e) => {
      console.log('✅ Button clicked!', e);
      
      // Check for dropdown after click
      setTimeout(() => {
        const dropdown = document.querySelector('.theme-dropdown');
        const fallbackDropdown = document.querySelector('.theme-dropdown-fallback');
        
        console.log('After click:');
        console.log('- theme-dropdown found:', !!dropdown);
        console.log('- theme-dropdown-fallback found:', !!fallbackDropdown);
        
        if (dropdown) {
          const styles = window.getComputedStyle(dropdown);
          console.log('Dropdown styles:', {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            position: styles.position,
            top: styles.top,
            left: styles.left
          });
        }
        
        if (fallbackDropdown) {
          const fallbackStyles = window.getComputedStyle(fallbackDropdown);
          console.log('Fallback dropdown styles:', {
            display: fallbackStyles.display,
            visibility: fallbackStyles.visibility,
            opacity: fallbackStyles.opacity,
            zIndex: fallbackStyles.zIndex,
            position: fallbackStyles.position,
            top: fallbackStyles.top,
            left: fallbackStyles.left
          });
        }
        
        // Check for theme options
        const options = document.querySelectorAll('.theme-option, .theme-option-fallback');
        console.log('Theme options found:', options.length);
        
        options.forEach((option, index) => {
          console.log(`Option ${index + 1}:`, {
            text: option.textContent,
            visible: option.offsetWidth > 0 && option.offsetHeight > 0
          });
        });
      }, 100);
    });
    
    // Auto-click for testing
    console.log('🔍 Auto-clicking button in 2 seconds...');
    setTimeout(() => {
      button.click();
    }, 2000);
  } else {
    console.log('❌ No theme buttons found');
  }
}, 1000);

// Export for manual testing
window.debugThemeButton = () => {
  const button = document.querySelector('.palette-button');
  if (button) {
    button.click();
    console.log('Manual click executed');
  } else {
    console.log('No button found for manual click');
  }
};