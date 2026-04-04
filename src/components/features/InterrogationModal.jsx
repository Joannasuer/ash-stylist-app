import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext'; // Using the real auth
import { X, ArrowRight, ShieldCheck, Loader2, Sparkles, CheckCircle } from 'lucide-react';

const InterrogationModal = () => {
  const { showInterrogation, setShowInterrogation } = useApp();
  const { session, userProfile, loginWithMagicLink, saveProfile } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Check Inbox, 3: Profile
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '', dob: '', height_cm: '', weight_kg: '', skin_tone: '#eac086'
  });

  useEffect(() => {
    if (showInterrogation) {
      if (session && !userProfile) setStep(3);
      else if (session && userProfile) setShowInterrogation(false);
      else setStep(1);
    }
  }, [showInterrogation, session, userProfile, setShowInterrogation]);

  if (!showInterrogation) return null;

  // STEP 1: LOGIN / SUBSCRIBE
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithMagicLink(email);
      setStep(2); // Show "Check Email"
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // HELPER: Zodiac
  const getZodiac = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if((month==3&&day>=21)||(month==4&&day<=19)) return "Aries";
    if((month==4&&day>=20)||(month==5&&day<=20)) return "Taurus";
    if((month==5&&day>=21)||(month==6&&day<=20)) return "Gemini";
    if((month==6&&day>=21)||(month==7&&day<=22)) return "Cancer";
    if((month==7&&day>=23)||(month==8&&day<=22)) return "Leo";
    if((month==8&&day>=23)||(month==9&&day<=22)) return "Virgo";
    if((month==9&&day>=23)||(month==10&&day<=22)) return "Libra";
    if((month==10&&day>=23)||(month==11&&day<=21)) return "Scorpio";
    if((month==11&&day>=22)||(month==12&&day<=21)) return "Sagittarius";
    if((month==12&&day>=22)||(month==1&&day<=19)) return "Capricorn";
    if((month==1&&day>=20)||(month==2&&day<=18)) return "Aquarius";
    if((month==2&&day>=19)||(month==3&&day<=20)) return "Pisces";
    return "Unknown";
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.dob || !formData.height_cm) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const zodiac = getZodiac(formData.dob);
      await saveProfile({
        ...formData,
        zodiac,
        height_cm: parseInt(formData.height_cm),
        weight_kg: formData.weight_kg ? parseInt(formData.weight_kg) : null
      });
      setShowInterrogation(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-black text-white p-6 text-center relative">
          <button onClick={() => setShowInterrogation(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
          <h2 className="font-serif text-2xl italic flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-red-500"/> VIP Access
          </h2>
        </div>

        <div className="p-8">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <p className="text-center text-gray-600 text-sm mb-4">Enter email to unlock Ash's brain + HUSH drops.</p>
              <input type="email" required placeholder="you@example.com" className="w-full border-b border-gray-300 py-2 outline-none font-serif text-lg"
                value={email} onChange={e => setEmail(e.target.value)} />
              <button disabled={loading} className="w-full bg-black text-white py-4 mt-4 rounded-lg font-bold uppercase text-xs hover:bg-gray-800 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : "Get Magic Link"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
              <h3 className="text-xl font-bold">Check your Inbox</h3>
              <p className="text-gray-600 text-sm mt-2">We sent a login link to <strong>{email}</strong>.</p>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <p className="text-center text-gray-600 text-sm mb-4">Complete your Stylist Profile.</p>
              
              <input type="text" required placeholder="Full Name" className="w-full border-b border-gray-300 py-2 outline-none"
                onChange={e => setFormData({...formData, full_name: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                 <input type="date" required className="w-full border-b border-gray-300 py-2 outline-none"
                  onChange={e => setFormData({...formData, dob: e.target.value})} />
                 <input type="text" required placeholder="Height (cm)" className="w-full border-b border-gray-300 py-2 outline-none"
                  onChange={e => setFormData({...formData, height_cm: e.target.value})} />
              </div>

              <input type="text" placeholder="Weight (kg) - Optional" className="w-full border-b border-gray-300 py-2 outline-none"
                onChange={e => setFormData({...formData, weight_kg: e.target.value})} />

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Skin Tone</label>
                <div className="flex justify-center gap-2">
                  {['#f5d0b0', '#eac086', '#d29b68', '#8d5524', '#3b2219'].map(color => (
                    <div
                      key={color}
                      onClick={() => setFormData({...formData, skin_tone: color})}
                      className={`h-10 w-10 rounded-full cursor-pointer border-2 transition-transform ${formData.skin_tone === color ? 'border-black scale-125 ring-2 ring-black ring-offset-2' : 'border-transparent hover:scale-110'}`}
                      style={{backgroundColor: color}}
                    />
                  ))}
                </div>
              </div>

              <button disabled={loading} className="w-full bg-red-600 text-white py-4 mt-4 rounded-lg font-bold uppercase text-xs hover:bg-red-700 transition-all">
                 {loading ? <Loader2 className="animate-spin mx-auto"/> : "Unlock VIP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterrogationModal;