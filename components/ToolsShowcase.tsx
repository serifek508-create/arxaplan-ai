import React, { useEffect, useRef, useState } from 'react';
import { Wand2, Sparkles, Zap, Layers, SlidersHorizontal, ShoppingBag, FileDown, ImageIcon } from 'lucide-react';

const tools = [
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: 'AI Arxa Plan Silmə',
    desc: 'Süni intellekt ilə saniyələr ərzində arxa planı avtomatik silin.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Fon Yaratma',
    desc: 'DALL·E 3 ilə istənilən arxa plan mənzərəsi yaradın.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'HD Keyfiyyət',
    desc: 'Şəkillərinizi 4K-a qədər yüksək çözünürlüyə artırın.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: 'Toplu Emal',
    desc: '20-yə qədər şəkili eyni anda emal edin və yükləyin.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Kölgə & Effektlər',
    desc: 'Peşəkar kölgə, bulanıqlıq və effektlər əlavə edin.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: <SlidersHorizontal className="w-6 h-6" />,
    title: 'Filtr & Düzəliş',
    desc: 'Parlaqlıq, kontrast və doyğunluq ayarları ilə mükəmməlləşdirin.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: 'E-ticarət Presetləri',
    desc: 'Instagram, məhsul fotosu və digər hazır şablonlar.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: <FileDown className="w-6 h-6" />,
    title: 'Çoxlu Format Export',
    desc: 'PNG, WebP, JPG formatlarında keyfiyyət nəzarəti ilə ixrac edin.',
    color: 'from-gray-600 to-slate-700',
  },
];

const ToolsShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="tools" ref={sectionRef} className="w-full py-24 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Güclü alətlər</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0d191b] leading-tight mb-4">
            Bütün <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-primary">AI Alətlər</span> bir yerdə
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Peşəkar görsel emal üçün lazım olan hər şey
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${tool.color} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 blur-2xl`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {tool.icon}
                </div>
                <h3 className="text-base font-bold text-[#0d191b] mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
