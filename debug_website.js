// Website debugging script - saare common errors check karte hain
console.log('🔍 Starting website debug...');

// Check 1: Authentication state consistency
function checkAuthState() {
  console.log('\n=== AUTH STATE CHECK ===');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token exists:', !!token);
  console.log('User data exists:', !!user);
  
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      console.log('User data valid:', !!parsedUser.id && !!parsedUser.role);
      console.log('User role:', parsedUser.role);
    } catch (e) {
      console.error('User data corrupt:', e);
    }
  }
}

// Check 2: API connectivity
async function checkAPIConnection() {
  console.log('\n=== API CONNECTION CHECK ===');
  try {
    const response = await fetch('http://localhost:8000/api/health/');
    console.log('API Status:', response.status);
    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('API Connection failed:', error);
  }
}

// Check 3: Theme system
function checkThemeSystem() {
  console.log('\n=== THEME SYSTEM CHECK ===');
  const themeKeys = Object.keys(localStorage).filter(key => key.includes('theme'));
  console.log('Theme keys in localStorage:', themeKeys);
  
  themeKeys.forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
  });
}

// Check 4: Console errors
function checkConsoleErrors() {
  console.log('\n=== CONSOLE ERRORS CHECK ===');
  
  // Override console.error to catch errors
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args);
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.log('Captured errors:', errors);
    console.error = originalError;
  }, 5000);
}

// Run all checks
checkAuthState();
checkAPIConnection();
checkThemeSystem();
checkConsoleErrors();

console.log('🔍 Debug script loaded. Check console for results.');