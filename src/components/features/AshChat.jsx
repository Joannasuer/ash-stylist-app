import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../ui/AppLogo';
import { askAshAI } from '../../utils/api';

const AshChat = ({ 
  onBack, 
  handleScroll, 
  setSuggestedLook, 
  userProfile, 
  requestProfile, 
  hasSkippedProfile, 
  completeProfile, 
  suggestedLook: activeLook 
}) => {
  const [messages, setMessages] = useState([{ sender: 'ash', text: "Darling, I'm Ash. I'm here to make you look dangerous and expensive. What's the occasion?" }]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (completeProfile && userProfile) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          sender: 'ash',
          text: `WOW ${userProfile.name}, I like you already! A ${userProfile.zodiac}? We are going to cause some trouble. Let's get to work.`
        }]);
      }, 800);
    }
  }, [completeProfile, userProfile]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const formattedText = inputMessage.charAt(0).toUpperCase() + inputMessage.slice(1);
    const userMsg = { sender: 'user', text: formattedText };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    if (!userProfile && !hasSkippedProfile) {
      setIsTyping(true);
      setTimeout(() => {
         setIsTyping(false);
         setMessages(prev => [...prev, { sender: 'ash', text: "Unlock your VIP profile below.", isAction: true }]);
      }, 600);
      return; 
    }

    setIsTyping(true);
    try {
      const aiData = await askAshAI(userMsg.text, userProfile);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ash', text: String(aiData.text) }]);
      if (aiData.suggestedLook) setSuggestedLook(aiData.suggestedLook);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ash', text: "Honey, the fashion signal is weak. Try asking again?" }]);
    }
  };

  return (
    // 🔴 FIX: Changed 'm-4' to 'mt-24 mx-4 mb-4' to push content DOWN below the header.
    // 🔴 FIX: Changed height to 'h-[calc(100vh-8rem)]' so the bottom doesn't get cut off.
    <div className="flex flex-col bg-white w-[calc(100%-2rem)] h-[calc(100vh-8rem)] mt-24 mx-4 mb-4 rounded-3xl overflow-hidden z-20 shadow-2xl border border-gray-200 mx-auto relative">
      
      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 w-full shadow-sm z-30">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/')} className="lg:hidden p-1 -ml-2 text-black hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
           
           <div className="flex-shrink-0">
              <AppLogo className="w-10 h-10" />
           </div>
           
           <div>
              <h2 className="font-serif text-xl italic leading-none mb-0.5 text-black">
                ᴀꜱʜ <span className="not-italic text-red-600">X</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">AI Stylist</p>
           </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans bg-white w-full" onScroll={handleScroll}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.isAction ? (
              <div className="max-w-[85%] p-6 bg-white border border-gray-200 shadow-lg rounded-xl text-center">
                 <p className="text-sm mb-4 font-serif italic">{msg.text}</p>
                 <button onClick={requestProfile} className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors mb-2">Unlock VIP Profile</button>
                 <p className="text-[9px] text-gray-400 flex justify-center gap-1"><ShieldCheck size={10}/> Secure. No FBI involved.</p>
              </div>
            ) : (
              <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-black text-white rounded-2xl rounded-br-none' : 'bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-100'}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><div className="bg-gray-50 text-gray-400 rounded-2xl rounded-bl-none p-3 text-xs flex items-center gap-1 border border-gray-100"><span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span></div></div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 w-full z-30">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={inputMessage} 
            onChange={(e) => setInputMessage(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Ask me anything..." 
            className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-0 focus:outline-none font-sans capitalize placeholder:text-gray-400" 
          />
          <button onClick={handleSendMessage} className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors shadow-lg"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AshChat;