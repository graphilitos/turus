import React, { useEffect, useState } from 'react';
import { Candidate, ElectionConfig } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Award, FileText, X } from 'lucide-react';

interface WinnerCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  voteCounts: Record<string, number>;
  invalidVotesCount: number;
  config: ElectionConfig;
  onOpenBeritaAcara: () => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  isOpen,
  onClose,
  candidates,
  voteCounts,
  invalidVotesCount,
  config,
  onOpenBeritaAcara,
}) => {


  const totalValidVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const sortedCandidates = [...candidates].sort(
    (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
  );
  const winner = sortedCandidates[0];
  const winnerVotes = voteCounts[winner?.id] || 0;
  const runnerUpVotes = sortedCandidates[1] ? voteCounts[sortedCandidates[1].id] || 0 : 0;
  const isTie = winnerVotes > 0 && winnerVotes === runnerUpVotes && sortedCandidates.length > 1;

  useEffect(() => {
    if (isOpen && winnerVotes > 0 && !isTie) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if confetti blocked
      }
    }
  }, [isOpen, winnerVotes, isTie]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-100" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Hasil Akhir Pemilihan Ketua {config.rtNumber}
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            {config.kelurahan}, {config.kecamatan} · Periode {config.period}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {totalValidVotes === 0 ? (
            <div className="py-8 text-slate-500">
              <p className="text-sm font-medium">Belum ada suara sah yang dihitung.</p>
              <p className="text-xs text-slate-400 mt-1">
                Silakan mulai penghitungan suara pada papan turus.
              </p>
            </div>
          ) : isTie ? (
            <div className="py-6">
              <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700 mb-3">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Perolehan Suara Seri / Imbang
              </h3>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                Calon urut dengan perolehan tertinggi memperoleh suara yang sama ({winnerVotes} suara). Berdasarkan tata tertib pemilihan, panitia dapat mengadakan musyawarah mufakat atau pemungutan suara putaran kedua.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 shadow-lg flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Ketua {config.rtNumber} Terpilih
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {winner?.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Nomor Urut {winner?.number}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Perolehan</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-600">
                      {winnerVotes}{' '}
                      <span className="text-xs font-normal text-slate-500">suara</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Persentase Sah</span>
                    <span className="text-2xl font-extrabold font-mono text-slate-900">
                      {totalValidVotes > 0
                        ? ((winnerVotes / totalValidVotes) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Recap */}
          {totalValidVotes > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-4 text-left">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rekapitulasi Suara
              </h4>
              <div className="space-y-1.5 text-xs">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-1 border-b border-slate-100"
                  >
                    <span className="font-medium text-slate-800">
                      No. {c.number} {c.name}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {voteCounts[c.id] || 0} suara (
                      {totalValidVotes > 0
                        ? (((voteCounts[c.id] || 0) / totalValidVotes) * 100).toFixed(1)
                        : 0}
                      %)
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-1 text-slate-500">
                  <span>Suara Tidak Sah</span>
                  <span className="font-mono tabular-nums">
                    {invalidVotesCount} suara
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenBeritaAcara();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat & Cetak Berita Acara</span>
          </button>
        </div>
      </div>
    </div>
  );
};
