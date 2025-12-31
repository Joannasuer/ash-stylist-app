import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import PrivacyBadge from '../ui/PrivacyBadge';

const SizeModal = ({ close, saveStats, isLoggedIn, requestLogin }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const handleSave = () => { if (!isLoggedIn) { requestLogin(); return; } saveStats({height, weight}); close(); };
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 w-full max-w-sm relative animate-fade-in-up">
        <button onClick={close} className="absolute top-4 right-4"><X size={20}/></button>
        <div className="flex justify-between items-start mb-4"><div className="flex items-center gap-2 text-red-600"><Ruler size={24}/><h2 className="font-serif text-2xl italic text-black">True Fit™</h2></div><PrivacyBadge /></div>
        <p className="text-gray-500 text-sm mb-6">Ash uses AI to predict your perfect size. Data is encrypted.</p>
        <div className="space-y-4 mb-6">
           <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Height (cm)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full border-b border-gray-200 py-2 focus:border-black outline-none font-serif text-lg" placeholder="170" /></div>
           <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border-b border-gray-200 py-2 focus:border-black outline-none font-serif text-lg" placeholder="65" /></div>
        </div>
        <button onClick={handleSave} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">{isLoggedIn ? 'Save Securely' : 'Login to Save Profile'}</button>
      </div>
    </div>
  );
};

export default SizeModal;