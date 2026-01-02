import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [cart, setCart] = useState([]);
  const [closet, setCloset] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // GLOBAL MODAL STATE (This fixes the button connection)
  const [showFitModal, setShowFitModal] = useState(false); 
  const [showSizeModal, setShowSizeModal] = useState(false);
  
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
    if (!product) return;
    setCart((prev) => [...prev, product]);
    alert("Added to Cart!");
  };

  const signup = async (email, password, additionalData) => {
    try {
      // Simulate API delay
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

  // --- EXPORT ---
  const value = {
    user,
    userProfile,
    isLoggedIn: !!user,
    cart,
    addToCart,
    closet,
    toggleCloset,
    isMobileNavOpen,
    toggleMobileNav,
    
    // The Fix: Exposing these globally
    showFitModal, 
    setShowFitModal,
    
    showSizeModal,
    setShowSizeModal,
    selectedProduct,
    setSelectedProduct,
    tryOnProduct,
    setTryOnProduct,
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