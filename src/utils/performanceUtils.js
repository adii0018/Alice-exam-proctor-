/**
 * Performance utilities for theme system
 * Provides tools for monitoring and optimizing theme operations
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Batch multiple function calls into a single requestAnimationFrame
 * @param {Function} func - Function to batch
 * @returns {Function} Batched function
 */
export const batchRAF = (func) => {
  let rafId = null;
  let pendingArgs = null;

  return function executedFunction(...args) {
    pendingArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...pendingArgs);
        rafId = null;
        pendingArgs = null;
      });
    }
  };
};

/**
 * Measure performance of a function
 * @param {string} label - Label for the measurement
 * @param {Function} func - Function to measure
 * @returns {Function} Wrapped function that measures performance
 */
export const measurePerformance = (label, func) => {
  return function measuredFunction(...args) {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

/**
 * Create a memoized version of a function
 * @param {Function} func - Function to memoize
 * @param {Function} keyGenerator - Optional function to generate cache key
 * @returns {Function} Memoized function
 */
export const memoize = (func, keyGenerator = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  const maxCacheSize = 100;

  return function memoizedFunction(...args) {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * Performance monitor for tracking theme operations
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Start timing an operation
   * @param {string} operation - Operation name
   */
  start(operation) {
    if (!this.enabled) return;
    this.metrics.set(operation, performance.now());
  }

  /**
   * End timing an operation and log the result
   * @param {string} operation - Operation name
   */
  end(operation) {
    if (!this.enabled) return;
    
    const start = this.metrics.get(operation);
    if (start) {
      const duration = performance.now() - start;
      console.log(`[Theme Performance] ${operation}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(operation);
    }
  }

  /**
   * Measure a function execution
   * @param {string} operation - Operation name
   * @param {Function} func - Function to measure
   * @returns {*} Function result
   */
  measure(operation, func) {
    if (!this.enabled) return func();
    
    this.start(operation);
    const result = func();
    this.end(operation);
    return result;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }
}

// Export singleton instance
export const themePerformanceMonitor = new PerformanceMonitor();
