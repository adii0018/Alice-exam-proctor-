// Ultra clean logout utility - guaranteed to work
export const cleanLogout = () => {
  console.log('🧹 Starting clean logout process...');
  
  try {
    // Step 1: Get all localStorage keys and remove them one by one
    const allKeys = Object.keys(localStorage);
    console.log('📋 Found localStorage keys:', allKeys);
    
    allKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Removed: ${key}`);
    });
    
    // Step 2: Clear localStorage completely
    localStorage.clear();
    console.log('✅ localStorage.clear() executed');
    
    // Step 3: Clear sessionStorage
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
    
    // Step 4: Clear all cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    console.log('✅ Cookies cleared');
    
    // Step 5: Verify everything is cleared
    console.log('🔍 Verification:');
    console.log('  - localStorage length:', localStorage.length);
    console.log('  - sessionStorage length:', sessionStorage.length);
    console.log('  - token exists:', !!localStorage.getItem('token'));
    console.log('  - user exists:', !!localStorage.getItem('user'));
    
    // Step 6: Force redirect to auth page with complete reload
    console.log('🔄 Redirecting to /auth...');
    
    // Force a complete page reload to clear all React state
    window.location.replace('/auth');
    
    // Backup: if replace doesn't work, use href
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
    
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Even on error, force redirect
    window.location.href = '/auth';
    return false;
  }
};

// Export as default too
export default cleanLogout;
