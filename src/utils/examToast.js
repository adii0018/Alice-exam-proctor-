// Exam-friendly toast notifications - Non-intrusive
import toast from 'react-hot-toast'

// Custom toast for exam mode - minimal interference
export const examToast = {
  success: (message) => {
    return toast.success(message, {
      duration: 1500, // Very short duration
      style: {
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        maxWidth: '300px',
        pointerEvents: 'none', // Don't block clicks
        zIndex: 30, // Lower z-index
      },
      position: 'top-center',
    })
  },

  error: (message) => {
    return toast.error(message, {
      duration: 2000, // Slightly longer for errors
      style: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        maxWidth: '300px',
        pointerEvents: 'none', // Don't block clicks
        zIndex: 30, // Lower z-index
      },
      position: 'top-center',
    })
  },

  warning: (message) => {
    return toast(message, {
      duration: 1800,
      icon: '⚠️',
      style: {
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        maxWidth: '300px',
        pointerEvents: 'none', // Don't block clicks
        zIndex: 30, // Lower z-index
      },
      position: 'top-center',
    })
  },

  info: (message) => {
    return toast(message, {
      duration: 1500,
      icon: 'ℹ️',
      style: {
        background: '#dbeafe',
        color: '#1d4ed8',
        border: '1px solid #93c5fd',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        maxWidth: '300px',
        pointerEvents: 'none', // Don't block clicks
        zIndex: 30, // Lower z-index
      },
      position: 'top-center',
    })
  },

  // Silent notification - just visual, no blocking
  silent: (message, type = 'info') => {
    const styles = {
      info: { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
      success: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      warning: { bg: '#fffbeb', color: '#92400e', border: '#fed7aa' },
      error: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    }

    const style = styles[type] || styles.info

    return toast(message, {
      duration: 1000, // Very short
      style: {
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '12px',
        maxWidth: '250px',
        pointerEvents: 'none', // Don't block clicks
        zIndex: 25, // Even lower z-index
        opacity: 0.9, // Slightly transparent
      },
      position: 'bottom-right', // Out of the way
    })
  }
}

// Exam mode toast - automatically uses non-intrusive settings
export const useExamToast = () => {
  return examToast
}