import React, { useState } from 'react';
import { Menu, ShoppingBag, X, Search, User, Ruler } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AppLogo from '../ui/AppLogo';
import FitProfileModal from '../features/FitProfileModal';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, cart, isMobileNavOpen, toggleMobileNav } = useApp();
  const [showFitModal, setShowFitModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white z-40 py-4 border-b border-gray-100 h-16 transition-all">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          
          {/* Logo with Special Text */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
             <AppLogo className="w-8 h-8"/>
             <span className="font-black text-2xl tracking-tighter">ᴀꜱʜ ✗</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            <button onClick={() => navigate('/')} className={`hover:text-red-600 transition-colors ${isActive('/') ? 'text-red-600' : 'text-gray-500'}`}>Collection</button>
            <button onClick={() => navigate('/chat')} className={`flex items-center gap-1 hover:text-red-600 transition-colors ${isActive('/chat') ? 'text-red-600' : 'text-gray-500'}`}>
              Ash AI <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            </button>
            <button onClick={() => navigate('/sketch')} className={`hover:text-red-600 transition-colors ${isActive('/sketch') ? 'text-red-600' : 'text-gray-500'}`}>Sketch It</button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 text-gray-500">
            <button onClick={() => setShowFitModal(true)} className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-widest hover:text-black">
              <Ruler size={16}/> Fit ID
            </button>
            
            <button className="p-1 hover:text-black"><Search size={20} /></button>
            
            <button onClick={() => setShowFitModal(true)} className="p-1 hover:text-black">
               {user ? <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[10px]">{user.name[0]}</div> : <User size={20} />}
            </button>

            <button className="p-1 relative hover:text-black">
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white"></span>}
            </button>
            
             <button onClick={toggleMobileNav} className="md:hidden p-1 hover:text-black">
              {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {showFitModal && <FitProfileModal onClose={() => setShowFitModal(false)} />}
    </>
  );
};

export default Header;