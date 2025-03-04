
import { useState, useEffect } from 'react';

export const useOceanAnimation = () => {
  const [showOceanAnimation, setShowOceanAnimation] = useState(false);
  
  useEffect(() => {
    const handleOpenAnimation = () => setShowOceanAnimation(true);
    const handleCloseAnimation = () => setShowOceanAnimation(false);
    
    document.addEventListener('openOceanAnimation', handleOpenAnimation);
    document.addEventListener('closeOceanAnimation', handleCloseAnimation);
    
    return () => {
      document.removeEventListener('openOceanAnimation', handleOpenAnimation);
      document.removeEventListener('closeOceanAnimation', handleCloseAnimation);
    };
  }, []);
  
  return { showOceanAnimation };
};
