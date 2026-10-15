import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, WorkProofFile } from '../types/attendance';
import { 
  formatIndonesianDate, 
  formatShortDate, 
  getLast30DaysList, 
  getLast12MonthsList, 
  getStatusBadgeConfig 
} from '../utils/dateUtils';
import { 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  HeartPulse, 
  Briefcase, 
  UserX,
  X,
  Building2
} from 'lucide-react';

interface HRAbsentReportProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onViewPdf: (file: WorkProofFile, empName: string, division: string, dateStr: string) => void;
}

export const HRAbsentReport: React.FC<HRAbsentReportProps> = ({
  employees,
  attendanceRecords,
  onViewPdf,
}) => {
  const [timeframe, setTimeframe] = useState<'30days' | '12months'>('30days');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drillDownEmployee, setDrillDownEmployee] = useState<Employee | null>(null);

  // Available divisions
  const divisions = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => set.add(e.division));
    return ['all', ...Array.from(set)];
  }, [employees]);

  // Date filters
  const last30Days = useMemo(() => getLast30DaysList('2026-10-15'), []);
  const last12Months = useMemo(() => getLast12MonthsList('2026-10-15'), []);

  // Filter records by selected timeframe
  const periodRecords = useMemo(() => {
    if (timeframe === '30days') {
      const datesSet = new Set(last30Days);
      return attendanceRecords.filter((r) => datesSet.has(r.date));
    } else {
      // 12 months (e.g. 2025-11-01 to 2026-10-15)
      const oldestMonth = last12Months[0]?.key || '2025-11';
      return attendanceRecords.filter((r) => r.date >= `${oldestMonth}-01`);
    }
  }, [attendanceRecords, timeframe, last30Days, last12Months]);

  // Aggregate absent/off data per employee
  const absentSummaries = useMemo(() => {
    return employees
      .filter((emp) => {
        if (selectedDivision !== 'all' && emp.division !== selectedDivision) return false;
        if (searchQuery && !emp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !emp.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .map((emp) => {
        const empRecords = periodRecords.filter((r) => r.employeeId === emp.id);
        const sakitRecords = empRecords.filter((r) => r.status === 'sakit');
        const izinRecords = empRecords.filter((r) => r.status === 'izin');
        const cutiRecords = empRecords.filter((r) => r.status === 'cuti');
        const offRecords = empRecords.filter((r) => r.status === 'off');
        const alphaRecords = empRecords.filter((r) => r.status === 'alpha');
        const hadirRecords = empRecords.filter((r) => r.status === 'hadir');

        const totalOffAndAbsent = sakitRecords.length + izinRecords.length + cutiRecords.length + offRecords.length + alphaRecords.length;
        const totalAbsentWorkingDays = sakitRecords.length + izinRecords.length + cutiRecords.length + alphaRecords.length;

        return {
          employee: emp,
          sakitCount: sakitRecords.length,
          izinCount: izinRecords.length,
          cutiCount: cutiRecords.length,
          offCount: offRecords.length,
          alphaCount: alphaRecords.length,
          hadirCount: hadirRecords.length,
          totalOffAndAbsent,
          totalAbsentWorkingDays,
          absentRecords: empRecords.filter((r) => r.status !== 'hadir')
        };
      })
      .sort((a, b) => b.totalAbsentWorkingDays - a.totalAbsentWorkingDays);
  }, [employees, selectedDivision, searchQuery, periodRecords]);

  // Overall KPIs
  const overallKPIs = useMemo(() => {
    const totalSakit = absentSummaries.reduce((sum, item) => sum + item.sakitCount, 0);
    const totalIzin = absentSummaries.reduce((sum, item) => sum + item.izinCount, 0);
    const totalCuti = absentSummaries.reduce((sum, item) => sum + item.cutiCount, 0);
    const totalOff = absentSummaries.reduce((sum, item) => sum + item.offCount, 0);
    const totalAbsentWorking = absentSummaries.reduce((sum, item) => sum + item.totalAbsentWorkingDays, 0);
    return { totalSakit, totalIzin, totalCuti, totalOff, totalAbsentWorking };
  }, [absentSummaries]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Nama Karyawan', 'Email', 'Divisi', 'Sakit', 'Izin', 'Cuti', 'Off/Libur', 'Alpha', 'Total Tidak Masuk (Hari Kerja)'];
    const rows = absentSummaries.map((s) => [
      `"${s.employee.name}"`,
      `"${s.employee.email}"`,
      `"${s.employee.division}"`,
      s.sakitCount,
      s.izinCount,
      s.cutiCount,
      s.offCount,
      s.alphaCount,
      s.totalAbsentWorkingDays
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Karyawan_Tidak_Masuk_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drill down records for the selected modal employee
  const drillDownRecords = useMemo(() => {
    if (!drillDownEmployee) return [];
    return periodRecords
      .filter((r) => r.employeeId === drillDownEmployee.id && r.status !== 'hadir')
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [drillDownEmployee, periodRecords]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Title & Filter Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-600" />
              <span>Rekap Karyawan Tidak Masuk & Off</span>
            </h2>
            <p className="text-xs text-slate-500">
              Laporan terpusat mengenai cuti, izin, sakit, dan hari off karyawan dalam 30 hari & 12 bulan
            </p>
          </div>

          {/* Timeframe & Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => setTimeframe('30days')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === '30days'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Hari Terakhir
              </button>
              <button
                onClick={() => setTimeframe('12months')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === '12months'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                12 Bulan Terakhir
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors"
              title="Unduh Data CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Division Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama karyawan atau email..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedDivision === div
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {div === 'all' ? 'Semua Divisi' : div}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Tidak Masuk</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {overallKPIs.totalAbsentWorking} <span className="text-xs font-normal text-slate-400">hari</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Hari kerja tidak efektif</p>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Izin Karyawan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {overallKPIs.totalIzin} <span className="text-xs font-normal text-slate-400">hari</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Izin keperluan pribadi</p>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Sakit</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {overallKPIs.totalSakit} <span className="text-xs font-normal text-slate-400">hari</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Disertai surat dokter</p>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Cuti Tahunan</span>
            <Briefcase className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-sky-600 mt-1">
            {overallKPIs.totalCuti} <span className="text-xs font-normal text-slate-400">hari</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Cuti resmi disetujui</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Hari Off / Libur</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-600 mt-1">
            {overallKPIs.totalOff} <span className="text-xs font-normal text-slate-400">hari</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Weekend & off terjadwal</p>
        </div>
      </div>

      {/* Main Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Daftar Rekap Tidak Masuk / Off ({timeframe === '30days' ? '30 Hari Terakhir' : '12 Bulan Terakhir'})
          </h3>
          <span className="text-xs text-slate-400">
            {absentSummaries.length} Karyawan Ditemukan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Karyawan</th>
                <th className="py-3 px-3">Divisi</th>
                <th className="py-3 px-3 text-center">Sakit</th>
                <th className="py-3 px-3 text-center">Izin</th>
                <th className="py-3 px-3 text-center">Cuti</th>
                <th className="py-3 px-3 text-center">Off / Libur</th>
                <th className="py-3 px-3 text-center">Total Tidak Hadir (Kerja)</th>
                <th className="py-3 px-4 text-right">Rincian Lengkap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {absentSummaries.map((item) => (
                <tr key={item.employee.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.employee.avatar}
                        alt={item.employee.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.employee.name}</p>
                        <p className="text-[11px] text-slate-500">{item.employee.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-lg text-[11px]">
                      {item.employee.division}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${item.sakitCount > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}`}>
                      {item.sakitCount} hr
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${item.izinCount > 0 ? 'text-amber-600 font-black' : 'text-slate-400'}`}>
                      {item.izinCount} hr
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${item.cutiCount > 0 ? 'text-sky-600 font-black' : 'text-slate-400'}`}>
                      {item.cutiCount} hr
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center text-slate-500">
                    {item.offCount} hr
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                      {item.totalAbsentWorkingDays} Hari
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDrillDownEmployee(item.employee)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all text-xs"
                    >
                      <span>Lihat Tanggal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-Down Modal: Detail Specific Dates when Absent */}
      {drillDownEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={drillDownEmployee.avatar}
                  alt={drillDownEmployee.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Log Tidak Masuk / Off: {drillDownEmployee.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {drillDownEmployee.division} • Periode {timeframe === '30days' ? '30 Hari Terakhir' : '12 Bulan Terakhir'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDrillDownEmployee(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Records Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center justify-between">
                <span>Total Hari Tercatat Tidak Bekerja / Off:</span>
                <span className="font-black text-sm">{drillDownRecords.length} Hari</span>
              </div>

              {drillDownRecords.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada catatan ketidakhadiran selama periode ini (Kehadiran 100%).
                </div>
              ) : (
                <div className="space-y-2">
                  {drillDownRecords.map((r) => {
                    const badge = getStatusBadgeConfig(r.status);
                    return (
                      <div
                        key={r.id}
                        className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{formatIndonesianDate(r.date)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">
                            Alasan: {r.notes || '-'}
                          </p>
                        </div>

                        {r.workProofFile ? (
                          <button
                            onClick={() => onViewPdf(r.workProofFile!, r.employeeName, r.division, r.date)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-xl font-bold shadow-2xs transition-all shrink-0"
                          >
                            <FileText className="w-3.5 h-3.5 text-rose-500" />
                            <span>Lihat Surat / Dokumen PDF</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Tanpa lampiran berkas
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDrillDownEmployee(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
