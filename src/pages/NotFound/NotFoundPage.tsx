import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020203] text-[#F3F3F4] flex items-center justify-center p-4 font-mono">
      <div className="border border-[#02F74C] bg-[#0A0D0C] p-8 sm:p-12 max-w-lg w-full text-center shadow-[0_0_35px_rgba(2,247,76,0.15)]">
        <span className="px-3 py-1 bg-[#02F74C]/10 border border-[#02F74C]/40 text-[#02F74C] text-xs font-bold uppercase tracking-wider mb-4 inline-block">
          STATUS 404 // ROUTE_NOT_FOUND
        </span>
        <h1 className="font-code-header text-5xl sm:text-6xl font-black text-[#F3F3F4] tracking-tight my-4">
          PAGE_NOT_FOUND
        </h1>
        <p className="text-xs text-[#A6A9AA] mb-8 leading-relaxed">
          &gt; The requested endpoint or dossier does not exist in this system environment.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs uppercase font-bold tracking-wider shadow-[0_0_15px_rgba(2,247,76,0.3)] hover:shadow-[0_0_25px_rgba(2,247,76,0.6)] hover:scale-105 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>[ RETURN TO HOME ]</span>
        </Link>
      </div>
    </div>
  );
};
