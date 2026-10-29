import React from 'react';
import { BoardTheme } from '../types';

interface TurusBundleProps {
  count: number; // 1 to 5
  theme: BoardTheme;
  bundleIndex?: number;
  highlightLatest?: boolean;
}

export const TurusBundle: React.FC<TurusBundleProps> = ({
  count,
  theme,
  bundleIndex,
  highlightLatest = false,
}) => {
  // Stroke colors based on board theme
  const strokeColor =
    theme === 'chalkboard'
      ? '#f1f5f9' // chalk white
      : theme === 'whiteboard'
      ? '#0f172a' // whiteboard dry-erase marker black
      : '#1e293b';

  const strikeColor =
    theme === 'chalkboard'
      ? '#fef08a' // yellow chalk highlight
      : '#dc2626'; // marker red slash or marker black

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transition-all duration-150 ${
        highlightLatest ? 'scale-105' : ''
      }`}
      title={bundleIndex !== undefined ? `Ikat ke-${bundleIndex + 1} (${count} suara)` : `${count} suara`}
    >
      <svg
        width="46"
        height="38"
        viewBox="0 0 46 38"
        className="overflow-visible"
        style={{
          filter:
            theme === 'chalkboard'
              ? 'drop-shadow(0 0 1px rgba(255,255,255,0.4))'
              : 'none',
        }}
      >
        {/* Stroke 1 */}
        {count >= 1 && (
          <line
            x1="8"
            y1="5"
            x2="7.5"
            y2="33"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        )}

        {/* Stroke 2 */}
        {count >= 2 && (
          <line
            x1="16"
            y1="6"
            x2="16.5"
            y2="32"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        )}

        {/* Stroke 3 */}
        {count >= 3 && (
          <line
            x1="24.5"
            y1="4.5"
            x2="24"
            y2="33.5"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        )}

        {/* Stroke 4 */}
        {count >= 4 && (
          <line
            x1="32.5"
            y1="5.5"
            x2="33.5"
            y2="32.5"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        )}

        {/* Stroke 5 (Diagonal crossing slash / turus penutup ikat) */}
        {count >= 5 && (
          <line
            x1="3"
            y1="31"
            x2="38"
            y2="7"
            stroke={theme === 'whiteboard' ? strokeColor : strikeColor}
            strokeWidth="3.6"
            strokeLinecap="round"
            className="transition-all duration-300 animate-in fade-in"
          />
        )}
      </svg>
      {bundleIndex !== undefined && (bundleIndex + 1) % 5 === 0 && (
        <span
          className={`text-[9px] font-mono tabular-nums mt-0.5 ${
            theme === 'chalkboard' ? 'text-slate-400' : 'text-slate-400'
          }`}
        >
          {(bundleIndex + 1) * 5}
        </span>
      )}
    </div>
  );
};
