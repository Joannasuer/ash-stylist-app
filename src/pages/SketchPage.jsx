import React from 'react';
// 1. REMOVED: import { useOutletContext } ... (This was crashing it)
import DesignerStudio from '../components/features/DesignerStudio';
import { useApp } from '../context/AppContext';

const SketchPage = () => {
  // 2. FIXED: Replaced the broken context call with a simple function
  const handleScroll = (e) => {
     // Optional: You can add scroll logic here later if needed
  };

  const { isLoggedIn, setShowLoginModal } = useApp();

  return (
    <div className="h-full overflow-y-auto pt-6" onScroll={handleScroll}>
        <DesignerStudio isLoggedIn={isLoggedIn} requestLogin={() => setShowLoginModal(true)} />
    </div>
  );
};

export default SketchPage;