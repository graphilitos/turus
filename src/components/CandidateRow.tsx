import React, { useState } from 'react';
import { Candidate, BoardTheme } from '../types';
import { TurusWall } from './TurusWall';
import { Plus, Minus, Trophy } from 'lucide-react';

interface CandidateRowProps {
  candidate: Candidate;
  count: number;
  totalValidVotes: number;
  isLeading: boolean;
  theme: BoardTheme;
  shortcutKey: string;
  onAddVote: (candidateId: string, amount?: number) => void;
  onSubtractVote: (candidateId: string) => void;
}

export const CandidateRow: React.FC<CandidateRowProps> = ({
  candidate,
  count,
  totalValidVotes,
  isLeading,
  theme,
  shortcutKey,
  onAddVote,
  onSubtractVote,
}) => {

  const [isAnimating, setIsAnimating] = useState(false);

  const percentage =
    totalValidVotes > 0
      ? ((count / totalValidVotes) * 100).toFixed(1)
      : '0.0';

  const handleAdd = (amount: number = 1) => {
    setIsAnimating(true);
    onAddVote(candidate.id, amount);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      className={`rounded-xl transition-all duration-200 border p-4 sm:p-5 ${
        theme === 'chalkboard'
          ? 'bg-[#1b2a22] border-slate-700/80 text-slate-100 shadow-md'
          : theme === 'whiteboard'
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-white border-slate-200 shadow-xs'
      } ${isLeading && count > 0 ? 'ring-2 ring-amber-500/50' : ''}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3.5">
        {/* Candidate Profile Lockup */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Nomor Urut */}
          <div
            className={`w-11 h-11 shrink-0 rounded-lg flex flex-col items-center justify-center font-bold font-mono transition-transform ${
              theme === 'chalkboard'
                ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-300'
                : 'bg-slate-900 text-white shadow-xs'
            }`}
          >
            <span className="text-[10px] font-sans font-semibold tracking-wider text-slate-400 uppercase">
              No.
            </span>
            <span className="text-base leading-none">{candidate.number}</span>
          </div>



          {/* Candidate Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                  theme === 'chalkboard' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {candidate.name}
              </h3>
              {isLeading && count > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-md">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Unggul Sementara</span>
                </span>
              )}
            </div>
            <p
              className={`text-xs truncate ${
                theme === 'chalkboard' ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {candidate.tagline || 'Calon Ketua RT'}
            </p>
          </div>
        </div>

        {/* Counter and Action Controls */}
        <div className="flex items-center justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/50">
          {/* Big Number & Percentage */}
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight transition-transform ${
                  isAnimating ? 'scale-110 text-emerald-500' : ''
                } ${theme === 'chalkboard' ? 'text-white' : 'text-slate-900'}`}
              >
                {count}
              </span>
              <span
                className={`text-xs font-medium ${
                  theme === 'chalkboard' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                suara
              </span>
            </div>
            <div
              className={`text-xs font-mono font-medium ${
                theme === 'chalkboard' ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {percentage}% dari suara sah
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Subtract Button (Koreksi) */}
            <button
              onClick={() => onSubtractVote(candidate.id)}
              disabled={count <= 0}
              title="Koreksi / Kurangi 1 suara"
              className={`p-2.5 rounded-lg border transition-colors ${
                count <= 0
                  ? 'opacity-40 cursor-not-allowed border-slate-300 text-slate-400'
                  : theme === 'chalkboard'
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Quick +5 Button */}
            <button
              onClick={() => handleAdd(5)}
              title="Tambah 5 suara (1 ikat cepat)"
              className={`px-2.5 py-2 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                theme === 'chalkboard'
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              +5
            </button>

            {/* Primary Big +1 Suara Button */}
            <button
              onClick={() => handleAdd(1)}
              className="flex items-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base sm:text-sm shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+1 Suara</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-700/80 text-emerald-100">
                [{shortcutKey}]
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress percentage bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(parseFloat(percentage) || 0, 100)}%` }}
        />
      </div>

      {/* Tally Wall Display (The physical chalkboard/whiteboard turus) */}
      <TurusWall count={count} theme={theme} latestVoted={isAnimating} />
    </div>
  );
};
