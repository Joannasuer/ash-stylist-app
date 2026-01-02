import React from 'react';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import VirtualTryOnModal from '../features/VirtualTryOnModal'; // Import the new box

const Layout = () => {
  const location = useLocation();
  const { tryOnProduct, setTryOnProduct } = useApp(); // Get global state

  // Smooth scroll logic
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) console.log("Reached bottom");
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header stays at the top */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet context={{ handleScroll }} />
      </main>

      {/* 🔴 THE POPUP: If 'tryOnProduct' exists, show the modal */}
      {tryOnProduct && (
        <VirtualTryOnModal 
          product={tryOnProduct} 
          onClose={() => setTryOnProduct(null)} 
        />
      )}

    </div>
  );
};

export default Layout;