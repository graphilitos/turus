import React, { useState, useEffect, useRef } from 'react';
import { BoardTheme, ElectionConfig } from '../types';
import {
  Volume2, VolumeX, Maximize2, FileText, History,
  Settings, Award, Menu, X, Monitor, BookOpen, ChevronRight
} from 'lucide-react';

interface TopHeaderProps {
  config: ElectionConfig;
  theme: BoardTheme;
  onChangeTheme: (theme: BoardTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBeritaAcara: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenWinner: () => void;
  onToggleFullscreen: () => void;
  activeTab: 'tally' | 'berita-acara' | 'history' | 'settings';
  setActiveTab: (tab: 'tally' | 'berita-acara' | 'history' | 'settings') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  config,
  theme,
  onChangeTheme,
  soundEnabled,
  onToggleSound,
  onOpenBeritaAcara,
  onOpenHistory,
  onOpenSettings,
  onOpenWinner,
  onToggleFullscreen,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isDark = theme === 'chalkboard';

  const menuItemClass = `flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all active:scale-[0.98] ${
    isDark
      ? 'text-slate-200 hover:bg-slate-700/60 active:bg-slate-700'
      : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
  }`;

  const handleMenuItem = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <header
        className={`border-b sticky top-0 z-30 transition-colors ${
          isDark
            ? 'bg-[#0f1914]/95 border-slate-700/80 text-white backdrop-blur'
            : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Wordmark */}
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-base font-bold tracking-tight truncate">
              Papan Turus {config.rtNumber}/{config.rwNumber}
            </span>
            <span className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {config.kelurahan}
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={onOpenBeritaAcara}
              className={`flex items-center gap-1.5 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FileText className="w-4 h-4" />
              Berita Acara
            </button>
            <button
              onClick={onOpenHistory}
              className={`flex items-center gap-1.5 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <History className="w-4 h-4" />
              Riwayat
            </button>
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Settings className="w-4 h-4" />
              Pengaturan
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop: theme toggle */}
            <div className={`hidden md:flex items-center p-0.5 rounded-lg border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              <button
                onClick={() => onChangeTheme('whiteboard')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${theme === 'whiteboard' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                Putih
              </button>
              <button
                onClick={() => onChangeTheme('chalkboard')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${isDark ? 'bg-[#1b2a22] text-white shadow-xs' : 'hover:text-slate-900'}`}
              >
                Hitam
              </button>
            </div>

            {/* Sound toggle - desktop only */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
              className={`hidden md:flex p-2 rounded-lg border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Fullscreen - desktop only */}
            <button
              onClick={onToggleFullscreen}
              title="Layar Penuh (F)"
              className={`hidden md:flex p-2 rounded-lg border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Hasil Akhir - desktop */}
            <button
              onClick={onOpenWinner}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Hasil Akhir
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden p-2 rounded-lg border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
              aria-label="Buka menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-down Menu ── */}
      {menuOpen && (
        <div
          ref={menuRef}
          className={`md:hidden fixed top-14 left-0 right-0 z-40 border-b shadow-xl transition-all ${
            isDark
              ? 'bg-[#111c16] border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-3 space-y-1">
            {/* Theme toggle */}
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
              <Monitor className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tema Tampilan</span>
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => { onChangeTheme('whiteboard'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${theme === 'whiteboard' ? 'bg-slate-900 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'}`}
                >
                  Putih
                </button>
                <button
                  onClick={() => { onChangeTheme('chalkboard'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${isDark ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                >
                  Hitam
                </button>
              </div>
            </div>

            {/* Menu items */}
            <button onClick={() => handleMenuItem(onOpenBeritaAcara)} className={menuItemClass}>
              <span className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                Berita Acara Resmi
              </span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            <button onClick={() => handleMenuItem(onOpenHistory)} className={menuItemClass}>
              <span className="flex items-center gap-3">
                <History className="w-5 h-5 text-purple-500" />
                Riwayat Suara
              </span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            <button onClick={() => handleMenuItem(onOpenSettings)} className={menuItemClass}>
              <span className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-500" />
                Pengaturan TPS
              </span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            <button onClick={() => handleMenuItem(onToggleSound)} className={menuItemClass}>
              <span className="flex items-center gap-3">
                {soundEnabled
                  ? <Volume2 className="w-5 h-5 text-emerald-500" />
                  : <VolumeX className="w-5 h-5 text-slate-400" />}
                {soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button onClick={() => handleMenuItem(onToggleFullscreen)} className={menuItemClass}>
              <span className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-slate-400" />
                Mode Layar Penuh
              </span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => handleMenuItem(onOpenWinner)}
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all"
            >
              <Award className="w-5 h-5 text-amber-400" />
              Lihat Hasil Akhir Pemilihan
            </button>
          </div>

          {/* Safe area spacer */}
          <div className="h-2" />
        </div>
      )}

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30 top-14"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};
