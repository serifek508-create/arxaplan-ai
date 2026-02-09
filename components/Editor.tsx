import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Wand2, Image as ImageIcon, RotateCcw, RotateCw, Share2, 
  Download, Palette, Component, ChevronLeft, Minus, Plus, Maximize,
  SplitSquareHorizontal, Grid, User, Loader2, Upload, UploadCloud, Sparkles, 
  CheckCircle2, Check, SlidersHorizontal, FileDown, Send
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import { useToast } from '../lib/useToast';
import { generateAIBackground, AI_BG_PRESETS } from '../lib/openai';

const Editor: React.FC = () => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const [activeTool, setActiveTool] = useState('feather');
  const [zoom, setZoom] = useState(100);
  const [featherRadius, setFeatherRadius] = useState(0);
  const [viewMode, setViewMode] = useState<'compare' | 'transparent' | 'white'>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('');
  
  // Shadow settings
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(8);
  const [shadowBlur, setShadowBlur] = useState(16);
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.3)');

  // AI Background state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Filter state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Export state
  const [exportFormat, setExportFormat] = useState<'png' | 'webp' | 'jpg'>('png');
  const [exportQuality, setExportQuality] = useState(92);

  // Image Processing State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isHd, setIsHd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Undo/Redo history
  const [history, setHistory] = useState<Array<{ image: string; label: string }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY || "";

  const pushToHistory = useCallback((imageUrl: string, label: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ image: imageUrl, label });
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setProcessedImage(history[newIndex].image);
      addToast(`Geri: ${history[newIndex].label}`, 'info');
    }
  }, [historyIndex, history, addToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setProcessedImage(history[newIndex].image);
      addToast(`İrəli: ${history[newIndex].label}`, 'info');
    }
  }, [historyIndex, history, addToast]);

  useEffect(() => {
    if (location.state?.file) {
      handleFile(location.state.file);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFile = (file: File) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setFileName(file.name);
    setProcessedImage(null);
    setError(null);
    setCustomBgColor('');
    setIsHd(false);
    setBgImage(null);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setAiPrompt('');
    
    removeBackground(file);
  };

  const removeBackground = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto'); 
    formData.append('format', 'auto'); 

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': API_KEY },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.errors?.[0]?.title || 'Failed to remove background');
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setProcessedImage(resultUrl);
      pushToHistory(resultUrl, 'Arxa plan silindi');
      setViewMode('compare'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CLIENT SIDE HD UPSCALING (React/Canvas Logic) ---
  
  const applySharpenFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const output = ctx.createImageData(width, height);
    const outputData = output.data;

    // Sharpen Kernel (Edge detection enhancement)
    //  0 -1  0
    // -1  5 -1
    //  0 -1  0
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const mix = 0.3; // Intensity (0.0 - 1.0). Kept low to avoid noise.

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const dstOff = (y * width + x) * 4;
        let r = 0, g = 0, b = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const srcOff = ((y + ky) * width + (x + kx)) * 4;
            const kWeight = kernel[(ky + 1) * 3 + (kx + 1)];
            r += pixels[srcOff] * kWeight;
            g += pixels[srcOff + 1] * kWeight;
            b += pixels[srcOff + 2] * kWeight;
          }
        }
        
        outputData[dstOff] = pixels[dstOff] * (1 - mix) + r * mix;
        outputData[dstOff + 1] = pixels[dstOff + 1] * (1 - mix) + g * mix;
        outputData[dstOff + 2] = pixels[dstOff + 2] * (1 - mix) + b * mix;
        outputData[dstOff + 3] = pixels[dstOff + 3]; // Alpha channel preserved
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  const handleHDUpscale = async () => {
    if (!originalImage || !processedImage) return;
    setIsUpscaling(true);

    try {
      // 1. Load Images
      const origImg = new Image();
      origImg.src = originalImage;
      await origImg.decode();

      const procImg = new Image();
      procImg.src = processedImage;
      await procImg.decode();

      // 2. Create Canvas matching ORIGINAL resolution
      const canvas = document.createElement('canvas');
      canvas.width = origImg.naturalWidth;
      canvas.height = origImg.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Canvas not supported");

      // 3. Upscale: Draw low-res mask onto high-res canvas
      // Browser uses built-in interpolation (Bicubic/Lanczos)
      ctx.drawImage(procImg, 0, 0, canvas.width, canvas.height);

      // 4. Enhance: Apply sharpening to fix soft edges from upscaling
      // This runs on the main thread, so we wrap in timeout to allow UI update
      setTimeout(() => {
        applySharpenFilter(ctx, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const hdUrl = URL.createObjectURL(blob);
            setProcessedImage(hdUrl);
            pushToHistory(hdUrl, 'HD keyfiyyətə yüksəldildi');
            setIsHd(true);
            setViewMode('transparent');
            setCustomBgColor('');
            addToast('HD keyfiyyətə yüksəldildi!', 'success');
          }
          setIsUpscaling(false);
        }, 'image/png');
      }, 100);

    } catch (e) {
      console.error("Upscale failed", e);
      setIsUpscaling(false);
    }
  };

  // AI Background Generator
  const handleGenerateAIBg = async (prompt: string) => {
    if (!processedImage) { addToast('Əvvəlcə şəkil emal edin', 'error'); return; }
    setIsGeneratingBg(true);
    try {
      const result = await generateAIBackground(prompt);
      setBgImage(result.imageDataUrl);
      setCustomBgColor('');
      setViewMode('transparent');
      pushToHistory(processedImage, 'AI fon yaradıldı');
      addToast('AI fon uğurla yaradıldı!', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI fon yaradıla bilmədi';
      addToast(message, 'error');
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // Enhanced Download with format & filter support
  const handleDownload = async () => {
    if (!processedImage) return;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = processedImage;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      if (bgImage) {
        const bg = new Image();
        bg.crossOrigin = 'anonymous';
        bg.src = bgImage;
        await bg.decode();
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      } else if (customBgColor) {
        ctx.fillStyle = customBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
      const mime = exportFormat === 'png' ? 'image/png' : exportFormat === 'webp' ? 'image/webp' : 'image/jpeg';
      const quality = exportFormat === 'png' ? undefined : exportQuality / 100;
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `arxaplan_${isHd ? 'HD_' : ''}${fileName.split('.')[0]}.${exportFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        }
        addToast(`${exportFormat.toUpperCase()} formatında yükləndi!`, 'success');
      }, mime, quality);
    } catch {
      const a = document.createElement('a');
      a.href = processedImage;
      a.download = `arxaplan_${fileName}`;
      a.click();
      addToast('Şəkil yükləndi!', 'success');
    }
  };

  const handleShare = async () => {
    if (!processedImage) return;
    
    try {
      // Try Web Share API first
      if (navigator.share) {
        const response = await fetch(processedImage);
        const blob = await response.blob();
        const file = new File([blob], `arxaplan_${fileName}`, { type: blob.type });
        
        await navigator.share({
          title: 'ArxaPlan.ai - AI ilə emal edilmiş şəkil',
          text: 'ArxaPlan.ai ilə arxa planı silinmiş şəkil',
          files: [file],
        });
        addToast('Paylaşıldı!', 'success');
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        addToast('Link kopyalandı!', 'success');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // If share fails, copy link
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        addToast('Link kopyalandı!', 'info');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        addToast('Paylaşma uğursuz oldu', 'error');
      }
    }
  };

  const handleNewUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const presetColors = [
    'transparent', '#ffffff', '#000000', '#f44336', '#e91e63', '#9c27b0', 
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', 
    '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileInputChange} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Top Header */}
      <header className="z-20 w-full glass-panel border-b border-white/50 sticky top-0 bg-white/80 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <ChevronLeft className="w-6 h-6 text-slate-400 hover:text-slate-800 transition-colors" />
              <div className="flex items-center gap-2">
                <Wand2 className="w-6 h-6" />
                <span className="hidden sm:inline">AI Silici</span>
              </div>
            </Link>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2 text-slate-700">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <h1 className="text-sm font-semibold truncate max-w-[150px] md:max-w-[300px]">{fileName}</h1>
              {processedImage && !isLoading && !isUpscaling && (
                 <div className="flex items-center gap-2">
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider hidden sm:inline-block">Hazırdır</span>
                   {isHd && (
                     <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white uppercase tracking-wider shadow-sm">
                       <Sparkles className="w-3 h-3" /> HD
                     </span>
                   )}
                 </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {processedImage && !isLoading && !isHd && (
              <button 
                onClick={handleHDUpscale}
                disabled={isUpscaling}
                className="hidden md:flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-lg shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-wait hover:scale-105 active:scale-95"
              >
                {isUpscaling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">HD Et</span>
              </button>
            )}

            {isHd && (
              <div className="hidden md:flex items-center justify-center gap-2 h-10 px-4 text-violet-600 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>HD Aktivdir</span>
              </div>
            )}

             <button 
              onClick={handleNewUploadClick}
              className="hidden sm:flex items-center justify-center gap-2 h-10 px-4 rounded-xl hover:bg-slate-100 text-slate-600 text-sm font-bold transition-all"
            >
              <Upload className="w-4 h-4" />
              Yeni
            </button>

            {/* Share button */}
            {processedImage && !isLoading && (
              <button 
                onClick={handleShare}
                className="hidden sm:flex items-center justify-center gap-2 h-10 px-4 rounded-xl hover:bg-slate-100 text-slate-600 text-sm font-bold transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Kopyalandı' : 'Paylaş'}
              </button>
            )}

            <div className="hidden sm:flex items-center bg-white/50 rounded-lg p-1 mr-2 border border-slate-200">
              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-1.5 rounded-md transition-colors ${historyIndex > 0 ? 'hover:bg-slate-100 text-slate-600 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`} 
                title="Geri qaytar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`p-1.5 rounded-md transition-colors ${historyIndex < history.length - 1 ? 'hover:bg-slate-100 text-slate-600 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`} 
                title="İrəli"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={handleDownload}
              disabled={!processedImage || isLoading || isUpscaling}
              className={`flex items-center justify-center gap-2 h-10 px-6 rounded-xl text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all ${!processedImage || isLoading || isUpscaling ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
            >
              <Download className="w-5 h-5" />
              <span>Yüklə</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="w-20 lg:w-72 flex-shrink-0 z-10 glass-panel border-r border-white/50 flex flex-col justify-between py-6 px-3 lg:px-4 bg-white/60 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden lg:block mb-2">Alətlər</div>
            
            <SidebarButton 
              active={activeTool === 'feather'} 
              icon={<Wand2 className="w-5 h-5" />} 
              label="Kənar yumşaltma" 
              onClick={() => setActiveTool('feather')}
            />
            
            {activeTool === 'feather' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-white/50 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-medium">Bulanıqlıq</span>
                  <span className="text-xs text-primary font-bold">{featherRadius}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.1" 
                  value={featherRadius}
                  onChange={(e) => setFeatherRadius(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-slate-400 mt-2">Qeyd: CSS effekti (Yükləməyə daxil deyil)</p>
              </div>
            )}

            <SidebarButton 
              active={activeTool === 'bg'} 
              icon={<Palette className="w-5 h-5" />} 
              label="Fon rəngi" 
              onClick={() => setActiveTool('bg')}
            />

            {activeTool === 'bg' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-white/50 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-2">
                 <div className="grid grid-cols-6 gap-2">
                    {presetColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => {
                           setCustomBgColor(color === 'transparent' ? '' : color);
                           setBgImage(null);
                           if (viewMode === 'compare') setViewMode('transparent'); 
                        }}
                        className={`w-6 h-6 rounded-full border border-slate-200 shadow-sm ${customBgColor === color ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                        style={{ 
                          backgroundColor: color === 'transparent' ? 'transparent' : color,
                          backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                          backgroundSize: '8px 8px'
                        }}
                      />
                    ))}
                 </div>
              </div>
            )}
            
            <SidebarButton 
              active={activeTool === 'shadow'} 
              icon={<Component className="w-5 h-5" />} 
              label="Kölgə" 
              onClick={() => setActiveTool('shadow')}
            />

            {activeTool === 'shadow' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-white/50 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">X Ofset</span>
                      <span className="text-xs text-primary font-bold">{shadowOffsetX}px</span>
                    </div>
                    <input 
                      type="range" min="-20" max="20" step="1" value={shadowOffsetX}
                      onChange={(e) => setShadowOffsetX(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">Y Ofset</span>
                      <span className="text-xs text-primary font-bold">{shadowOffsetY}px</span>
                    </div>
                    <input 
                      type="range" min="-20" max="20" step="1" value={shadowOffsetY}
                      onChange={(e) => setShadowOffsetY(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">Bulanıqlıq</span>
                      <span className="text-xs text-primary font-bold">{shadowBlur}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="1" value={shadowBlur}
                      onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-2">Kölgə rəngi</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)',
                        'rgba(19,200,236,0.3)', 'rgba(147,51,234,0.3)', 'rgba(239,68,68,0.3)',
                        'rgba(34,197,94,0.3)', 'rgba(59,130,246,0.3)',
                      ].map((color, i) => (
                        <button
                          key={i}
                          onClick={() => setShadowColor(color)}
                          className={`w-6 h-6 rounded-full border shadow-sm ${shadowColor === color ? 'ring-2 ring-primary ring-offset-1' : 'border-slate-200'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setShadowOffsetX(0); setShadowOffsetY(0); setShadowBlur(0); }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium mt-1 transition-colors"
                  >
                    Kölgəni sıfırla
                  </button>
                </div>
              </div>
            )}

            {/* === AI & Advanced Tools === */}
            <div className="border-t border-slate-100 pt-3 mt-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden lg:block mb-2">AI & Əlavə</div>
            </div>

            {/* AI Background Generator */}
            <SidebarButton 
              active={activeTool === 'aibg'} 
              icon={<Sparkles className="w-5 h-5" />} 
              label="AI Fon Yarat" 
              onClick={() => setActiveTool('aibg')}
            />
            {activeTool === 'aibg' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-gradient-to-b from-violet-50/50 to-white/50 rounded-lg border border-violet-200/50">
                <p className="text-xs text-slate-500 font-medium mb-3">DALL·E 3 ilə yeni arxa plan yaradın</p>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {AI_BG_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => { setAiPrompt(preset.prompt); handleGenerateAIBg(preset.prompt); }}
                      disabled={isGeneratingBg || !processedImage}
                      className="text-left p-2 rounded-lg bg-white hover:bg-violet-50 border border-gray-100 hover:border-violet-200 transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="text-base">{preset.emoji}</span>
                      <span className="block font-medium text-gray-700 mt-0.5">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Xüsusi prompt yazın..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="flex-1 h-8 px-3 rounded-lg border border-gray-200 text-xs focus:border-violet-400 focus:ring-1 focus:ring-violet-200 outline-none transition-all"
                    onKeyDown={e => e.key === 'Enter' && aiPrompt && handleGenerateAIBg(aiPrompt)}
                  />
                  <button
                    onClick={() => aiPrompt && handleGenerateAIBg(aiPrompt)}
                    disabled={!aiPrompt || isGeneratingBg || !processedImage}
                    className="h-8 w-8 rounded-lg bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center disabled:opacity-40 transition-colors shrink-0"
                  >
                    {isGeneratingBg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {bgImage && (
                  <button
                    onClick={() => { setBgImage(null); addToast('AI fon silindi', 'info'); }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium mt-2 transition-colors"
                  >
                    AI fonu sil
                  </button>
                )}
              </div>
            )}

            {/* Filters */}
            <SidebarButton 
              active={activeTool === 'filters'} 
              icon={<SlidersHorizontal className="w-5 h-5" />} 
              label="Filtrlər" 
              onClick={() => setActiveTool('filters')}
            />
            {activeTool === 'filters' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-white/50 rounded-lg border border-primary/10">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">Parlaqlıq</span>
                      <span className="text-xs text-primary font-bold">{brightness}%</span>
                    </div>
                    <input type="range" min="50" max="150" step="1" value={brightness}
                      onChange={e => setBrightness(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">Kontrast</span>
                      <span className="text-xs text-primary font-bold">{contrast}%</span>
                    </div>
                    <input type="range" min="50" max="150" step="1" value={contrast}
                      onChange={e => setContrast(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-medium">Doyğunluq</span>
                      <span className="text-xs text-primary font-bold">{saturation}%</span>
                    </div>
                    <input type="range" min="0" max="200" step="1" value={saturation}
                      onChange={e => setSaturation(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                  <button
                    onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium mt-1 transition-colors"
                  >
                    Filtrləri sıfırla
                  </button>
                </div>
              </div>
            )}

            {/* Export Options */}
            <SidebarButton 
              active={activeTool === 'export'} 
              icon={<FileDown className="w-5 h-5" />} 
              label="Export Seçimləri" 
              onClick={() => setActiveTool('export')}
            />
            {activeTool === 'export' && (
              <div className="hidden lg:block mt-1 px-4 py-3 bg-white/50 rounded-lg border border-primary/10">
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-2">Format</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['png', 'webp', 'jpg'] as const).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${exportFormat === fmt ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  {exportFormat !== 'png' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500 font-medium">Keyfiyyət</span>
                        <span className="text-xs text-primary font-bold">{exportQuality}%</span>
                      </div>
                      <input type="range" min="10" max="100" step="1" value={exportQuality}
                        onChange={e => setExportQuality(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    {exportFormat === 'png' && 'Şəffaf fon dəstəyi · Ən yaxşı keyfiyyət'}
                    {exportFormat === 'webp' && 'Kiçik fayl ölçüsü · Web üçün ideal'}
                    {exportFormat === 'jpg' && 'Universal format · Ən geniş dəstək'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Canvas Area */}
        <section className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-12">
          
          {/* Top Floating Controls */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-full shadow-lg border border-slate-100 flex gap-2">
            <ViewModeButton 
              active={viewMode === 'compare'} 
              icon={<SplitSquareHorizontal className="w-4 h-4" />} 
              label="Müqayisə" 
              onClick={() => { setViewMode('compare'); setCustomBgColor(''); }}
            />
            <ViewModeButton 
              active={viewMode === 'transparent'} 
              icon={<Grid className="w-4 h-4" />} 
              label="Düzəliş" 
              onClick={() => setViewMode('transparent')}
            />
            <ViewModeButton 
              active={viewMode === 'white'} 
              icon={<User className="w-4 h-4" />} 
              label="Ağ Fon" 
              onClick={() => { setViewMode('white'); setCustomBgColor('#ffffff'); }}
            />
          </div>

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-4xl aspect-square md:aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white ring-1 ring-slate-900/5 group transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Background Layers */}
            {bgImage ? (
               <div className="absolute inset-0 z-0">
                 <img src={bgImage} className="w-full h-full object-cover" alt="AI Background" />
               </div>
            ) : customBgColor ? (
               <div className="absolute inset-0 z-0" style={{ backgroundColor: customBgColor }}></div>
            ) : (
               <div className="absolute inset-0 z-0 bg-checkerboard bg-checkerboard-pattern"></div>
            )}

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90">
                <div className="text-center p-6 max-w-sm">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Minus className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Xəta</h3>
                  <p className="text-sm text-slate-600 mt-1">{error}</p>
                  <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-primary font-bold text-sm hover:underline">Başqa şəkil seçin</button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {(isLoading || isUpscaling || isGeneratingBg) && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-800 font-bold text-lg animate-pulse">
                  {isUpscaling ? 'HD Keyfiyyətə yüksəldilir...' : isGeneratingBg ? 'AI fon yaradılır...' : 'Süni intellekt emal edir...'}
                </p>
                {isUpscaling && <p className="text-slate-500 text-xs mt-2">React Canvas gücü istifadə olunur</p>}
                {isGeneratingBg && <p className="text-slate-500 text-xs mt-2">DALL·E 3 AI modeli istifadə olunur</p>}
              </div>
            )}

            {/* Empty State */}
            {!originalImage && !isLoading && !error && (
               <div onClick={handleNewUploadClick} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold">Başlamaq üçün şəkil yükləyin</p>
               </div>
            )}

            {/* Image Views */}
            {originalImage && processedImage && !isLoading && (
              <>
                {viewMode === 'compare' ? (
                  <ImageSlider 
                    beforeImage={originalImage}
                    afterImage={processedImage}
                  />
                ) : (
                  <div className="relative w-full h-full">
                     <img 
                      src={processedImage} 
                      className="w-full h-full object-contain relative z-10" 
                      alt="Result" 
                      style={{ 
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}) ${featherRadius > 0 ? `blur(${featherRadius * 0.1}px)` : ''}`,
                      }}
                     />
                  </div>
                )}
              </>
            )}
            
            {/* Show original only while loading or if processed not ready */}
            {originalImage && !processedImage && !isLoading && !error && (
               <img src={originalImage} className="w-full h-full object-contain" alt="Original" />
            )}
          </div>

          {/* Bottom Zoom Controls */}
          <div className="absolute bottom-6 flex items-center gap-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-200 z-30">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="text-slate-500 hover:text-primary transition-colors">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-700 w-12 text-center select-none">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="text-slate-500 hover:text-primary transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button onClick={() => setZoom(100)} className="text-slate-500 hover:text-primary transition-colors" title="Fit to Screen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const SidebarButton: React.FC<{active: boolean, icon: React.ReactNode, label: string, onClick: () => void}> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${active ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'hover:bg-slate-100 text-slate-600'}`}
  >
    <div className={`transition-colors ${active ? 'text-primary' : 'group-hover:text-primary'}`}>
      {icon}
    </div>
    <span className={`text-sm font-medium hidden lg:block ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

const ViewModeButton: React.FC<{active: boolean, icon: React.ReactNode, label: string, onClick: () => void}> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Editor;