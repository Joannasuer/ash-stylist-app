import React from 'react';
import { ShoppingBag, Search, User, Ruler } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLogo from '../ui/AppLogo';
import { useApp } from '../../context/AppContext';

const Header = ({ isScrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, userStats, setShowSizeModal, setShowLoginModal, isLoggedIn, userProfile } = useApp();
  
  const activeTab = location.pathname;

  return (
    <header className={`sticky top-0 z-40 bg-white border-b border-gray-100 flex-shrink-0 transition-all duration-300 ${activeTab === '/chat' ? 'hidden lg:block' : 'block'} ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className={`w-full px-4 lg:px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-12 lg:h-14' : 'h-14 lg:h-16'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             {/* Logo Image */}
             <AppLogo className={`transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`} />
             
             {/* 🔴 THIS IS THE FIX FOR THE TEXT */}
             <span className={`font-black tracking-tighter transition-all duration-300 ${isScrolled ? 'text-lg lg:text-xl' : 'text-2xl lg:text-3xl'}`}>
               ᴀꜱʜ ✗
             </span>
          </div>

          <nav className="hidden lg:flex items-center gap-12 text-xs font-bold tracking-widest uppercase">
            <button onClick={() => navigate('/')} className={`hover:text-red-600 transition-colors ${activeTab === '/' ? 'text-red-600' : 'text-gray-500'}`}>Collection</button>
            <button onClick={() => navigate('/chat')} className={`hover:text-red-600 transition-colors flex items-center gap-2 ${activeTab === '/chat' ? 'text-red-600' : 'text-gray-500'}`}>Ash AI <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span></button>
            <button onClick={() => navigate('/sketch')} className={`hover:text-red-600 transition-colors flex items-center gap-2 ${activeTab === '/sketch' ? 'text-red-600' : 'text-gray-500'}`}>Sketch It</button>
          </nav>
          <div className="flex items-center gap-4 lg:gap-6">
             {!userStats.height && <button onClick={() => setShowSizeModal(true)} className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black"><Ruler size={16}/> Fit ID</button>}
             <Search size={20} className="text-gray-400 cursor-pointer hover:text-black hidden lg:block" />
             <button onClick={() => setShowLoginModal(true)} className="relative group"><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">{isLoggedIn ? (userProfile ? userProfile.name.charAt(0) : 'U') : <User size={16}/>}</div></button>
             <div className="relative"><ShoppingBag size={20} className="text-gray-400 cursor-pointer hover:text-black" />{cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}</div>
          </div>
        </div>
      </header>
  );
};
export default Header;