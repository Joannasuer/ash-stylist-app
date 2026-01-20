import React from 'react';
// 1. REMOVED the broken import that was crashing your app
import AshChat from '../components/features/AshChat';
import StyleCanvas from '../components/features/StyleCanvas';
import { useApp } from '../context/AppContext';
import { PRODUCT_DATABASE } from '../utils/constants';

const ChatPage = () => {
  // 2. FIXED: Removed 'useOutletContext' failure. 
  // We use a simple placeholder so the app doesn't crash.
  const handleScroll = () => {}; 

  const { 
    setSuggestedLook, 
    userProfile, 
    setShowInterrogation, 
    hasSkippedProfile, 
    completeProfileTrigger, 
    suggestedLook,
    toggleCloset,
    closet,
    setSelectedProduct,
    setTryOnProduct
  } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full w-full">
        <div className={`h-full border-r border-gray-200 min-h-0 transition-all duration-500 ease-in-out ${suggestedLook ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <AshChat 
            handleScroll={handleScroll} 
            setSuggestedLook={setSuggestedLook} 
            userProfile={userProfile}
            requestProfile={() => setShowInterrogation(true)} // This triggers the modal
            hasSkippedProfile={hasSkippedProfile}
            completeProfile={completeProfileTrigger}
            suggestedLook={suggestedLook}
            onBack={() => {}} 
            />
        </div>
        
        {suggestedLook && (
        <div className="hidden lg:flex lg:col-span-2 h-full bg-gray-50 min-h-0 animate-in slide-in-from-right duration-500">
            <StyleCanvas 
                suggestedLook={suggestedLook} 
                products={PRODUCT_DATABASE} 
                toggleCloset={toggleCloset} 
                closet={closet} 
                openDetails={setSelectedProduct} 
                openTryOn={setTryOnProduct} 
                onClose={() => setSuggestedLook(null)} 
            />
        </div>
        )}
    </div>
  );
};

export default ChatPage;