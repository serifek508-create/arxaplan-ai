import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d191b] via-[#1a3a40] to-[#0d191b]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">Pulsuz başlayın</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Şəkillərinizi{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            dəyişdirməyə
          </span>{' '}
          hazırsınız?
        </h2>

        <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-10">
          AI gücü ilə saniyələr ərzində peşəkar nəticələr əldə edin. Heç bir dizayn təcrübəsi tələb olunmur.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/editor')}
            className="h-14 px-10 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:from-primary-dark hover:to-cyan-600 text-white text-base font-bold shadow-2xl shadow-primary/30 transition-all duration-300 flex items-center gap-3 hover:scale-105 active:scale-95 btn-ripple"
          >
            Pulsuz Başlayın
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/batch')}
            className="h-14 px-10 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-bold border border-white/20 transition-all duration-300 flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            Toplu Emal
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Kredit kartı tələb olunmur · Gündə 3 pulsuz şəkil
        </p>
      </div>
    </section>
  );
};

export default CTA;
