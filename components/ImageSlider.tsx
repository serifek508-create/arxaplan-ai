import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Code2 } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  overlayText?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  beforeImage, 
  afterImage, 
  className = "", 
  overlayText = true 
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden select-none cursor-ew-resize group ${className}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image (Result/After) */}
      <div className="absolute inset-0 w-full h-full bg-checkerboard bg-checkerboard-pattern">
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </div>

      {/* Foreground Image (Original/Before) - Clipped */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white/80 shadow-[2px_0_10px_rgba(0,0,0,0.2)] z-10 bg-white"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute top-0 left-0 max-w-none h-full object-cover pointer-events-none select-none"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-transform group-active:scale-110"
        style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}
      >
        <Code2 className="w-5 h-5 text-primary rotate-90" />
      </div>

      {/* Labels */}
      {overlayText && (
        <>
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded z-20 pointer-events-none">
            Orijinal
          </div>
          <div className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded z-20 pointer-events-none">
            Nəticə
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
