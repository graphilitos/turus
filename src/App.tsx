/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Candidate, ElectionConfig, VoteRecord, BoardTheme } from './types';
import { TopHeader } from './components/TopHeader';
import { StatsBar } from './components/StatsBar';
import { CandidateRow } from './components/CandidateRow';
import { InvalidVotesLane } from './components/InvalidVotesLane';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { BeritaAcaraModal } from './components/BeritaAcaraModal';
import { VoteHistoryModal } from './components/VoteHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import {
  playStrokeSound,
  playBundleCompleteSound,
  playInvalidVoteSound,
  playUndoSound,
} from './utils/audio';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_VOTES = 'rt_election_vote_records_v1';
const STORAGE_KEY_CONFIG = 'rt_election_config_v1';
const STORAGE_KEY_CANDIDATES = 'rt_election_candidates_v1';
const STORAGE_KEY_THEME = 'rt_election_theme_v1';
const STORAGE_KEY_SOUND = 'rt_election_sound_v1';

const DEFAULT_CONFIG: ElectionConfig = {
  rtNumber: 'RT 05',
  rwNumber: 'RW 08',
  kelurahan: 'Kelurahan Kebon Jeruk',
  kecamatan: 'Kecamatan Kebon Jeruk',
  city: 'Kota Jakarta Barat',
  province: 'DKI Jakarta',
  period: '2026 - 2031',
  date: '29 Oktober 2026',
  dptTotal: 150,
  ballotsReceived: 160,
  ketuaPanitia: 'Hendra Wijaya, S.T.',
  sekretarisPanitia: 'Anisa Putri, S.Pd.',
  saksi1: 'Ahmad Fauzi',
  saksi2: 'Supriyadi',
};

const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    number: '01',
    name: 'Bpk. Budi Santoso',
    tagline: 'Visi: Guyub Rukun, Bersih, dan Lingkungan Aman',
    avatarUrl: '/src/assets/images/candidate_budi_avatar_1793242288902.jpg',
    colorScheme: 'blue',
  },
  {
    id: 'cand-02',
    number: '02',
    name: 'Ibu Sri Wahyuni',
    tagline: 'Visi: Pemberdayaan Warga, Posyandu Aktif & Digitalisasi RT',
    avatarUrl: '/src/assets/images/candidate_sri_avatar_1793242289550.jpg',
    colorScheme: 'emerald',
  },
  {
    id: 'cand-03',
    number: '03',
    name: 'Bpk. H. Bambang Irawan',
    tagline: 'Visi: Transparansi Iuran Kas & Pembangunan Fasilitas Pos Ronda',
    avatarUrl: '/src/assets/images/candidate_bambang_avatar_1793242290006.jpg',
    colorScheme: 'amber',
  },
];

