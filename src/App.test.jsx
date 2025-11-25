// Minimal test version of App - Use this if white screen persists
import { useState } from 'react';

function AppTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          🎉 React is Working!
        </h1>
        
        <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.9 }}>
          If you see this page, your React app is rendering correctly.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2>Counter Test:</h2>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>Count: {count}</p>
          <button
            onClick={() => setCount(count + 1)}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Increment
          </button>
          <button
            onClick={() => setCount(0)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>✅ What's Working:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>✓ React is rendering</li>
            <li>✓ State management (useState)</li>
            <li>✓ Event handlers (onClick)</li>
            <li>✓ Styling</li>
          </ul>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.3)',
          borderRadius: '10px',
          border: '2px solid rgba(59, 130, 246, 0.5)'
        }}>
          <h3>📝 Next Steps:</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>If you see this, React is working fine</li>
            <li>The issue might be with ThemeContext or other dependencies</li>
            <li>Check browser console (F12) for any errors</li>
            <li>Try commenting out ThemeProvider in main.jsx</li>
          </ol>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(16, 185, 129, 0.2)',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <strong>To use this test version:</strong>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '10px',
            overflow: 'auto'
          }}>
{`// In src/main.jsx, replace:
import App from './App.jsx'

// With:
import App from './App.test.jsx'`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default AppTest;
