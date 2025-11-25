// Custom Hook for Sound Effects
import { useCallback } from 'react';
import { playClick, playHover } from '../utils/soundUtils';

export const useSoundEffects = () => {
  const handleClick = useCallback(() => {
    playClick();
  }, []);

  const handleHover = useCallback(() => {
    playHover();
  }, []);

  // Enhanced button props with sound effects
  const getSoundProps = useCallback((options = {}) => {
    const { 
      onClick, 
      onMouseEnter, 
      enableHover = false, 
      enableClick = true 
    } = options;

    return {
      onClick: (e) => {
        if (enableClick) handleClick();
        if (onClick) onClick(e);
      },
      onMouseEnter: (e) => {
        if (enableHover) handleHover();
        if (onMouseEnter) onMouseEnter(e);
      }
    };
  }, [handleClick, handleHover]);

  return {
    handleClick,
    handleHover,
    getSoundProps
  };
};

export default useSoundEffects;