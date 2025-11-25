/**
 * Performance Optimizer Utility - yeh app ki performance improve karta hai
 * Scroll aur zoom ke time heavy animations pause kar deta hai
 */

class PerformanceOptimizer {
  constructor() {
    // Performance states track karte hain
    this.isScrolling = false; // Scroll ho raha hai ya nahi
    this.isZooming = false; // Zoom ho raha hai ya nahi
    this.scrollTimeout = null; // Scroll timeout
    this.zoomTimeout = null; // Zoom timeout
    this.animationElements = []; // Animation elements ka array
    
    this.init(); // Initialize kar dete hain
  }

  init() {
    // Saare optimizations setup karte hain
    this.optimizeScrolling(); // Scroll performance optimize karte hain
    
    this.optimizeZooming(); // Zoom performance optimize karte hain
    
    this.optimizeAnimations(); // Animations optimize karte hain
    
    this.handleVisibilityChange(); // Page visibility changes handle karte hain
  }

  optimizeScrolling() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
  }

  onScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.pauseHeavyAnimations();
    }

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.resumeAnimations();
    }, 150);
  }

  optimizeZooming() {
    let lastScale = 1;

    const handleZoom = (e) => {
      const currentScale = e.scale || (window.outerWidth / window.innerWidth);
      
      if (Math.abs(currentScale - lastScale) > 0.1) {
        if (!this.isZooming) {
          this.isZooming = true;
          this.pauseHeavyAnimations();
        }

        clearTimeout(this.zoomTimeout);
        this.zoomTimeout = setTimeout(() => {
          this.isZooming = false;
          this.resumeAnimations();
        }, 300);

        lastScale = currentScale;
      }
    };

    // Listen for zoom events
    window.addEventListener('gesturestart', handleZoom, { passive: true });
    window.addEventListener('gesturechange', handleZoom, { passive: true });
    window.addEventListener('gestureend', handleZoom, { passive: true });
    
    // Listen for keyboard zoom
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
        handleZoom({ scale: 1.1 });
      }
    });

    // Listen for wheel zoom
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        handleZoom({ scale: e.deltaY > 0 ? 0.9 : 1.1 });
      }
    }, { passive: true });
  }

  optimizeAnimations() {
    // Find all animation elements
    this.findAnimationElements();
    
    // Optimize based on device capabilities
    this.optimizeForDevice();
  }

  findAnimationElements() {
    this.animationElements = [
      ...document.querySelectorAll('[class*="motion-"]'),
      ...document.querySelectorAll('[key*="snowflake"]'),
      ...document.querySelectorAll('[key*="snow"]'),
      ...document.querySelectorAll('.framer-motion-div'),
    ];
  }

  // Heavy animations pause karne wala function - performance improve karne ke liye
  pauseHeavyAnimations() {
    // Saare animation elements ko pause kar dete hain
    this.animationElements.forEach(element => {
      if (element) {
        element.style.animationPlayState = 'paused'; // Animation pause kar dete hain
        element.style.willChange = 'auto'; // GPU acceleration band kar dete hain
      }
    });

    // Snowflake effects ka opacity kam kar dete hain scroll/zoom ke time
    const snowflakes = document.querySelectorAll('[key*="snowflake"], [key*="snow"]');
    snowflakes.forEach(flake => {
      if (flake) {
        flake.style.opacity = '0.3'; // Opacity kam kar dete hain
        flake.style.filter = 'none'; // Filters remove kar dete hain
      }
    });
  }

  // Animations resume karne wala function - scroll/zoom complete hone ke baad
  resumeAnimations() {
    // Saare animation elements ko resume kar dete hain
    this.animationElements.forEach(element => {
      if (element) {
        element.style.animationPlayState = 'running'; // Animation resume kar dete hain
        element.style.willChange = 'transform, opacity'; // GPU acceleration wapas on kar dete hain
      }
    });

    // Snowflake effects ka opacity restore kar dete hain
    const snowflakes = document.querySelectorAll('[key*="snowflake"], [key*="snow"]');
    snowflakes.forEach(flake => {
      if (flake) {
        flake.style.opacity = ''; // Original opacity restore kar dete hain
        flake.style.filter = ''; // Original filters restore kar dete hain
      }
    });
  }

  optimizeForDevice() {
    // Check device capabilities
    const isLowEndDevice = this.isLowEndDevice();
    const isMobile = this.isMobile();

    if (isLowEndDevice || isMobile) {
      // Reduce animation complexity
      this.reduceAnimationComplexity();
    }
  }

  isLowEndDevice() {
    // Simple heuristic for low-end devices
    return (
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 2 ||
      window.devicePixelRatio <= 1
    );
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  reduceAnimationComplexity() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: 0.3s !important;
        transition-duration: 0.2s !important;
      }
      [key*="snowflake"], [key*="snow"] {
        filter: none !important;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5) !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseHeavyAnimations();
      } else {
        setTimeout(() => {
          this.resumeAnimations();
        }, 100);
      }
    });
  }

  // Public method to manually optimize
  optimize() {
    this.findAnimationElements();
    this.optimizeForDevice();
  }

  // Public method to clean up
  destroy() {
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.zoomTimeout);
  }
}

// Performance optimizer initialize karne ke liye functions
let performanceOptimizer = null; // Global instance

// Performance optimizer initialize karne wala function
export const initPerformanceOptimizer = () => {
  if (!performanceOptimizer) {
    performanceOptimizer = new PerformanceOptimizer(); // Naya instance banate hain
  }
  return performanceOptimizer;
};

// Current performance optimizer instance get karne wala function
export const getPerformanceOptimizer = () => performanceOptimizer;

export default PerformanceOptimizer;