import React, { useState } from 'react';
import { Layers, Loader2, Sparkles, Lock, PenTool, Scissors, X } from 'lucide-react';

// 🔴 NO EXTERNAL IMPORTS. This file is self-contained.

const DesignerStudio = ({ requestLogin, isLoggedIn }) => {
  const [sketchPrompt, setSketchPrompt] = useState('');
  const [isSketching, setIsSketching] = useState(false);
  const [generatedSketch, setGeneratedSketch] = useState(null);
  const [designOptions, setDesignOptions] = useState({ fabric: 'Silk', silhouette: 'Fitted', vibe: 'Elegant' });
  const [showMeasurements, setShowMeasurements] = useState(false);

  // 1. SAFE LIST OF "FAKE" RESULTS
  // Since the free AI server is down (Robot Image), we use these high-quality placeholders
  // so you can see how the app looks when it works perfectly.
  const simulationSketches = [
    "https://images.unsplash.com/photo-1576246342838-8e68449c4701?w=800&q=80", // Sketch 1
    "https://i.pinimg.com/736x/87/42/1d/87421d01f80f12d2a44d18392109866c.jpg",    // Sketch 2
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5201c184439937.5d5c414995f55.jpg" // Sketch 3
  ];

  const handleGenerateSketch = () => {
    if (!sketchPrompt) return;

    // Start Loading Animation
    setIsSketching(true);
    setGeneratedSketch(null);

    // 2. SIMULATION LOGIC
    // We wait 2.5 seconds to "pretend" the AI is thinking, then show a result.
    setTimeout(() => {
        // Pick a random sketch from the safe list
        const randomSketch = simulationSketches[Math.floor(Math.random() * simulationSketches.length)];
        
        setGeneratedSketch(randomSketch); 
        setIsSketching(false); // Stop loading
    }, 2500);
  };

  return (
    <div className="w-full animate-fade-in pb-20 lg:pb-0 px-4 pt-32">
       
       <div className="text-center mb-8 lg:mb-12">
         <h1 className="text-3xl lg:text-5xl font-serif italic mb-4">Designer Studio</h1>
         <p className="text-gray-500 text-sm max-w-lg mx-auto font-sans">
            Turn words into couture sketches.
         </p>
         {/* STATUS BADGE */}
         <div className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">
            ● Simulation Mode Active (No Errors)
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
         <div className="space-y-6 w-full">
            {/* CONTROLS */}
            <div className="bg-gray-50 p-6 border border-gray-100 w-full">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Layers size={14}/> Design Specs</label>
                <span className="text-[10px] bg-black text-white px-2 py-1 rounded font-bold uppercase">Pro Feature ✨</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Fabric</span>
                  <select className="w-full bg-white border border-gray-200 p-3 text-sm outline-none focus:border-black font-sans" value={designOptions.fabric} onChange={(e) => setDesignOptions({...designOptions, fabric: e.target.value})}>
                    <option>Silk Charmeuse</option><option>Heavy Velvet</option><option>Italian Leather</option><option>French Lace</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Silhouette</span>
                  <select className="w-full bg-white border border-gray-200 p-3 text-sm outline-none focus:border-black font-sans" value={designOptions.silhouette} onChange={(e) => setDesignOptions({...designOptions, silhouette: e.target.value})}>
                    <option>Fitted / Bodycon</option><option>A-Line Flowy</option><option>Structured Oversized</option><option>Mermaid Tail</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* TEXT INPUT */}
            <div className="w-full">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Your Vision</label>
              <textarea 
                value={sketchPrompt} 
                onChange={(e) => setSketchPrompt(e.target.value)} 
                placeholder={`e.g., A ${designOptions.silhouette} gown in ${designOptions.fabric} with a deep V-neck...`} 
                className="w-full h-32 p-6 bg-gray-50 border border-gray-200 focus:border-black outline-none resize-none font-serif text-lg"
              ></textarea>
            </div>
            
            {/* GENERATE BUTTON */}
            <button 
                onClick={handleGenerateSketch} 
                disabled={isSketching || !sketchPrompt} 
                className={`w-full py-4 text-white font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSketching ? 'bg-gray-800' : 'bg-black hover:bg-red-600'}`}
            >
              {isSketching ? (
                  <><Loader2 size={16} className="animate-spin"/> Designing...</>
              ) : (
                  <><Sparkles size={16}/> Generate Sketch</>
              )}
            </button>
            {!isLoggedIn && <p className="text-[10px] text-center text-red-500 mt-2 flex items-center justify-center gap-1"><Lock size={10}/> Login required to save designs</p>}
         </div>

         <div className="space-y-6 w-full">
            {/* CANVAS AREA - Fixed height so it doesn't collapse */}
            <div className="bg-gray-50 aspect-[3/4] border border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-inner w-full rounded-lg min-h-[400px]">
              
              {!generatedSketch && !isSketching && (
                  <div className="text-center text-gray-300">
                      <PenTool size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-serif italic">Canvas Empty</p>
                  </div>
              )}
              
              {isSketching && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 flex-col">
                      <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
                      <p className="font-serif italic text-gray-600 animate-pulse">Sketching on paper...</p>
                  </div>
              )}
              
              {generatedSketch && !isSketching && (
                  <div className="w-full h-full relative animate-fade-in group">
                      <img src={generatedSketch} alt="Generated Sketch" className="w-full h-full object-cover grayscale contrast-125" />
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-200 shadow-sm">
                        {designOptions.fabric} • {designOptions.silhouette}
                      </div>
                  </div>
              )}
            </div>
            {generatedSketch && <button onClick={() => setShowMeasurements(true)} className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-xl"><Scissors size={16} /> Send to Tailor</button>}
         </div>
       </div>

       {showMeasurements && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-white p-8 w-full max-w-md relative animate-fade-in shadow-2xl">
             <button onClick={() => setShowMeasurements(false)} className="absolute top-4 right-4 hover:text-red-500"><X size={20}/></button>
             <h2 className="font-serif text-2xl italic mb-4">Tailor Specs</h2>
             <p className="text-sm text-gray-500 mb-4">Ash will send this design to our atelier.</p>
             <div className="space-y-4 mb-6"><input placeholder="Height (cm)" className="w-full border-b p-2 outline-none" /><input placeholder="Weight (kg)" className="w-full border-b p-2 outline-none" /></div>
             <button onClick={() => {setShowMeasurements(false); alert("Sent to Tailor!");}} className="w-full bg-black text-white py-3 uppercase font-bold text-xs hover:bg-gray-800">Confirm & Send</button>
           </div>
         </div>
       )}
    </div>
  );
};

export default DesignerStudio;