import React, { useState } from 'react';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FitProfileModal = ({ onClose }) => {
  const { signup } = useApp();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    zodiac: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Create User in App (Local State)
      await signup(formData.email, formData.password, { 
        name: formData.name, 
        zodiac: formData.zodiac, 
        height: formData.height, 
        weight: formData.weight 
      });

      // 2. Send Emails via FormSubmit (No Keys Needed)
      // Replace 'YOUR_EMAIL_HERE' with the email where YOU want to receive notifications.
      const ADMIN_EMAIL = "YOUR_EMAIL_HERE"; // <--- PUT YOUR REAL EMAIL HERE

      if (ADMIN_EMAIL.includes("@")) {
          await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                // DATA TO SEND
                name: formData.name,
                email: formData.email, // The User's Email (for the auto-reply)
                zodiac: formData.zodiac,
                message: `New VIP Signup: ${formData.name} (${formData.zodiac})`,
                
                // SETTINGS
                _subject: "New HUSH VIP Member",
                _autoresponse: `Welcome to HUSH, ${formData.name}. Your VIP profile has been activated. Prepare for a new era of style.`, // <--- The email THE USER gets
                _template: "table",
                _captcha: "false"
            })
          });
          console.log("FormSubmit request sent.");
      } else {
          console.warn("Please put your email in the ADMIN_EMAIL variable to receive alerts.");
      }

      setIsLoading(false);
      onClose();
      alert(`Welcome to HUSH, ${formData.name}. Check your email!`);

    } catch (error) {
      setIsLoading(false);
      alert("Signup Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl relative p-8 border border-gray-100">
        
        <button onClick={onClose} className="absolute top-0 right-0 bg-black text-white p-3 hover:bg-red-600 transition-colors z-50">
            <X size={24} />
        </button>

        <h2 className="text-2xl font-black tracking-tighter text-center mb-2">ᴀꜱʜ <span className="text-red-600">✗</span></h2>
        <p className="text-[10px] text-center uppercase tracking-widest text-gray-400 mb-8 font-bold">VIP Access • Step {step}/2</p>

        {step === 1 && (
          <div className="space-y-4">
            <input name="name" type="text" placeholder="Your Name" className="w-full border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black transition-colors" onChange={handleChange} />
            <div className="flex gap-4">
                 <input name="height" type="number" placeholder="Height (cm)" className="w-1/2 border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black" onChange={handleChange} />
                 <input name="weight" type="number" placeholder="Weight (kg)" className="w-1/2 border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black" onChange={handleChange} />
            </div>
            <select name="zodiac" className="w-full border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black bg-white" onChange={handleChange}>
               <option value="">Select Your Sign</option>
               {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <button onClick={() => setStep(2)} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 mt-4">Next Step</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input name="email" type="email" placeholder="Email" className="w-full border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" className="w-full border-b-2 border-gray-100 p-4 text-sm outline-none focus:border-black" onChange={handleChange} />
            
            <button onClick={handleFinalSubmit} disabled={isLoading} className="w-full bg-red-600 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black mt-4 shadow-xl flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Confirm & Join"}
            </button>
            <div className="flex items-center justify-center gap-1 mt-4">
                <ShieldCheck size={12} className="text-green-600"/>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Secure Signup</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitProfileModal;