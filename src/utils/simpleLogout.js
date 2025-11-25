// Super simple and foolproof logout utility
export const simpleLogout = () => {
  console.log('🚪 Simple logout started...');
  
  try {
    // Step 1: Clear all localStorage items individually first
    const keysToRemove = ['token', 'user', 'teacherDashboardTheme', 'theme', 'userTheme'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Removed ${key} from localStorage`);
    });
    
    // Step 2: Clear all localStorage
    localStorage.clear();
    console.log('✅ localStorage cleared completely');
    
    // Step 3: Clear sessionStorage  
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
    
    // Step 4: Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies cleared');
    
    // Step 5: Force redirect with a small delay to ensure storage is cleared
    console.log('🔄 Redirecting to auth in 50ms...');
    setTimeout(() => {
      window.location.href = '/auth';
    }, 50);
    
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Even if error, force redirect
    window.location.href = '/auth';
    return false;
  }
};

// Alternative method using replace
export const forceLogout = () => {
  console.log('🚪 Force logout started...');
  
  // Clear everything
  localStorage.clear();
  sessionStorage.clear();
  
  // Force redirect with replace
  window.location.replace('/auth');
};

// Emergency logout - clears everything and reloads page
export const emergencyLogout = () => {
  console.log('🚨 Emergency logout started...');
  
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies
  try {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  } catch (e) {
    console.log('Cookie clear failed, continuing...');
  }
  
  // Force page reload to auth
  window.location.href = '/auth';
  window.location.reload();
};