// Authentication Fix Utility - saare auth issues solve karne ke liye
export const forceCompleteLogout = () => {
  console.log('🔧 Starting force complete logout...');
  
  try {
    // Step 1: Clear all possible localStorage keys
    const keysToRemove = [
      'token',
      'user', 
      'theme',
      'userTheme',
      'teacherDashboardTheme',
      'studentDashboardTheme',
      'authState',
      'currentUser',
      'sessionData'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Removed: ${key}`);
    });
    
    // Step 2: Complete localStorage clear
    localStorage.clear();
    
    // Step 3: Clear sessionStorage
    sessionStorage.clear();
    
    // Step 4: Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    // Step 5: Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    console.log('✅ All data cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error during logout:', error);
    return false;
  }
};

export const forceRedirectToAuth = () => {
  console.log('🔄 Force redirecting to auth...');
  
  // Multiple redirect methods for maximum compatibility
  try {
    // Method 1: Replace current history entry
    window.location.replace('/auth');
  } catch (e1) {
    try {
      // Method 2: Direct href assignment
      window.location.href = '/auth';
    } catch (e2) {
      try {
        // Method 3: Assign to location
        window.location = '/auth';
      } catch (e3) {
        // Method 4: Reload with hash
        window.location.hash = '';
        window.location.pathname = '/auth';
      }
    }
  }
};

export const performCompleteLogout = () => {
  console.log('🚪 Performing complete logout...');
  
  // Step 1: Clear all data
  const clearSuccess = forceCompleteLogout();
  
  // Step 2: Small delay to ensure cleanup
  setTimeout(() => {
    // Step 3: Force redirect
    forceRedirectToAuth();
  }, 100);
  
  return clearSuccess;
};

export const checkAuthConsistency = () => {
  console.log('🔍 Checking auth consistency...');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Auth check results:', {
    hasToken: !!token,
    hasUser: !!user,
    tokenLength: token?.length || 0,
    userValid: user ? (() => {
      try {
        const parsed = JSON.parse(user);
        return !!(parsed.id && parsed.role);
      } catch {
        return false;
      }
    })() : false
  });
  
  // If inconsistent state, force logout
  if ((token && !user) || (!token && user)) {
    console.log('⚠️ Inconsistent auth state detected, forcing logout');
    performCompleteLogout();
    return false;
  }
  
  return !!(token && user);
};

export default {
  forceCompleteLogout,
  forceRedirectToAuth, 
  performCompleteLogout,
  checkAuthConsistency
};