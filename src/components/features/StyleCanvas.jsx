import React from 'react';
import { XCircle, Sparkles, Layers } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const StyleCanvas = ({ suggestedLook, products, toggleCloset, closet, openDetails, openTryOn, onClose }) => {
  if (!suggestedLook) return null;

  const canvasItems = (suggestedLook.itemIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="h-full w-full bg-white flex flex-col animate-fade-in border-l border-gray-200 relative">
       <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white hover:text-black transition-colors">
          <XCircle size={24} />
       </button>

       <div className="p-8 border-b border-gray-100 bg-black text-white relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Sparkles size={120} /></div>
           <div className="relative z-10 pr-12">
             <span className="bg-white text-black px-2 py-1 text-[9px] font-bold uppercase tracking-widest mb-2 inline-block">Curated For You ✨</span>
             <h2 className="font-serif text-3xl italic mb-2">{String(suggestedLook.title)}</h2>
             <p className="text-sm text-gray-300 font-sans leading-relaxed max-w-md">{String(suggestedLook.explanation)}</p>
           </div>
       </div>
       <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><Layers size={14}/> The Selection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {canvasItems.map(p => (
               <ProductCard key={p.id} product={p} toggleCloset={toggleCloset} isInCloset={!!closet.find(i => i.id === p.id)} openDetails={openDetails} openTryOn={openTryOn} showReason={true} />
             ))}
          </div>
       </div>
    </div>
  );
};

export default StyleCanvas;