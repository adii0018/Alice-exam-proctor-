/**
 * Tests for performance utilities
 * These tests verify that optimization functions work correctly
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  batchRAF,
  memoize,
  PerformanceMonitor
} from '../performanceUtils';

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should limit function execution rate', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const expensiveFunc = vi.fn((x) => x * 2);
      const memoized = memoize(expensiveFunc);

      const result1 = memoized(5);
      expect(result1).toBe(10);
      expect(expensiveFunc).toHaveBeenCalledTimes(1);

      const result2 = memoized(5);
      expect(result2).toBe(10);
      expect(expensiveFunc).toHaveBeenCalledTimes(1); // Still 1, used cache
    });

    it('should handle different arguments', () => {
      const func = vi.fn((x) => x * 2);
      const memoized = memoize(func);

      memoized(5);
      memoized(10);
      expect(func).toHaveBeenCalledTimes(2);

      memoized(5);
      expect(func).toHaveBeenCalledTimes(2); // Used cache for 5
    });
  });

  describe('PerformanceMonitor', () => {
    it('should track operation timing', () => {
      const monitor = new PerformanceMonitor();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

      monitor.start('test');
      monitor.end('test');

      // In development mode, should log
      if (process.env.NODE_ENV === 'development') {
        expect(consoleSpy).toHaveBeenCalled();
      }
    });

    it('should measure function execution', () => {
      const monitor = new PerformanceMonitor();
      const func = () => 42;

      const result = monitor.measure('test', func);
      expect(result).toBe(42);
    });
  });
});
