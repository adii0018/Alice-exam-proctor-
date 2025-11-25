// Theme Context - yahan saara theme management hota hai
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// Theme utilities import karte hain
import {
  DEFAULT_THEME, // Default theme settings
  saveThemeToStorage, // Theme save karne ke liye
  loadThemeFromStorage, // Theme load karne ke liye
  applyThemeToDocument, // Theme apply karne ke liye
  getSystemThemePreference, // System theme detect karne ke liye
  getSystemReducedMotionPreference, // Reduced motion detect karne ke liye
  mergeWithDefaults, // Theme merge karne ke liye
  isValidTheme, // Theme validate karne ke liye
} from "../utils/themeUtils";
// Accessibility utilities
import {
  announceThemeModeChange, // Theme change announce karne ke liye
  announceColorSchemeChange, // Color scheme change announce karne ke liye
  announceAccessibilityChange, // Accessibility change announce karne ke liye
} from "../utils/a11yUtils";
// Backend sync utilities
import {
  syncThemeToBackend, // Backend mein theme sync karne ke liye
  getSyncStatus, // Sync status check karne ke liye
  loadThemeFromBackend, // Backend se theme load karne ke liye
  mergeThemeWithLocal, // Backend aur local theme merge karne ke liye
} from "../services/themeService";
// Performance utilities
import { batchRAF, themePerformanceMonitor } from "../utils/performanceUtils";

// Theme Context create karte hain - yeh saare components mein available hoga
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Theme state - yahan current theme store hota hai
  const [theme, setTheme] = useState(() => {
    // Pehle saved theme load karte hain ya system preference use karte hain
    const savedTheme = loadThemeFromStorage(); // localStorage se theme load karte hain
    const systemMode = getSystemThemePreference(); // System ka theme preference
    const systemReducedMotion = getSystemReducedMotionPreference(); // Reduced motion preference

    if (savedTheme) {
      // Agar saved theme hai toh use kar dete hain
      return mergeWithDefaults({
        ...savedTheme,
        accessibility: {
          ...savedTheme.accessibility,
          reducedMotion: systemReducedMotion, // System preference se update kar dete hain
        },
      });
    }

    // Agar saved theme nahi hai toh default use karte hain
    return {
      ...DEFAULT_THEME,
      mode: systemMode, // System preference use karte hain
      accessibility: {
        ...DEFAULT_THEME.accessibility,
        reducedMotion: systemReducedMotion, // System preference use karte hain
      },
    };
  });

  const [systemPreference, setSystemPreference] = useState(
    getSystemThemePreference()
  );
  const [syncStatus, setSyncStatus] = useState({
    inProgress: false,
    retryCount: 0,
    maxRetries: 3,
  });

  // Prevent transitions on initial page load to avoid flash of unstyled content
  useEffect(() => {
    // Add preload class to prevent transitions during initial render
    document.documentElement.classList.add("preload");

    // Remove preload class after a short delay to enable transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("preload");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Batch theme application using requestAnimationFrame for optimal performance
  // This ensures all DOM updates happen in a single frame, minimizing repaints
  const applyThemeBatched = useMemo(
    () =>
      batchRAF((themeToApply) => {
        themePerformanceMonitor.start("applyTheme");
        applyThemeToDocument(themeToApply);
        themePerformanceMonitor.end("applyTheme");
      }),
    []
  );

  // Apply theme to document whenever it changes
  useEffect(() => {
    // Apply theme with batched updates
    applyThemeBatched(theme);

    // Save to localStorage (synchronous, fast operation)
    saveThemeToStorage(theme);

    // Sync to backend (debounced, async)
    syncThemeToBackend(theme).catch((error) => {
      console.error("Theme sync error:", error);
    });

    // Update sync status
    setSyncStatus(getSyncStatus());
  }, [theme, applyThemeBatched]);

  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const newPreference = e.matches ? "dark" : "light";
      setSystemPreference(newPreference);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e) => {
      setTheme((prev) => ({
        ...prev,
        accessibility: {
          ...prev.accessibility,
          reducedMotion: e.matches,
        },
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleMode = useCallback(() => {
    setTheme((prev) => {
      const newMode = prev.mode === "dark" ? "light" : "dark";
      announceThemeModeChange(newMode);
      return {
        ...prev,
        mode: newMode,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const setMode = useCallback((mode) => {
    if (mode !== "dark" && mode !== "light") {
      console.warn(`Invalid mode: ${mode}. Must be 'dark' or 'light'`);
      return;
    }

    setTheme((prev) => {
      if (prev.mode !== mode) {
        announceThemeModeChange(mode);
      }
      return {
        ...prev,
        mode,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const setScheme = useCallback((scheme) => {
    setTheme((prev) => {
      if (prev.scheme !== scheme) {
        announceColorSchemeChange(scheme);
      }
      return {
        ...prev,
        scheme,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const setCustomColors = useCallback((customColors) => {
    setTheme((prev) => ({
      ...prev,
      scheme: "custom",
      customColors,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const updateAccessibility = useCallback((settings) => {
    setTheme((prev) => {
      // Announce each changed setting
      Object.entries(settings).forEach(([key, value]) => {
        if (prev.accessibility[key] !== value) {
          announceAccessibilityChange(key, value);
        }
      });

      return {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          ...settings,
        },
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const resetTheme = useCallback(() => {
    const systemMode = getSystemThemePreference();
    const systemReducedMotion = getSystemReducedMotionPreference();

    setTheme({
      ...DEFAULT_THEME,
      mode: systemMode,
      accessibility: {
        ...DEFAULT_THEME.accessibility,
        reducedMotion: systemReducedMotion,
      },
    });
  }, []);

  const syncTheme = useCallback(
    async (options = {}) => {
      try {
        setSyncStatus({ ...getSyncStatus(), inProgress: true });
        await syncThemeToBackend(theme, { immediate: true, ...options });
        setSyncStatus(getSyncStatus());
        return { success: true };
      } catch (error) {
        setSyncStatus(getSyncStatus());
        throw error;
      }
    },
    [theme]
  );

  const loadThemeFromServer = useCallback(async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "Not authenticated", source: "local" };
      }

      // Load theme from backend
      const backendTheme = await loadThemeFromBackend();

      if (!backendTheme) {
        // No theme on backend, keep current theme
        return {
          success: true,
          source: "local",
          message: "No theme found on server",
        };
      }

      // Get current local theme
      const localTheme = loadThemeFromStorage();

      // Merge backend theme with local changes
      const mergedTheme = mergeThemeWithLocal(backendTheme, localTheme);

      // Validate and apply merged theme
      if (isValidTheme(mergedTheme)) {
        setTheme(mergeWithDefaults(mergedTheme));
        return { success: true, source: "backend", theme: mergedTheme };
      } else {
        console.warn("Invalid theme from backend, keeping local theme");
        return { success: false, error: "Invalid theme data", source: "local" };
      }
    } catch (error) {
      console.error("Failed to load theme from backend:", error);
      // Continue with local theme on error
      return {
        success: false,
        error: error.message || "Unknown error",
        source: "local",
      };
    }
  }, []);

  const value = {
    theme,
    mode: theme.mode,
    scheme: theme.scheme,
    systemPreference,
    syncStatus,
    toggleMode,
    setMode,
    setScheme,
    setCustomColors,
    updateAccessibility,
    resetTheme,
    syncTheme,
    loadThemeFromServer,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
