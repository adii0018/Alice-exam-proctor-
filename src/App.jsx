// Bhai yeh main App component hai - yahan se sab kuch start hota hai
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Notifications ke liye
import { AnimatePresence } from "framer-motion"; // Smooth transitions ke liye
import { useTheme } from "./hooks/useTheme"; // Theme system
import { initPerformanceOptimizer } from "./utils/performanceOptimizer"; // Performance boost ke liye
import { performCompleteLogout, checkAuthConsistency } from "./utils/authFix"; // Auth fix utilities
import './styles/modern-global.css';
import './styles/performance-optimizations.css';

// Saare components import kar rahe hain - yeh hamara component library hai
import FullPageLoader from "./components/loaders/FullPageLoader"; // Loading screen
import ScrollProgressBar from "./components/ui/ScrollProgressBar"; // Page scroll indicator
import Footer from "./components/common/Footer"; // Website ka footer
import ModernHeader from "./components/layout/ModernHeader"; // Header component
import LandingPage from "./pages/LandingPage"; // Main landing page
import ModernLandingPage from "./pages/ModernLandingPage"; // Modern design landing
import SimpleLandingPage from "./pages/SimpleLandingPage"; // Simple clean landing
import FeaturesPage from "./pages/FeaturesPage"; // Features showcase page
import AuthPage from "./pages/AuthPage"; // Login/Register page
import StudentDashboard from "./pages/StudentDashboard"; // Student ka dashboard
import TeacherDashboard from "./pages/TeacherDashboard"; // Teacher ka dashboard
import ResultsPage from "./pages/ResultsPage"; // Results dikhane ke liye
import ProfilePage from "./pages/ProfilePage"; // User profile page
import NotFoundPage from "./pages/NotFoundPage"; // 404 page
import JEEDashboardTest from "./pages/JEEDashboardTest"; // JEE Dashboard test page
import SimpleJEETest from "./pages/SimpleJEETest"; // Simple JEE test (no network)
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Route protection ke liye

// Yeh function decide karta hai ki footer dikhana hai ya nahi
function ConditionalFooter() {
  const location = useLocation();
  
  // Dashboard pages aur landing page mein footer hide kar dete hain
  // Kyunki landing page ka apna footer hai
  const hiddenPaths = ['/student', '/teacher', '/results', '/profile', '/', '/auth'];
  const shouldHideFooter = hiddenPaths.includes(location.pathname);
  
  if (shouldHideFooter) {
    return null; // Footer nahi dikhana
  }
  
  return <Footer />; // Footer dikhao
}

function App() {
  // State variables - app ki main states yahan manage karte hain
  const [loading, setLoading] = useState(true); // Loading state
  const [authLoading, setAuthLoading] = useState(false); // Auth transition loading
  const [user, setUser] = useState(null); // Current user ka data
  const { loadThemeFromServer, theme } = useTheme(); // Theme system

  useEffect(() => {
    // Performance optimizer start karte hain - app ko fast banane ke liye
    const optimizer = initPerformanceOptimizer();
    
    // Check auth consistency first
    const isAuthValid = checkAuthConsistency();
    
    if (isAuthValid) {
      // Check karte hain ki user pehle se logged in hai ya nahi
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log('🔍 App startup check:', { hasToken: !!token, hasUserData: !!userData });

      if (token && userData) {
        try {
          // User data parse karte hain localStorage se
          const parsedUser = JSON.parse(userData);
          
          // Validate user data structure
          if (parsedUser && parsedUser.id && parsedUser.role) {
            console.log('✅ Valid user data found:', parsedUser.role);
            setUser(parsedUser);
            
            // User login hai toh theme load karte hain backend se
            loadThemeFromServer().catch(error => {
              console.error("Theme load nahi hua bhai:", error);
            });
          } else {
            console.log('❌ Invalid user data structure, performing complete logout');
            performCompleteLogout();
          }
        } catch (error) {
          console.error("User data parse nahi hua:", error);
          performCompleteLogout(); // Complete logout on corrupt data
        }
      }
    }

    // Loading screen kam se kam 500ms dikhate hain - smooth UX ke liye
    const timer = setTimeout(() => {
      setLoading(false);
      // Loading complete hone ke baad optimize karte hain
      if (optimizer) {
        optimizer.optimize();
      }
    }, 500);

    // Cleanup function - memory leaks avoid karne ke liye
    return () => {
      clearTimeout(timer);
      if (optimizer) {
        optimizer.destroy();
      }
    };
  }, [loadThemeFromServer]);

  // Login handle karne wala function
  const handleLogin = async (userData) => {
    setAuthLoading(true);
    
    try {
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(userData); // User data set karte hain
      
      // Login ke baad user ka theme load karte hain backend se
      try {
        await loadThemeFromServer();
      } catch (error) {
        console.error("Login ke baad theme load nahi hua:", error);
        // Error aaye toh local theme use karte hain
      }
      
      // Extra delay for smooth experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handle karne wala function
  const handleLogout = async () => {
    console.log('🔄 App.jsx handleLogout called');
    
    setAuthLoading(true);
    
    try {
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // First set user to null
      setUser(null);
      console.log('✅ User state set to null');
      
      // Extra delay before redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the comprehensive logout utility
      performCompleteLogout();
      
    } finally {
      setAuthLoading(false);
    }
  };

  // Agar loading chal rahi hai toh loader dikhate hain
  if (loading || authLoading) {
    return <FullPageLoader />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen">
        <ScrollProgressBar />
        <Toaster
          position="top-center"
          containerStyle={{
            top: 20,
            zIndex: 50, // Lower z-index to not interfere with exam interface
          }}
          toastOptions={{
            duration: 2000, // Shorter duration to reduce interference
            style: {
              background: theme.mode === 'dark' ? '#1f2937' : '#ffffff',
              color: theme.mode === 'dark' ? '#f9fafb' : '#111827',
              borderRadius: "12px",
              padding: "12px 16px", // Smaller padding
              border: theme.mode === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
              boxShadow: theme.mode === 'dark' 
                ? '0 4px 6px -1px rgb(0 0 0 / 0.4)' 
                : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '14px', // Smaller font
              maxWidth: '400px', // Limit width
              pointerEvents: 'none', // Don't block clicks
            },
            success: {
              iconTheme: {
                primary: theme.mode === 'dark' ? '#34d399' : '#10b981',
                secondary: theme.mode === 'dark' ? '#111827' : '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: theme.mode === 'dark' ? '#f87171' : '#ef4444',
                secondary: theme.mode === 'dark' ? '#111827' : '#fff',
              },
            },
          }}
        />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    <Navigate
                      to={user.role === "student" ? "/student" : "/teacher"}
                      replace
                    />
                  ) : (
                    <>
                      <SimpleLandingPage />
                    </>
                  )
                }
              />

              <Route
                path="/features"
                element={<FeaturesPage />}
              />

              <Route
                path="/auth"
                element={
                  user ? (
                    <Navigate
                      to={user.role === "student" ? "/student" : "/teacher"}
                      replace
                    />
                  ) : (
                    <AuthPage onLogin={handleLogin} />
                  )
                }
              />

              <Route
                path="/student"
                element={
                  <ProtectedRoute user={user} requiredRole="student">
                    <StudentDashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute user={user} requiredRole="teacher">
                    <TeacherDashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/results"
                element={
                  <ProtectedRoute user={user}>
                    <ResultsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute user={user}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="/test-jee" element={<JEEDashboardTest />} />
              <Route path="/simple-jee" element={<SimpleJEETest />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </div>

        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
