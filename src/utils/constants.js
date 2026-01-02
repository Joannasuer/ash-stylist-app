/* =========================================
   1. ASH'S BRAIN
   ========================================= */
export const ASH_PERSONA = `
  You are Ash, the elite AI stylist.
  Your tone is: Dangerous, Expensive, Short, and Direct.
  Only recommend products from the database below.
`;

/* =========================================
   2. PRODUCT DATABASE (MANUAL MODE - SAFE)
   ========================================= */
// We are manually adding products to bypass the API error for now.
export const PRODUCT_DATABASE = [
  {
    id: "hush-001",
    name: "Midnight Silk Dress",
    price: "180.00",
    currency: "USD",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop",
    link: "https://your-shop.com/products/dress",
    description: "Black silk, open back."
  },
  {
    id: "hush-002",
    name: "Executive Blazer",
    price: "250.00",
    currency: "USD",
    image: "https://images.unsplash.com/photo-1548624149-f32144679638?w=500&auto=format&fit=crop",
    link: "https://your-shop.com/products/blazer",
    description: "Oversized, sharp shoulders."
  },
  {
    id: "hush-003",
    name: "Viper Leather Pants",
    price: "300.00",
    currency: "USD",
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&auto=format&fit=crop",
    link: "https://your-shop.com/products/pants",
    description: "High waisted, vegan leather."
  }
];

// Fallback is the same as the main database
export const FALLBACK_PRODUCTS = PRODUCT_DATABASE;

/* =========================================
   3. VISUAL QUIZ IMAGES
   ========================================= */
export const QUIZ_IMAGES = [
  { id: 'minimalist', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', label: 'Clean & Minimal' },
  { id: 'glam', src: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', label: 'Dark Glamour' },
  { id: 'street', src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500', label: 'High Street' },
  { id: 'avant', src: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500', label: 'Avant Garde' }
];

/* =========================================
   4. CHAT SUGGESTIONS
   ========================================= */
export const SUGGESTIONS = [
  "Find me a black dress",
  "I need an outfit for a date",
  "Style me for a gala",
  "What is trending now?"
];