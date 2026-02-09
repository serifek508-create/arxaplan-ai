import React from 'react';
import { 
  Wand2, Menu, CloudUpload, ImagePlus, Download, Home, Layers, History, User,
  Sparkles, MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobilePrototype: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0fdf4] overflow-hidden p-4">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-300/20 blur-[120px]"></div>

      {/* Main Container simulating mobile device */}
      <div className="relative z-10 flex h-[850px] max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[3rem] bg-white shadow-2xl border-8 border-white ring-1 ring-black/5">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Wand2 className="w-6 h-6" />
            </Link>
            <h2 className="text-slate-900 text-lg font-bold tracking-tight">RemoveBG.az</h2>
          </div>
          <button className="flex w-10 h-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6">
          <div className="mt-4 mb-8 flex flex-col gap-3">
            <h1 className="text-slate-900 text-4xl font-black leading-[1.1] tracking-tight">
              Arxa fonu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">silin</span>
            </h1>
            <p className="text-slate-500 text-base font-medium leading-relaxed">
              Süni intellekt ilə saniyələr içində şəkillərinizin fonunu təmizləyin.
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div className="relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-slate-50 p-8 transition-all hover:border-primary hover:bg-primary/5">
              <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
                <div className="relative flex w-24 h-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 to-emerald-200/20 shadow-glow">
                  <div className="absolute inset-0 rounded-full bg-white/40 blur-xl"></div>
                  <CloudUpload className="w-12 h-12 text-primary relative z-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 text-lg font-bold">Şəkil yüklə</p>
                  <p className="text-slate-500 text-sm">və ya bura sürüşdürün</p>
                </div>
                <button className="mt-2 w-full max-w-[200px] rounded-xl bg-primary py-3.5 px-6 text-white shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:bg-primary-dark font-bold text-sm tracking-wide flex items-center justify-center gap-2">
                  <ImagePlus className="w-5 h-5" />
                  Qalereya
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 text-lg font-bold">Son fəaliyyətlər</h3>
              <button className="text-primary text-sm font-bold hover:opacity-80">Hamısı</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {[
                { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", name: "Portret_01.png" },
                { img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80", name: "Model_shoot.jpg" },
                { img: "https://images.unsplash.com/photo-1488161628813-99c974c76949?auto=format&fit=crop&w=200&q=80", name: "Smoke.png" }
              ].map((item, idx) => (
                <div key={idx} className="flex min-w-[140px] flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                  <div className="aspect-[4/5] w-full rounded-xl bg-slate-100 overflow-hidden relative group">
                    <img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="px-1">
                    <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">2 dəq əvvəl</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <nav className="flex h-20 w-full items-center justify-around rounded-3xl bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 px-2">
            <NavIcon icon={<Home className="w-7 h-7" />} active />
            <NavIcon icon={<Layers className="w-7 h-7" />} />
            
            {/* Center Action Button */}
            <div className="relative -top-8">
              <button className="flex w-16 h-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl hover:bg-slate-800 transition-transform active:scale-95 border-[6px] border-white">
                <Sparkles className="w-8 h-8" />
              </button>
            </div>
            
            <NavIcon icon={<History className="w-7 h-7" />} />
            <NavIcon icon={<User className="w-7 h-7" />} />
          </nav>
        </div>
      </div>
    </div>
  );
};

const NavIcon: React.FC<{icon: React.ReactNode, active?: boolean}> = ({ icon, active }) => (
  <button className={`group flex flex-col items-center justify-center gap-1 w-14 h-full ${active ? 'text-primary' : 'text-slate-400'}`}>
    <div className="transition-transform group-active:scale-90">{icon}</div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>}
  </button>
);

export default MobilePrototype;
