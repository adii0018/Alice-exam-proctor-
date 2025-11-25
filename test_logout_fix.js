// Comprehensive logout test script
console.log('🧪 Testing logout functionality...');

// Simulate being logged in as teacher
const simulateLogin = () => {
  console.log('📝 Simulating teacher login...');
  
  const mockUser = {
    id: 1,
    name: 'Test Teacher',
    email: 'teacher@test.com',
    role: 'teacher'
  };
  
  const mockToken = 'mock-jwt-token-12345';
  
  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('token', mockToken);
  localStorage.setItem('teacherDashboardTheme', 'theme-ocean');
  
  console.log('✅ Mock login data set');
  console.log('Current localStorage:', {
    user: localStorage.getItem('user'),
    token: localStorage.getItem('token'),
    theme: localStorage.getItem('teacherDashboardTheme')
  });
};

// Test the logout process
const testLogoutProcess = () => {
  console.log('🚪 Testing logout process...');
  
  // Step 1: Clear specific keys
  const keysToRemove = [
    'token',
    'user',
    'teacherDashboardTheme',
    'theme',
    'userTheme',
    'authToken',
    'userData',
    'currentUser',
    'sessionData'
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Removed ${key}`);
    }
  });
  
  // Step 2: Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Step 3: Verify cleanup
  console.log('🔍 Verifying cleanup...');
  console.log('localStorage length:', localStorage.length);
  console.log('sessionStorage length:', sessionStorage.length);
  
  if (localStorage.length === 0 && sessionStorage.length === 0) {
    console.log('✅ Storage cleanup successful');
  } else {
    console.log('❌ Storage cleanup failed');
  }
  
  // Step 4: Test redirect (simulate)
  console.log('🔄 Would redirect to /auth');
  console.log('Current path:', window.location.pathname);
  
  return true;
};

// Run the test
simulateLogin();
setTimeout(() => {
  testLogoutProcess();
}, 1000);

// Export for manual testing
window.testLogout = testLogoutProcess;
window.simulateLogin = simulateLogin;

console.log('💡 Use window.testLogout() to manually test logout');
console.log('💡 Use window.simulateLogin() to simulate login again');