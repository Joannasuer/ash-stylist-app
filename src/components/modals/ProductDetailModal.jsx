import React from 'react';
import { X, MessageCircle, Camera } from 'lucide-react';
import { PRODUCT_DATABASE } from '../../utils/constants';

const ProductDetailModal = ({ product, close, addToCart, openTryOn, openDetails }) => {
  if (!product) return null;
  const relatedProducts = PRODUCT_DATABASE.filter(p => product.relatedIds && product.relatedIds.includes(p.id));
  return (
    <div className="fixed inset-0 z-[90] bg-white overflow-y-auto animate-fade-in">
      <div className="sticky top-0 flex justify-between items-center p-4 bg-white/90 backdrop-blur z-50 border-b border-gray-100">
        <h2 className="font-serif text-xl italic">Ash's Pick</h2>
        <button onClick={close}><X size={24}/></button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-10">
        <div className="space-y-4">
           <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover" />
           <button onClick={() => openTryOn(product)} className="w-full py-4 border border-black hover:bg-black hover:text-white transition-all uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-2"><Camera size={16} /> Visualize On Me</button>
        </div>
        <div className="space-y-8">
           <div><h1 className="text-4xl lg:text-6xl font-serif italic mb-2">{product.name}</h1><p className="text-2xl font-bold text-red-600">${product.price.toFixed(2)}</p></div>
           <div className="bg-gray-50 p-6 border-l-4 border-black"><h3 className="font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><MessageCircle size={14}/> Ash Says:</h3><p className="font-serif italic text-lg text-gray-700">"This isn't just a {product.category.toLowerCase()}. It's a statement. The fabric quality is rated {product.quality}/5, and if you order now, it ships in {product.shipping}."</p></div>
           <button onClick={() => { addToCart(product); close(); }} className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">Add To Cart</button>
           {relatedProducts.length > 0 && (
             <div className="pt-8 border-t border-gray-100"><h3 className="font-serif text-2xl italic mb-4">Complete The Look</h3><div className="grid grid-cols-2 gap-4">{relatedProducts.map(rp => (<div key={rp.id} className="group cursor-pointer" onClick={() => openDetails(rp)}><div className="aspect-[3/4] mb-2 overflow-hidden"><img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div><h4 className="font-bold text-xs uppercase tracking-wide">{rp.name}</h4><p className="text-xs text-gray-500">${rp.price}</p></div>))}</div></div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;