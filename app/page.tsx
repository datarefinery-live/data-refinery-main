'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Data Refinery - Home Component
 * Designed for High-Performance Data Synthesis Visualization
 * Version: 2.1.0 | 2026 Stable Alpha
 */
export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Handle Search Submission and Navigation
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Featured Nodes Configuration with Analytics Focus
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
      
      {/* Top Global Navigation Bar - Membership Access */}
      <nav className="absolute top-0 w-full flex justify-end p-6 space-x-6 text-[10px] tracking-tight text-gray-400 font-bold uppercase">
        <a href="#" className="hover:text-black transition-colors underline decoration-gray-100 underline-offset-4">
          become a refinery member
        </a>
        <a href="#" className="hover:text-blue-600 transition-colors underline decoration-blue-100 underline-offset-4">
          enter into refinery
        </a>
      </nav>

      {/* Main Content Area: Brand and Synthesis Engine */}
      <main className="flex flex-col items-center w-full max-w-4xl px-6 -mt-16">
        
        {/* Core Brand Identity Section - Technical Typography */}
        <header className="mb-10 text-center select-none">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter inline-block uppercase font-sans">
            data refinery<span className="text-blue-600 animate-pulse">_</span>
          </h1>
          <p className="text-[10px] text-gray-400 mt-2 tracking-[0.3em] uppercase font-semibold">
            Refining Raw Data into Global Intelligence
          </p>
        </header>

        {/* Intelligence Synthesis Input Field - Command Center */}
        <section className="w-full max-w-2xl mb-16">
          <form onSubmit={handleSearch} className="group">
            <div className="w-full py-4 px-6 rounded-2xl border border-gray-100 bg-gray-50/30 flex items-center space-x-4 shadow-sm hover:border-blue-100 focus-within:border-blue-200 focus-within:shadow-md transition-all duration-300">
              {/* Analytics Synthesis Icon */}
              <div className="flex-shrink-0 text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3V21H21"/><path d="M7 16L12 11L16 15L21 9"/>
                </svg>
              </div>
              {/* Command Input Field */}
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Access the global intelligence stream..." 
                className="flex-1 outline-none text-base text-gray-600 bg-transparent placeholder-gray-400 font-medium"
                autoFocus
              />
            </div>
          </form>
        </section>

        {/* Intelligence Nodes Navigation Grid - Node Layout */}
        <section className="w-full max-w-2xl">
          <div className="flex items-center space-x-2 mb-6 opacity-70">
            <span className="h-px w-8 bg-blue-200"></span>
            <h2 className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-extrabold">Featured Nodes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredNodes.map((node) => (
              <button 
                key={node.name}
                onClick={() => router.push(node.path)}
                className="group p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 text-left flex flex-col space-y-4 relative overflow-hidden"
              >
                {/* Visual Icon with Interactive Status */}
                <div className="text-blue-500 bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {node.icon}
                </div>
                
                {/* Node Metadata and Real-time Information */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-gray-800 tracking-tight uppercase font-mono">
                      [{node.name}]
                    </span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">
                      {node.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-tight tracking-wide font-medium">
                    {node.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Global Infrastructure Status Footer - Alpha Metadata */}
      <footer className="absolute bottom-0 w-full flex flex-col md:flex-row justify-between items-center py-6 px-10 text-[10px] text-gray-400 border-t border-gray-50 uppercase tracking-tighter bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* Real-time Online Status Pulse */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            {/* Core System Parameters */}
            <div className="flex items-center space-x-3 font-semibold tracking-widest text-gray-500">
              <span>STATUS: LIVE_TEST_MODE</span>
              <span className="text-gray-200">//</span>
              <span className="text-gray-400">SCOPE: GLOBAL_ALPHA_STREAM</span>
            </div>
          </div>
        </div>

        {/* Corporate Legal and Identity Metadata */}
        <div className="flex space-x-6 mt-4 md:mt-0 font-semibold tracking-normal">
          <span className="text-gray-400 font-normal underline decoration-gray-100 underline-offset-2 uppercase text-[9px]">
            © 2026 EZHUTHOLA EDTECH PVT LTD
          </span>
        </div>
      </footer>

    </div>
  );
}