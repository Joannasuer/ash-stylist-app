import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { PRODUCT_DATABASE } from '../utils/constants';
import { useApp } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  // We default closet to [] to prevent crashes
  const { toggleCloset, closet = [], setSelectedProduct, setTryOnProduct } = useApp();

  const HERO_CATEGORIES = [
    { id: 'minimal', label: 'MINIMAL', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&fit=crop' },
    { id: 'glam', label: 'GLAM', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&fit=crop' },
    { id: 'street', label: 'STREET', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&fit=crop' },
    { id: 'avant', label: 'AVANT', img: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&fit=crop' }
  ];

  return (
    // 🔴 NUCLEAR FIX: 'fixed inset-0 overflow-y-auto' forces this page to scroll 
    // independently, ignoring any parent locks. 'z-0' keeps it behind the header.
    <div className="fixed inset-0 overflow-y-auto bg-white z-0 pt-16">
      
      {/* SECTION 1: HERO (The Girl + 4 Boxes) */}
      <div className="relative w-full h-[90vh] bg-black flex flex-col justify-between shrink-0">
        <div className="absolute inset-0 opacity-70">
           <img 
             src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop" 
             alt="Fashion Hero" 
             className="w-full h-full object-cover object-top"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* CENTER CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center mt-[-60px]">
          <Sparkles size={40} className="mb-6 text-red-600 animate-pulse" />
          <h1 className="text-8xl md:text-[10rem] font-black text-white leading-none tracking-tighter">
            ᴀꜱʜ <span className="text-red-600">✗</span>
          </h1>
          <p className="text-sm md:text-base uppercase tracking-[0.4em] text-gray-100 mt-4 mb-10 font-medium font-sans">
            The World's First AI Stylist
          </p>
          <button 
            onClick={() => navigate('/chat')}
            className="bg-white text-black px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            Start Styling <ArrowRight size={16} />
          </button>
        </div>

        {/* BOTTOM BOXES */}
        <div className="relative z-20 grid grid-cols-4 h-32 md:h-48 border-t border-white/20">
          {HERO_CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate('/chat')}
              className="relative group cursor-pointer overflow-hidden border-r border-white/20 last:border-none"
            >
               <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
               <div className="absolute inset-0 flex items-end justify-center pb-8 bg-black/20 group-hover:bg-transparent transition-all">
                 <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-transparent group-hover:border-white pb-1">
                   {cat.label}
                 </span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: THE EDIT (Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 py-24 pb-40">
        <div className="mb-12">
          <h2 className="font-serif italic text-5xl md:text-6xl text-black mb-3">The Edit</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Curated by Ash • Global & Local Finds
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {(PRODUCT_DATABASE || []).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              toggleCloset={toggleCloset} 
              isInCloset={!!(closet || []).find(i => i.id === product.id)} 
              openDetails={setSelectedProduct}
              // We pass a fallback function if setTryOnProduct is missing to ensure the button shows
              openTryOn={setTryOnProduct || (() => alert("Virtual Try-On Coming Soon"))} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;