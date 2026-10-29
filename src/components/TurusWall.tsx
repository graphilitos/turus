import React from 'react';
import { TurusBundle } from './TurusBundle';
import { BoardTheme } from '../types';

interface TurusWallProps {
  count: number;
  theme: BoardTheme;
  latestVoted?: boolean;
}

export const TurusWall: React.FC<TurusWallProps> = ({
  count,
  theme,
  latestVoted = false,
}) => {
  const fullBundles = Math.floor(count / 5);
  const remainder = count % 5;

  if (count === 0) {
    return (
      <div
        className={`h-24 flex items-center justify-center border-2 border-dashed rounded-lg ${
          theme === 'chalkboard'
            ? 'border-slate-700/60 text-slate-500'
            : 'border-slate-200 text-slate-400'
        }`}
      >
        <span className="text-xs font-medium italic font-handwriting text-base">
          Belum ada turus tercatat
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Tally Marks Display Container */}
      <div
        className={`p-3 rounded-lg min-h-[96px] max-h-56 overflow-y-auto transition-colors ${
          theme === 'chalkboard'
            ? 'bg-[#15201b]/80 border border-slate-700/50'
            : theme === 'whiteboard'
            ? 'bg-slate-50/70 border border-slate-200/80 shadow-inner'
            : 'bg-white border border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-end gap-x-2.5 gap-y-2">
          {Array.from({ length: fullBundles }).map((_, i) => (
            <TurusBundle
              key={`full-${i}`}
              count={5}
              theme={theme}
              bundleIndex={i}
              highlightLatest={latestVoted && i === fullBundles - 1 && remainder === 0}
            />
          ))}

          {remainder > 0 && (
            <TurusBundle
              key="remainder"
              count={remainder}
              theme={theme}
              bundleIndex={fullBundles}
              highlightLatest={latestVoted}
            />
          )}
        </div>
      </div>

      {/* Breakdown helper info */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span
          className={
            theme === 'chalkboard' ? 'text-slate-400' : 'text-slate-500'
          }
        >
          {fullBundles > 0 && (
            <span>
              {fullBundles} ikat ({fullBundles * 5} suara)
            </span>
          )}
          {fullBundles > 0 && remainder > 0 && <span> + </span>}
          {remainder > 0 && <span>{remainder} turus</span>}
        </span>
        <span
          className={`font-semibold tabular-nums ${
            theme === 'chalkboard' ? 'text-emerald-400' : 'text-slate-900'
          }`}
        >
          Total: {count} Suara
        </span>
      </div>
    </div>
  );
};
