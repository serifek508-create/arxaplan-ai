import React, { useEffect, useRef, useState } from 'react';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Pulsuz',
    price: '0',
    period: '',
    description: 'Fərdi istifadə üçün',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-gray-600',
    bgGradient: '',
    borderColor: 'border-gray-200',
    buttonClass: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    popular: false,
    features: [
      'Gündə 3 şəkil',
      'Standart keyfiyyət',
      'JPG, PNG dəstəyi',
      'Əsas fon rəngləri',
    ],
    notIncluded: [
      'HD keyfiyyət',
      'Toplu emal',
      'API giriş',
    ]
  },
  {
    name: 'Pro',
    price: '9.99',
    period: '/ay',
    description: 'Peşəkarlar üçün',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-primary',
    bgGradient: 'bg-gradient-to-br from-primary/5 to-cyan-500/5',
    borderColor: 'border-primary/30',
    buttonClass: 'bg-gradient-to-r from-primary to-cyan-500 hover:from-primary-dark hover:to-cyan-600 text-white shadow-lg shadow-primary/25',
    popular: true,
    features: [
      'Limitsiz şəkil',
      'HD keyfiyyət (4K)',
      'Bütün formatlar',
      'Fon rəngi seçimi',
      'Kölgə & effektlər',
      'Prioritet dəstək',
    ],
    notIncluded: []
  },
  {
    name: 'Müəssisə',
    price: 'Xüsusi',
    period: '',
    description: 'Böyük komandalar üçün',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-violet-600',
    bgGradient: 'bg-gradient-to-br from-violet-500/5 to-purple-500/5',
    borderColor: 'border-violet-200',
    buttonClass: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200',
    popular: false,
    features: [
      'Limitsiz şəkil',
      'HD keyfiyyət (4K+)',
      'API giriş',
      'Toplu emal (100+)',
      'Xüsusi inteqrasiya',
      'Ayrılmış dəstək',
      'SLA zəmanəti',
    ],
    notIncluded: []
  },
];

const Pricing: React.FC = () => {
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
    <section id="pricing" ref={sectionRef} className="w-full py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Qiymətlər</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0d191b] leading-tight mb-4">
            Sizə uyğun <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4c8d9a]">Plan</span> seçin
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            İstənilən vaxt planınızı yüksəldə və ya ləğv edə bilərsiniz
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/25">
                    ⭐ Ən Populyar
                  </span>
                </div>
              )}
              
              <div className={`pricing-card relative rounded-2xl p-8 border-2 ${plan.borderColor} ${plan.bgGradient || 'bg-white'} ${plan.popular ? 'ring-2 ring-primary/20 shadow-xl scale-105' : 'shadow-sm hover:shadow-lg'}`}>
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0d191b]">{plan.name}</h3>
                    <p className="text-xs text-gray-400">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== 'Xüsusi' && <span className="text-sm text-gray-400 font-medium">$</span>}
                    <span className="text-4xl font-black text-[#0d191b]">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 font-medium text-sm">{plan.period}</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-600 font-medium">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={`no-${i}`} className="flex items-center gap-3 text-sm opacity-40">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                        <span className="text-[10px] text-gray-400">✕</span>
                      </div>
                      <span className="text-gray-400 font-medium line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full h-12 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 btn-ripple hover:scale-[1.02] active:scale-[0.98] ${plan.buttonClass}`}>
                  {plan.price === 'Xüsusi' ? 'Əlaqə saxlayın' : 'Başlayın'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
