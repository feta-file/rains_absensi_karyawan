import React from 'react';
import { WorkProofFile } from '../types/attendance';
import { X, FileText, Download, CheckCircle, Calendar, HardDrive, Eye } from 'lucide-react';

interface PdfViewerModalProps {
  file: WorkProofFile | null;
  employeeName?: string;
  division?: string;
  dateStr?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  file,
  employeeName = 'Karyawan',
  division = 'Divisi',
  dateStr = '15 Oktober 2026',
  onClose,
}) => {
  if (!file) return null;

  const fileSizeKb = Math.round(file.size / 1024);

  const handleDownload = () => {
    // Generate text or data blob for mock download
    const content = `=== LAPORAN HASIL PEKERJAAN (PDF SIMULASI) ===\nNama: ${employeeName}\nDivisi: ${division}\nTanggal: ${dateStr}\nFile: ${file.name}\nUkuran: ${fileSizeKb} KB\nRingkasan: ${file.summary || 'Laporan pekerjaan harian telah diverifikasi sistem'}\nStatus: Terverifikasi oleh AbsenKu HR`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'Laporan_Hasil_Kerja.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-[220px] sm:max-w-md">
                  {file.name}
                </h3>
                <span className="text-[11px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{employeeName}</span> • <span>{division}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-100/50">
          
          {/* Metadata banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-slate-400 text-[10px]">Tanggal Upload</p>
                <p className="font-medium text-slate-700">{file.uploadedAt || '08:15 WIB'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-slate-400 text-[10px]">Ukuran File</p>
                <p className="font-medium text-slate-700">{fileSizeKb} KB</p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-slate-400 text-[10px]">Validasi Sistem</p>
                <p className="font-medium text-emerald-600">Dokumen Sah</p>
              </div>
            </div>
          </div>

          {/* PDF Visual Document Sheet Preview */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-8 min-h-[340px] text-slate-800 space-y-5 font-sans relative">
            <div className="border-b-2 border-blue-600 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  PT NUSANTARA DIGITAL INDONESIA
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  LAPORAN PROGRES HASIL KERJA HARIAN
                </h4>
                <p className="text-xs text-slate-500">
                  Sistem Informasi Absensi & Akuntabilitas Kinerja Pegawai
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400">Nama Karyawan:</span>
                <p className="font-semibold text-slate-800">{employeeName}</p>
              </div>
              <div>
                <span className="text-slate-400">Divisi / Unit:</span>
                <p className="font-semibold text-slate-800">{division}</p>
              </div>
              <div>
                <span className="text-slate-400">Tanggal Pengesahan:</span>
                <p className="font-semibold text-slate-800">{dateStr}</p>
              </div>
              <div>
                <span className="text-slate-400">Nama Dokumen:</span>
                <p className="font-mono text-[11px] text-blue-700 font-medium truncate">{file.name}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                Ringkasan Output & Deliverables:
              </h5>
              <div className="p-3.5 bg-blue-50/40 rounded-lg border border-blue-100 text-slate-700 leading-relaxed font-sans">
                {file.summary || (
                  <span>
                    Telah menyelesaikan pekerjaan operasional harian sesuai target sprint. Meliputi sinkronisasi tugas tim, dokumentasi perubahan kode & konfigurasi teknis, serta pengujian berkas akhir yang siap ditinjau oleh pimpinan divisi.
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-400">
              <div>
                <p>Digital Signature ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}-HR-2026</p>
                <p>Status: Diserahkan otomatis via AbsenKu Mobile</p>
              </div>
              <div className="text-right font-mono text-[9px] text-slate-400">
                Halaman 1 dari 1 (Dokumen Sah)
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Format: Dokumen Portable Document Format (.pdf)
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
