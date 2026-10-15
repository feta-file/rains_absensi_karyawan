import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, WorkProofFile, AttendanceStatus } from '../types/attendance';
import { 
  formatIndonesianDate, 
  formatShortDate, 
  getLast30DaysList, 
  getLast12MonthsList, 
  getStatusBadgeConfig 
} from '../utils/dateUtils';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  FileText, 
  User, 
  Clock, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HRChartsEmployeeProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onViewPdf: (file: WorkProofFile, empName: string, division: string, dateStr: string) => void;
}

export const HRChartsEmployee: React.FC<HRChartsEmployeeProps> = ({
  employees,
  attendanceRecords,
  onViewPdf,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || 'emp-1');
  const [timeframe, setTimeframe] = useState<'30days' | '12months'>('30days');
  const [activeDayHover, setActiveDayHover] = useState<AttendanceRecord | null>(null);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [employees, selectedEmployeeId]);

  // 30 Days Data
  const last30Dates = useMemo(() => getLast30DaysList('2026-10-15'), []);

  const employee30DaysRecords = useMemo(() => {
    if (!selectedEmployee) return [];
    return last30Dates.map((dateStr) => {
      const found = attendanceRecords.find(
        (r) => r.employeeId === selectedEmployee.id && r.date === dateStr
      );
      if (found) return found;
      // Default fallback
      return {
        id: `rec-fallback-${dateStr}`,
        employeeId: selectedEmployee.id,
        employeeEmail: selectedEmployee.email,
        employeeName: selectedEmployee.name,
        division: selectedEmployee.division,
        date: dateStr,
        time: '-',
        status: 'off' as AttendanceStatus,
        notes: 'Hari Libur / Off'
      };
    });
  }, [attendanceRecords, selectedEmployee, last30Dates]);

  // 30 Days Statistics
  const stats30Days = useMemo(() => {
    const hadir = employee30DaysRecords.filter((r) => r.status === 'hadir').length;
    const sakit = employee30DaysRecords.filter((r) => r.status === 'sakit').length;
    const izin = employee30DaysRecords.filter((r) => r.status === 'izin').length;
    const cuti = employee30DaysRecords.filter((r) => r.status === 'cuti').length;
    const off = employee30DaysRecords.filter((r) => r.status === 'off').length;
    const alpha = employee30DaysRecords.filter((r) => r.status === 'alpha').length;
    const totalWorkingDays = hadir + sakit + izin + cuti + alpha;
    const attendanceRate = totalWorkingDays > 0 ? Math.round((hadir / totalWorkingDays) * 100) : 100;
    return { hadir, sakit, izin, cuti, off, alpha, totalWorkingDays, attendanceRate };
  }, [employee30DaysRecords]);

  // 12 Months Data
  const last12Months = useMemo(() => getLast12MonthsList('2026-10-15'), []);

  const stats12Months = useMemo(() => {
    if (!selectedEmployee) return [];
    return last12Months.map((m) => {
      // Find all records matching year and month
      const monthPrefix = m.key; // e.g. "2026-10"
      const monthRecords = attendanceRecords.filter(
        (r) => r.employeeId === selectedEmployee.id && r.date.startsWith(monthPrefix)
      );

      const hadir = monthRecords.filter((r) => r.status === 'hadir').length;
      const sakit = monthRecords.filter((r) => r.status === 'sakit').length;
      const izin = monthRecords.filter((r) => r.status === 'izin').length;
      const cuti = monthRecords.filter((r) => r.status === 'cuti').length;
      const off = monthRecords.filter((r) => r.status === 'off').length;
      const alpha = monthRecords.filter((r) => r.status === 'alpha').length;
      const workDays = hadir + sakit + izin + cuti + alpha;
      const rate = workDays > 0 ? Math.round((hadir / workDays) * 100) : 100;

      return {
        ...m,
        hadir,
        sakit,
        izin,
        cuti,
        off,
        alpha,
        workDays,
        rate
      };
    });
  }, [last12Months, attendanceRecords, selectedEmployee]);

  // 12 Months Aggregates
  const stats12MonthsTotal = useMemo(() => {
    const totalHadir = stats12Months.reduce((acc, curr) => acc + curr.hadir, 0);
    const totalSakit = stats12Months.reduce((acc, curr) => acc + curr.sakit, 0);
    const totalIzin = stats12Months.reduce((acc, curr) => acc + curr.izin, 0);
    const totalCuti = stats12Months.reduce((acc, curr) => acc + curr.cuti, 0);
    const totalOff = stats12Months.reduce((acc, curr) => acc + curr.off, 0);
    const totalWork = stats12Months.reduce((acc, curr) => acc + curr.workDays, 0);
    const avgRate = totalWork > 0 ? Math.round((totalHadir / totalWork) * 100) : 100;
    return { totalHadir, totalSakit, totalIzin, totalCuti, totalOff, totalWork, avgRate };
  }, [stats12Months]);

  // Max value for 12 months chart scaling
  const maxMonthValue = useMemo(() => {
    const maxVal = Math.max(...stats12Months.map((m) => m.hadir + m.sakit + m.izin + m.cuti + m.off), 28);
    return maxVal;
  }, [stats12Months]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Employee Selector Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Grafik Status Absensi Perorangan</span>
            </h2>
            <p className="text-xs text-slate-500">
              Pilih karyawan untuk menganalisis performa kehadiran 30 hari atau 12 bulan
            </p>
          </div>

          {/* Timeframe Switcher Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('30days')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === '30days'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Hari Terakhir
            </button>
            <button
              onClick={() => setTimeframe('12months')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === '12months'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Bulan Terakhir
            </button>
          </div>
        </div>

        {/* Employee Cards Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {employees.map((emp) => {
            const isSelected = emp.id === selectedEmployeeId;
            return (
              <button
                key={emp.id}
                onClick={() => {
                  setSelectedEmployeeId(emp.id);
                  setActiveDayHover(null);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all shrink-0 text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="pr-1">
                  <p className={`text-xs font-bold whitespace-nowrap ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {emp.name}
                  </p>
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">
                    {emp.division}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Employee Profile Header */}
      {selectedEmployee && (
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={selectedEmployee.avatar}
              alt={selectedEmployee.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{selectedEmployee.name}</h3>
                <span className="text-[11px] font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  {selectedEmployee.division}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedEmployee.email} • {selectedEmployee.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-5">
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Tingkat Kehadiran</p>
              <p className="text-2xl font-black text-emerald-400">
                {timeframe === '30days' ? stats30Days.attendanceRate : stats12MonthsTotal.avgRate}%
              </p>
            </div>
            <div className="text-xs text-slate-300">
              <p>Periode: <span className="font-semibold text-white">{timeframe === '30days' ? '30 Hari Terakhir' : '12 Bulan Terakhir'}</span></p>
              <p className="text-[11px] text-slate-400">Status Akun: Aktif Bekerja</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: GRAFIK 30 HARI */}
      {timeframe === '30days' && (
        <div className="space-y-4">
          
          {/* KPI Cards for 30 Days */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Total Hadir</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{stats30Days.hadir} <span className="text-xs font-normal text-slate-400">hari</span></p>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                Efektif Masuk
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Izin Kerja</span>
              <p className="text-xl font-extrabold text-amber-600 mt-0.5">{stats30Days.izin} <span className="text-xs font-normal text-slate-400">hari</span></p>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                Izin Resmi
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Sakit</span>
              <p className="text-xl font-extrabold text-rose-600 mt-0.5">{stats30Days.sakit} <span className="text-xs font-normal text-slate-400">hari</span></p>
              <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                Surat Dokter
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Cuti Tahunan</span>
              <p className="text-xl font-extrabold text-sky-600 mt-0.5">{stats30Days.cuti} <span className="text-xs font-normal text-slate-400">hari</span></p>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                Cuti Disetujui
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Off / Libur</span>
              <p className="text-xl font-extrabold text-slate-600 mt-0.5">{stats30Days.off} <span className="text-xs font-normal text-slate-400">hari</span></p>
              <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                Weekend / Off
              </span>
            </div>
          </div>

          {/* Interactive 30-Day Heatmap & Timeline Punchcard Chart */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Visualisasi Kalender Presensi 30 Hari (16 Sep 2026 - 15 Okt 2026)
                </h4>
                <p className="text-xs text-slate-500">
                  Klik atau arahkan kursor ke tiap kotak tanggal untuk melihat detail presensi & file PDF
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Hadir</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> Izin</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500" /> Sakit</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-500" /> Cuti</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300" /> Off</span>
              </div>
            </div>

            {/* 30 Day Grid Boxes */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {employee30DaysRecords.map((rec) => {
                const isSelected = activeDayHover?.date === rec.date;
                let bgClass = 'bg-emerald-500 text-white';
                if (rec.status === 'izin') bgClass = 'bg-amber-500 text-white';
                if (rec.status === 'sakit') bgClass = 'bg-rose-500 text-white';
                if (rec.status === 'cuti') bgClass = 'bg-sky-500 text-white';
                if (rec.status === 'off') bgClass = 'bg-slate-200 text-slate-600';
                if (rec.status === 'alpha') bgClass = 'bg-red-600 text-white';

                return (
                  <button
                    key={rec.date}
                    onClick={() => setActiveDayHover(rec)}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isSelected ? 'ring-4 ring-blue-500/30 scale-105 z-10 shadow-md' : 'hover:scale-102 shadow-2xs'
                    } ${bgClass}`}
                  >
                    <span className="text-[10px] font-medium opacity-80">
                      {formatShortDate(rec.date)}
                    </span>
                    <span className="text-xs font-black capitalize mt-0.5">
                      {rec.status === 'hadir' ? 'Hadir' : rec.status}
                    </span>
                    {rec.workProofFile && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Detail Card */}
            {activeDayHover ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {formatIndonesianDate(activeDayHover.date)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeConfig(activeDayHover.status).bg} ${getStatusBadgeConfig(activeDayHover.status).text} ${getStatusBadgeConfig(activeDayHover.status).border}`}>
                      {getStatusBadgeConfig(activeDayHover.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Catatan: {activeDayHover.notes || 'Tidak ada catatan'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Waktu Input: {activeDayHover.time} {activeDayHover.workLocation ? `• ${activeDayHover.workLocation.toUpperCase()}` : ''}
                  </p>
                </div>

                {activeDayHover.workProofFile ? (
                  <button
                    onClick={() => onViewPdf(activeDayHover.workProofFile!, activeDayHover.employeeName, activeDayHover.division, activeDayHover.date)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 shadow-xs transition-all"
                  >
                    <FileText className="w-4 h-4 text-rose-300" />
                    <span>Lihat Berkas PDF ({Math.round(activeDayHover.workProofFile.size / 1024)} KB)</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Tidak ada lampiran PDF
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-400 italic">
                Klik salah satu kotak tanggal di atas untuk melihat detail & bukti pekerjaan PDF.
              </div>
            )}
          </div>

          {/* 30-Day Bar Trend Chart */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Grafik Komparasi Durasi & Presensi Harian (30 Hari)
            </h4>
            <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-2 border-b border-slate-200 overflow-x-auto">
              {employee30DaysRecords.map((r, i) => {
                const isHadir = r.status === 'hadir';
                const heightPercent = isHadir ? 85 : r.status === 'off' ? 25 : 55;
                const color = isHadir ? 'bg-emerald-500' : r.status === 'sakit' ? 'bg-rose-500' : r.status === 'izin' ? 'bg-amber-500' : r.status === 'cuti' ? 'bg-sky-500' : 'bg-slate-300';
                
                return (
                  <div key={r.date} className="flex-1 min-w-[14px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                      {formatShortDate(r.date)}: {r.status.toUpperCase()}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all group-hover:brightness-110 ${color}`}
                    />
                    <span className="text-[8px] sm:text-[9px] text-slate-400 rotate-90 sm:rotate-0 mt-1 truncate">
                      {i % 3 === 0 ? formatShortDate(r.date) : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
              <span>*Tinggi bar menunjukkan jam kerja produktif / kehadiran penuh</span>
              <span className="font-semibold text-emerald-600">Tingkat Kehadiran: {stats30Days.attendanceRate}%</span>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: GRAFIK 12 BULAN */}
      {timeframe === '12months' && (
        <div className="space-y-4">
          
          {/* 12 Months Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Total Hari Hadir (12 Bln)</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {stats12MonthsTotal.totalHadir} <span className="text-xs font-normal text-slate-400">hari</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Dari {stats12MonthsTotal.totalWork} hari kerja resmi
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Total Sakit & Izin</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {stats12MonthsTotal.totalSakit + stats12MonthsTotal.totalIzin} <span className="text-xs font-normal text-slate-400">hari</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Sakit: {stats12MonthsTotal.totalSakit} | Izin: {stats12MonthsTotal.totalIzin}
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Cuti Tahunan Digunakan</span>
              <p className="text-2xl font-black text-sky-600 mt-1">
                {stats12MonthsTotal.totalCuti} <span className="text-xs font-normal text-slate-400">hari</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Sisa kuota cuti: {Math.max(0, 12 - stats12MonthsTotal.totalCuti)} hari
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Rata-rata Kehadiran</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {stats12MonthsTotal.avgRate}%
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Kategori Sangat Baik
              </p>
            </div>
          </div>

          {/* Grouped Bar Chart for 12 Months */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Grafik Distribusi Kehadiran Bulanan (12 Bulan Terakhir)
                </h4>
                <p className="text-xs text-slate-500">
                  Komparasi status Hadir vs Tidak Masuk (Sakit/Izin/Cuti) vs Off per bulan
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Hadir</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500" /> Sakit/Izin</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-500" /> Cuti</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300" /> Off</span>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="pt-4 pb-2 overflow-x-auto">
              <div className="min-w-[620px] h-60 flex items-end justify-between gap-3 px-3 border-b border-slate-200">
                {stats12Months.map((m) => {
                  const hadirH = (m.hadir / 24) * 160;
                  const absentH = ((m.sakit + m.izin) / 24) * 160;
                  const cutiH = (m.cuti / 24) * 160;
                  const offH = (m.off / 24) * 160;

                  return (
                    <div key={m.key} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                      {/* Floating tooltip */}
                      <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                        <p className="font-bold">{m.label}</p>
                        <p>Hadir: {m.hadir} hari ({m.rate}%)</p>
                        <p>Sakit/Izin: {m.sakit + m.izin} hari | Cuti: {m.cuti}</p>
                      </div>

                      {/* Bar group */}
                      <div className="flex items-end gap-1 h-44">
                        <div
                          style={{ height: `${Math.max(8, hadirH)}px` }}
                          className="w-3.5 sm:w-4 bg-emerald-500 rounded-t-md hover:brightness-110 transition-all"
                          title={`Hadir: ${m.hadir} hari`}
                        />
                        <div
                          style={{ height: `${Math.max(4, absentH)}px` }}
                          className="w-2.5 sm:w-3 bg-rose-500 rounded-t-md hover:brightness-110 transition-all"
                          title={`Sakit & Izin: ${m.sakit + m.izin} hari`}
                        />
                        <div
                          style={{ height: `${Math.max(4, cutiH)}px` }}
                          className="w-2.5 sm:w-3 bg-sky-500 rounded-t-md hover:brightness-110 transition-all"
                          title={`Cuti: ${m.cuti} hari`}
                        />
                        <div
                          style={{ height: `${Math.max(6, offH)}px` }}
                          className="w-2.5 sm:w-3 bg-slate-300 rounded-t-md hover:brightness-110 transition-all"
                          title={`Off: ${m.off} hari`}
                        />
                      </div>

                      {/* Month label */}
                      <span className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">
                        {m.shortLabel}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600">
                        {m.rate}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3 text-center">Hadir</th>
                    <th className="py-2.5 px-3 text-center">Izin</th>
                    <th className="py-2.5 px-3 text-center">Sakit</th>
                    <th className="py-2.5 px-3 text-center">Cuti</th>
                    <th className="py-2.5 px-3 text-center">Off</th>
                    <th className="py-2.5 px-3 text-right">Tingkat Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats12Months.slice(-6).map((m) => (
                    <tr key={m.key} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{m.label}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{m.hadir} hr</td>
                      <td className="py-2.5 px-3 text-center text-amber-600">{m.izin} hr</td>
                      <td className="py-2.5 px-3 text-center text-rose-600">{m.sakit} hr</td>
                      <td className="py-2.5 px-3 text-center text-sky-600">{m.cuti} hr</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">{m.off} hr</td>
                      <td className="py-2.5 px-3 text-right font-black text-blue-600">{m.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
