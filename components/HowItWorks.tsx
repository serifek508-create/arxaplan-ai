import React, { useEffect, useRef, useState } from 'react';
import { Upload, Cpu, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    number: '01',
    title: 'Şəkil Yükləyin',
    description: 'JPG, PNG və ya WEBP formatında istənilən şəkili yükləyin. Sürüşdürüb buraxmaq da olar.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    number: '02',
    title: 'AI Emal Edir',
    description: 'Güclü süni intellekt modeli saniyələr içində arxa planı tanıyır və avtomatik silir.',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    icon: <Download className="w-8 h-8" />,
    number: '03',
    title: 'Nəticəni Yükləyin',
    description: 'Hazır şəkili HD keyfiyyətdə yükləyin. Fon rəngini dəyişmək də mümkündür.',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
];

const HowItWorks: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="w-full py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute top-40 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-60 h-60 bg-violet-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Sadə prosess</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0d191b] leading-tight mb-4">
            Necə <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4c8d9a]">İşləyir?</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Cəmi 3 sadə addımda peşəkar nəticə əldə edin
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200"></div>
          
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`group relative bg-white rounded-2xl p-8 border ${step.borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default`}>
                {/* Step number */}
                <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-black text-gray-300">{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-[#0d191b] mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-24 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center z-10 border border-gray-100">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
