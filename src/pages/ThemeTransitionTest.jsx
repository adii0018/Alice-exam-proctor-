/**
 * Theme Transition Test Page
 * Manual testing page for verifying smooth theme transitions
 */

import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeTransitionTest = () => {
  const { theme, toggleMode, setScheme, updateAccessibility } = useTheme();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, passed) => {
    setTestResults(prev => [...prev, { test, passed, timestamp: new Date().toISOString() }]);
  };

  const testThemeToggle = () => {
    const startMode = theme.mode;
    toggleMode();
    setTimeout(() => {
      const endMode = theme.mode === 'light' ? 'dark' : 'light';
      addTestResult('Theme Toggle', startMode !== endMode);
    }, 350);
  };

  const testSchemeChange = () => {
    const schemes = ['default', 'ocean', 'forest', 'sunset'];
    const currentIndex = schemes.indexOf(theme.scheme);
    const nextScheme = schemes[(currentIndex + 1) % schemes.length];
    setScheme(nextScheme);
    setTimeout(() => {
      addTestResult('Scheme Change', theme.scheme === nextScheme);
    }, 350);
  };

  const testReducedMotion = () => {
    const current = theme.accessibility.reducedMotion;
    updateAccessibility({ reducedMotion: !current });
    setTimeout(() => {
      addTestResult('Reduced Motion Toggle', theme.accessibility.reducedMotion !== current);
    }, 50);
  };

  const testHighContrast = () => {
    const current = theme.accessibility.highContrast;
    updateAccessibility({ highContrast: !current });
    setTimeout(() => {
      addTestResult('High Contrast Toggle', theme.accessibility.highContrast !== current);
    }, 350);
  };

  return (
    <div className="min-h-screen p-8" style={{ 
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)'
    }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Theme Transition Test Page</h1>
        
        {/* Current Theme Info */}
        <div className="mb-8 p-6 rounded-lg" style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <h2 className="text-xl font-semibold mb-4">Current Theme</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Mode:</strong> {theme.mode}
            </div>
            <div>
              <strong>Scheme:</strong> {theme.scheme}
            </div>
            <div>
              <strong>High Contrast:</strong> {theme.accessibility.highContrast ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Reduced Motion:</strong> {theme.accessibility.reducedMotion ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-8 p-6 rounded-lg" style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testThemeToggle}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white'
              }}
            >
              Test Theme Toggle (300ms)
            </button>
            <button
              onClick={testSchemeChange}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'white'
              }}
            >
              Test Scheme Change (300ms)
            </button>
            <button
              onClick={testHighContrast}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white'
              }}
            >
              Test High Contrast (300ms)
            </button>
            <button
              onClick={testReducedMotion}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: 'var(--color-info)',
                color: 'white'
              }}
            >
              Test Reduced Motion (instant)
            </button>
          </div>
        </div>

        {/* Sample Elements */}
        <div className="mb-8 p-6 rounded-lg" style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <h2 className="text-xl font-semibold mb-4">Sample Elements</h2>
          <div className="space-y-4">
            <div className="p-4 rounded" style={{
              backgroundColor: 'var(--color-surface-hover)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}>
              <p>This is a card with hover background</p>
            </div>
            <input
              type="text"
              placeholder="Sample input"
              className="w-full px-4 py-2 rounded"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: 'var(--color-text)'
              }}
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded" style={{
                backgroundColor: 'var(--color-success)',
                color: 'white'
              }}>
                Success
              </button>
              <button className="px-4 py-2 rounded" style={{
                backgroundColor: 'var(--color-warning)',
                color: 'white'
              }}>
                Warning
              </button>
              <button className="px-4 py-2 rounded" style={{
                backgroundColor: 'var(--color-error)',
                color: 'white'
              }}>
                Error
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="p-6 rounded-lg" style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>
              No tests run yet. Click the test buttons above.
            </p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded flex items-center justify-between"
                  style={{
                    backgroundColor: result.passed 
                      ? 'rgba(102, 187, 106, 0.1)' 
                      : 'rgba(239, 83, 80, 0.1)',
                    borderColor: result.passed 
                      ? 'var(--color-success)' 
                      : 'var(--color-error)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <span>{result.test}</span>
                  <span style={{
                    color: result.passed 
                      ? 'var(--color-success)' 
                      : 'var(--color-error)',
                    fontWeight: 'bold'
                  }}>
                    {result.passed ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-lg" style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border-focus)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2" style={{
            color: 'var(--color-text-secondary)'
          }}>
            <li>Click each test button and observe the transition smoothness</li>
            <li>Transitions should take 300ms with cubic-bezier easing</li>
            <li>Reduced motion should apply changes instantly (0.01ms)</li>
            <li>No visual glitches or flashing should occur</li>
            <li>All colors should transition smoothly</li>
            <li>Test in both light and dark modes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ThemeTransitionTest;
