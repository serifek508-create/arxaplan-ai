import React from 'react';

const brands = [
  'TechCorp', 'DigiStudio', 'PhotoPro', 'DesignHub', 'CreativeLab',
  'MediaWorks', 'PixelForge', 'ArtBase', 'CloudShot', 'SnapEdit',
  'BrandBox', 'ImageAI', 'VisionTech', 'PrintFlow', 'StyleMaker',
];

const TrustedBy: React.FC = () => (
  <section className="w-full py-12 border-y border-gray-100 bg-white/50 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
        2000+ peşəkarın etibar etdiyi platforma
      </p>
    </div>
    <div className="relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background-light to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-light to-transparent z-10 pointer-events-none"></div>
      
      {/* Scrolling marquee */}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div
            key={i}
            className="flex-shrink-0 mx-10 flex items-center gap-2.5 opacity-30 hover:opacity-60 transition-opacity duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-black text-gray-500 shadow-sm">
              {brand[0]}
            </div>
            <span className="text-lg font-bold text-gray-400">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBy;
