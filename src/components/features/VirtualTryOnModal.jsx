import React, { useState } from 'react';
import { X, Camera, Upload, RefreshCw } from 'lucide-react';

const VirtualTryOnModal = ({ product, onClose }) => {
  const [mode, setMode] = useState('upload'); // 'camera' or 'upload'

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      
      {/* 🔴 THE EXIT BUTTON */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-50 p-2 bg-black/50 rounded-full"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-4xl h-[80vh] bg-gray-900 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
        
        {/* LEFT: The Product You Selected */}
        <div className="w-full md:w-1/3 bg-white p-6 flex flex-col items-center justify-center text-center relative">
           <h3 className="font-serif italic text-2xl mb-2">{product.name}</h3>
           <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{product.price}</p>
           <div className="flex-1 w-full relative overflow-hidden rounded-xl border border-gray-100">
             <img src={product.image || product.img} alt={product.name} className="w-full h-full object-cover" />
           </div>
           <p className="text-[10px] text-gray-400 mt-4">Powered by Ash AI Vision</p>
        </div>

        {/* RIGHT: Your Photo / Camera */}
        <div className="w-full md:w-2/3 bg-black relative flex flex-col">
           
           {/* Placeholder for Camera Feed */}
           <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black relative">
              <div className="text-center space-y-4">
                 {mode === 'upload' ? <Upload size={48} className="mx-auto text-gray-600"/> : <Camera size={48} className="mx-auto text-gray-600"/>}
                 <p className="text-gray-500 font-serif italic text-lg">
                   {mode === 'upload' ? "Upload your full-body photo" : "Camera Access Required"}
                 </p>
              </div>

              {/* Simulation Overlay (Fake UI) */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none" />
           </div>

           {/* Controls */}
           <div className="h-24 border-t border-white/10 flex items-center justify-center gap-6 bg-gray-900">
              <button onClick={() => setMode('upload')} className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-widest ${mode === 'upload' ? 'text-white' : 'text-gray-500'}`}>
                <div className="p-3 bg-white/10 rounded-full mb-1"><Upload size={20}/></div>
                Upload Photo
              </button>
              
              <button className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-red-900/20">
                 Generate Fit
              </button>

              <button onClick={() => setMode('camera')} className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-widest ${mode === 'camera' ? 'text-white' : 'text-gray-500'}`}>
                <div className="p-3 bg-white/10 rounded-full mb-1"><Camera size={20}/></div>
                Live Camera
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnModal;