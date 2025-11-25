/**
 * Theme Service
 * Handles theme synchronization with backend
 */
import apiService from './api';
import toast from 'react-hot-toast';

const SYNC_DEBOUNCE_MS = 2000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

let syncTimeout = null;
let syncInProgress = false;
let retryCount = 0;

/**
 * Debounced theme sync function
 * Waits 2 seconds after the last change before syncing
 */
export const syncThemeToBackend = (theme, options = {}) => {
  const { immediate = false, showToast = false } = options;

  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // If immediate sync requested, sync now
  if (immediate) {
    return performSync(theme, showToast);
  }

  // Otherwise, debounce the sync
  return new Promise((resolve, reject) => {
    syncTimeout = setTimeout(async () => {
      try {
        await performSync(theme, showToast);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, SYNC_DEBOUNCE_MS);
  });
};

/**
 * Perform the actual sync operation with retry logic
 */
const performSync = async (theme, showToast = false) => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    // User not logged in, skip sync
    return;
  }

  // Prevent concurrent syncs
  if (syncInProgress) {
    return;
  }

  syncInProgress = true;

  try {
    // Prepare theme data for backend
    const themeData = {
      mode: theme.mode,
      scheme: theme.scheme,
      customColors: theme.customColors || null,
      accessibility: theme.accessibility || {
        highContrast: false,
        fontSize: 'medium',
        reducedMotion: false
      }
    };

    // Send to backend
    await apiService.post('/user/theme/update/', themeData);

    // Reset retry count on success
    retryCount = 0;

    if (showToast) {
      toast.success('Theme synced successfully');
    }

    return { success: true };
  } catch (error) {
    console.error('Theme sync failed:', error);

    // Retry logic
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      retryCount++;
      console.log(`Retrying theme sync (attempt ${retryCount}/${MAX_RETRY_ATTEMPTS})...`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retryCount));

      // Retry
      syncInProgress = false;
      return performSync(theme, showToast);
    } else {
      // Max retries reached
      retryCount = 0;
      if (showToast) {
        toast.error('Failed to sync theme. Saved locally.');
      }
      throw error;
    }
  } finally {
    syncInProgress = false;
  }
};

/**
 * Load theme from backend
 */
export const loadThemeFromBackend = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await apiService.getUserTheme();
    return response.theme;
  } catch (error) {
    // 404 means no theme saved yet, which is fine
    if (error.response?.status === 404) {
      return null;
    }

    console.error('Failed to load theme from backend:', error);
    throw error;
  }
};

/**
 * Merge backend theme with local changes
 * Backend theme takes precedence, but we preserve local changes if backend theme is older
 */
export const mergeThemeWithLocal = (backendTheme, localTheme) => {
  if (!backendTheme) {
    return localTheme;
  }

  if (!localTheme) {
    return backendTheme;
  }

  // Compare timestamps if available
  const backendTime = backendTheme.updated_at ? new Date(backendTheme.updated_at).getTime() : 0;
  const localTime = localTheme.updated_at ? new Date(localTheme.updated_at).getTime() : 0;

  // If backend is newer or same age, use backend theme
  if (backendTime >= localTime) {
    return backendTheme;
  }

  // If local is newer, keep local but mark for sync
  return localTheme;
};

/**
 * Get sync status
 */
export const getSyncStatus = () => {
  return {
    inProgress: syncInProgress,
    retryCount,
    maxRetries: MAX_RETRY_ATTEMPTS
  };
};

/**
 * Cancel pending sync
 */
export const cancelPendingSync = () => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
};
