import { useTheme } from '../../hooks/useTheme';
import { CheckCircle, Cloud, AlertCircle, Loader } from 'lucide-react';

/**
 * ThemeSyncIndicator Component
 * Shows the current sync status of theme preferences
 */
const ThemeSyncIndicator = ({ className = '' }) => {
  const { syncStatus } = useTheme();

  if (!syncStatus) {
    return null;
  }

  const { inProgress, retryCount, maxRetries } = syncStatus;

  // Don't show if not syncing and no retries
  if (!inProgress && retryCount === 0) {
    return (
      <div className={`flex items-center gap-2 text-sm text-text-secondary ${className}`}>
        <CheckCircle className="w-4 h-4 text-success" />
        <span>Synced</span>
      </div>
    );
  }

  // Show syncing state
  if (inProgress) {
    return (
      <div className={`flex items-center gap-2 text-sm text-text-secondary ${className}`}>
        <Loader className="w-4 h-4 animate-spin text-primary" />
        <span>Syncing...</span>
      </div>
    );
  }

  // Show retry state
  if (retryCount > 0) {
    return (
      <div className={`flex items-center gap-2 text-sm text-warning ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span>Retrying ({retryCount}/{maxRetries})</span>
      </div>
    );
  }

  return null;
};

export default ThemeSyncIndicator;
