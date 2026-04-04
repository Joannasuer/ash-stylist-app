import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../ui/AppLogo';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { askAshAI, saveMessageToHistory, loadChatHistory } from '../../utils/openai';
import { PRODUCT_DATABASE } from '../../utils/constants';

const AshChat = () => {
  const { setShowInterrogation, setSuggestedLook } = useApp();
  const { session, userProfile } = useAuth();
  const [messages, setMessages] = useState([{ sender: 'ash', text: "Darling, I'm Ash. Let's make you look dangerous. What's the occasion?" }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (session?.user?.id && userProfile) {
      loadChatHistory(session.user.id).then(history => {
        if (history.length > 0) {
          setMessages(history);
        }
      });
    }
  }, [session, userProfile]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');
    setIsTyping(true);

    if (!userProfile) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          sender: 'ash',
          text: "I need to know who I'm styling. Unlock your VIP profile.",
          isAction: true
        }]);
      }, 600);
      return;
    }

    try {
      const response = await askAshAI(userMsg, userProfile, PRODUCT_DATABASE);
      setIsTyping(false);

      setMessages(prev => [...prev, {
        sender: 'ash',
        text: response.text,
        suggestedLook: response.suggestedLook
      }]);

      if (response.suggestedLook) {
        setSuggestedLook(response.suggestedLook);
      }

      if (session?.user?.id) {
        await saveMessageToHistory(session.user.id, userMsg, 'user');
        await saveMessageToHistory(session.user.id, response.text, 'ash', response.suggestedLook);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'ash',
        text: "Something went wrong. Try again, darling."
      }]);
    }
  };

  return (
    <div className="flex flex-col bg-white w-full lg:w-[calc(100%-2rem)] h-[calc(100dvh-5rem)] lg:h-[calc(100vh-6rem)] mt-20 lg:mt-24 mx-0 lg:mx-4 mb-0 rounded-t-3xl lg:rounded-3xl overflow-hidden z-20 shadow-2xl border border-gray-200 relative">
      
      {/* HEADER */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0 w-full shadow-sm z-30">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate('/')} className="lg:hidden p-2 -ml-2 text-black hover:bg-gray-100 rounded-full"><ChevronLeft size={24} /></button>
           <AppLogo className="w-8 h-8" />
           <div><h2 className="font-serif text-lg italic leading-none text-black">ᴀꜱʜ <span className="text-red-600">X</span></h2><p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">AI Stylist</p></div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white w-full scroll-smooth pb-24">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.isAction ? (
              <div className="max-w-[85%] p-5 bg-white border border-gray-200 shadow-lg rounded-xl text-center relative z-40">
                 <p className="text-sm mb-3 font-serif italic">{msg.text}</p>
                 <button
                    onClick={() => setShowInterrogation(true)}
                    className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors mb-2 shadow-md relative z-50 cursor-pointer pointer-events-auto"
                 >
                    Unlock VIP Profile
                 </button>
                 <div className="flex justify-center items-center gap-1 text-[9px] text-gray-400"><ShieldCheck size={10}/> <span>Secure. No Spam.</span></div>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className={`p-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-black text-white rounded-2xl rounded-br-none' : 'bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-100'}`}>
                  {msg.text}
                </div>
                {msg.suggestedLook && msg.sender === 'ash' && (
                  <button
                    onClick={() => setSuggestedLook(msg.suggestedLook)}
                    className="mt-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:underline"
                  >
                    View {msg.suggestedLook.title}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 p-2 animate-pulse">Ash is thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 lg:pb-4 z-40">
        <div className="flex items-center gap-2">
          <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me anything..." className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-black outline-none" />
          <button onClick={handleSendMessage} className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AshChat;