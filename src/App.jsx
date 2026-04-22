import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import SketchPage from './pages/SketchPage';
import FitProfileModal from './components/features/FitProfileModal';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import InterrogationModal from './components/features/InterrogationModal';

// Detect if running inside Shopify iframe — if so, hide the React header
const isEmbedded = (() => { try { return window.self !== window.top; } catch { return true; } })();

const AppContent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { showSizeModal, setShowSizeModal } = useApp();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-red-100">
      {!isEmbedded && <Header isScrolled={isScrolled} />}
      {showSizeModal && <FitProfileModal onClose={() => setShowSizeModal(false)} />}
      <InterrogationModal />
      <main className={`flex-grow ${isEmbedded ? 'pt-0' : 'pt-12'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/sketch" element={<SketchPage />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  </AuthProvider>
);

export default App;
