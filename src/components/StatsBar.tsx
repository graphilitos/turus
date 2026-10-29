import React from 'react';
import { BoardTheme, ElectionConfig } from '../types';
import { Users, CheckCircle2, XCircle, PieChart, Inbox } from 'lucide-react';

interface StatsBarProps {
  totalVotesCast: number;
  totalValidVotes: number;
  invalidVotesCount: number;
  config: ElectionConfig;
  theme: BoardTheme;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalVotesCast,
  totalValidVotes,
  invalidVotesCount,
  config,
  theme,
}) => {
  const turnoutPercent =
    config.dptTotal > 0
      ? ((totalVotesCast / config.dptTotal) * 100).toFixed(1)
      : '0.0';

  const remainingDPT = Math.max(0, config.dptTotal - totalVotesCast);

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        theme === 'chalkboard'
          ? 'bg-[#15221b] border-slate-700/80 text-slate-200'
          : theme === 'whiteboard'
          ? 'bg-slate-50 border-slate-200 shadow-xs'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/50 dark:divide-slate-700/50">
        {/* Metric 1: Total Suara Masuk */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'chalkboard'
                ? 'bg-slate-800 text-slate-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Surat Suara Masuk
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tabular-nums">
                {totalVotesCast}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {config.dptTotal} DPT
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Partisipasi Warga */}
        <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'chalkboard'
                ? 'bg-emerald-950/80 text-emerald-300'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Partisipasi Warga
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {turnoutPercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({remainingDPT} sisa)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Suara Sah */}
        <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'chalkboard'
                ? 'bg-blue-950/80 text-blue-300'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Suara Sah
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                {totalValidVotes}
              </span>
              <span className="text-xs text-slate-400">
                (
                {totalVotesCast > 0
                  ? ((totalValidVotes / totalVotesCast) * 100).toFixed(0)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Suara Tidak Sah */}
        <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'chalkboard'
                ? 'bg-rose-950/80 text-rose-300'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Suara Tidak Sah
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                {invalidVotesCount}
              </span>
              <span className="text-xs text-slate-400">
                (
                {totalVotesCast > 0
                  ? ((invalidVotesCount / totalVotesCast) * 100).toFixed(0)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
