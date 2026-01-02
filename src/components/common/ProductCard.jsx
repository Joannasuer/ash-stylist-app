import React from 'react';
import { Heart, Camera } from 'lucide-react';

const ProductCard = ({ product, toggleCloset, isInCloset, openDetails, openTryOn }) => {
  // 1. SAFETY: Prevent crash if product is missing
  if (!product) return null;

  return (
    <div className="group w-full cursor-pointer flex flex-col">
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
         
         {/* Main Image */}
         <img 
           src={product.image || product.img || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"} 
           alt={product.name} 
           onClick={() => openDetails && openDetails(product)}
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
         />

         {/* TOP RIGHT: HEART BUTTON */}
         {toggleCloset && (
           <button 
             onClick={(e) => { e.stopPropagation(); toggleCloset(product); }}
             className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-red-600 transition-colors z-10"
           >
             <Heart size={16} fill={isInCloset ? "currentColor" : "none"} className={isInCloset ? "text-red-600" : "text-black"} />
           </button>
         )}

         {/* 🔴 BOTTOM: VIRTUAL TRY-ON BAR (Like your screenshot) */}
         {openTryOn && (
           <div 
             onClick={(e) => { e.stopPropagation(); openTryOn(product); }}
             className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-black hover:text-white transition-colors shadow-lg"
           >
             <Camera size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Virtual Try-On</span>
           </div>
         )}
      </div>

      {/* DETAILS */}
      <div className="text-center" onClick={() => openDetails && openDetails(product)}>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
          {product.category || "Collection"}
        </p>
        <h3 className="font-serif text-lg italic text-black mb-1">{product.name}</h3>
        <p className="text-xs font-bold font-sans text-gray-900">
          {typeof product.price === 'number' ? `$${product.price}` : product.price}
        </p>
      </div>

    </div>
  );
};

export default ProductCard;