'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Data Refinery - Home Component
 * Optimized for Mobile Responsiveness & Technical Branding
 * Version: 2.1.3 | Fixed: Metadata Title Sync & Mobile View
 */
export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Optimized Search Navigation Logic for Global Streams
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Node Configuration for Kerala Specific Data Analytics
  const featuredNodes = [
    { 
      name: "Kerala_Election_2026", 
      path: "/election", 
      status: "COMING SOON", 
      description: "Live Assembly Election Result Analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      name: "Kerala_Weather", 
      path: "/weather", 
      status: "COMING SOON", 
      description: "Real-time meteorological stream",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono antialiased text-gray-800 overflow-hidden">
      
      {/* HTML Metadata Simulation for Browser Tab Identity */}
      <title>Data Refinery_</title>
      
      {/* Top Global Navigation Bar - Responsive Padding and Scaled Text */}
      <nav className="absolute top-0 w-full flex justify-end p-4 md:p-6 space-x-4 md:space-x-6 text-[9px] md:text-[10px] tracking-tight text-gray-400 font-bold uppercase">
        <a href="#" className="hover:text-black transition-colors underline decoration-gray-100 underline-offset-4">
          become a refinery member
        </a>
        <a href="#" className="hover:text-blue-600 transition-colors underline decoration-blue-100 underline-offset-4">
          enter into refinery
        </a>
      </nav>

      {/* Main Core Synthesis Interface - Optimized Vertical Alignment */}
      <main className="flex flex-col items-center w-full max-w-4xl px-6 -mt-12 md:-mt-16">
        
        {/* Adjusted Logo Scale for Balanced Mobile/Desktop Typography */}
        <header className="mb-8 md:mb-10 text-center select-none">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter inline-block uppercase font-sans leading-tight">
            data refinery<span className="text-blue-600 animate-pulse">_</span>
          </h1>
          <p className="text-[9px] md:text-[10px] text-gray-400 mt-2 tracking-[0.25em] md:tracking-[0.3em] uppercase font-semibold">
            Refining Raw Data into Global Intelligence
          </p>
        </header>

        {/* Search Command Center - High Visibility Input Field */}
        <section className="w-full max-w-2xl mb-12 md:mb-16">
          <form onSubmit={handleSearch} className="group">
            <div className="w-full py-4 px-5 rounded-2xl border border-gray-100 bg-gray-50/30 flex items-center space-x-3 md:space-x-4 shadow-sm hover:border-blue-100 focus-within:border-blue-200 focus-within:shadow-md transition-all duration-300">
              {/* Technical Indicator Icon - Analytics Focus */}
              <div className="flex-shrink-0 text-blue-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3V21H21"/><path d="M7 16L12 11L16 15L21 9"/>
                </svg>
              </div>
              {/* Intelligence Stream Input - Mobile Optimized Text Size */}
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Access the global intelligence stream..." 
                className="flex-1 outline-none text-xs md:text-base text-gray-600 bg-transparent placeholder-gray-400 font-medium"
                autoFocus
              />
            </div>
          </form>
        </section>

        {/* Intelligence Nodes Navigation Grid - Dynamic Tile Layout */}
        <section className="w-full max-w-2xl">
          <div className="flex items-center space-x-2 mb-6 opacity-70">
            <span className="h-px w-6 md:w-8 bg-blue-200"></span>
            <h2 className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.25em] font-extrabold">Featured Nodes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {featuredNodes.map((node) => (
              <button 
                key={node.name}
                onClick={() => router.push(node.path)}
                className="group p-5 md:p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 text-left flex flex-col space-y-3 md:space-y-4 relative overflow-hidden"
              >
                {/* Visual Status Icon with Contextual Background */}
                <div className="text-blue-500 bg-blue-50 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {node.icon}
                </div>
                
                {/* Node Metadata Display - Monospaced Typography */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] md:text-[12px] font-bold text-gray-800 tracking-tight uppercase font-mono">
                      [{node.name}]
                    </span>
                    <span className="text-[7px] md:text-[8px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100 uppercase tracking-tighter">
                      {node.status}
                    </span>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-gray-400 mt-1.5 leading-tight tracking-wide font-medium">
                    {node.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Global Status Footer - Finalized Corporate Branding */}
      <footer className="absolute bottom-0 w-full flex flex-col md:flex-row justify-between items-center py-4 md:py-6 px-6 md:px-10 text-[8px] md:text-[10px] text-gray-400 border-t border-gray-50 uppercase tracking-tighter bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Real-time System Pulse Indicator */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            {/* System Parameters Metadata */}
            <div className="flex flex-wrap items-center gap-x-2 md:gap-x-3 font-semibold tracking-widest text-gray-500 uppercase">
              <span>STATUS: LIVE_TEST_MODE</span>
              <span className="hidden md:inline text-gray-200">//</span>
              <span className="text-gray-400">SCOPE: GLOBAL_ALPHA_STREAM</span>
            </div>
          </div>
        </div>

        {/* Corporate Identity - Full Registered Name Display */}
        <div className="flex space-x-6 mt-3 md:mt-0 font-semibold tracking-normal text-center">
          <span className="text-gray-400 font-normal underline decoration-gray-100 underline-offset-2 uppercase text-[7px] md:text-[9px] tracking-wider">
            © 2026 Ezhuthola edTech Private Limited
          </span>
        </div>
      </footer>

    </div>
  );
}