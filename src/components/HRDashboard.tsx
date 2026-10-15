import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, WorkProofFile } from '../types/attendance';
import { HRChartsEmployee } from './HRChartsEmployee';
import { HRAbsentReport } from './HRAbsentReport';
import { formatIndonesianDate, getStatusBadgeConfig } from '../utils/dateUtils';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  FileText, 
  Bell, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Search,
  Filter,
  Eye,
  Send
} from 'lucide-react';

interface HRDashboardProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onViewPdf: (file: WorkProofFile, empName: string, division: string, dateStr: string) => void;
  onOpenReminderModal: () => void;
  todayDateStr?: string;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  employees,
  attendanceRecords,
  onViewPdf,
  onOpenReminderModal,
  todayDateStr = '2026-10-15',
}) => {
  const [activeHRTab, setActiveHRTab] = useState<'overview' | 'individual_charts' | 'absent_report'>('overview');
  const [todayFilter, setTodayFilter] = useState<'all' | 'hadir' | 'pending' | 'tidak_masuk'>('all');
  const [searchEmployee, setSearchEmployee] = useState('');

  // Today's attendance mapping
  const todayRecordsMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceRecords
      .filter((r) => r.date === todayDateStr)
      .forEach((r) => map.set(r.employeeId, r));
    return map;
  }, [attendanceRecords, todayDateStr]);

  // Metrics for Today
  const todayMetrics = useMemo(() => {
    let hadirCount = 0;
    let tidakMasukCount = 0; // sakit, izin, cuti
    let pendingCount = 0;

    employees.forEach((emp) => {
      const rec = todayRecordsMap.get(emp.id);
      if (!rec) {
        pendingCount++;
      } else if (rec.status === 'hadir') {
        hadirCount++;
      } else {
        tidakMasukCount++;
      }
    });

    const attendanceRate = employees.length > 0 ? Math.round((hadirCount / employees.length) * 100) : 0;
    return { hadirCount, tidakMasukCount, pendingCount, attendanceRate };
  }, [employees, todayRecordsMap]);

  // Filtered employee attendance for today table
  const todayTableItems = useMemo(() => {
    return employees
      .map((emp) => {
        const record = todayRecordsMap.get(emp.id) || null;
        return { employee: emp, record };
      })
      .filter(({ employee, record }) => {
        if (searchEmployee && !employee.name.toLowerCase().includes(searchEmployee.toLowerCase()) && !employee.division.toLowerCase().includes(searchEmployee.toLowerCase())) {
          return false;
        }

        if (todayFilter === 'hadir') return record?.status === 'hadir';
        if (todayFilter === 'pending') return !record;
        if (todayFilter === 'tidak_masuk') return record && record.status !== 'hadir';
        return true;
      });
  }, [employees, todayRecordsMap, searchEmployee, todayFilter]);

  return (
    <div className="space-y-6">
      
      {/* HR Header & Sub-navigation */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
              Portal Manajemen HR
            </span>
            <span className="text-xs text-slate-400">
              {formatIndonesianDate(todayDateStr)}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Dashboard Absensi & Kinerja Pegawai
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring kehadiran harian, grafik analisis 30 hari & 12 bulan, rekap off, dan broadcast pengingat
          </p>
        </div>

        {/* HR Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveHRTab('overview')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeHRTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Presensi Hari Ini</span>
          </button>
          <button
            onClick={() => setActiveHRTab('individual_charts')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeHRTab === 'individual_charts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik 1 Karyawan (30 Hari & 12 Bln)</span>
          </button>
          <button
            onClick={() => setActiveHRTab('absent_report')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeHRTab === 'absent_report'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Rekap Tidak Masuk / Off</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeHRTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Total Pegawai */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Karyawan</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {employees.length} <span className="text-xs font-normal text-slate-400">orang</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Aktif di 6 divisi perusahaan</p>
            </div>

            {/* Hadir Hari Ini */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Hadir Bekerja</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {todayMetrics.hadirCount} <span className="text-xs font-normal text-slate-400">orang</span>
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${todayMetrics.attendanceRate}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-700">{todayMetrics.attendanceRate}%</span>
              </div>
            </div>

            {/* Belum Absen Hari Ini (Actionable) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">Belum Absen Hari Ini</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {todayMetrics.pendingCount} <span className="text-xs font-normal text-amber-600/70">orang</span>
              </p>
              <button
                onClick={onOpenReminderModal}
                className="mt-2 text-[11px] font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 underline underline-offset-2"
              >
                <Bell className="w-3 h-3 text-amber-600" />
                <span>Kirim Pengingat Otomatis</span>
              </button>
            </div>

            {/* Tidak Masuk (Sakit / Izin / Cuti) */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Izin / Sakit / Cuti</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {todayMetrics.tidakMasukCount} <span className="text-xs font-normal text-slate-400">orang</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Disertai berkas validasi resmi</p>
            </div>

          </div>

          {/* Broadcast Reminder Prompt Bar */}
          {todayMetrics.pendingCount > 0 && (
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {todayMetrics.pendingCount} Karyawan Belum Melakukan Absensi Hari Ini
                  </h4>
                  <p className="text-xs text-blue-100">
                    Batas waktu pengisian harian adalah pukul 09:00 WIB. Kirim notifikasi pengingat otomatis ke perangkat HP karyawan.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenReminderModal}
                className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 text-xs font-extrabold rounded-2xl shadow-xs transition-all shrink-0 inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka Pusat Pengingat</span>
              </button>
            </div>
          )}

          {/* Today's Presensi Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Monitoring Presensi Harian (Hari Ini: 15 Oktober 2026)
                </h3>
                <p className="text-xs text-slate-500">
                  Verifikasi email, jam masuk, lokasi kerja, dan berkas PDF hasil pekerjaan
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchEmployee}
                    onChange={(e) => setSearchEmployee(e.target.value)}
                    placeholder="Cari karyawan..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTodayFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      todayFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Semua ({employees.length})
                  </button>
                  <button
                    onClick={() => setTodayFilter('hadir')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      todayFilter === 'hadir' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Hadir ({todayMetrics.hadirCount})
                  </button>
                  <button
                    onClick={() => setTodayFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      todayFilter === 'pending' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Belum Absen ({todayMetrics.pendingCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Karyawan</th>
                    <th className="py-3 px-3">Divisi</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Waktu Masuk</th>
                    <th className="py-3 px-3">Lokasi / Keterangan</th>
                    <th className="py-3 px-4 text-right">Hasil Kerja (PDF)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayTableItems.map(({ employee, record }) => {
                    const isPending = !record;
                    const badge = record ? getStatusBadgeConfig(record.status) : {
                      label: 'Belum Absen',
                      bg: 'bg-amber-50',
                      text: 'text-amber-700',
                      border: 'border-amber-200',
                      dot: 'bg-amber-500'
                    };

                    return (
                      <tr key={employee.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={employee.avatar}
                              alt={employee.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{employee.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{employee.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-lg text-[11px]">
                            {employee.division}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono text-slate-600">
                          {record ? record.time : <span className="text-amber-600 font-bold">Menunggu</span>}
                        </td>

                        <td className="py-3 px-3 max-w-[200px]">
                          {record ? (
                            <div>
                              {record.workLocation && (
                                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">
                                  {record.workLocation} • {record.checkInLocation || 'Tercatat'}
                                </span>
                              )}
                              <p className="text-[11px] text-slate-600 truncate">
                                {record.notes || '-'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Belum mengisi catatan</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {record?.workProofFile ? (
                            <button
                              onClick={() => onViewPdf(record.workProofFile!, record.employeeName, record.division, record.date)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold shadow-2xs transition-all"
                            >
                              <FileText className="w-3.5 h-3.5 text-rose-500" />
                              <span>Lihat PDF</span>
                            </button>
                          ) : isPending ? (
                            <span className="text-[11px] text-amber-600 font-semibold">
                              Belum Upload
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Tidak Ada File
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* INDIVIDUAL CHARTS TAB (30 Days & 12 Months) */}
      {activeHRTab === 'individual_charts' && (
        <HRChartsEmployee
          employees={employees}
          attendanceRecords={attendanceRecords}
          onViewPdf={onViewPdf}
        />
      )}

      {/* ABSENT REPORT TAB (30 Days & 12 Months) */}
      {activeHRTab === 'absent_report' && (
        <HRAbsentReport
          employees={employees}
          attendanceRecords={attendanceRecords}
          onViewPdf={onViewPdf}
        />
      )}

    </div>
  );
};
