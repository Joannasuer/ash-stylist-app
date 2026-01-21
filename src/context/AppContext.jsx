import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [closet, setCloset] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // MODALS
  const [showFitModal, setShowFitModal] = useState(false); 
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showInterrogation, setShowInterrogation] = useState(false); 

  // STYLING DATA
  const [suggestedLook, setSuggestedLook] = useState(null);
  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryOnProduct, setTryOnProduct] = useState(null);

  // --- 🔴 THE MISSING PIECE: LISTEN FOR LOGIN ---
  useEffect(() => {
    // 1. Check if user is already logged in when app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for the "Magic Link" click
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // If they just logged in, close the VIP popup automatically
        setShowInterrogation(false);
        console.log("User successfully logged in:", session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const value = {
    user, // Now this will actually update!
    cart, addToCart,
    closet, toggleCloset,
    isMobileNavOpen, toggleMobileNav,
    showFitModal, setShowFitModal,
    showSizeModal, setShowSizeModal,
    showInterrogation, setShowInterrogation,
    suggestedLook, setSuggestedLook,
    hasSkippedProfile, setHasSkippedProfile,
    selectedProduct, setSelectedProduct,
    tryOnProduct, setTryOnProduct
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
export default AppContext;