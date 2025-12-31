import React from 'react';
import { ShoppingBag, MessageCircle, PenTool, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNavButton = ({ path, icon: Icon, label, activeTab }) => {
    const navigate = useNavigate();
    const isActive = activeTab === path;
    return (
        <button onClick={() => navigate(path)} className={`flex flex-col items-center justify-center gap-1 w-full py-2 ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
            <Icon size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
        </button>
    );
};

const MobileNav = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  if (activeTab === '/chat') return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-safe pt-1 flex justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-16">
      <MobileNavButton path="/" icon={ShoppingBag} label="Shop" activeTab={activeTab} />
      <MobileNavButton path="/chat" icon={MessageCircle} label="Ash AI" activeTab={activeTab} />
      <MobileNavButton path="/sketch" icon={PenTool} label="Sketch" activeTab={activeTab} />
      <MobileNavButton path="/closet" icon={Heart} label="Closet" activeTab={activeTab} />
    </div>
  );
};

export default MobileNav;