import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [cart, setCart] = useState([]);
  const [closet, setCloset] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // MODALS
  const [showFitModal, setShowFitModal] = useState(false); 
  const [showSizeModal, setShowSizeModal] = useState(false);
  
  // 🔴 THIS WAS MISSING IN YOUR FILE. IT IS REQUIRED FOR THE BUTTON TO WORK.
  const [showInterrogation, setShowInterrogation] = useState(false); 

  // STYLING DATA
  const [suggestedLook, setSuggestedLook] = useState(null);
  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryOnProduct, setTryOnProduct] = useState(null);

  // --- ACTIONS ---
  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const toggleCloset = (product) => {
    if (!product) return;
    setCloset((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert("Added to Cart!");
  };

  const signup = async (email, password, additionalData) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser = { uid: "user-" + Date.now(), email };
        const newProfile = { ...additionalData };
        setUser(newUser);
        setUserProfile(newProfile);
        return newUser;
      } catch (error) {
        console.error("Signup error", error);
        throw error;
      }
    };

  const value = {
    user, userProfile,
    cart, addToCart,
    closet, toggleCloset,
    isMobileNavOpen, toggleMobileNav,
    
    // Modals
    showFitModal, setShowFitModal,
    showSizeModal, setShowSizeModal,
    
    // 🔴 FIXED: Now the "Unlock" button will work
    showInterrogation, setShowInterrogation,

    suggestedLook, setSuggestedLook,
    hasSkippedProfile, setHasSkippedProfile,
    selectedProduct, setSelectedProduct,
    tryOnProduct, setTryOnProduct,
    signup
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default AppContext;