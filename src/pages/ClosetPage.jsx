import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';

const ClosetPage = () => {
  const { handleScroll } = useOutletContext();
  const { closet, toggleCloset, setSelectedProduct, setTryOnProduct } = useApp();

  return (
    <div className="px-4 pt-6 animate-fade-in h-full overflow-y-auto" onScroll={handleScroll}>
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl font-serif italic">My Wardrobe</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pb-20">
            {closet.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    toggleCloset={toggleCloset} 
                    isInCloset={true} 
                    openDetails={setSelectedProduct} 
                    openTryOn={setTryOnProduct} 
                />
            ))}
        </div>
    </div>
  );
};

export default ClosetPage;