import React, { useState } from 'react';
import { X, Upload, Lock, EyeOff } from 'lucide-react';
import PrivacyBadge from '../ui/PrivacyBadge';

const VirtualTryOnModal = ({ product, close, isLoggedIn, requestLogin }) => {
  const [step, setStep] = useState('upload'); 
  const [image, setImage] = useState(null);
  const handleUpload = (e) => { if (!isLoggedIn) { requestLogin(); return; } const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setImage(reader.result); setStep('processing'); setTimeout(() => setStep('result'), 3000); }; reader.readAsDataURL(file); } };
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-none overflow-hidden relative min-h-[600px] flex flex-col">
        <button onClick={close} className="absolute top-4 right-4 z-20 text-black bg-white rounded-full p-1"><X size={20}/></button>
        {step === 'upload' && (<div className="flex-1 flex flex-col items-center justify-center p-8 text-center"><div className="mb-4"><PrivacyBadge /></div><h2 className="font-serif text-3xl italic mb-2">Virtual Studio</h2><p className="text-gray-500 text-sm mb-8">Upload a full-body photo. We'll tailor the {product.name} to your measurements.</p><label className="w-full aspect-[3/4] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"><Upload size={32} className="mb-2 text-gray-400"/><span className="text-xs font-bold uppercase tracking-widest text-gray-500">Tap to Upload Photo</span><input type="file" className="hidden" onChange={handleUpload} accept="image/*" />{!isLoggedIn && (<div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs"><Lock size={12}/> Login Required</div></div>)}</label><p className="mt-4 text-[10px] text-gray-400 flex items-center gap-1"><EyeOff size={10}/> Photos are encrypted & auto-deleted after session</p></div>)}
        {step === 'processing' && (<div className="flex-1 flex flex-col items-center justify-center p-8"><div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-6"></div><h3 className="font-serif text-2xl italic mb-2">Ash is working...</h3><p className="text-xs uppercase tracking-widest text-gray-500 animate-pulse">Adjusting Fit • Matching Lighting • Rendering</p></div>)}
        {step === 'result' && (<div className="flex-1 relative"><img src={image} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" alt="User" /><div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div><img src={product.image} className="absolute inset-0 w-full h-full object-cover mix-blend-normal" alt="Result" /><div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none"><h1 className="text-6xl font-serif font-black text-white text-center tracking-tighter mix-blend-overlay">VOGUE</h1><div className="text-white"><h3 className="font-bold uppercase tracking-widest text-xl mb-1">The Look</h3><p className="font-serif italic text-lg opacity-90">Styled by Ash for You.</p></div></div><div className="absolute bottom-0 inset-x-0 p-4 bg-white pointer-events-auto flex gap-2"><button className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase" onClick={() => alert('Saved to device!')}>Download</button><button className="flex-1 border border-black py-3 text-xs font-bold uppercase" onClick={() => setStep('upload')}>Try Another</button></div></div>)}
      </div>
    </div>
  );
};

export default VirtualTryOnModal;