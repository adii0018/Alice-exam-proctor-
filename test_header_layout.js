// Teacher Header Layout Test
console.log('🧪 Testing teacher header layout...');

function testHeaderLayout() {
  console.log('\n=== HEADER LAYOUT TEST ===');
  
  setTimeout(() => {
    // Find header elements
    const nav = document.querySelector('.teacher-nav');
    const container = document.querySelector('.teacher-nav-container');
    const logo = document.querySelector('.teacher-logo');
    const menu = document.querySelector('.teacher-nav-menu');
    const userSection = document.querySelector('.teacher-user-section');
    const logoutBtn = document.querySelector('.logout-btn-enhanced');
    
    console.log('Header Elements Found:', {
      nav: !!nav,
      container: !!container,
      logo: !!logo,
      menu: !!menu,
      userSection: !!userSection,
      logoutBtn: !!logoutBtn
    });
    
    if (container) {
      const containerStyles = window.getComputedStyle(container);
      const containerRect = container.getBoundingClientRect();
      
      console.log('Container Layout:', {
        display: containerStyles.display,
        justifyContent: containerStyles.justifyContent,
        alignItems: containerStyles.alignItems,
        gap: containerStyles.gap,
        width: containerRect.width,
        height: containerRect.height,
        overflow: containerStyles.overflow
      });
    }
    
    if (userSection) {
      const userStyles = window.getComputedStyle(userSection);
      const userRect = userSection.getBoundingClientRect();
      
      console.log('User Section Layout:', {
        display: userStyles.display,
        justifyContent: userStyles.justifyContent,
        alignItems: userStyles.alignItems,
        gap: userStyles.gap,
        width: userRect.width,
        minWidth: userStyles.minWidth,
        flexShrink: userStyles.flexShrink
      });
    }
    
    if (logoutBtn) {
      const btnStyles = window.getComputedStyle(logoutBtn);
      const btnRect = logoutBtn.getBoundingClientRect();
      
      console.log('Logout Button Layout:', {
        display: btnStyles.display,
        visibility: btnStyles.visibility,
        opacity: btnStyles.opacity,
        position: btnStyles.position,
        zIndex: btnStyles.zIndex,
        width: btnRect.width,
        height: btnRect.height,
        minWidth: btnStyles.minWidth,
        flexShrink: btnStyles.flexShrink,
        isVisible: btnRect.width > 0 && btnRect.height > 0 && btnStyles.visibility !== 'hidden' && btnStyles.opacity !== '0',
        isClickable: btnRect.top >= 0 && btnRect.left >= 0 && btnRect.right <= window.innerWidth && btnRect.bottom <= window.innerHeight
      });
      
      // Test if button is actually clickable
      const elementAtPoint = document.elementFromPoint(
        btnRect.left + btnRect.width / 2,
        btnRect.top + btnRect.height / 2
      );
      
      console.log('Button Clickability:', {
        elementAtCenter: elementAtPoint === logoutBtn || logoutBtn.contains(elementAtPoint),
        elementAtPoint: elementAtPoint?.className || 'none'
      });
    }
    
    // Test responsive behavior
    console.log('Screen Size:', {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024
    });
    
    // Check for overlapping elements
    if (container) {
      const children = Array.from(container.children);
      const overlaps = [];
      
      for (let i = 0; i < children.length; i++) {
        for (let j = i + 1; j < children.length; j++) {
          const rect1 = children[i].getBoundingClientRect();
          const rect2 = children[j].getBoundingClientRect();
          
          const overlap = !(rect1.right < rect2.left || 
                           rect2.right < rect1.left || 
                           rect1.bottom < rect2.top || 
                           rect2.bottom < rect1.top);
          
          if (overlap) {
            overlaps.push({
              element1: children[i].className,
              element2: children[j].className
            });
          }
        }
      }
      
      console.log('Element Overlaps:', overlaps.length > 0 ? overlaps : 'None detected');
    }
    
    return {
      headerExists: !!nav,
      layoutCorrect: !!container && !!logo && !!menu && !!userSection,
      logoutVisible: !!logoutBtn && logoutBtn.getBoundingClientRect().width > 0
    };
  }, 2000);
}

// Auto-run test
testHeaderLayout();

// Export for manual testing
window.testHeaderLayout = testHeaderLayout;

console.log('🧪 Header layout test loaded. Results will appear in 2 seconds.');