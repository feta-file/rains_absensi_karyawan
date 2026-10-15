import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, WorkLocation, WorkProofFile } from '../types/attendance';
import { formatIndonesianDate } from '../utils/dateUtils';
import { 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Clock, 
  MapPin, 
  Building2, 
  UserCheck, 
  Sparkles,
  Laptop,
  Briefcase,
  ChevronDown,
  Info,
  Calendar,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmployeeCheckInProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  currentEmail: string;
  onEmailChange: (email: string) => void;
  onSubmitAttendance: (newRecord: AttendanceRecord) => void;
  onViewPdf: (file: WorkProofFile, empName: string, division: string, dateStr: string) => void;
}

export const EmployeeCheckIn: React.FC<EmployeeCheckInProps> = ({
  employees,
  attendanceRecords,
  currentEmail,
  onEmailChange,
  onSubmitAttendance,
  onViewPdf,
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus>('hadir');
  const [workLocation, setWorkLocation] = useState<WorkLocation>('wfo');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<WorkProofFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Today's date in Indonesian
  const todayDateStr = '2026-10-15';
  const todayFormatted = formatIndonesianDate(todayDateStr);

  // Background matching with email authenticator
  const matchedEmployee = useMemo(() => {
    const trimmed = emailInput.trim().toLowerCase();
    return employees.find((e) => e.email.toLowerCase() === trimmed) || null;
  }, [employees, emailInput]);

  // Sync email input if parent changes
  useEffect(() => {
    setEmailInput(currentEmail);
  }, [currentEmail]);

  // Check if this employee already checked in today
  const todayRecord = useMemo(() => {
    if (!matchedEmployee) return null;
    return attendanceRecords.find(
      (r) => r.employeeId === matchedEmployee.id && r.date === todayDateStr
    ) || null;
  }, [attendanceRecords, matchedEmployee, todayDateStr]);

  // When matched employee changes, load default notes or status
  useEffect(() => {
    if (todayRecord) {
      setStatus(todayRecord.status);
      if (todayRecord.workLocation) setWorkLocation(todayRecord.workLocation);
      setNotes(todayRecord.notes || '');
      setUploadedFile(todayRecord.workProofFile || null);
    } else {
      // Default clean form
      setStatus('hadir');
      setWorkLocation('wfo');
      setNotes('');
      setUploadedFile(null);
    }
    setSuccessMessage(null);
    setErrorMessage(null);
  }, [todayRecord, matchedEmployee]);

  const handleSelectEmail = (emp: Employee) => {
    setEmailInput(emp.email);
    onEmailChange(emp.email);
    setShowEmailDropdown(false);
  };

  // Handle PDF file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Harap unggah berkas dengan format PDF (.pdf). Format lain tidak didukung.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal adalah 15 MB.');
      return;
    }

    setErrorMessage(null);
    const mockFile: WorkProofFile = {
      name: file.name,
      size: file.size,
      type: 'application/pdf',
      uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      summary: `Berkas hasil kerja harian diunggah oleh ${matchedEmployee?.name || 'Karyawan'}`
    };
    setUploadedFile(mockFile);
  };

  // Quick sample file generator for testing convenience
  const handleGenerateSamplePdf = () => {
    const empName = matchedEmployee ? matchedEmployee.name.replace(/\s+/g, '_') : 'Karyawan';
    const fileName = status === 'sakit' 
      ? `Surat_Keterangan_Sakit_${empName}.pdf` 
      : `Laporan_Hasil_Pekerjaan_${empName}_15Okt.pdf`;

    setUploadedFile({
      name: fileName,
      size: 485 * 1024,
      type: 'application/pdf',
      uploadedAt: '08:25 WIB',
      summary: status === 'sakit' 
        ? 'Surat Istirahat Medis dari Klinik Pratama Sehat'
        : `Dokumentasi penyelesaian deliverables harian & checklist tugas divisi ${matchedEmployee?.division || 'Divisi'}`
    });
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!matchedEmployee) {
      setErrorMessage('Autentikasi gagal: Email tidak terdaftar dalam database karyawan perusahaan.');
      return;
    }

    if (status === 'hadir' && !notes.trim()) {
      setErrorMessage('Mohon tuliskan ringkasan hasil pekerjaan harian Anda.');
      return;
    }

    if (status === 'hadir' && !uploadedFile) {
      setErrorMessage('Wajib mengunggah file hasil pekerjaan dalam format PDF.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newRecord: AttendanceRecord = {
        id: todayRecord ? todayRecord.id : `rec-${Date.now()}`,
        employeeId: matchedEmployee.id,
        employeeEmail: matchedEmployee.email,
        employeeName: matchedEmployee.name,
        division: matchedEmployee.division,
        date: todayDateStr,
        time: todayRecord?.time || timeStr,
        status: status,
        workLocation: status === 'hadir' ? workLocation : undefined,
        notes: notes.trim(),
        workProofFile: uploadedFile || undefined,
        checkInLocation: workLocation === 'wfo' ? 'Kantor Pusat Jakarta' : 'Remote / WFH'
      };

      onSubmitAttendance(newRecord);
      setIsSubmitting(false);
      setSuccessMessage('Absensi dan laporan hasil kerja berhasil disimpan!');

      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      
      {/* Employee Today's Status Header Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-blue-100" />
              {todayFormatted}
            </span>
          </div>
          <span className="text-xs font-mono bg-black/25 px-2.5 py-1 rounded-lg">
            08:45 WIB
          </span>
        </div>

        <h2 className="text-xl font-extrabold tracking-tight">
          Form Absensi Online Karyawan
        </h2>
        <p className="text-xs text-blue-100 mt-0.5">
          Verifikasi identitas otomatis via email & upload bukti hasil kerja (PDF)
        </p>

        {/* Status banner if already checked in */}
        {todayRecord && (
          <div className="mt-4 p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-300 flex items-center justify-center text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Sudah Absen Hari Ini: <span className="uppercase text-emerald-300 font-extrabold">{todayRecord.status}</span>
                </p>
                <p className="text-[11px] text-blue-100">
                  Waktu: {todayRecord.time} • {todayRecord.workLocation?.toUpperCase() || 'Standby'}
                </p>
              </div>
            </div>
            {todayRecord.workProofFile && (
              <button
                type="button"
                onClick={() => onViewPdf(todayRecord.workProofFile!, todayRecord.employeeName, todayRecord.division, todayRecord.date)}
                className="text-xs bg-white text-blue-700 px-3 py-1.5 rounded-xl font-bold shadow-xs hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat PDF</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Check-In Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        
        {/* Email Authenticator Input (Halaman Belakang Matching) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Email Perusahaan (Authenticator)</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Verifikasi Otomatis</span>
          </div>

          <div className="relative">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                onEmailChange(e.target.value);
              }}
              onFocus={() => setShowEmailDropdown(true)}
              placeholder="contoh: budi.santoso@perusahaan.com"
              required
              className={`w-full px-4 py-3 rounded-2xl text-sm border font-medium transition-all outline-none ${
                matchedEmployee 
                  ? 'border-emerald-400 bg-emerald-50/20 text-slate-800 focus:ring-2 focus:ring-emerald-400/30' 
                  : emailInput.length > 3 
                    ? 'border-amber-400 bg-amber-50/20 text-slate-800' 
                    : 'border-slate-300 bg-slate-50/60 focus:border-blue-500 focus:bg-white'
              }`}
            />
            
            <button
              type="button"
              onClick={() => setShowEmailDropdown(!showEmailDropdown)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Pilih dari daftar karyawan"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Quick Email Selection Dropdown */}
            {showEmailDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto p-1.5 divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Daftar Karyawan Terdaftar (Klik untuk Ganti):
                </div>
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleSelectEmail(emp)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-xl flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{emp.name}</p>
                      <p className="text-slate-500 text-[11px]">{emp.email}</p>
                    </div>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {emp.division}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Result Card (Matched from background employee DB) */}
          {matchedEmployee ? (
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <img
                  src={matchedEmployee.avatar}
                  alt={matchedEmployee.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-slate-900">{matchedEmployee.name}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.2 rounded-md">
                      {matchedEmployee.division}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{matchedEmployee.role}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                Terverifikasi
              </span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Email Belum Terverifikasi</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Ketik email terdaftar atau pilih dari tombol dropdown panah di atas untuk mencocokkan Nama & Divisi otomatis.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Kehadiran Radio Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-700 block">
            Status Kehadiran Hari Ini:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hadir', label: 'Hadir Bekerja', icon: UserCheck, color: 'emerald' },
              { id: 'izin', label: 'Izin', icon: Clock, color: 'amber' },
              { id: 'sakit', label: 'Sakit', icon: AlertCircle, color: 'rose' },
              { id: 'cuti', label: 'Cuti Tahunan', icon: Briefcase, color: 'sky' },
              { id: 'off', label: 'Off / Libur', icon: Building2, color: 'slate' },
            ].map((item) => {
              const isSelected = status === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id as AttendanceStatus)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-18 active:scale-95 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <item.icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Work Location (if Hadir) */}
        {status === 'hadir' && (
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Lokasi Kerja:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWorkLocation('wfo')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  workLocation === 'wfo'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>WFO (Kantor Pusat)</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkLocation('wfh')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  workLocation === 'wfh'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>WFH (Remote)</span>
              </button>
            </div>
          </div>
        )}

        {/* Ringkasan Hasil Pekerjaan / Catatan Alasan */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              {status === 'hadir' ? 'Ringkasan Pekerjaan Hari Ini' : 'Alasan / Keterangan Tidak Masuk'}
            </label>
            <span className="text-[11px] text-slate-400">
              {status === 'hadir' ? 'Wajib diisi' : 'Opsional'}
            </span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={
              status === 'hadir'
                ? 'Contoh: Menyelesaikan sprint review, testing modul absensi mobile, dan update dokumentasi...'
                : 'Contoh: Sedang istirahat medis karena flu / urusan keluarga mendesak...'
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Upload File Hasil Pekerjaan Dalam PDF */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{status === 'sakit' ? 'Upload Surat Keterangan Sakit (PDF)' : 'Upload Hasil Pekerjaan (PDF)'}</span>
              {status === 'hadir' && <span className="text-rose-500">*</span>}
            </label>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Khusus Format .PDF
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {!uploadedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                Pilih atau Tarik Berkas PDF Hasil Kerja
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maksimal ukuran 15 MB • Standar laporan dokumen PDF
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateSamplePdf();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gunakan Dokumen Contoh (Simulasi Cepat)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {Math.round(uploadedFile.size / 1024)} KB • PDF Siap Dikirim
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onViewPdf(uploadedFile, matchedEmployee?.name || 'Karyawan', matchedEmployee?.division || 'Divisi', todayDateStr)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors"
                >
                  Lihat
                </button>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold">{successMessage}</p>
              <p className="text-[11px] text-emerald-700">Data telah terintegrasi langsung ke dashboard HR.</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !matchedEmployee}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{todayRecord ? 'Perbarui Absensi Hari Ini' : 'Kirim Absensi & Berkas PDF'}</span>
            </>
          )}
        </button>

      </form>

      {/* Helpful Mobile Tip */}
      <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-500 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span>
          Aplikasi dioptimalkan untuk layar handphone (HP). Absensi harian otomatis dicatat sebelum batas waktu 09:00 WIB.
        </span>
      </div>

    </div>
  );
};
