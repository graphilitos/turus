export interface Candidate {
  id: string;
  number: string; // e.g. "01", "02", "03"
  name: string;
  tagline: string;
  avatarUrl: string;
  colorScheme: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
}

export interface VoteRecord {
  id: string;
  type: 'CANDIDATE' | 'INVALID';
  candidateId?: string;
  candidateNumber?: string;
  candidateName?: string;
  timestamp: string; // ISO string
  seqNumber: number; // sequential ballot #, e.g. 1, 2, 3...
  note?: string;
}

export interface ElectionConfig {
  rtNumber: string; // e.g. "RT 04"
  rwNumber: string; // e.g. "RW 07"
  kelurahan: string; // e.g. "Kelurahan Sukamaju"
  kecamatan: string; // e.g. "Kecamatan Pancoran"
  city: string; // e.g. "Jakarta Selatan"
  province: string; // e.g. "DKI Jakarta"
  period: string; // e.g. "2026 - 2031"
  date: string; // e.g. "29 Oktober 2026"
  dptTotal: number; // Total Daftar Pemilih Tetap
  ballotsReceived: number; // Total surat suara diterima (disediakan)
  ketuaPanitia: string;
  sekretarisPanitia: string;
  saksi1: string;
  saksi2: string;
}

export type BoardTheme = 'whiteboard' | 'chalkboard' | 'clean';
