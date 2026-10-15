import { AttendanceStatus } from '../types/attendance';

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

export const INDONESIAN_DAYS = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function formatIndonesianDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    const dayName = INDONESIAN_DAYS[date.getDay()];
    const monthName = INDONESIAN_MONTHS[month];
    return `${dayName}, ${day} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${day} ${INDONESIAN_MONTHS_SHORT[month]}`;
  } catch {
    return dateStr;
  }
}

export function getStatusBadgeConfig(status: AttendanceStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'hadir':
      return {
        label: 'Hadir',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'izin':
      return {
        label: 'Izin',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'sakit':
      return {
        label: 'Sakit',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500'
      };
    case 'cuti':
      return {
        label: 'Cuti Tahunan',
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-500'
      };
    case 'off':
      return {
        label: 'Off / Libur',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400'
      };
    case 'alpha':
      return {
        label: 'Alpha (Tanpa Keterangan)',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-600'
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-400'
      };
  }
}

export function getLast30DaysList(referenceDateStr = '2026-10-15'): string[] {
  const dates: string[] = [];
  const ref = new Date(`${referenceDateStr}T00:00:00`);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(ref.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

export function getLast12MonthsList(referenceDateStr = '2026-10-15'): { key: string; monthNum: number; year: number; label: string; shortLabel: string }[] {
  const result: { key: string; monthNum: number; year: number; label: string; shortLabel: string }[] = [];
  const ref = new Date(`${referenceDateStr}T00:00:00`);
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const key = `${y}-${String(m + 1).padStart(2, '0')}`;
    result.push({
      key,
      monthNum: m + 1,
      year: y,
      label: `${INDONESIAN_MONTHS[m]} ${y}`,
      shortLabel: `${INDONESIAN_MONTHS_SHORT[m]} '${String(y).slice(-2)}`
    });
  }
  return result;
}
