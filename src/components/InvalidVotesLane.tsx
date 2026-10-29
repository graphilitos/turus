import React, { useState } from 'react';
import { BoardTheme } from '../types';
import { TurusWall } from './TurusWall';
import { Plus, Minus, AlertCircle } from 'lucide-react';

interface InvalidVotesLaneProps {
  count: number;
  totalVotesCast: number;
  theme: BoardTheme;
  onAddVote: () => void;
  onSubtractVote: () => void;
}

export const InvalidVotesLane: React.FC<InvalidVotesLaneProps> = ({
  count,
  totalVotesCast,
  theme,
  onAddVote,
  onSubtractVote,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const percentage =
    totalVotesCast > 0
      ? ((count / totalVotesCast) * 100).toFixed(1)
      : '0.0';

  const handleAdd = () => {
    setIsAnimating(true);
    onAddVote();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      className={`rounded-xl transition-all duration-200 border p-4 sm:p-5 ${
        theme === 'chalkboard'
          ? 'bg-[#261e1e] border-rose-900/60 text-slate-100'
          : theme === 'whiteboard'
          ? 'bg-rose-50/50 border-rose-200 shadow-sm'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 shrink-0 rounded-lg flex items-center justify-center font-bold ${
              theme === 'chalkboard'
                ? 'bg-rose-950/80 border border-rose-700/60 text-rose-300'
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>

          <div>
            <h3
              className={`text-base sm:text-lg font-bold tracking-tight ${
                theme === 'chalkboard' ? 'text-rose-200' : 'text-rose-900'
              }`}
            >
              Surat Suara Tidak Sah / Rusak
            </h3>
            <p
              className={`text-xs ${
                theme === 'chalkboard' ? 'text-rose-300/80' : 'text-rose-600'
              }`}
            >
              Coblos ganda di luar kotak, robek, atau tidak sah sesuai tata tertib
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-rose-200/50">
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight transition-transform ${
                  isAnimating ? 'scale-110 text-rose-500' : ''
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
                theme === 'chalkboard' ? 'text-rose-300' : 'text-rose-600'
              }`}
            >
              {percentage}% dari total masuk
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onSubtractVote}
              disabled={count <= 0}
              title="Koreksi / Kurangi 1 suara tidak sah"
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

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+1 Tidak Sah</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-700/80 text-rose-100">
                Tombol [0]
              </span>
            </button>
          </div>
        </div>
      </div>

      <TurusWall count={count} theme={theme} latestVoted={isAnimating} />
    </div>
  );
};
