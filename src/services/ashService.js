// src/services/ashService.js
// Ash's styling engine — all API calls go through the secure backend

export const HUSH_PRODUCTS = [
  {
    id: 'hush-001',
    name: 'Midnight Silk Dress',
    price: '180.00',
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop',
    link: 'https://timeforhush.com/products/midnight-silk-dress',
    description: 'Black silk, open back. The kind of dress that ends conversations.',
    category: 'dress',
    tags: ['evening', 'minimalist', 'luxury'],
  },
  {
    id: 'hush-002',
    name: 'Executive Blazer',
    price: '250.00',
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1548624149-f32144679638?w=500&auto=format&fit=crop',
    link: 'https://timeforhush.com/products/executive-blazer',
    description: 'Oversized, sharp shoulders. Power dressing for the modern era.',
    category: 'blazer',
    tags: ['workwear', 'power', 'versatile'],
  },
  {
    id: 'hush-003',
    name: 'Viper Leather Pants',
    price: '300.00',
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&auto=format&fit=crop',
    link: 'https://timeforhush.com/products/viper-leather-pants',
    description: 'High waisted, vegan leather. Built for people who arrive.',
    category: 'pants',
    tags: ['athleisure', 'evening', 'statement'],
  },
  {
    id: 'hush-004',
    name: 'Raw Edge Denim',
    price: '220.00',
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop',
    link: 'https://timeforhush.com/products/raw-edge-denim',
    description: 'Japanese selvage. Straight leg. The only denim you need.',
    category: 'denim',
    tags: ['denim', 'everyday', 'elevated'],
  },
  {
    id: 'hush-005',
    name: 'Sculpt Athleisure Set',
    price: '195.00',
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop',
    link: 'https://timeforhush.com/products/sculpt-athleisure-set',
    description: 'Technical fabric. Body-sculpting silhouette. From studio to street.',
    category: 'athleisure',
    tags: ['fitness', 'athleisure', 'casual'],
  },
];

/**
 * Send a message to Ash via the secure backend API
 * @param {string} message - User's message
 * @param {object|null} userProfile - FIT ID profile data
 * @param {array} history - Conversation history [{role, content}]
 * @returns {Promise<{text: string, suggestedLook: object|null}>}
 */
export async function askAsh(message, userProfile = null, history = []) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      userProfile,
      products: HUSH_PRODUCTS,
      history,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Ash is unavailable right now.');
  }

  return response.json();
}
