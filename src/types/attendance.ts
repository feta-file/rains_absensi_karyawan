export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'cuti' | 'off' | 'alpha';

export type WorkLocation = 'wfo' | 'wfh' | 'hybrid';

export interface Employee {
  id: string;
  name: string;
  email: string;
  division: string;
  role: string;
  avatar: string;
  phone: string;
  joinedDate: string;
  status: 'active' | 'leave' | 'inactive';
}

export interface WorkProofFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  summary?: string;
  dataUrl?: string;
  contentPreview?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeEmail: string;
  employeeName: string;
  division: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm WIB
  status: AttendanceStatus;
  workLocation?: WorkLocation;
  notes: string;
  workProofFile?: WorkProofFile;
  checkInLocation?: string;
}

export interface ReminderSetting {
  enabled: boolean;
  cutoffTime: string; // "09:00"
  reminderTime: string; // "08:30"
  enableBrowserPush: boolean;
  enableWhatsApp: boolean;
  enableInAppBanner: boolean;
  messageTemplate: string;
}

export interface ReminderLog {
  id: string;
  timestamp: string;
  timeStr: string;
  employeeIds: string[];
  employeeNames: string[];
  channel: 'In-App' | 'WhatsApp' | 'Browser Push' | 'Broadcast Otomatis';
  status: 'Terkirim' | 'Gagal';
  notes: string;
}

export interface MonthlyStats {
  month: string; // e.g. "Jan", "Feb"
  monthNum: number;
  year: number;
  hadir: number;
  izin: number;
  sakit: number;
  cuti: number;
  off: number;
  alpha: number;
  totalWorkingDays: number;
  percentage: number;
}

export interface AbsentSummaryItem {
  employee: Employee;
  totalAbsentDays: number;
  sakitCount: number;
  izinCount: number;
  cutiCount: number;
  offCount: number;
  alphaCount: number;
  records: AttendanceRecord[];
}
