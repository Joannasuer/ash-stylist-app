import React, { useState } from 'react';
import { X, User, Loader2, ShieldCheck } from 'lucide-react';

const LoginModal = ({ close, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (e) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { setIsLoading(false); onLogin({ name: "HUSH Member", email: email }); }, 1500); };
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-8 relative animate-fade-in-up shadow-2xl">
        <button onClick={close} className="absolute top-4 right-4 hover:text-red-600 transition-colors"><X size={20}/></button>
        <div className="text-center mb-8"><div className="inline-block p-3 bg-gray-50 rounded-full mb-4"><User size={32} className="text-black" /></div><h2 className="font-serif text-3xl italic mb-2">Welcome Back</h2><p className="text-xs text-gray-500 uppercase tracking-widest">Save your closet, measurements & style DNA</p></div>
        <form onSubmit={handleLogin} className="space-y-4"><div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors font-serif" placeholder="you@example.com" /></div><div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors" placeholder="••••••••" /></div><button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 mt-6">{isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Secure Log In'}</button></form>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center"><div className="flex items-center justify-center gap-2 text-green-600 mb-2"><ShieldCheck size={16} /><span className="text-xs font-bold uppercase tracking-wide">Privacy Guarantee</span></div><p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">Your measurements, photos, and style DNA are encrypted and stored securely. We verify your identity to protect your digital closet. HUSH never sells your body data.</p></div>
      </div>
    </div>
  );
};

export default LoginModal;