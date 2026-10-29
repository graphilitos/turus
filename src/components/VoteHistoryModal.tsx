import React, { useState } from 'react';
import { VoteRecord } from '../types';
import { RotateCcw, X, Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoteHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: VoteRecord[];
  onUndoLastVote: () => void;
  onUndoSpecificVote: (recordId: string) => void;
}

export const VoteHistoryModal: React.FC<VoteHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onUndoLastVote,
  onUndoSpecificVote,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CANDIDATE' | 'INVALID'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (filter === 'CANDIDATE' && item.type !== 'CANDIDATE') return false;
    if (filter === 'INVALID' && item.type !== 'INVALID') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.candidateName?.toLowerCase().includes(q);
      const matchNum = item.candidateNumber?.toLowerCase().includes(q);
      const matchSeq = item.seqNumber.toString().includes(q);
      return matchName || matchNum || matchSeq;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Riwayat Pencatatan Suara (Audit Log)
            </h2>
            <p className="text-xs text-slate-500">
              Daftar kronologis setiap surat suara yang dihitung di hadapan saksi
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onUndoLastVote}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="Batalkan surat suara yang terakhir dimasukkan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Batalkan Suara Terakhir</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({history.length})
            </button>
            <button
              onClick={() => setFilter('CANDIDATE')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'CANDIDATE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suara Sah
            </button>
            <button
              onClick={() => setFilter('INVALID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'INVALID'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tidak Sah
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari calon / nomor surat suara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada riwayat suara yang tercatat
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const date = new Date(item.timestamp);
              const timeStr = date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-mono text-xs font-bold">
                      #{item.seqNumber}
                    </span>

                    {item.type === 'CANDIDATE' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            No. {item.candidateNumber} — {item.candidateName}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Pukul {timeStr}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <div>
                          <p className="text-sm font-semibold text-rose-900">
                            Surat Suara Tidak Sah
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Pukul {timeStr}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {index === 0 && (
                    <button
                      onClick={() => onUndoSpecificVote(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50"
                    >
                      Batalkan
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
