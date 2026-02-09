import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Əli Həsənov',
    role: 'Fotoqraf',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    text: 'ArxaPlan.ai işimi inanılmaz dərəcədə asanlaşdırdı. Əvvəllər saatlarla Photoshop-da etdiyim işi indi saniyələr ərzində edirəm.',
    rating: 5,
  },
  {
    name: 'Aynur Məmmədova',
    role: 'E-ticarət sahibi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    text: 'Onlayn mağazam üçün məhsul şəkillərini hazırlamaq heç vaxt bu qədər asan olmamışdı. HD keyfiyyət möhtəşəmdir!',
    rating: 5,
  },
  {
    name: 'Rəşad Quliyev',
    role: 'Dizayner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
    text: 'Müştərilərimə daha sürətli xidmət göstərə bilirəm. Kənar xətlərin keyfiyyəti peşəkar səviyyədədir.',
    rating: 5,
  },
  {
    name: 'Ləman Kazımova',
    role: 'Bloger',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    text: 'Instagram postlarım üçün əla! Fon rəngi seçimi ilə kreativ dizaynlar yaradıram. Çox təşəkkür edirəm!',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="w-full py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">İstifadəçi rəyləri</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0d191b] leading-tight mb-4">
            Müştərilərimiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4c8d9a]">nə deyir?</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Minlərlə istifadəçi ArxaPlan.ai ilə işlərini asanlaşdırır
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm font-medium">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="font-bold text-[#0d191b] text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
