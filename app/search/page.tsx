'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const sampleResults = [
    { 
      title: "Kerala Regional Node", 
      path: "/global/asia/india/kerala", 
      desc: "Data aggregation cluster for Southwest India." 
    },
    { 
      title: "Global Climate Module", 
      path: "/global/weather", 
      desc: "Standardized weather monitoring and analytics." 
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <div className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full inline-block mb-8">
        Search_Query: <span className="text-gray-800 font-bold">"{query}"</span>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-8 uppercase tracking-tighter">
        Refining data from global servers... [Status: Alpha_Stream]
      </p>
      
      <div className="space-y-12">
        {sampleResults.map((result, index) => (
          <div key={index} className="group border-l border-gray-100 pl-6 hover:border-blue-600 transition-colors">
            <Link href={result.path}>
              <h2 className="text-lg font-bold text-blue-600 hover:text-blue-800 cursor-pointer uppercase tracking-tight">
                {result.title}
              </h2>
            </Link>
            <p className="text-[9px] text-gray-400 mt-1 mb-3 uppercase tracking-widest font-bold">
              Access_Path: <span className="text-gray-300">{result.path}</span>
            </p>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              {result.desc}
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={result.path} className="text-[10px] font-bold text-blue-500 uppercase">
                Open_Node →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-8 border border-dashed border-gray-100 rounded-lg text-center bg-gray-50/30">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          End of refined output. No more high-fidelity nodes detected.
        </p>
      </div>
    </main>
  );
}

export default function SearchResults() {
  return (
    <div className="min-h-screen bg-white font-mono p-8 text-gray-800">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12 border-b border-gray-50 pb-6">
        <Link href="/" className="text-xl font-bold tracking-tighter uppercase group">
          data refinery<span className="text-blue-600 group-hover:animate-pulse">_</span>
        </Link>
      </header>

      <Suspense fallback={<div className="text-center font-mono text-[10px] uppercase tracking-widest">Refining Search Data...</div>}>
        <SearchContent />
      </Suspense>

      <footer className="max-w-4xl mx-auto mt-20 pt-6 border-t border-gray-50 text-[9px] text-gray-300 uppercase tracking-[0.2em]">
        Data Refinery Search Engine // Build 2K36.01
      </footer>
    </div>
  );
}