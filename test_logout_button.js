// Logout Button Visibility Test
console.log('🔍 Testing logout button visibility...');

// Test function to check logout button
function testLogoutButton() {
  console.log('\n=== LOGOUT BUTTON TEST ===');
  
  // Wait for page to load
  setTimeout(() => {
    // Find all possible logout buttons
    const selectors = [
      '.logout-btn',
      '.logout-btn-enhanced',
      'button[title*="Logout"]',
      'button[class*="logout"]',
      '[class*="logout-btn"]'
    ];
    
    let foundButtons = [];
    
    selectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        foundButtons.push({ selector, count: buttons.length, buttons: Array.from(buttons) });
      }
    });
    
    console.log('Found logout buttons:', foundButtons);
    
    // Check visibility of each button
    foundButtons.forEach(({ selector, buttons }) => {
      buttons.forEach((button, index) => {
        const styles = window.getComputedStyle(button);
        const rect = button.getBoundingClientRect();
        
        console.log(`Button ${selector}[${index}]:`, {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
          position: styles.position,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.opacity !== '0'
        });
      });
    });
    
    // Test click functionality
    if (foundButtons.length > 0) {
      const firstButton = foundButtons[0].buttons[0];
      console.log('Testing click on first button...');
      
      // Add test click listener
      firstButton.addEventListener('click', (e) => {
        console.log('✅ Logout button clicked successfully!');
        e.preventDefault(); // Prevent actual logout during test
      });
      
      // Simulate hover
      firstButton.dispatchEvent(new MouseEvent('mouseenter'));
      setTimeout(() => {
        firstButton.dispatchEvent(new MouseEvent('mouseleave'));
      }, 1000);
    }
    
    return foundButtons.length > 0;
  }, 2000);
}

// Auto-run test
testLogoutButton();

// Export for manual testing
window.testLogoutButton = testLogoutButton;

console.log('🧪 Logout button test loaded. Results will appear in 2 seconds.');