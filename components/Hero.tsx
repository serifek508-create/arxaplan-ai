import React, { useRef } from 'react';
import { UploadCloud, PlayCircle, Star, Sparkles, Wand2, Zap, Monitor, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from './ImageSlider';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      navigate('/editor', { state: { file } });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      navigate('/editor', { state: { file } });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const MODEL_ORIGINAL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAU_TfdzohpwVs5g-9dt60RWgxbDw44tEDOjBJjKiEdU0uzuHt8nA40ndKXr-3JZVH2t15hmAG2WBXbCsjClJSJyhz4xPTxu0w_nhcrEaGbMuFMMMIPCc9payJDSXk9zJQh1rcJY1W9nNxLxfxnmm2rmyd-tcSR4f4DIUPR1sN-cn1-8Ru2UBcg4yCqOfyZz5taOltQ7DC-yuGiu95v_ygXH75IPTmMCtI2QZHKxhsPjjf8XFcryn301WUOHEzKYD_5uCRX_GfEUUY9";
  const MODEL_PROCESSED = "https://lh3.googleusercontent.com/aida-public/AB6AXuBjyuD5WT21xwZz3mLfKihQp2-o1W0CGaFbvgWvBh5rh77e3Vsi8AyX9Rglig4IgnY5NsrVcsaCvr6xQ2bMlP2qjXuncog2RphUgycEKEkIy0ml34UaVRZT66nJggSJjBD5-BfK0eur3IuOeodPdPou1ct1V4ReeOp_bWyz6RFENosB__nwa4j1-F_4nenaDXuSh2oJhM_nuFCJcYXOsbWjs4i6lT9L29ZO3d3PTqJcABLGOlt386lXNRbFAvYelOe9pojxRI7u5m9K";

  return (
    <div className="relative flex-grow flex flex-col items-center justify-center w-full">
      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/jpg, image/webp"
      />

      {/* Abstract background shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4c8d9a]/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col gap-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">AI V2.0 İndi Aktivdir</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0d191b] leading-[1.15] tracking-tight">
              Şəkildən Arxa Planı <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4c8d9a]">Ani Sil</span>
            </h1>
            
            <p className="text-lg text-[#4c8d9a] font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Sürətli, avtomatik ve yüksək keyfiyyətli nəticə. Süni intellekt ilə bir toxunuşla şəkillərinizi peşəkar səviyyədə təmizləyin.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={handleUploadClick}
                className="h-14 min-w-[180px] px-8 rounded-xl bg-primary hover:bg-primary-dark text-white text-base font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 btn-ripple hover:scale-[1.02] active:scale-[0.98]"
              >
                <UploadCloud className="w-6 h-6" />
                Şəkil yüklə
              </button>
              <button 
                onClick={scrollToHowItWorks}
                className="h-14 min-w-[160px] px-8 rounded-xl bg-white hover:bg-gray-50 text-[#0d191b] text-base font-bold shadow-sm border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] hover:border-primary/30"
              >
                <PlayCircle className="w-6 h-6" />
                Necə işləyir?
              </button>
            </div>

            {/* Stats/Social Proof */}
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-6 border-t border-gray-200/50">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    alt="User avatar" 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                    src={`https://picsum.photos/100/100?random=${i}`}
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-semibold text-gray-500">100+ müsbət rəy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Demo & Upload */}
          <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-3xl rotate-12 opacity-20 blur-xl animate-bounce duration-[3000ms]"></div>
            
            {/* Main Glass Card */}
            <div className="glass-panel rounded-xl shadow-glass p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden z-20">
              
              {/* Upload Zone */}
              <div 
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="group border-2 border-dashed border-primary/30 hover:border-primary bg-white/50 hover:bg-white/80 transition-all duration-300 rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-[#0d191b] font-bold text-lg">Şəkli bura sürüşdürün</p>
                  <p className="text-gray-500 text-sm mt-1">və ya fayl seçmək üçün toxunun</p>
                </div>
                <p className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">JPG, PNG, WEBP dəstəklənir</p>
              </div>

              {/* Before/After Slider Component */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-bold text-[#0d191b]">Nümunə</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">Hərəkət etdirin</span>
                </div>
                
                <div className="h-64 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                   <ImageSlider 
                      beforeImage={MODEL_ORIGINAL}
                      afterImage={MODEL_PROCESSED}
                   />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-panel-enhanced py-2.5 px-5 rounded-xl shadow-xl flex items-center gap-3 z-30 animate-float-slow">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-[#0d191b]">1M+ Şəkil emal edilib</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <FeatureItem 
            icon={<Wand2 className="w-6 h-6 text-blue-500" />} 
            color="bg-blue-50"
            title="100% Avtomatik"
            desc="Süni intellekt obyektləri avtomatik tanıyır ve kəsir. Əl ilə seçməyə ehtiyac yoxdur."
          />
          <FeatureItem 
            icon={<Monitor className="w-6 h-6 text-purple-500" />} 
            color="bg-purple-50"
            title="HD Keyfiyyət"
            desc="Kənar xətləri mükəmməl qoruyaraq yüksək keyfiyyətli (4K-a qədər) şəkillər əldə edin."
          />
          <FeatureItem 
            icon={<Zap className="w-6 h-6 text-emerald-500" />} 
            color="bg-emerald-50"
            title="Saniyələr içində"
            desc="Vaxtınıza qənaət edin. Mürəkkəb proqramlara ehtiyac olmadan nəticə əldə edin."
          />
          <FeatureItem 
            icon={<Shield className="w-6 h-6 text-orange-500" />} 
            color="bg-orange-50"
            title="Təhlükəsiz"
            desc="Şəkilləriniz serverlərimizdə saxlanılmır. Məxfiliiyiniz bizim üçün önəmlidir."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{icon: React.ReactNode, color: string, title: string, desc: string}> = ({ icon, color, title, desc }) => (
  <div className="bg-white/60 p-6 rounded-xl border border-white/60 shadow-sm flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-[#0d191b]">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default Hero;