import React from 'react';
import { Employee, AttendanceRecord } from '../types/attendance';
import { BellRing, AlertCircle, ArrowRight, X } from 'lucide-react';

interface ReminderBannerProps {
  currentEmployee: Employee | null;
  todayRecord: AttendanceRecord | null;
  cutoffTime?: string;
  onGoToCheckIn: () => void;
  onDismiss?: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({
  currentEmployee,
  todayRecord,
  cutoffTime = '09:00',
  onGoToCheckIn,
}) => {
  // If already checked in or no employee, don't show
  if (!currentEmployee || todayRecord) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-3 rounded-2xl shadow-md border border-amber-300/30 animate-pulse-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5 text-white animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-black/25 px-2 py-0.5 rounded-md tracking-wider">
              Pengingat Otomatis Presensi
            </span>
            <span className="text-xs text-amber-100">Batas Waktu: {cutoffTime} WIB</span>
          </div>
          <p className="text-xs font-bold text-white mt-0.5">
            Halo {currentEmployee.name}, Anda belum mencatat absensi & laporan harian hari ini!
          </p>
        </div>
      </div>

      <button
        onClick={onGoToCheckIn}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-orange-700 hover:bg-orange-50 active:scale-95 text-xs font-black rounded-xl shadow-xs transition-all shrink-0"
      >
        <span>Absen Sekarang</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
