// Authentication utility functions

/**
 * Comprehensive logout function that clears all user data
 */
export const performLogout = () => {
  console.log('🚪 Starting comprehensive logout...');
  
  // List of all possible localStorage keys to clear
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
  
  // Remove specific keys
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Removed ${key} from localStorage`);
    }
  });
  
  // Clear all localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  console.log('✅ All storage cleared');
  
  // Clear any cookies (if any)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('✅ Cookies cleared');
  
  return true;
};

/**
 * Check if user is properly authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    return user && user.id && user.role;
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    return false;
  }
};

/**
 * Get current user data safely
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user && user.id && user.role ? user : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Force redirect to auth page with comprehensive cleanup
 */
export const redirectToAuth = () => {
  console.log('🔄 Redirecting to auth page...');
  
  // Additional cleanup before redirect
  try {
    // Clear any remaining data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('✅ Final cleanup completed');
  } catch (error) {
    console.error('Error during final cleanup:', error);
  }
  
  // Use replace to prevent back button issues and ensure clean navigation
  if (window.location.pathname !== '/auth') {
    console.log('🔄 Performing redirect to /auth');
    window.location.replace('/auth');
  } else {
    console.log('ℹ️ Already on auth page, forcing reload for clean state');
    window.location.reload();
  }
};