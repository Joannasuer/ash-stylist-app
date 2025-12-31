import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';
import LoginModal from '../modals/LoginModal';
import SizeModal from '../modals/SizeModal';
import InterrogationModal from '../modals/InterrogationModal';
import VisualQuiz from '../modals/VisualQuiz';
import ProductDetailModal from '../modals/ProductDetailModal';
import VirtualTryOnModal from '../modals/VirtualTryOnModal';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { 
    showLoginModal, setShowLoginModal, handleLogin,
    showSizeModal, setShowSizeModal, saveStats, isLoggedIn,
    showInterrogation, setShowInterrogation, handleProfileComplete, setHasSkippedProfile,
    isQuizOpen, setIsQuizOpen,
    selectedProduct, setSelectedProduct, addToCart, setTryOnProduct,
    tryOnProduct
  } = useApp();

  const handleScroll = (e) => {
    // If the scroll event comes from a child container
    if (e.target.scrollTop > 10) setIsScrolled(true);
    else setIsScrolled(false);
  };

  return (
    <div className="h-screen w-full bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 flex flex-col overflow-hidden absolute inset-0">
      <Header isScrolled={isScrolled} />
      
      <main className="flex-1 w-full px-0 lg:px-6 py-0 lg:py-0 overflow-hidden relative min-h-0 pb-20 lg:pb-10">
        <div className="h-full w-full overflow-hidden" onScroll={handleScroll}>
            <Outlet context={{ handleScroll }} />
        </div>
      </main>

      <MobileNav />

      {/* Global Modals */}
      {showInterrogation && <InterrogationModal onComplete={handleProfileComplete} onSkip={() => { setHasSkippedProfile(true); setShowInterrogation(false); }} onClose={() => setShowInterrogation(false)} />}
      {selectedProduct && <ProductDetailModal product={selectedProduct} close={() => setSelectedProduct(null)} addToCart={addToCart} openTryOn={setTryOnProduct} openDetails={setSelectedProduct} />}
      {tryOnProduct && <VirtualTryOnModal product={tryOnProduct} close={() => setTryOnProduct(null)} isLoggedIn={true} />}
      {showLoginModal && <LoginModal close={() => setShowLoginModal(false)} onLogin={handleLogin} />}
      {showSizeModal && <SizeModal close={() => setShowSizeModal(false)} saveStats={saveStats} isLoggedIn={isLoggedIn} requestLogin={() => setShowLoginModal(true)} />}
      {isQuizOpen && <VisualQuiz closeQuiz={() => setIsQuizOpen(false)} onComplete={() => { setIsQuizOpen(false); alert("Style Profile Built."); }} />}
    </div>
  );
};

export default Layout;