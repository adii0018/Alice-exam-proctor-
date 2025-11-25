// Animated Logout Button Test
console.log('🎨 Testing animated logout button...');

function testAnimatedLogout() {
  console.log('\n=== ANIMATED LOGOUT BUTTON TEST ===');
  
  setTimeout(() => {
    // Find animated logout buttons
    const animatedButtons = document.querySelectorAll('.animated-logout-btn');
    
    console.log('Found animated logout buttons:', animatedButtons.length);
    
    animatedButtons.forEach((button, index) => {
      const styles = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      console.log(`Animated Button ${index + 1}:`, {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        width: rect.width,
        height: rect.height,
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        position: styles.position,
        zIndex: styles.zIndex,
        isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.opacity !== '0'
      });
      
      // Test hover animation
      console.log(`Testing hover animation for button ${index + 1}...`);
      
      // Simulate mouseenter
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      setTimeout(() => {
        const hoverStyles = window.getComputedStyle(button);
        const hoverRect = button.getBoundingClientRect();
        
        console.log(`Button ${index + 1} on hover:`, {
          width: hoverRect.width,
          borderRadius: hoverStyles.borderRadius,
          backgroundColor: hoverStyles.backgroundColor
        });
        
        // Check text visibility on hover
        const textElement = button.querySelector('.logout-text-animated');
        if (textElement) {
          const textStyles = window.getComputedStyle(textElement);
          console.log(`Text visibility on hover:`, {
            opacity: textStyles.opacity,
            width: textStyles.width
          });
        }
        
        // Simulate mouseleave
        button.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      }, 500);
      
      // Test click functionality
      setTimeout(() => {
        console.log(`Testing click for button ${index + 1}...`);
        
        // Add test click listener
        const testClickHandler = (e) => {
          console.log('✅ Animated logout button clicked successfully!');
          e.preventDefault(); // Prevent actual logout during test
          button.removeEventListener('click', testClickHandler);
        };
        
        button.addEventListener('click', testClickHandler);
        
        // Simulate click
        button.click();
      }, 1000);
    });
    
    // Test SVG icon
    const svgIcons = document.querySelectorAll('.logout-sign svg');
    console.log('SVG icons found:', svgIcons.length);
    
    svgIcons.forEach((svg, index) => {
      const svgStyles = window.getComputedStyle(svg);
      console.log(`SVG ${index + 1}:`, {
        width: svgStyles.width,
        height: svgStyles.height,
        fill: svgStyles.fill
      });
    });
    
    // Test responsive behavior
    console.log('Testing responsive behavior...');
    
    const originalWidth = window.innerWidth;
    
    // Test mobile view
    if (originalWidth > 768) {
      console.log('Current view: Desktop');
      console.log('Button should expand to ~125px on hover');
    } else if (originalWidth > 480) {
      console.log('Current view: Tablet');
      console.log('Button should expand to ~110px on hover');
    } else {
      console.log('Current view: Mobile');
      console.log('Button should expand to ~100px on hover');
    }
    
    return animatedButtons.length > 0;
  }, 2000);
}

// Test animation performance
function testAnimationPerformance() {
  console.log('\n=== ANIMATION PERFORMANCE TEST ===');
  
  const button = document.querySelector('.animated-logout-btn');
  if (!button) {
    console.log('No animated button found for performance test');
    return;
  }
  
  let hoverCount = 0;
  const maxHovers = 10;
  const startTime = performance.now();
  
  const performanceTest = () => {
    if (hoverCount < maxHovers) {
      // Simulate rapid hover/unhover
      button.dispatchEvent(new MouseEvent('mouseenter'));
      
      setTimeout(() => {
        button.dispatchEvent(new MouseEvent('mouseleave'));
        hoverCount++;
        
        setTimeout(performanceTest, 100);
      }, 100);
    } else {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log('Animation Performance Results:', {
        totalHovers: maxHovers,
        totalTime: `${totalTime.toFixed(2)}ms`,
        averageTime: `${(totalTime / maxHovers).toFixed(2)}ms per hover`,
        performance: totalTime < 1000 ? 'Excellent' : totalTime < 2000 ? 'Good' : 'Needs optimization'
      });
    }
  };
  
  performanceTest();
}

// Auto-run tests
testAnimatedLogout();

setTimeout(() => {
  testAnimationPerformance();
}, 5000);

// Export for manual testing
window.testAnimatedLogout = testAnimatedLogout;
window.testAnimationPerformance = testAnimationPerformance;

console.log('🎨 Animated logout button test loaded. Results will appear in 2 seconds.');