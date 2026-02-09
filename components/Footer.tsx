import React, { useState } from 'react';
import { Layers, Mail, MapPin, Phone, Send, Heart, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitFeedback } from '../lib/database';
import { useToast } from '../lib/useToast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setSubscribing(true);
    const { error } = await submitFeedback(email, 'Newsletter abunəliyi', '', 5);
    if (!error) {
      addToast('Xəbər bülletenimizə uğurla abunə oldunuz!', 'success');
      setEmail('');
    } else {
      addToast('Xəta baş verdi, yenidən cəhd edin', 'error');
    }
    setSubscribing(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="w-full bg-[#0d191b] text-white relative overflow-hidden">
      {/* Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold">
                ArxaPlan<span className="text-primary">.ai</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Süni intellekt ilə şəkillərdən arxa planı saniyələr ərzində silin. Pulsuz, sürətli və HD keyfiyyətdə.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Sürətli keçidlər</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-primary text-sm transition-colors">Necə işləyir?</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-primary text-sm transition-colors">Qiymətlər</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-primary text-sm transition-colors">Rəylər</button></li>
              <li><Link to="/editor" className="text-gray-400 hover:text-primary text-sm transition-colors">Redaktor</Link></li>
              <li><Link to="/mobile" className="text-gray-400 hover:text-primary text-sm transition-colors">Mobil tətbiq</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Əlaqə</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary/60" />
                info@arxaplan.ai
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-primary/60" />
                +994 50 123 45 67
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary/60 mt-0.5" />
                Bakı, Azərbaycan
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Xəbər bülleteni</h4>
            <p className="text-gray-400 text-sm mb-4">Yeniliklərdən xəbərdar olmaq üçün abunə olun.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-poçt ünvanı"
                required
                className="flex-1 h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="h-10 w-10 rounded-lg bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition-all shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 ArxaPlan.ai. Bütün hüquqlar qorunur.
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <span>Sevgi ilə hazırlanıb</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
            <span>Bakı, Azərbaycan</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => addToast('Məxfilik siyasəti səhifəsi hazırlanır', 'info')} className="text-gray-500 hover:text-primary text-xs transition-colors">Məxfilik siyasəti</button>
            <button onClick={() => addToast('İstifadə şərtləri səhifəsi hazırlanır', 'info')} className="text-gray-500 hover:text-primary text-xs transition-colors">İstifadə şərtləri</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
