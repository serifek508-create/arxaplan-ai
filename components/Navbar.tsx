import React from 'react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#e7f1f3]/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-[#0d191b] text-xl font-extrabold tracking-tight">
              ArxaPlan<span className="text-primary">.ai</span>
            </h2>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors">Xüsusiyyətlər</a>
            <a href="#" className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors">Qiymətlər</a>
            <Link to="/mobile" className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors">Mobil App</Link>
          </nav>

          {/* Auth/Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex h-11 px-6 items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-glow hover:shadow-lg transition-all duration-300 transform active:scale-95">
              Giriş
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
