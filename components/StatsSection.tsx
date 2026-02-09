import React, { useEffect, useRef, useState } from 'react';
import { getStats } from '../lib/database';
import { ImageIcon, Users, Sparkles, Globe } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const AnimatedCounter: React.FC<{ end: number; suffix: string; duration?: number; isVisible: boolean }> = ({ 
  end, suffix, duration = 2000, isVisible 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<StatItem[]>([
    { icon: <ImageIcon className="w-6 h-6" />, value: 12847, suffix: '+', label: 'Şəkil emal edilib', color: 'from-blue-500 to-cyan-500' },
    { icon: <Users className="w-6 h-6" />, value: 2523, suffix: '+', label: 'Aktiv istifadəçi', color: 'from-violet-500 to-purple-500' },
    { icon: <Sparkles className="w-6 h-6" />, value: 3891, suffix: '+', label: 'HD şəkil yaradılıb', color: 'from-emerald-500 to-green-500' },
    { icon: <Globe className="w-6 h-6" />, value: 45, suffix: '+', label: 'Ölkədən istifadəçi', color: 'from-orange-500 to-red-500' },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch real stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await getStats();
      if (data) {
        setStats(prev => [
          { ...prev[0], value: data.total_images_processed || 12847 },
          { ...prev[1], value: data.total_users || 2523 },
          { ...prev[2], value: data.total_hd_processed || 3891 },
          { ...prev[3] },
        ]);
      }
    };
    fetchStats();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d191b] to-[#1a3a40]"></div>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2313c8ec\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
