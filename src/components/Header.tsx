import React from 'react';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  RotateCcw, 
  UserCheck, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  appRole: 'employee' | 'hr';
  onRoleChange: (role: 'employee' | 'hr') => void;
  isMobileFrameActive: boolean;
  onToggleMobileFrame: () => void;
  onOpenReminderModal: () => void;
  onResetData: () => void;
  pendingCheckInCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  appRole,
  onRoleChange,
  isMobileFrameActive,
  onToggleMobileFrame,
  onOpenReminderModal,
  onResetData,
  pendingCheckInCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                AbsenKu
              </span>
              <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                HR Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Presensi Mandiri, Verifikasi Email & Rekap Laporan
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Karyawan HP vs HR Portal) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => onRoleChange('employee')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              appRole === 'employee'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Input Presensi (HP)</span>
            <span className="sm:hidden">Karyawan</span>
          </button>

          <button
            onClick={() => onRoleChange('hr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              appRole === 'hr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal HRD (Grafik & Rekap)</span>
            <span className="sm:hidden">HRD</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          
          {/* Mobile frame simulator toggle (only relevant when on desktop screens) */}
          <button
            onClick={onToggleMobileFrame}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isMobileFrameActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Ubah mode bingkai HP / Layar penuh"
          >
            {isMobileFrameActive ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mode Layar Lebar</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Frame HP (Simulator)</span>
              </>
            )}
          </button>

          {/* Reminder Bell with Badge */}
          <button
            onClick={onOpenReminderModal}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
            title="Pusat Pengingat Otomatis"
          >
            <Bell className="w-4 h-4" />
            {pendingCheckInCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {pendingCheckInCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-transparent transition-colors"
            title="Reset ke Data Bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
