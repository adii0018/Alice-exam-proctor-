// Non-intrusive toast for exam interface
export const nonIntrusiveToast = {
  show: (message, type = 'info', duration = 1500) => {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = 'non-intrusive-toast'
    
    // Set styles based on type
    const styles = {
      info: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
      success: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
      warning: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
      error: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    }
    
    const style = styles[type] || styles.info
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${style.bg};
      color: ${style.color};
      border: 1px solid ${style.border};
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 500;
      max-width: 300px;
      z-index: 30;
      pointer-events: none;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `
    
    toast.textContent = message
    document.body.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateX(0)'
    }, 10)
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, duration)
  },
  
  success: (message) => nonIntrusiveToast.show(message, 'success', 1200),
  error: (message) => nonIntrusiveToast.show(message, 'error', 2000),
  warning: (message) => nonIntrusiveToast.show(message, 'warning', 1500),
  info: (message) => nonIntrusiveToast.show(message, 'info', 1200)
}