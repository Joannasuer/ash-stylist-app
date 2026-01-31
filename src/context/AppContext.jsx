import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 

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
  const [showInterrogation, setShowInterrogation] = useState(false); 

  // STYLING DATA
  const [suggestedLook, setSuggestedLook] = useState(null);
  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryOnProduct, setTryOnProduct] = useState(null);

  // --- LOGIN LOGIC (THE BRIDGE) ---
  useEffect(() => {
    // 1. Check for Real Login (Supabase)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setUserProfile({ isVIP: true }); // Supabase user is VIP
      } else {
        // 🟢 2. THE BRIDGE: Check if Shopify sent us a user via URL
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const shopifyEmail = params.get('email');
            const shopifyName = params.get('name');
    
            if (shopifyEmail) {
              console.log("Bridge Connected: User from Shopify found:", shopifyEmail);
              // Create a "Virtual User" so Ash knows who they are
              setUser({ 
                email: shopifyEmail, 
                user_metadata: { full_name: shopifyName },
                id: 'shopify_guest' 
              });
              setUserProfile({ isVIP: true }); // Assume Shopify users are VIPs
              setShowInterrogation(false); // Close the lock screen
            }
        }
      }
    });

    // 3. Listen for Magic Link clicks (Standard Supabase Login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserProfile({ isVIP: true });
        setShowInterrogation(false);
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
    user, 
    userProfile, setUserProfile, 
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

// 🟢 CRITICAL EXPORT (This fixes the build error)
export const useApp = () => useContext(AppContext);

export default AppContext;