import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';

// SHA-256 hash of "turus2026"
const CORRECT_HASH = 'b6251dd4829630b4f5fbb65c83045d61f6d1518d250bffbaef66fba2479f136d';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_KEY = 'turus_auth_v1';

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === 'granted') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const hash = await sha256(password.trim());
      if (hash === CORRECT_HASH) {
        sessionStorage.setItem(SESSION_KEY, 'granted');
        setIsAuthenticated(true);
      } else {
        setError('Password salah. Silakan coba lagi.');
        setPassword('');
      }
    } catch {
      setError('Terjadi kesalahan, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  if (isChecking) return null;
  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.03) 20px,
            rgba(255,255,255,0.03) 40px
          )`,
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Papan Turus Digital
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Masukkan password panitia untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Password panitia"
                autoFocus
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-rose-500/60 focus:ring-rose-500/40'
                    : 'border-white/10 focus:ring-emerald-500/40 focus:border-emerald-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-rose-400 text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/40"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-6">
            Sesi aktif sampai tab ditutup
          </p>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-slate-600 mt-4">
          Sistem Turus Digital — Pemilihan Ketua RT
        </p>
      </div>
    </div>
  );
};
