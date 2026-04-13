// src/pages/ChatPage.jsx
import { useState, useRef, useEffect, useContext } from 'react';
import { Send, Lock, Sparkles, ShoppingBag, X } from 'lucide-react';
import { askAsh, HUSH_PRODUCTS } from '../services/ashService';
import { AppContext } from '../context/AppContext';

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3 shadow-sm mt-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
        <p className="text-sm font-bold text-red-600 mt-1">${product.price}</p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors text-center"
        >
          Shop
        </a>
        <button
          onClick={() => onAddToCart(product)}
          className="text-[10px] font-bold uppercase tracking-widest border border-black text-black px-3 py-1.5 rounded hover:border-red-600 hover:text-red-600 transition-colors"
        >
          + Bag
        </button>
      </div>
    </div>
  );
}

// ─── Suggested Look Card ─────────────────────────────────────────────────────
function SuggestedLook({ look, onAddToCart }) {
  const products = look.itemIds
    .map((id) => HUSH_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  if (!products.length) return null;

  return (
    <div className="mt-3 border border-red-100 rounded-xl p-4 bg-red-50">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={13} className="text-red-600" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
          {look.title}
        </span>
      </div>
      {look.explanation && (
        <p className="text-xs text-gray-600 mb-3 italic">{look.explanation}</p>
      )}
      <div className="space-y-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onAddToCart }) {
  const isAsh = msg.role === 'assistant';
  return (
    <div className={`flex ${isAsh ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAsh && (
        <div className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          A
        </div>
      )}
      <div className={`max-w-[80%] ${isAsh ? '' : 'items-end flex flex-col'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAsh
              ? 'bg-white border border-gray-100 text-gray-900 shadow-sm'
              : 'bg-black text-white'
          }`}
        >
          {msg.content}
        </div>
        {isAsh && msg.suggestedLook && (
          <SuggestedLook look={msg.suggestedLook} onAddToCart={onAddToCart} />
        )}
        {msg.isError && (
          <p className="text-[10px] text-red-500 mt-1 ml-1">Connection issue — try again</p>
        )}
      </div>
    </div>
  );
}

// ─── VIP Unlock Banner ────────────────────────────────────────────────────────
function VIPBanner({ onUnlock }) {
  return (
    <div className="bg-gradient-to-r from-black to-gray-900 text-white p-4 flex items-center justify-between gap-3 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Lock size={14} className="text-red-500 flex-shrink-0" />
        <p className="text-xs leading-snug">
          <span className="font-bold">Unlock your FIT ID</span> — Ash recommends better when she knows you.
        </p>
      </div>
      <button
        onClick={onUnlock}
        className="text-[10px] font-bold uppercase tracking-widest bg-red-600 px-3 py-2 rounded whitespace-nowrap hover:bg-red-500 transition-colors"
      >
        Unlock VIP
      </button>
    </div>
  );
}

// ─── Quick Prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Style me for a dinner date",
  "What should I wear to a meeting?",
  "Sketch it — a power look for tonight",
  "Best denim for my body type",
  "I need a full athleisure set",
];

// ─── Chat Page ────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user, userProfile, isVIP, addToCart, setShowVIPModal } = useContext(AppContext);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        isVIP && userProfile?.full_name
          ? `Welcome back, ${userProfile.full_name.split(' ')[0]}. I've been thinking about your wardrobe. What are we solving today?`
          : "I'm Ash. I style for HUSH — the brand for people who don't follow trends, they set them. Tell me what you need.",
      id: 'init',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build history array for API (exclude init message)
  const getHistory = () =>
    messages
      .filter((m) => m.id !== 'init')
      .map((m) => ({ role: m.role, content: m.content }));

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Optimistic typing indicator
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '...', id: typingId, isTyping: true },
    ]);

    try {
      const result = await askAsh(trimmed, userProfile, getHistory());
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            role: 'assistant',
            content: result.text,
            suggestedLook: result.suggestedLook,
            id: Date.now(),
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            role: 'assistant',
            content: "Something interrupted me. Try again — I don't give up easily.",
            id: Date.now(),
            isError: true,
          })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pt-16">
      {/* VIP Banner */}
      {!isVIP && <VIPBanner onUnlock={() => setShowVIPModal(true)} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {messages.map((msg) =>
          msg.isTyping ? (
            <div key={msg.id} className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                A
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          ) : (
            <MessageBubble key={msg.id} msg={msg} onAddToCart={addToCart} />
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts — show at start */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-full whitespace-nowrap hover:border-black hover:text-black transition-colors shadow-sm flex-shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Ash anything about your style..."
          rows={1}
          className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors max-h-28"
          style={{ lineHeight: '1.5' }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center disabled:opacity-30 hover:bg-red-600 transition-colors flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
