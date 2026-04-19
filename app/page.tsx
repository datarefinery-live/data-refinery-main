import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono antialiased text-gray-800">
      
      {/* Top Navigation - Global Access Links */}
      <div className="absolute top-0 w-full flex justify-end p-6 space-x-6 text-xs tracking-tight text-gray-400">
        <a href="#" className="hover:text-black transition-colors underline decoration-gray-200 underline-offset-4">/about</a>
        <a href="#" className="hover:text-black transition-colors underline decoration-gray-200 underline-offset-4">/contact</a>
      </div>

      <main className="flex flex-col items-center w-full max-w-xl px-4 -mt-24">
        
        {/* Logo Section - Clean Typewriter Style */}
        <div className="mb-8 group">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter border-r-4 border-black pr-2 animate-pulse inline-block uppercase">
            data refinery<span className="text-blue-600">_</span>
          </h1>
        </div>

        {/* Global Mission Statement / Console Input */}
        <div className="w-full max-w-lg mb-10">
          <div className="w-full py-3 px-6 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center space-x-3 shadow-sm">
            <span className="text-blue-600 font-bold font-sans">🌐</span>
            <input 
              type="text" 
              placeholder="Refining data for a smarter global future..." 
              className="flex-1 outline-none text-sm text-gray-500 bg-transparent placeholder-gray-400"
              disabled
            />
          </div>
        </div>

        {/* Global Status Tags */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-black text-white text-[10px] uppercase tracking-widest font-bold">
            Status: Under Construction
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] uppercase tracking-widest font-bold">
            Release: April 2026
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 text-[10px] uppercase tracking-widest font-bold">
            Scope: Global
          </span>
        </div>
      </main>

      {/* Terminal Footer - Global Network Signature */}
      <footer className="absolute bottom-0 w-full flex flex-col md:flex-row justify-between py-4 px-10 text-[10px] text-gray-400 border-t border-gray-50">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="tracking-widest uppercase">SYSTEM_STATUS: GLOBAL_ACCESS_ENABLED // CORE_REFINERY</span>
        </div>
        <div className="flex space-x-6 mt-2 md:mt-0 uppercase tracking-tighter">
          <a href="#" className="hover:text-black">Privacy_Policy</a>
          <a href="#" className="hover:text-black">Terms_of_Service</a>
          <span className="hidden md:inline text-gray-200">|</span>
          <span className="font-semibold text-gray-500">© 2026 Ezhuthola edTech Private Limited</span>
        </div>
      </footer>
    </div>
  );
}