export default function App() {
  // Theme & audio settings
  const [theme, setTheme] = useState<BoardTheme>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as BoardTheme) || 'whiteboard';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Config and Candidates
  const [config, setConfig] = useState<ElectionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CANDIDATES);
      return saved ? JSON.parse(saved) : DEFAULT_CANDIDATES;
    } catch {
      return DEFAULT_CANDIDATES;
    }
  });

  // Historical audit log of every vote record
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & View state
  const [activeTab, setActiveTab] = useState<'tally' | 'berita-acara' | 'history' | 'settings'>('tally');
  const [isBeritaAcaraOpen, setIsBeritaAcaraOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(voteHistory));
  }, [voteHistory]);

  // Derived vote counts from history (single source of truth prevents drift)
  const { voteCounts, invalidVotesCount, totalValidVotes, totalVotesCast } = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
      counts[c.id] = 0;
    });

    let invalid = 0;
    voteHistory.forEach((record) => {
      if (record.type === 'CANDIDATE' && record.candidateId) {
        counts[record.candidateId] = (counts[record.candidateId] || 0) + 1;
      } else if (record.type === 'INVALID') {
        invalid += 1;
      }
    });

    const validTotal = Object.values(counts).reduce((a, b) => a + b, 0);

    return {
      voteCounts: counts,
      invalidVotesCount: invalid,
      totalValidVotes: validTotal,
      totalVotesCast: validTotal + invalid,
    };
  }, [voteHistory, candidates]);

  // Find candidate with max votes
  const leadingCandidateId = useMemo(() => {
    let max = 0;
    let leadId = '';
    let isTied = false;

    candidates.forEach((c) => {
      const v = voteCounts[c.id] || 0;
      if (v > max) {
        max = v;
        leadId = c.id;
        isTied = false;
      } else if (v === max && max > 0) {
        isTied = true;
      }
    });

    return isTied ? '' : leadId;
  }, [voteCounts, candidates]);

  // Add votes handler
  const handleAddVote = useCallback(
    (candidateId: string, amount: number = 1) => {
      const cand = candidates.find((c) => c.id === candidateId);
      if (!cand) return;

      const newRecords: VoteRecord[] = [];
      const now = new Date().toISOString();
      const startSeq = voteHistory.length + 1;

      for (let i = 0; i < amount; i++) {
        newRecords.unshift({
          id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}-${i}`,
          type: 'CANDIDATE',
          candidateId: cand.id,
          candidateNumber: cand.number,
          candidateName: cand.name,
          timestamp: now,
          seqNumber: startSeq + i,
        });
      }

      setVoteHistory((prev) => [...newRecords, ...prev]);

      if (soundEnabled) {
        const nextTotal = (voteCounts[cand.id] || 0) + amount;
        if (nextTotal % 5 === 0) {
          playBundleCompleteSound();
        } else {
          playStrokeSound();
        }
      }
    },
    [candidates, voteHistory.length, soundEnabled, voteCounts]
  );

  // Subtract vote handler (correction)
  const handleSubtractVote = useCallback(
    (candidateId: string) => {
      // Find the latest vote record for this candidate
      const targetIndex = voteHistory.findIndex(
        (r) => r.type === 'CANDIDATE' && r.candidateId === candidateId
      );
      if (targetIndex === -1) return;

      const newHistory = [...voteHistory];
      newHistory.splice(targetIndex, 1);
      setVoteHistory(newHistory);

      if (soundEnabled) {
        playUndoSound();
      }
    },
    [voteHistory, soundEnabled]
  );

  // Invalid vote handler
  const handleAddInvalidVote = useCallback(() => {
    const newRecord: VoteRecord = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'INVALID',
      timestamp: new Date().toISOString(),
      seqNumber: voteHistory.length + 1,
      note: 'Surat suara tidak sah / rusak',
    };

    setVoteHistory((prev) => [newRecord, ...prev]);

    if (soundEnabled) {
      playInvalidVoteSound();
    }
  }, [voteHistory.length, soundEnabled]);

  const handleSubtractInvalidVote = useCallback(() => {
    const targetIndex = voteHistory.findIndex((r) => r.type === 'INVALID');
    if (targetIndex === -1) return;

    const newHistory = [...voteHistory];
    newHistory.splice(targetIndex, 1);
    setVoteHistory(newHistory);

    if (soundEnabled) {
      playUndoSound();
    }
  }, [voteHistory, soundEnabled]);

  // Undo last recorded vote
  const handleUndoLastVote = useCallback(() => {
    if (voteHistory.length === 0) return;
    setVoteHistory((prev) => prev.slice(1));
    if (soundEnabled) {
      playUndoSound();
    }
  }, [voteHistory.length, soundEnabled]);

  // Undo specific record
  const handleUndoSpecificVote = useCallback(
    (recordId: string) => {
      setVoteHistory((prev) => prev.filter((r) => r.id !== recordId));
      if (soundEnabled) {
        playUndoSound();
      }
    },
    [soundEnabled]
  );

  // Reset votes
  const handleResetVotes = useCallback(() => {
    setVoteHistory([]);
  }, []);

  // Load sample simulation data
  const handleLoadSampleData = useCallback(() => {
    const sampleVotes: VoteRecord[] = [];
    let seq = 1;

    // Distribute realistic test votes: e.g. 18 for cand 1, 23 for cand 2, 14 for cand 3, 3 invalid
    const dist = [
      { cand: candidates[0], count: 18 },
      { cand: candidates[1], count: 23 },
      { cand: candidates[2], count: 14 },
    ];

    dist.forEach(({ cand, count }) => {
      if (!cand) return;
      for (let i = 0; i < count; i++) {
        sampleVotes.push({
          id: `sample-${seq}`,
          type: 'CANDIDATE',
          candidateId: cand.id,
          candidateNumber: cand.number,
          candidateName: cand.name,
          timestamp: new Date(Date.now() - (60 - seq) * 45000).toISOString(),
          seqNumber: seq++,
        });
      }
    });

    for (let i = 0; i < 3; i++) {
      sampleVotes.push({
        id: `sample-${seq}`,
        type: 'INVALID',
        timestamp: new Date().toISOString(),
        seqNumber: seq++,
      });
    }

    // Shuffle sample sequence slightly for realistic chronological order
    sampleVotes.sort(() => Math.random() - 0.5);
    sampleVotes.forEach((v, idx) => {
      v.seqNumber = sampleVotes.length - idx;
    });

    setVoteHistory(sampleVotes);
  }, [candidates]);

  // Export JSON
  const handleExportData = useCallback(() => {
    const data = {
      config,
      candidates,
      voteHistory,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Papan_Turus_${config.rtNumber.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config, candidates, voteHistory]);

  // Import JSON
  const handleImportData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.config) setConfig(data.config);
      if (data.candidates) setCandidates(data.candidates);
      if (data.voteHistory) setVoteHistory(data.voteHistory);
      alert('Data pemilihan berhasil dipulihkan!');
    } catch {
      alert('Format file JSON tidak valid.');
    }
  }, []);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when user is in input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo shortcut: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndoLastVote();
        return;
      }

      // Sound shortcut: M
      if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
        return;
      }

      // Fullscreen shortcut: F
      if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
        return;
      }

      // Invalid vote: 0
      if (e.key === '0') {
        e.preventDefault();
        handleAddInvalidVote();
        return;
      }

      // Candidates 1..9
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= candidates.length) {
        e.preventDefault();
        const cand = candidates[num - 1];
        if (cand) {
          handleAddVote(cand.id, 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidates, handleAddVote, handleAddInvalidVote, handleUndoLastVote]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'chalkboard'
          ? 'bg-[#101c15] text-slate-100'
          : theme === 'whiteboard'
          ? 'bg-slate-100/90 text-slate-900'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <TopHeader
        config={config}
        theme={theme}
        onChangeTheme={setTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenBeritaAcara={() => setIsBeritaAcaraOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWinner={() => setIsWinnerOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Title & Balai Warga context strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Papan Penghitungan Suara Digital
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 font-medium">
                Sistem Turus Ikat 5 (|||| <s>||||</s>)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              Pemilihan Calon Ketua {config.rtNumber} / {config.rwNumber}
            </h1>
          </div>

          {/* Quick Undo Last Vote Floating Action */}
          {voteHistory.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleUndoLastVote}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  theme === 'chalkboard'
                    ? 'border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                }`}
                title="Batalkan surat suara yang baru saja dihitung (Ctrl+Z)"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Batalkan Suara Terakhir (#{voteHistory[0]?.seqNumber})</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-Time Election Statistics Strip */}
        <StatsBar
          totalVotesCast={totalVotesCast}
          totalValidVotes={totalValidVotes}
          invalidVotesCount={invalidVotesCount}
          config={config}
          theme={theme}
        />

        {/* Keyboard Shortcut Banner */}
        <KeyboardShortcutsHelp candidates={candidates} theme={theme} />

        {/* Physical Board Frame Container */}
        <div
          className={`rounded-2xl transition-all duration-300 p-4 sm:p-6 shadow-xl ${
            theme === 'chalkboard'
              ? 'bg-[#15241c] border-4 border-[#2c3e34] ring-1 ring-slate-800'
              : theme === 'whiteboard'
              ? 'bg-slate-200/60 border-4 border-slate-300 ring-1 ring-slate-300'
              : 'bg-white border border-slate-200'
          }`}
        >
          {/* Board Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-300/40 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold tracking-tight uppercase">
                Papan Rekapitulasi Turus Terbuka
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {totalVotesCast === 0
                ? 'Menunggu surat suara pertama dibuka'
                : `${totalVotesCast} surat suara telah dihitung`}
            </div>
          </div>

          {/* Candidate Voting Rows / Lanes */}
          <div className="space-y-4">
            {candidates.map((cand, index) => (
              <CandidateRow
                key={cand.id}
                candidate={cand}
                count={voteCounts[cand.id] || 0}
                totalValidVotes={totalValidVotes}
                isLeading={leadingCandidateId === cand.id}
                theme={theme}
                shortcutKey={(index + 1).toString()}
                onAddVote={(id, amt) => handleAddVote(id, amt)}
                onSubtractVote={(id) => handleSubtractVote(id)}
              />
            ))}

            {/* Suara Tidak Sah / Rusak Lane */}
            <InvalidVotesLane
              count={invalidVotesCount}
              totalVotesCast={totalVotesCast}
              theme={theme}
              onAddVote={handleAddInvalidVote}
              onSubtractVote={handleSubtractInvalidVote}
            />
          </div>
        </div>

        {/* Warning if votes exceed DPT */}
        {totalVotesCast > config.dptTotal && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Perhatian Panitia: </span>
              Jumlah surat suara masuk ({totalVotesCast}) telah melebihi kuota Daftar Pemilih Tetap ({config.dptTotal} DPT). Mohon periksa kembali kesesuaian daftar hadir pemilih dengan kotak suara.
            </div>
          </div>
        )}
      </main>

      {/* Official Berita Acara Modal */}
      <BeritaAcaraModal
        isOpen={isBeritaAcaraOpen}
        onClose={() => setIsBeritaAcaraOpen(false)}
        config={config}
        candidates={candidates}
        voteCounts={voteCounts}
        invalidVotesCount={invalidVotesCount}
      />

      {/* Vote Audit History Modal */}
      <VoteHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={voteHistory}
        onUndoLastVote={handleUndoLastVote}
        onUndoSpecificVote={handleUndoSpecificVote}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        candidates={candidates}
        onUpdateCandidates={setCandidates}
        onResetVotes={handleResetVotes}
        onLoadSampleData={handleLoadSampleData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Winner Celebration Modal */}
      <WinnerCelebrationModal
        isOpen={isWinnerOpen}
        onClose={() => setIsWinnerOpen(false)}
        candidates={candidates}
        voteCounts={voteCounts}
        invalidVotesCount={invalidVotesCount}
        config={config}
        onOpenBeritaAcara={() => setIsBeritaAcaraOpen(true)}
      />
    </div>
  );
}
