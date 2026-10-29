import React from 'react';
import { BoardTheme, ElectionConfig } from '../types';
import { Volume2, VolumeX, Maximize2, FileText, History, Settings, Award } from 'lucide-react';

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
  activeTab,
  setActiveTab,
}) => {
  return (
    <header
      className={`border-b sticky top-0 z-30 transition-colors ${
        theme === 'chalkboard'
          ? 'bg-[#0f1914]/95 border-slate-700/80 text-white backdrop-blur'
          : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            Papan Turus {config.rtNumber}/{config.rwNumber}
          </span>
          <span
            className={`hidden lg:inline text-xs ${
              theme === 'chalkboard' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {config.kelurahan}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('tally')}
            className={`transition-colors whitespace-nowrap pb-1 border-b-2 ${
              activeTab === 'tally'
                ? theme === 'chalkboard'
                  ? 'border-emerald-400 text-white'
                  : 'border-emerald-600 text-emerald-950 font-semibold'
                : theme === 'chalkboard'
                ? 'border-transparent text-slate-300 hover:text-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Papan Hitung
          </button>

          <button
            onClick={onOpenBeritaAcara}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              theme === 'chalkboard'
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Berita Acara</span>
          </button>

          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              theme === 'chalkboard'
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Suara</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              theme === 'chalkboard'
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan TPS</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme switcher */}
          <div
            className={`hidden sm:flex items-center p-0.5 rounded-lg border text-xs ${
              theme === 'chalkboard'
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <button
              onClick={() => onChangeTheme('whiteboard')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                theme === 'whiteboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Whiteboard
            </button>
            <button
              onClick={() => onChangeTheme('chalkboard')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                theme === 'chalkboard'
                  ? 'bg-[#1b2a22] text-white shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Papan Tulis Hitam
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan suara klik/turus' : 'Nyalakan suara klik/turus'}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'chalkboard'
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Fullscreen / Projector */}
          <button
            onClick={onToggleFullscreen}
            title="Layar Penuh / Mode Proyektor (F)"
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'chalkboard'
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Primary Action Button: Selesai / Pemenang */}
          <button
            onClick={onOpenWinner}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-xs"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Hasil Akhir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
