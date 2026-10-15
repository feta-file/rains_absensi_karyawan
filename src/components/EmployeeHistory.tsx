import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, WorkProofFile } from '../types/attendance';
import { formatIndonesianDate, getStatusBadgeConfig } from '../utils/dateUtils';
import { Calendar, FileText, CheckCircle, Clock, MapPin, Eye, Search, Filter } from 'lucide-react';

interface EmployeeHistoryProps {
  currentEmployee: Employee | null;
  attendanceRecords: AttendanceRecord[];
  onViewPdf: (file: WorkProofFile, empName: string, division: string, dateStr: string) => void;
}

export const EmployeeHistory: React.FC<EmployeeHistoryProps> = ({
  currentEmployee,
  attendanceRecords,
  onViewPdf,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  const employeeRecords = useMemo(() => {
    if (!currentEmployee) return [];
    return attendanceRecords
      .filter((r) => r.employeeId === currentEmployee.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, currentEmployee]);

  // Statistics for this employee
  const stats = useMemo(() => {
    const last30 = employeeRecords.slice(0, 30);
    const hadir = last30.filter((r) => r.status === 'hadir').length;
    const sakit = last30.filter((r) => r.status === 'sakit').length;
    const izin = last30.filter((r) => r.status === 'izin').length;
    const cuti = last30.filter((r) => r.status === 'cuti').length;
    const off = last30.filter((r) => r.status === 'off').length;
    const totalWorkDays = last30.filter((r) => r.status !== 'off').length;
    const rate = totalWorkDays > 0 ? Math.round((hadir / totalWorkDays) * 100) : 100;
    return { hadir, sakit, izin, cuti, off, rate };
  }, [employeeRecords]);

  const filteredRecords = useMemo(() => {
    return employeeRecords.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (searchDate && !r.date.includes(searchDate) && !formatIndonesianDate(r.date).toLowerCase().includes(searchDate.toLowerCase())) return false;
      return true;
    });
  }, [employeeRecords, filterStatus, searchDate]);

  if (!currentEmployee) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
        <p>Silakan masukkan email yang valid pada menu Absensi untuk melihat riwayat.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      
      {/* Profile & KPI Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={currentEmployee.avatar}
            alt={currentEmployee.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-xs"
          />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{currentEmployee.name}</h3>
            <p className="text-xs text-slate-500">{currentEmployee.division} • {currentEmployee.role}</p>
          </div>
        </div>

        {/* 30-Day Rate Banner */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="bg-blue-50/60 p-2.5 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Kehadiran 30 Hari</p>
            <p className="text-lg font-black text-blue-700">{stats.rate}%</p>
          </div>
          <div className="bg-emerald-50/60 p-2.5 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Hadir</p>
            <p className="text-lg font-black text-emerald-700">{stats.hadir} <span className="text-xs font-normal">hari</span></p>
          </div>
          <div className="bg-rose-50/60 p-2.5 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Sakit & Izin</p>
            <p className="text-lg font-black text-rose-700">{stats.sakit + stats.izin} <span className="text-xs font-normal">hari</span></p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 flex flex-col gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tanggal / catatan..."
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'hadir', label: 'Hadir' },
            { id: 'izin', label: 'Izin' },
            { id: 'sakit', label: 'Sakit' },
            { id: 'cuti', label: 'Cuti' },
            { id: 'off', label: 'Off' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                filterStatus === item.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Timeline List */}
      <div className="space-y-2.5">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400">
            Tidak ada riwayat absensi yang cocok dengan filter.
          </div>
        ) : (
          filteredRecords.slice(0, 30).map((record) => {
            const badge = getStatusBadgeConfig(record.status);
            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {formatIndonesianDate(record.date)}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <p className="line-clamp-2">{record.notes || '-'}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {record.time}
                      </span>
                      {record.workLocation && (
                        <span className="uppercase font-semibold text-blue-600">
                          {record.workLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  {record.workProofFile && (
                    <button
                      onClick={() => onViewPdf(record.workProofFile!, record.employeeName, record.division, record.date)}
                      className="shrink-0 flex items-center gap-1 text-[11px] font-bold bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all"
                      title="Lihat lampiran PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-500" />
                      <span>PDF</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
