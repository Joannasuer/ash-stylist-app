// --- PASTE THIS INTO src/context/AppContext.jsx ---
  useEffect(() => {
    // 1. Check for Real Login (Supabase)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // 🟢 2. THE BRIDGE: Check if Shopify sent us a user
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
          // Auto-Close the VIP Modal since we know them
          setShowInterrogation(false); 
        }
      }
    });

    // 3. Listen for Magic Link clicks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setShowInterrogation(false); // Close modal on login
      }
    });

    return () => subscription.unsubscribe();
  }, []);