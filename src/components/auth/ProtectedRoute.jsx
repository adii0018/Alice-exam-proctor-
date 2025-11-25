// Protected Route - yeh check karta hai ki user login hai ya nahi
import { Navigate } from 'react-router-dom'
import { performCompleteLogout } from '../../utils/authFix'

export default function ProtectedRoute({ children, user, requiredRole }) {
  console.log('🔒 ProtectedRoute check:', { 
    hasUser: !!user, 
    userRole: user?.role, 
    requiredRole,
    hasToken: !!localStorage.getItem('token'),
    hasUserData: !!localStorage.getItem('user')
  });
  
  // Triple check - localStorage, user object, and data validity
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  // Case 1: No user object AND no localStorage data - redirect to auth
  if (!user && (!token || !userData)) {
    console.log('❌ No authentication found, redirecting to auth');
    return <Navigate to="/auth" replace />
  }
  
  // Case 2: User object missing but localStorage has data (inconsistent state)
  if (!user && token && userData) {
    console.log('⚠️ Inconsistent auth state detected, performing complete logout');
    performCompleteLogout();
    return <Navigate to="/auth" replace />
  }
  
  // Case 3: User exists but no valid data
  if (user && (!user.id || !user.role)) {
    console.log('⚠️ Invalid user data, performing complete logout');
    performCompleteLogout();
    return <Navigate to="/auth" replace />
  }
  
  // Case 4: Role mismatch - redirect to correct dashboard
  if (requiredRole && user && user.role !== requiredRole) {
    console.log('❌ Role mismatch, redirecting to correct dashboard');
    return <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace />
  }
  
  console.log('✅ ProtectedRoute passed, rendering children');
  // All checks passed - render children
  return children
}
