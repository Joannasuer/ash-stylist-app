export const LOGO_CONFIG = {
  useImage: false, 
  imageUrl: 'https://cdn.shopify.com/s/files/YOUR_UPLOADED_LOGO.jpg',
  svgColor: 'text-red-600' 
};

export const ZODIAC_SIGNS = [
  'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 
  'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
];

export const PRODUCT_DATABASE = [
  { 
    id: 1, 
    name: 'Midnight Silk Slip', 
    price: 189.00, 
    category: 'Evening', 
    source: 'HUSH Exclusive', 
    shipping: '2-3 Days', 
    quality: '5.0', 
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=600', 
    link: '#', 
    relatedIds: [4, 2],
    reason: 'The bias cut creates an hourglass silhouette effortlessly. Silk reflects light beautifully on warm skin tones.'
  },
  { 
    id: 2, 
    name: 'Oversized Dad Blazer', 
    price: 89.99, 
    category: 'Work', 
    source: 'ZARA (Global)', 
    shipping: '5-7 Days', 
    quality: '4.2', 
    reviewCount: 840,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600', 
    link: 'https://zara.com', 
    relatedIds: [1, 4],
    reason: 'Structured shoulders add authority. Perfect for balancing softer, more feminine layers underneath.'
  },
  { 
    id: 3, 
    name: 'Vintage Moto Jacket', 
    price: 250.00, 
    category: 'Outerwear', 
    source: 'SoHo Vintage (Local)', 
    shipping: 'Same Day', 
    quality: 'Unique', 
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?auto=format&fit=crop&q=80&w=600', 
    link: '#', 
    relatedIds: [4],
    reason: 'One-of-a-kind leather. It adds immediate texture and edge to any monochromatic outfit.'
  },
  { 
    id: 4, 
    name: 'Gold Chain Belt', 
    price: 45.00, 
    category: 'Accessories', 
    source: 'Amazon Fashion', 
    shipping: 'Prime (1 Day)', 
    quality: '4.5', 
    reviewCount: 2300,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', 
    link: 'https://amazon.com', 
    relatedIds: [1],
    reason: 'Defines the waist without breaking the vertical line. Gold hardware warms up the entire look.'
  },
  { 
    id: 5, 
    name: 'Velvet Corset Top', 
    price: 120.00, 
    category: 'Night Out', 
    source: 'HUSH Exclusive', 
    shipping: '2-4 Days', 
    quality: '4.9', 
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=600', 
    link: '#', 
    relatedIds: [3],
    reason: 'Rich texture that catches low light perfectly.'
  },
  { 
    id: 6, 
    name: 'Chunky Gold Hoops', 
    price: 24.99, 
    category: 'Accessories', 
    source: 'MANGO', 
    shipping: '3-5 Days', 
    quality: '4.0', 
    reviewCount: 150,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a51?auto=format&fit=crop&q=80&w=600', 
    link: 'https://mango.com', 
    relatedIds: [2],
    reason: 'Classic staple that frames the face.'
  },
];

export const QUIZ_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600', style: 'Street Chic' },
  { id: 2, src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', style: 'Boho Luxe' },
  { id: 3, src: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600', style: 'Avant Garde' },
  { id: 4, src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600', style: 'Minimalist' },
];
