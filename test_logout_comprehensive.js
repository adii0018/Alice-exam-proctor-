// Comprehensive Logout Test Script
// Run this in browser console after logging in

console.log('🧪 Starting Comprehensive Logout Test...\n');

// Step 1: Check current state
console.log('📊 STEP 1: Current Authentication State');
console.log('  - Token:', localStorage.getItem('token') ? '✅ Present' : '❌ Missing');
console.log('  - User:', localStorage.getItem('user') ? '✅ Present' : '❌ Missing');
console.log('  - Current URL:', window.location.href);
console.log('  - localStorage keys:', Object.keys(localStorage));
console.log('');

// Step 2: Simulate logout
console.log('🚪 STEP 2: Simulating Logout...');
console.log('  - Clearing localStorage...');
localStorage.clear();
console.log('  - Clearing sessionStorage...');
sessionStorage.clear();
console.log('  - Verification:');
console.log('    - localStorage length:', localStorage.length);
console.log('    - Token exists:', !!localStorage.getItem('token'));
console.log('    - User exists:', !!localStorage.getItem('user'));
console.log('');

// Step 3: Test redirect
console.log('🔄 STEP 3: Testing Redirect...');
console.log('  - Current location:', window.location.pathname);
console.log('  - Redirecting to /auth in 2 seconds...');

setTimeout(() => {
  console.log('  - Executing redirect...');
  window.location.replace('/auth');
}, 2000);

console.log('\n✅ Test script completed. Watch for redirect...');
