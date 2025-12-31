import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DesignerStudio from '../components/features/DesignerStudio';
import { useApp } from '../context/AppContext';

const SketchPage = () => {
  const { handleScroll } = useOutletContext();
  const { isLoggedIn, setShowLoginModal } = useApp();

  return (
    <div className="h-full overflow-y-auto pt-6" onScroll={handleScroll}>
        <DesignerStudio isLoggedIn={isLoggedIn} requestLogin={() => setShowLoginModal(true)} />
    </div>
  );
};

export default SketchPage;