import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 border-t border-[#e7f1f3] bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2024 ArxaPlan.ai. Bütün hüquqlar qorunur.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Məxfilik siyasəti</a>
          <a href="#" className="hover:text-primary transition-colors">İstifadə şərtləri</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
