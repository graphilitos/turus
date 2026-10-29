import React, { useState } from 'react';
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react';
import { BoardTheme, Candidate } from '../types';

interface KeyboardShortcutsHelpProps {
  candidates: Candidate[];
  theme: BoardTheme;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  candidates,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-colors text-xs ${
        theme === 'chalkboard'
          ? 'bg-[#15221b]/60 border-slate-700/60 text-slate-300'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">
            Pintasan Keyboard (Operasi Cepat Tanpa Mouse)
          </span>
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
            · Tekan tombol angka untuk langsung input suara
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {candidates.slice(0, 5).map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
                {i + 1}
              </kbd>
              <span className="truncate">{c.name}</span>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 rounded font-mono font-bold bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 shadow-xs">
              0
            </kbd>
            <span>Suara Tidak Sah</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
              Ctrl+Z
            </kbd>
            <span>Batalkan Terakhir</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
              M
            </kbd>
            <span>Suara On / Off</span>
          </div>
        </div>
      )}
    </div>
  );
};
