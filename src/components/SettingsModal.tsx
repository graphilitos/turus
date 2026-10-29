import React, { useState } from 'react';
import { Candidate, ElectionConfig } from '../types';
import { X, Plus, Trash2, Download, Upload, RefreshCw, AlertTriangle, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ElectionConfig;
  onUpdateConfig: (newConfig: ElectionConfig) => void;
  candidates: Candidate[];
  onUpdateCandidates: (newCandidates: Candidate[]) => void;
  onResetVotes: () => void;
  onLoadSampleData: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  candidates,
  onUpdateCandidates,
  onResetVotes,
  onLoadSampleData,
  onExportData,
  onImportData,
}) => {
  const [formData, setFormData] = useState<ElectionConfig>({ ...config });
  const [candidateList, setCandidateList] = useState<Candidate[]>([...candidates]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'candidates' | 'data'>('info');

  if (!isOpen) return null;

  const handleSaveInfo = () => {
    onUpdateConfig(formData);
    onUpdateCandidates(candidateList);
    onClose();
  };

  const handleAddCandidate = () => {
    const nextNum = (candidateList.length + 1).toString().padStart(2, '0');
    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      number: nextNum,
      name: `Calon Baru ${nextNum}`,
      tagline: 'Visi: Mewujudkan RT yang rukun dan transparan',
      avatarUrl: '',
      colorScheme: 'indigo',
    };
    setCandidateList([...candidateList, newCand]);
  };

  const handleUpdateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidateList(
      candidateList.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteCandidate = (id: string) => {
    if (candidateList.length <= 1) {
      alert('Minimal harus ada 1 calon.');
      return;
    }
    setCandidateList(candidateList.filter((c) => c.id !== id));
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pengaturan & Data Pemilihan RT
            </h2>
            <p className="text-xs text-slate-500">
              Kelola nama RT/RW, panitia, daftar calon, serta cadangan data
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Wilayah & Panitia
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'candidates'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Calon ({candidateList.length})
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cadangan & Reset
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor RT
                  </label>
                  <input
                    type="text"
                    value={formData.rtNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rtNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Contoh: RT 04"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor RW
                  </label>
                  <input
                    type="text"
                    value={formData.rwNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rwNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Contoh: RW 07"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelurahan / Desa
                  </label>
                  <input
                    type="text"
                    value={formData.kelurahan}
                    onChange={(e) =>
                      setFormData({ ...formData, kelurahan: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) =>
                      setFormData({ ...formData, kecamatan: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Contoh: Jawa Barat"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periode Masa Bakti
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Contoh: 2026 - 2031"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total DPT (Daftar Pemilih Tetap)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.dptTotal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dptTotal: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-sm font-mono border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Pemilihan
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Susunan Panitia & Saksi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ketua Panitia Pemilihan
                    </label>
                    <input
                      type="text"
                      value={formData.ketuaPanitia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ketuaPanitia: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sekretaris Panitia
                    </label>
                    <input
                      type="text"
                      value={formData.sekretarisPanitia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sekretarisPanitia: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Saksi I
                    </label>
                    <input
                      type="text"
                      value={formData.saksi1}
                      onChange={(e) =>
                        setFormData({ ...formData, saksi1: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Saksi II
                    </label>
                    <input
                      type="text"
                      value={formData.saksi2}
                      onChange={(e) =>
                        setFormData({ ...formData, saksi2: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Daftar calon ketua RT yang akan tampil di papan turus
                </span>
                <button
                  onClick={handleAddCandidate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Calon</span>
                </button>
              </div>

              <div className="space-y-3">
                {candidateList.map((cand, index) => (
                  <div
                    key={cand.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        Calon #{index + 1}
                      </span>
                      {candidateList.length > 1 && (
                        <button
                          onClick={() => handleDeleteCandidate(cand.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          No. Urut
                        </label>
                        <input
                          type="text"
                          value={cand.number}
                          onChange={(e) =>
                            handleUpdateCandidate(cand.id, {
                              number: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-sm font-mono font-bold text-center border rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nama Lengkap Calon
                        </label>
                        <input
                          type="text"
                          value={cand.name}
                          onChange={(e) =>
                            handleUpdateCandidate(cand.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-sm border rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Slogan / Visi Singkat
                        </label>
                        <input
                          type="text"
                          value={cand.tagline}
                          onChange={(e) =>
                            handleUpdateCandidate(cand.id, {
                              tagline: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-sm border rounded-lg border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Export / Import */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Cadangkan & Pulihkan Data
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Simpan hasil pemungutan suara dalam bentuk file JSON sebagai arsip panitia atau pindahkan ke laptop lain.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={onExportData}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Cadangan (JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Pulihkan dari File JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      onLoadSampleData();
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Muat Contoh Suara Demo</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Reset */}
              <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-rose-900 mb-1">
                      Reset Seluruh Perhitungan Suara
                    </h4>
                    <p className="text-xs text-rose-700 mb-3">
                      Tindakan ini akan mengosongkan seluruh turus dan riwayat suara kembali ke nol (0).
                    </p>

                    {!confirmReset ? (
                      <button
                        onClick={() => setConfirmReset(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                      >
                        Reset Data Suara
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onResetVotes();
                            setConfirmReset(false);
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-700 text-white hover:bg-rose-800"
                        >
                          Ya, Yakin Kosongkan Semua
                        </button>
                        <button
                          onClick={() => setConfirmReset(false)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            Batal
          </button>
          <button
            onClick={handleSaveInfo}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};
