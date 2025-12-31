import React from 'react';
import { Heart, Camera, Truck, Star } from 'lucide-react';

const ProductCard = ({ product, toggleCloset, isInCloset, openDetails, openTryOn, showReason, mini }) => {
  if (!product) return null;
  return (
    <div 
      className={`group bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative font-sans flex flex-col cursor-pointer ${mini ? 'min-w-[160px] snap-start' : ''}`}
      onClick={() => openDetails(product)}
    >
      <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm ${product.source.includes('HUSH') ? 'bg-black text-white' : 'bg-white text-black border border-gray-200'}`}>{product.source}</div>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
        <button onClick={(e) => { e.stopPropagation(); toggleCloset(product); }} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:bg-red-600 hover:text-white transition-colors z-20"><Heart size={18} className={isInCloset ? "text-red-600 fill-current" : "currentColor"} /></button>
        {!mini && <button onClick={(e) => { e.stopPropagation(); openTryOn(product); }} className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-md text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg z-20"><Camera size={14} /> Virtual Try-On</button>}
      </div>
      <div className="p-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category}</div>
          <h3 className="font-serif text-lg text-gray-900 mb-1 tracking-tight leading-tight">{product.name}</h3>
          <p className="text-sm font-bold text-gray-900 mb-3">${product.price.toFixed(2)}</p>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-gray-500 border-t border-gray-100 pt-2 mb-3"><span className="flex items-center gap-1"><Truck size={10}/> {product.shipping}</span><span className="flex items-center gap-1"><Star size={10} className="text-yellow-500 fill-current"/> {product.quality} ({product.reviewCount})</span></div>
          {showReason && product.reason && (<div className="bg-red-50 p-2 text-[10px] text-red-800 italic font-serif mt-2 border-l-2 border-red-200 text-left">" {product.reason} "</div>)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;