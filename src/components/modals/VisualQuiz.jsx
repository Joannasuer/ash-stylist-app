import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { QUIZ_IMAGES } from '../../utils/constants';

const VisualQuiz = ({ closeQuiz, onComplete }) => {
  const [index, setIndex] = useState(0);
  const handleVote = (vote) => { if (index < QUIZ_IMAGES.length - 1) { setIndex(prev => prev + 1); } else { onComplete(); } };
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
       <div className="w-full max-w-sm bg-white overflow-hidden relative shadow-2xl rounded-xl animate-fade-in-up">
          <button onClick={closeQuiz} className="absolute top-4 right-4 z-20 text-white mix-blend-difference"><X/></button>
          <div className="absolute top-0 left-0 h-1 bg-red-600 z-30 transition-all duration-300" style={{ width: `${((index + 1) / QUIZ_IMAGES.length) * 100}%` }}></div>
          <div className="relative h-[450px]">
             <img src={QUIZ_IMAGES[index].src} className="w-full h-full object-cover" alt="Style" />
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-8 text-white"><h3 className="font-serif text-3xl italic mb-1">{QUIZ_IMAGES[index].style}</h3><p className="text-xs uppercase tracking-widest opacity-80">Does this spark joy?</p></div>
          </div>
          <div className="flex border-t border-gray-100">
             <button onClick={() => handleVote('hate')} className="flex-1 py-6 hover:bg-gray-50 text-gray-400 hover:text-red-600 font-bold uppercase tracking-widest border-r border-gray-100 transition-colors flex flex-col items-center gap-1"><X size={24} /> No Thanks</button>
             <button onClick={() => handleVote('love')} className="flex-1 py-6 hover:bg-red-50 text-red-600 font-bold uppercase tracking-widest transition-colors flex flex-col items-center gap-1"><Heart size={24} fill="currentColor" /> Love It</button>
          </div>
       </div>
    </div>
  );
};

export default VisualQuiz;