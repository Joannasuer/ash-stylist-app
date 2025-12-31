import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { PRODUCT_DATABASE } from '../utils/constants';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { handleScroll } = useOutletContext();
  const { toggleCloset, closet, setSelectedProduct, setTryOnProduct } = useApp();

  return (
    <div className="animate-fade-in px-4 pt-6 lg:pt-6 h-full overflow-y-auto" onScroll={handleScroll}>
      <div className="flex flex-col lg:flex-row justify-between items-end mb-8 lg:mb-12 gap-4">
          <div><h1 className="text-3xl lg:text-5xl font-serif italic mb-2">The Edit</h1><p className="text-gray-500 uppercase tracking-widest text-xs">Curated by Ash • Global & Local Finds</p></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-16 pb-20">
        {PRODUCT_DATABASE.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                toggleCloset={toggleCloset} 
                isInCloset={!!closet.find(i => i.id === product.id)} 
                openDetails={setSelectedProduct} 
                openTryOn={setTryOnProduct} 
            />
        ))}
      </div>
    </div>
  );
};

export default Home;