import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [closet, setCloset] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState({ height: '', weight: '' });
  const [suggestedLook, setSuggestedLook] = useState(null);

  // Global Modals State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showInterrogation, setShowInterrogation] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  // Specific Product Interaction State
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [tryOnProduct, setTryOnProduct] = useState(null); 

  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);
  const [completeProfileTrigger, setCompleteProfileTrigger] = useState(false);

  const addToCart = (product) => setCart([...cart, product]);
  
  const toggleCloset = (product) => { 
    if (!isLoggedIn) { 
      setShowLoginModal(true); 
      return; 
    } 
    setCloset(prev => prev.find(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product]); 
  };

  const saveStats = (stats) => { 
    setUserStats(stats); 
    alert(`Profile Updated.`); 
  };

  const handleLogin = (profile) => { 
    setIsLoggedIn(true); 
    if(profile) setUserProfile(prev => ({...prev, ...profile}));
    setShowLoginModal(false); 
  };

  const handleProfileComplete = (data) => {
    setUserProfile(data);
    setShowInterrogation(false);
    setCompleteProfileTrigger(true);
    setIsLoggedIn(true);
  };

  const value = {
    cart, addToCart,
    closet, toggleCloset,
    userProfile, setUserProfile,
    isLoggedIn, setIsLoggedIn,
    userStats, saveStats,
    suggestedLook, setSuggestedLook,
    
    // Modal Controls
    showLoginModal, setShowLoginModal,
    showSizeModal, setShowSizeModal,
    showInterrogation, setShowInterrogation,
    isQuizOpen, setIsQuizOpen,
    selectedProduct, setSelectedProduct,
    tryOnProduct, setTryOnProduct,

    hasSkippedProfile, setHasSkippedProfile,
    completeProfileTrigger, setCompleteProfileTrigger,

    handleLogin,
    handleProfileComplete
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);