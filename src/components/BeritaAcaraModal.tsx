import React, { useState } from 'react';
import { Candidate, ElectionConfig } from '../types';
import { Printer, Copy, Check, X } from 'lucide-react';

interface BeritaAcaraModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ElectionConfig;
  candidates: Candidate[];
  voteCounts: Record<string, number>;
  invalidVotesCount: number;
}

// Indonesian number to words helper for official legal documents
function terbilang(n: number): string {
  const bilangan = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
  ];
  if (n < 12) return bilangan[n];
  if (n < 20) return terbilang(n - 10) + ' belas';
  if (n < 100) return terbilang(Math.floor(n / 10)) + ' puluh ' + terbilang(n % 10);
  if (n < 200) return 'seratus ' + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + ' ratus ' + terbilang(n % 100);
  return n.toString();
}

export const BeritaAcaraModal: React.FC<BeritaAcaraModalProps> = ({
  isOpen,
  onClose,
  config,
  candidates,
  voteCounts,
  invalidVotesCount,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalValidVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const totalVotesCast = totalValidVotes + invalidVotesCount;

  // Determine winner
  const sortedCandidates = [...candidates].sort(
    (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
  );
  const winner = sortedCandidates[0];
  const winnerVotes = voteCounts[winner?.id] || 0;
  const isTie = sortedCandidates.length > 1 && winnerVotes > 0 && winnerVotes === (voteCounts[sortedCandidates[1]?.id] || 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `*BERITA ACARA PEMILIHAN KETUA ${config.rtNumber}/${config.rwNumber}*
${config.kelurahan}, ${config.kecamatan}, ${config.city}
Tanggal: ${config.date}

*DATA PEMILIHAN:*
• Daftar Pemilih Tetap (DPT): ${config.dptTotal} orang
• Total Surat Suara Masuk: ${totalVotesCast} suara (${config.dptTotal > 0 ? ((totalVotesCast / config.dptTotal) * 100).toFixed(1) : 0}%)
• Suara Sah: ${totalValidVotes} suara
• Suara Tidak Sah: ${invalidVotesCount} suara

*HASIL PEROLEHAN SUARA:*
${candidates
  .map(
    (c) =>
      `• No. ${c.number} ${c.name}: ${voteCounts[c.id] || 0} suara (${
        totalValidVotes > 0
          ? (((voteCounts[c.id] || 0) / totalValidVotes) * 100).toFixed(1)
          : 0
      }%)`
  )
  .join('\n')}

*CALON TERPILIH:*
${
  isTie
    ? 'Hasil imbang / seri, memerlukan musyawarah mufakat atau putaran kedua sesuai tata tertib.'
    : `Ketua ${config.rtNumber} Terpilih: *No. ${winner?.number} ${winner?.name}* dengan perolehan ${winnerVotes} suara.`
}

Ketua Panitia: ${config.ketuaPanitia}
Sekretaris: ${config.sekretarisPanitia}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Dokumen Berita Acara Resmi
            </h2>
            <p className="text-xs text-slate-500">
              Format standar pemilihan ketua RT, siap cetak fisik atau salin ke grup warga
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin untuk WA Warga</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-8 sm:p-12 font-serif text-slate-900 print:p-0 leading-relaxed max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* KOP SURAT */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <h3 className="text-sm uppercase tracking-widest font-sans font-semibold text-slate-600">
              PANITIA PEMILIHAN KETUA RUKUN TETANGGA
            </h3>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-sans mt-0.5">
              {config.rtNumber} / {config.rwNumber}
            </h1>
            <p className="text-sm font-sans text-slate-600">
              {config.kelurahan}, {config.kecamatan}, {config.city}, {config.province}
            </p>
          </div>

          {/* JUDUL BERITA ACARA */}
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold underline uppercase tracking-wider font-sans">
              BERITA ACARA
            </h2>
            <p className="text-sm font-sans text-slate-700">
              PEMUNGUTAN DAN PENGHITUNGAN SUARA PEMILIHAN KETUA {config.rtNumber} PERIODE {config.period}
            </p>
          </div>

          {/* PEMBUKA */}
          <p className="text-sm text-justify mb-4">
            Pada hari ini, tanggal <strong>{config.date}</strong>, telah diselenggarakan rapat pemungutan dan penghitungan suara dalam rangka Pemilihan Calon Ketua {config.rtNumber} / {config.rwNumber}, {config.kelurahan}, {config.kecamatan}, {config.city} untuk masa bakti periode {config.period}.
          </p>

          {/* DATA PEMILIH & SURAT SUARA */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans uppercase mb-2">
              I. DATA PEMILIH DAN PENGGUNAAN SURAT SUARA
            </h4>
            <div className="border border-slate-300 text-sm">
              <div className="grid grid-cols-2 p-2 border-b border-slate-200">
                <span>1. Jumlah Daftar Pemilih Tetap (DPT)</span>
                <span className="font-mono text-right font-semibold">
                  {config.dptTotal} orang
                </span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200">
                <span>2. Total Surat Suara Masuk (Digunakan)</span>
                <span className="font-mono text-right font-semibold">
                  {totalVotesCast} lembar
                </span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200 pl-6">
                <span>a. Surat Suara Sah</span>
                <span className="font-mono text-right font-semibold">
                  {totalValidVotes} lembar
                </span>
              </div>
              <div className="grid grid-cols-2 p-2 border-b border-slate-200 pl-6">
                <span>b. Surat Suara Tidak Sah / Rusak</span>
                <span className="font-mono text-right font-semibold">
                  {invalidVotesCount} lembar
                </span>
              </div>
              <div className="grid grid-cols-2 p-2 bg-slate-50">
                <span>3. Sisa Surat Suara / Tidak Hadir (Golput)</span>
                <span className="font-mono text-right font-semibold">
                  {Math.max(0, config.dptTotal - totalVotesCast)} lembar
                </span>
              </div>
            </div>
          </div>

          {/* HASIL PEROLEHAN SUARA */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans uppercase mb-2">
              II. HASIL PEROLEHAN SUARA CALON KETUA RT
            </h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-left font-sans">
                  <th className="border border-slate-300 p-2 text-center w-16">No. Urut</th>
                  <th className="border border-slate-300 p-2">Nama Calon</th>
                  <th className="border border-slate-300 p-2 text-center w-28">Perolehan Suara</th>
                  <th className="border border-slate-300 p-2">Terbilang</th>
                  <th className="border border-slate-300 p-2 text-right w-20">% Sah</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => {
                  const votes = voteCounts[c.id] || 0;
                  const pct =
                    totalValidVotes > 0
                      ? ((votes / totalValidVotes) * 100).toFixed(1)
                      : '0.0';
                  return (
                    <tr key={c.id}>
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold">
                        {c.number}
                      </td>
                      <td className="border border-slate-300 p-2 font-medium">
                        {c.name}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold">
                        {votes}
                      </td>
                      <td className="border border-slate-300 p-2 text-xs italic capitalize">
                        {votes > 0 ? terbilang(votes) + ' suara' : 'Nol suara'}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* KEPUTUSAN PENETAPAN */}
          <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded-sm">
            <h4 className="text-sm font-bold font-sans uppercase mb-1">
              III. PENETAPAN HASIL AKHIR
            </h4>
            <p className="text-sm">
              Berdasarkan hasil penghitungan suara yang sah di hadapan saksi dan warga, maka ditetapkan:
            </p>
            {isTie ? (
              <p className="text-sm font-semibold text-amber-700 mt-2">
                HASIL SERI / IMBANG: Perolehan suara tertinggi sama. Penyelesaian dilakukan melalui musyawarah mufakat atau pemilihan ulang sesuai kesepakatan tata tertib panitia.
              </p>
            ) : winnerVotes > 0 ? (
              <p className="text-base font-bold text-slate-900 mt-2">
                Ketua {config.rtNumber} Terpilih Periode {config.period} adalah Saudara/Bapak/Ibu:
                <br />
                <span className="text-lg underline uppercase">
                  {winner.name} (Nomor Urut {winner.number})
                </span>{' '}
                dengan perolehan sebanyak {winnerVotes} ({terbilang(winnerVotes)}) suara sah.
              </p>
            ) : (
              <p className="text-sm italic text-slate-500 mt-1">
                Penghitungan suara masih berlangsung / belum ada suara masuk.
              </p>
            )}
          </div>

          {/* LEMBAR TANDA TANGAN */}
          <div className="mt-8 pt-4">
            <p className="text-sm text-right mb-6">
              {config.city}, {config.date}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
              <div>
                <p className="font-semibold mb-16">Ketua Panitia,</p>
                <p className="font-bold underline uppercase">{config.ketuaPanitia}</p>
              </div>
              <div>
                <p className="font-semibold mb-16">Sekretaris Panitia,</p>
                <p className="font-bold underline uppercase">{config.sekretarisPanitia}</p>
              </div>
              <div>
                <p className="font-semibold mb-16">Saksi I,</p>
                <p className="font-bold underline uppercase">{config.saksi1}</p>
              </div>
              <div>
                <p className="font-semibold mb-16">Saksi II,</p>
                <p className="font-bold underline uppercase">{config.saksi2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
