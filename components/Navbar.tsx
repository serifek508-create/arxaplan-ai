import React, { useState, useEffect } from 'react';
import { Layers, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  onAuthOpen?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-panel-enhanced shadow-lg' : 'glass-panel border-b border-[#e7f1f3]/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-[#0d191b] text-xl font-extrabold tracking-tight">
                ArxaPlan<span className="text-primary">.ai</span>
              </h2>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors cursor-pointer">Necə işləyir?</button>
              <button onClick={() => scrollToSection('tools')} className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors cursor-pointer">Alətlər</button>
              <button onClick={() => scrollToSection('pricing')} className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors cursor-pointer">Qiymətlər</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors cursor-pointer">Rəylər</button>
              <Link to="/batch" className="text-[#0d191b]/80 hover:text-primary text-sm font-semibold transition-colors">Toplu Emal</Link>
            </nav>

            {/* Auth/Action Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 h-11 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{profile?.full_name || user.email?.split('@')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-fade-in-down z-50">
                      <div className="px-3 py-2 border-b border-gray-50 mb-1">
                        <p className="text-sm font-bold text-gray-800 truncate">{profile?.full_name || 'İstifadəçi'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {profile && (
                          <p className="text-xs text-primary font-bold mt-1">{profile.images_processed} şəkil emal edilib</p>
                        )}
                      </div>
                      <button 
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıxış
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onAuthOpen}
                  className="hidden sm:flex h-11 px-6 items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform active:scale-95 btn-ripple"
                >
                  Giriş
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex w-10 h-10 items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fade-in-down z-50">
            <nav className="flex flex-col gap-1">
              <button onClick={() => scrollToSection('how-it-works')} className="w-full text-left px-4 py-3 rounded-xl text-[#0d191b] hover:bg-primary/5 hover:text-primary text-sm font-semibold transition-colors">Necə işləyir?</button>
              <button onClick={() => scrollToSection('tools')} className="w-full text-left px-4 py-3 rounded-xl text-[#0d191b] hover:bg-primary/5 hover:text-primary text-sm font-semibold transition-colors">Alətlər</button>
              <button onClick={() => scrollToSection('pricing')} className="w-full text-left px-4 py-3 rounded-xl text-[#0d191b] hover:bg-primary/5 hover:text-primary text-sm font-semibold transition-colors">Qiymətlər</button>
              <button onClick={() => scrollToSection('testimonials')} className="w-full text-left px-4 py-3 rounded-xl text-[#0d191b] hover:bg-primary/5 hover:text-primary text-sm font-semibold transition-colors">Rəylər</button>
              <Link to="/batch" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[#0d191b] hover:bg-primary/5 hover:text-primary text-sm font-semibold transition-colors">Toplu Emal</Link>
              
              {!user && (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onAuthOpen?.(); }}
                  className="mt-3 w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-glow transition-all btn-ripple"
                >
                  Giriş / Qeydiyyat
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
