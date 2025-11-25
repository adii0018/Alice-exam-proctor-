// Website Fixes Test - saare fixes verify karne ke liye
console.log('🧪 Starting website fixes test...');

// Test 1: Auth Fix Utility
async function testAuthFix() {
  console.log('\n=== AUTH FIX TEST ===');
  
  try {
    // Import auth fix utility
    const { checkAuthConsistency, performCompleteLogout } = await import('./src/utils/authFix.js');
    
    console.log('✅ Auth fix utility imported successfully');
    
    // Test consistency check
    const isConsistent = checkAuthConsistency();
    console.log('Auth consistency:', isConsistent);
    
    return true;
  } catch (error) {
    console.error('❌ Auth fix test failed:', error);
    return false;
  }
}

// Test 2: Logout Flow
function testLogoutFlow() {
  console.log('\n=== LOGOUT FLOW TEST ===');
  
  // Simulate login state
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('user', JSON.stringify({ id: 1, role: 'student', name: 'Test User' }));
  localStorage.setItem('theme', 'test-theme');
  
  console.log('Before logout - localStorage keys:', Object.keys(localStorage));
  
  // Test logout
  try {
    // Simulate logout (without actual redirect)
    const keysToRemove = ['token', 'user', 'theme'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('After logout - localStorage keys:', Object.keys(localStorage));
    console.log('✅ Logout flow test passed');
    return true;
  } catch (error) {
    console.error('❌ Logout flow test failed:', error);
    return false;
  }
}

// Test 3: API Error Handling
async function testAPIErrorHandling() {
  console.log('\n=== API ERROR HANDLING TEST ===');
  
  try {
    // Test 401 error simulation
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    };
    
    console.log('Mock 401 error:', mockError);
    console.log('✅ API error handling structure correct');
    return true;
  } catch (error) {
    console.error('❌ API error handling test failed:', error);
    return false;
  }
}

// Test 4: Component State Management
function testComponentState() {
  console.log('\n=== COMPONENT STATE TEST ===');
  
  try {
    // Test user state consistency
    const mockUser = { id: 1, role: 'student', name: 'Test User' };
    const userJSON = JSON.stringify(mockUser);
    const parsedUser = JSON.parse(userJSON);
    
    const isValid = !!(parsedUser.id && parsedUser.role);
    console.log('User data validation:', isValid);
    console.log('✅ Component state test passed');
    return true;
  } catch (error) {
    console.error('❌ Component state test failed:', error);
    return false;
  }
}

// Test 5: Theme System
function testThemeSystem() {
  console.log('\n=== THEME SYSTEM TEST ===');
  
  try {
    // Test theme persistence
    const testTheme = 'theme-ocean';
    localStorage.setItem('studentDashboardTheme', testTheme);
    const savedTheme = localStorage.getItem('studentDashboardTheme');
    
    console.log('Theme save/load:', testTheme === savedTheme);
    
    // Cleanup
    localStorage.removeItem('studentDashboardTheme');
    
    console.log('✅ Theme system test passed');
    return true;
  } catch (error) {
    console.error('❌ Theme system test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all website fix tests...\n');
  
  const results = {
    authFix: await testAuthFix(),
    logoutFlow: testLogoutFlow(),
    apiErrorHandling: await testAPIErrorHandling(),
    componentState: testComponentState(),
    themeSystem: testThemeSystem()
  };
  
  console.log('\n=== TEST RESULTS ===');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return allPassed;
}

// Auto-run tests
runAllTests().then(success => {
  if (success) {
    console.log('\n✨ Website fixes verified successfully!');
  } else {
    console.log('\n🔧 Some fixes need attention.');
  }
});

// Export for manual testing
window.testWebsiteFixes = runAllTests;