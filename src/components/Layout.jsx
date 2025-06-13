import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0f1c] text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#082032]">
        <div className="text-xl font-bold">Dashboard</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl">
          {isMobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} 
        md:flex flex-col w-full md:w-60 bg-[#082032] p-6 space-y-8 
        md:sticky md:top-0 md:h-screen
        absolute top-16 z-50
      `}>
        <div className="text-xl font-bold">Dashboard</div>
        <nav className="space-y-4">
          <Link 
            to="/"
            className={`block py-2 px-3 rounded-lg cursor-pointer transition-all
              ${location.pathname === '/' ? 'bg-white/10 border border-white/30' : 'hover:bg-white/10 hover:border hover:border-white/30'}`}
          >
            Analytics
          </Link>
          <Link 
            to="/reports"
            className={`block py-2 px-3 rounded-lg cursor-pointer transition-all
              ${location.pathname === '/reports' ? 'bg-white/10 border border-white/30' : 'hover:bg-white/10 hover:border hover:border-white/30'}`}
          >
            Reports
          </Link>
          <Link 
            to="/settings"
            className={`block py-2 px-3 rounded-lg cursor-pointer transition-all
              ${location.pathname === '/settings' ? 'bg-white/10 border border-white/30' : 'hover:bg-white/10 hover:border hover:border-white/30'}`}
          >
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
