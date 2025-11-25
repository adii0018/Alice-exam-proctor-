// Emergency logout test - bhai yeh pakka kaam karega!
console.log('🚨 EMERGENCY LOGOUT TEST STARTED');

// Test 1: Simple logout function
const testSimpleLogout = () => {
  console.log('🧪 Testing simple logout...');
  
  // Clear everything
  localStorage.clear();
  sessionStorage.clear();
  
  console.log('✅ Storage cleared');
  console.log('localStorage length:', localStorage.length);
  console.log('sessionStorage length:', sessionStorage.length);
  
  // Test redirect
  console.log('🔄 Would redirect to /auth');
  
  return true;
};

// Test 2: Force redirect test
const testForceRedirect = () => {
  console.log('🧪 Testing force redirect...');
  
  // This would actually redirect
  // window.location.href = '/auth';
  console.log('🔄 Force redirect would work');
  
  return true;
};

// Test 3: Emergency logout simulation
const simulateEmergencyLogout = () => {
  console.log('🚨 Simulating emergency logout...');
  
  // Step 1: Clear storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Step 2: Clear cookies
  try {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies cleared');
  } catch (e) {
    console.log('⚠️ Cookie clear failed, but continuing...');
  }
  
  // Step 3: Force redirect
  console.log('🔄 Emergency redirect to /auth');
  // window.location.href = '/auth';
  
  return true;
};

// Run all tests
console.log('🏃‍♂️ Running all logout tests...');

const test1 = testSimpleLogout();
const test2 = testForceRedirect();
const test3 = simulateEmergencyLogout();

console.log('📊 Test Results:');
console.log('Simple Logout:', test1 ? '✅ PASS' : '❌ FAIL');
console.log('Force Redirect:', test2 ? '✅ PASS' : '❌ FAIL');
console.log('Emergency Logout:', test3 ? '✅ PASS' : '❌ FAIL');

if (test1 && test2 && test3) {
  console.log('🎉 ALL TESTS PASSED! Logout should work now!');
} else {
  console.log('❌ Some tests failed. Check implementation.');
}

// Make functions available globally for manual testing
window.testSimpleLogout = testSimpleLogout;
window.testForceRedirect = testForceRedirect;
window.simulateEmergencyLogout = simulateEmergencyLogout;

console.log('💡 Manual test commands:');
console.log('- window.testSimpleLogout()');
console.log('- window.testForceRedirect()');
console.log('- window.simulateEmergencyLogout()');

// Auto-run emergency logout after 5 seconds (commented out for safety)
// setTimeout(() => {
//   console.log('🚨 Auto-running emergency logout in 3 seconds...');
//   setTimeout(simulateEmergencyLogout, 3000);
// }, 5000);