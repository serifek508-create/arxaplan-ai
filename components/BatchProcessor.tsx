import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, UploadCloud, Wand2, Download, Loader2,
  CheckCircle2, XCircle, Trash2, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { useToast } from '../lib/useToast';

interface BatchImage {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

const BatchProcessor: React.FC = () => {
  const [images, setImages] = useState<BatchImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY || '';

  const handleFiles = (files: FileList | File[]) => {
    const newImages: BatchImage[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 20 - images.length)
      .map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        originalUrl: URL.createObjectURL(file),
        processedUrl: null,
        status: 'pending' as const,
      }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const processImage = async (image: BatchImage): Promise<BatchImage> => {
    const formData = new FormData();
    formData.append('image_file', image.file);
    formData.append('size', 'auto');
    formData.append('format', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': API_KEY },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.errors?.[0]?.title || 'Processing failed');
      }
      const blob = await response.blob();
      return { ...image, processedUrl: URL.createObjectURL(blob), status: 'done' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { ...image, status: 'error', error: message };
    }
  };

  const processAll = async () => {
    setIsProcessing(true);
    const pending = images.filter(img => img.status === 'pending');

    for (const img of pending) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'processing' } : i));
      const result = await processImage(img);
      setImages(prev => prev.map(i => i.id === img.id ? result : i));
    }

    setIsProcessing(false);
    addToast(`Toplu emal tamamlandı! ${pending.length} şəkil emal edildi.`, 'success');
  };

  const downloadImage = (img: BatchImage) => {
    if (!img.processedUrl) return;
    const link = document.createElement('a');
    link.href = img.processedUrl;
    link.download = `arxaplan_${img.file.name}`;
    link.click();
  };

  const downloadAll = () => {
    const done = images.filter(i => i.status === 'done');
    done.forEach((img, i) => {
      setTimeout(() => downloadImage(img), i * 300);
    });
    addToast(`${done.length} şəkil yüklənir...`, 'info');
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const completedCount = images.filter(i => i.status === 'done').length;
  const pendingCount = images.filter(i => i.status === 'pending').length;
  const processingCount = images.filter(i => i.status === 'processing').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {/* Header */}
      <header className="glass-panel border-b border-white/50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <ChevronLeft className="w-5 h-5 text-slate-400 hover:text-slate-800 transition-colors" />
              <Wand2 className="w-5 h-5" />
              <span>Toplu Emal</span>
            </Link>
            {images.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {completedCount}/{images.length} hazır
                </span>
                {processingCount > 0 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {processingCount} emal edilir
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {images.length > 0 && (
              <button
                onClick={clearAll}
                className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Hamısını sil
              </button>
            )}
            {pendingCount > 0 && (
              <button
                onClick={processAll}
                disabled={isProcessing}
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-bold shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Hamısını Emal Et
              </button>
            )}
            {completedCount > 1 && (
              <button
                onClick={downloadAll}
                className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                Hamısını Yüklə ({completedCount})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="group border-2 border-dashed border-primary/30 hover:border-primary bg-white/50 hover:bg-white rounded-2xl p-12 cursor-pointer flex flex-col items-center gap-4 text-center transition-all duration-300 mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#0d191b]">Şəkilləri bura sürüşdürün</p>
            <p className="text-gray-500 text-sm mt-1">və ya seçmək üçün toxunun · Eyni anda 20-yə qədər şəkil</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">JPG, PNG, WEBP dəstəklənir</span>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={img.processedUrl || img.originalUrl}
                    alt={img.file.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${img.status === 'done' ? '' : img.status === 'processing' ? 'scale-105 blur-[1px]' : 'opacity-70'}`}
                  />

                  {/* Status Overlay */}
                  {img.status === 'processing' && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-xs text-primary font-bold mt-2">Emal edilir...</span>
                    </div>
                  )}
                  {img.status === 'error' && (
                    <div className="absolute inset-0 bg-red-50/80 flex flex-col items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-400" />
                      <span className="text-xs text-red-500 font-bold mt-2">Xəta</span>
                    </div>
                  )}
                  {img.status === 'done' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                    </div>
                  )}
                  {img.status === 'pending' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                        <span className="text-[8px] font-black text-amber-600">⏳</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    {img.status === 'done' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadImage(img); }}
                        className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5">
                  <p className="text-xs font-medium text-gray-600 truncate">{img.file.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {img.status === 'pending' && 'Gözləyir...'}
                    {img.status === 'processing' && 'Emal edilir...'}
                    {img.status === 'done' && '✓ Hazırdır'}
                    {img.status === 'error' && `✕ ${img.error || 'Xəta'}`}
                  </p>
                </div>
              </div>
            ))}

            {/* Add More Card */}
            {images.length < 20 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white"
              >
                <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-xs font-medium text-gray-400">Daha əlavə et</span>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold text-lg">Hələ heç bir şəkil yüklənməyib</p>
            <p className="text-gray-300 text-sm mt-2">Yuxarıdakı sahəyə şəkillərinizi sürüşdürün və ya seçin</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-glow hover:shadow-glow-lg transition-all btn-ripple"
            >
              Şəkil Seçin
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BatchProcessor;
