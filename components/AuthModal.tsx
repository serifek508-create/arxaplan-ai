import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Uğurla daxil oldunuz!');
        setTimeout(() => onClose(), 1000);
      }
    } else {
      if (!fullName.trim()) {
        setError('Ad və soyad daxil edin');
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, fullName);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Hesab yaradıldı! E-poçtunuzu yoxlayın.');
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div 
        className="relative w-full max-w-md modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="relative h-32 bg-gradient-to-br from-primary via-cyan-500 to-[#4c8d9a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            <div className="text-center z-10">
              <div className="w-14 h-14 mx-auto bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-2">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-white text-xl font-extrabold tracking-tight">
                {mode === 'login' ? 'Xoş gəldiniz!' : 'Qeydiyyat'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 text-sm font-bold transition-all ${mode === 'login' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Daxil ol
            </button>
            <button 
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 text-sm font-bold transition-all ${mode === 'register' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Qeydiyyat
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-fade-in-up">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium animate-fade-in-up">
                {success}
              </div>
            )}

            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  placeholder="Ad və Soyad"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                placeholder="E-poçt ünvanı"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:from-primary-dark hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 btn-ripple hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'Daxil ol'
              ) : (
                'Hesab yarat'
              )}
            </button>

            <p className="text-center text-xs text-gray-400 pt-2">
              {mode === 'login' ? 'Hesabınız yoxdur? ' : 'Artıq hesabınız var? '}
              <button 
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Qeydiyyatdan keçin' : 'Daxil olun'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
