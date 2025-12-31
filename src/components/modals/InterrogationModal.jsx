import React, { useState } from 'react';
import { X, Key, Siren } from 'lucide-react';
import { getZodiacSign, formatName } from '../../utils/helpers';

const InterrogationModal = ({ onComplete, onSkip, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', email: '', password: '', dob: '', height: '', weight: '', skin: '' });
  const next = () => setStep(s => s + 1);
  const handleChange = (field, value) => setData({ ...data, [field]: value });
  const finish = () => {
    const date = new Date(data.dob);
    const zodiac = getZodiacSign(date.getDate(), date.getMonth() + 1);
    alert(`🔥 Welcome to the Inner Circle, ${formatName(data.name)}.\nA confirmation email has been sent to ${data.email}.\n(Simulated)`);
    onComplete({ ...data, name: formatName(data.name), zodiac });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"><X size={24}/></button>
      {step === 1 && (
        <div className="bg-white w-full max-w-md p-8 relative animate-fade-in-up text-center shadow-2xl border-2 border-black">
          <div className="inline-block p-3 bg-black rounded-full mb-4"><Key size={24} className="text-white" /></div>
          <h2 className="font-serif text-3xl italic mb-2">Create Your VIP Profile</h2>
          <p className="text-gray-500 mb-6 font-bold text-xs">Join the elite. Save your best looks and chat history.</p>
          <div className="mb-6 space-y-4 text-left">
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Name</label><input type="text" placeholder="NAME" className="w-full border-b-2 border-gray-200 py-2 text-lg font-serif outline-none placeholder:text-gray-300 focus:border-black transition-colors uppercase" onChange={e => handleChange('name', e.target.value)} /></div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email (Login)</label><input type="email" placeholder="you@example.com" className="w-full border-b-2 border-gray-200 py-2 text-lg font-sans outline-none placeholder:text-gray-300 focus:border-black transition-colors" onChange={e => handleChange('email', e.target.value)} /></div>
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Password</label><input type="password" placeholder="••••••••" className="w-full border-b-2 border-gray-200 py-2 text-lg font-sans outline-none placeholder:text-gray-300 focus:border-black transition-colors" onChange={e => handleChange('password', e.target.value)} /></div>
          </div>
          <button onClick={next} disabled={!data.name || !data.email || !data.password} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50 mb-4">Create Profile & Continue</button>
          <button onClick={onSkip} className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-black underline">Skip Account (Chats won't be saved)</button>
          <div className="mt-6 pt-4 border-t border-gray-100 text-[9px] text-gray-400 flex items-center justify-center gap-1"><Siren size={12} className="text-green-500"/> Relax, darling. I am not the FBI.</div>
        </div>
      )}
      {step === 2 && (
        <div className="bg-white w-full max-w-md p-8 relative animate-fade-in-up text-center shadow-2xl">
          <h2 className="font-serif text-3xl italic mb-2">The Vitals</h2>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-8">I need this to make the fit lethal.</p>
          <div className="space-y-6 mb-8">
             <div><label className="block text-[10px] font-bold uppercase tracking-widest text-black mb-1">Birthday (For Zodiac Vibe)</label><input type="date" className="w-full border-b border-gray-200 py-2 text-center text-lg outline-none font-sans" onChange={e => handleChange('dob', e.target.value)} /></div>
             <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Height (cm)" className="w-full border-b border-gray-200 py-2 text-center outline-none" onChange={e => handleChange('height', e.target.value)} />
                <input type="number" placeholder="Weight (kg)" className="w-full border-b border-gray-200 py-2 text-center outline-none" onChange={e => handleChange('weight', e.target.value)} />
             </div>
             <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Skin Tone (Color Theory)</p><div className="flex justify-center gap-2">{['#f5d0b0', '#eac086', '#d29b68', '#8d5524', '#3b2219'].map(color => (<div key={color} onClick={() => handleChange('skin', color)} className={`h-8 w-8 rounded-full cursor-pointer border-2 transition-transform ${data.skin === color ? 'border-black scale-125 ring-2 ring-black ring-offset-2' : 'border-transparent hover:scale-110'}`} style={{backgroundColor: color}}></div>))}</div></div>
          </div>
          <button onClick={finish} disabled={!data.dob || !data.height || !data.skin} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-colors disabled:opacity-50">Finish & Unlock</button>
        </div>
      )}
    </div>
  );
};

export default InterrogationModal;