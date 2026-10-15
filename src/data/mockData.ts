import { Employee, AttendanceRecord, ReminderSetting, ReminderLog } from '../types/attendance';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@perusahaan.com',
    division: 'Engineering',
    role: 'Lead Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567801',
    joinedDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 'emp-2',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@perusahaan.com',
    division: 'Engineering',
    role: 'Senior Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567802',
    joinedDate: '2023-03-01',
    status: 'active'
  },
  {
    id: 'emp-3',
    name: 'Dimas Pratama',
    email: 'dimas.pratama@perusahaan.com',
    division: 'UI/UX Design',
    role: 'Senior Product Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567803',
    joinedDate: '2023-06-10',
    status: 'active'
  },
  {
    id: 'emp-4',
    name: 'Anisa Dewi Lestari',
    email: 'anisa.dewi@perusahaan.com',
    division: 'Sales & Marketing',
    role: 'Digital Marketing Strategist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567804',
    joinedDate: '2023-08-20',
    status: 'active'
  },
  {
    id: 'emp-5',
    name: 'Rizky Fauzi',
    email: 'rizky.fauzi@perusahaan.com',
    division: 'Sales & Marketing',
    role: 'Key Account Executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567805',
    joinedDate: '2024-01-05',
    status: 'active'
  },
  {
    id: 'emp-6',
    name: 'Maya Indah Sari',
    email: 'maya.indah@perusahaan.com',
    division: 'Human Resources',
    role: 'HR Talent Specialist',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567806',
    joinedDate: '2022-11-01',
    status: 'active'
  },
  {
    id: 'emp-7',
    name: 'Hendra Wijaya',
    email: 'hendra.wijaya@perusahaan.com',
    division: 'Finance & Accounting',
    role: 'Finance & Tax Officer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567807',
    joinedDate: '2023-05-12',
    status: 'active'
  },
  {
    id: 'emp-8',
    name: 'Tri Wahyuni',
    email: 'tri.wahyuni@perusahaan.com',
    division: 'Operations',
    role: 'Operations Coordinator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567808',
    joinedDate: '2023-09-18',
    status: 'active'
  },
  {
    id: 'emp-9',
    name: 'Kevin Ardiansyah',
    email: 'kevin.ardian@perusahaan.com',
    division: 'IT Support',
    role: 'DevOps & IT Support',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567809',
    joinedDate: '2024-02-14',
    status: 'active'
  },
  {
    id: 'emp-10',
    name: 'Ratna Kusuma',
    email: 'ratna.kusuma@perusahaan.com',
    division: 'Legal & Compliance',
    role: 'Legal Compliance Officer',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    phone: '+6281234567810',
    joinedDate: '2023-10-01',
    status: 'active'
  }
];

export const INITIAL_REMINDER_SETTINGS: ReminderSetting = {
  enabled: true,
  cutoffTime: '09:00',
  reminderTime: '08:30',
  enableBrowserPush: true,
  enableWhatsApp: true,
  enableInAppBanner: true,
  messageTemplate: 'Halo [Nama], kami mengingatkan bahwa Anda belum melakukan absensi harian untuk tanggal [Tanggal]. Mohon segera melakukan absensi dan upload hasil kerja sebelum batas waktu pukul [BatasWaktu] WIB.'
};

export const INITIAL_REMINDER_LOGS: ReminderLog[] = [
  {
    id: 'rem-1',
    timestamp: '2026-10-15T08:30:00Z',
    timeStr: '08:30 WIB',
    employeeIds: ['emp-4', 'emp-5', 'emp-9'],
    employeeNames: ['Anisa Dewi Lestari', 'Rizky Fauzi', 'Kevin Ardiansyah'],
    channel: 'Broadcast Otomatis',
    status: 'Terkirim',
    notes: 'Pengingat otomatis pagi dikirim kepada 3 karyawan yang belum absen.'
  },
  {
    id: 'rem-2',
    timestamp: '2026-10-14T08:30:00Z',
    timeStr: '08:30 WIB',
    employeeIds: ['emp-2', 'emp-7'],
    employeeNames: ['Siti Rahmawati', 'Hendra Wijaya'],
    channel: 'In-App',
    status: 'Terkirim',
    notes: 'Pengingat harian terselesaikan setelah karyawan melakukan absensi.'
  }
];

// Helper to format date YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate realistic attendance dataset for the last 365 days (12 months) up to 2026-10-15
export function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const baseDate = new Date('2026-10-15T00:00:00');

  const sampleTasks = [
    'Menyelesaikan implementasi UI dashboard absensi & fixing responsive mobile',
    'Review PR migrasi database, unit test code coverage 88%',
    'Merancang user journey flow dan wireframe prototype mobile app',
    'Optimasi kampanye Google Ads dan audit performa landing page',
    'Meeting bersama calon klien enterprise dan follow-up penawaran proposal',
    'Screening CV kandidat developer dan persiapan sesi wawancara user',
    'Penyusunan laporan rekonsiliasi bank dan faktur pajak bulanan',
    'Monitoring operational SOP lapangan dan audit inventaris logistik',
    'Maintenance server, backup database mingguan dan security patch',
    'Review draft perjanjian kerjasama vendor dan revisi klausul NDA'
  ];

  // For 365 days back
  for (let dayOffset = 365; dayOffset >= 0; dayOffset--) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() - dayOffset);
    const dateStr = formatDateISO(curDate);
    const dayOfWeek = curDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
      // For today (dayOffset === 0), only some have checked in, others are pending
      if (dayOffset === 0) {
        // emp-1 (Budi), emp-2 (Siti), emp-3 (Dimas), emp-6 (Maya), emp-7 (Hendra), emp-8 (Tri), emp-10 (Ratna) checked in
        // emp-4 (Anisa), emp-5 (Rizky), emp-9 (Kevin) haven't checked in yet
        const checkedInIndices = [0, 1, 2, 5, 6, 7, 9];
        if (checkedInIndices.includes(empIdx)) {
          const isSick = empIdx === 1; // Siti is izin/sakit today
          records.push({
            id: `rec-today-${emp.id}`,
            employeeId: emp.id,
            employeeEmail: emp.email,
            employeeName: emp.name,
            division: emp.division,
            date: dateStr,
            time: isSick ? '07:45 WIB' : `08:${String(10 + (empIdx * 4)).padStart(2, '0')} WIB`,
            status: isSick ? 'sakit' : 'hadir',
            workLocation: isSick ? undefined : (empIdx % 2 === 0 ? 'wfo' : 'wfh'),
            notes: isSick ? 'Sakit radang tenggorokan & demam, istirahat dokter 1 hari' : sampleTasks[empIdx],
            workProofFile: isSick ? {
              name: `Surat_Dokter_${emp.name.replace(/\s+/g, '_')}_15Okt.pdf`,
              size: 420 * 1024,
              type: 'application/pdf',
              uploadedAt: '07:45 WIB',
              summary: 'Surat Keterangan Sakit dari Klinik Medika Sehat (1 Hari Istirahat)'
            } : {
              name: `Laporan_Kerja_${emp.name.replace(/\s+/g, '_')}_15Okt.pdf`,
              size: (650 + (empIdx * 80)) * 1024,
              type: 'application/pdf',
              uploadedAt: `08:${String(10 + (empIdx * 4)).padStart(2, '0')} WIB`,
              summary: `Dokumen rekap progres pekerjaan harian divisi ${emp.division}`
            },
            checkInLocation: empIdx % 2 === 0 ? 'Kantor Pusat Jakarta' : 'Remote / WFH'
          });
        }
        return;
      }

      // Past days
      if (isWeekend) {
        // Weekend is officially 'off'
        records.push({
          id: `rec-${dateStr}-${emp.id}`,
          employeeId: emp.id,
          employeeEmail: emp.email,
          employeeName: emp.name,
          division: emp.division,
          date: dateStr,
          time: '-',
          status: 'off',
          notes: 'Hari Libur Akhir Pekan (Weekend Off)'
        });
        return;
      }

      // Weekday: mostly hadir, occasionally izin, sakit, cuti, or alpha
      // Generate pseudo-random using deterministic hash so it stays consistent
      const hash = (dayOffset * 37 + empIdx * 19) % 100;
      let status: 'hadir' | 'izin' | 'sakit' | 'cuti' | 'alpha' = 'hadir';
      let notes = sampleTasks[empIdx % sampleTasks.length];
      let hasFile = true;
      let fileName = `Laporan_Harian_${emp.name.replace(/\s+/g, '_')}_${dateStr}.pdf`;

      if (hash < 3) {
        status = 'sakit';
        notes = 'Istirahat medis sakit musiman / flu';
        fileName = `Surat_Keterangan_Dokter_${dateStr}.pdf`;
      } else if (hash < 6) {
        status = 'izin';
        notes = 'Izin keperluan keluarga mendesak / dinas eksternal';
        hasFile = false;
      } else if (hash < 9) {
        status = 'cuti';
        notes = 'Pengambilan Cuti Tahunan yang disetujui HR';
        fileName = `Form_Pengajuan_Cuti_${dateStr}.pdf`;
      } else if (hash === 9) {
        status = 'alpha';
        notes = 'Tanpa keterangan resmi (Alpha)';
        hasFile = false;
      }

      const hour = 8;
      const minute = 10 + ((empIdx * 5 + dayOffset) % 45);
      const timeStr = status === 'hadir' ? `08:${String(minute).padStart(2, '0')} WIB` : '-';

      records.push({
        id: `rec-${dateStr}-${emp.id}`,
        employeeId: emp.id,
        employeeEmail: emp.email,
        employeeName: emp.name,
        division: emp.division,
        date: dateStr,
        time: timeStr,
        status,
        workLocation: status === 'hadir' ? ((hash % 2 === 0) ? 'wfo' : 'wfh') : undefined,
        notes,
        workProofFile: hasFile ? {
          name: fileName,
          size: Math.floor(350 + (hash * 12)) * 1024,
          type: 'application/pdf',
          uploadedAt: timeStr !== '-' ? timeStr : '10:00 WIB',
          summary: `Dokumen verifikasi ${status === 'hadir' ? 'hasil kerja' : 'pengajuan ' + status}`
        } : undefined,
        checkInLocation: status === 'hadir' ? ((hash % 2 === 0) ? 'Kantor Pusat Jakarta' : 'Remote / WFH') : undefined
      });
    });
  }

  return records;
}

const STORAGE_KEYS = {
  EMPLOYEES: 'absenku_employees_v1',
  ATTENDANCE: 'absenku_attendance_v1',
  REMINDERS: 'absenku_reminders_v1',
  LOGS: 'absenku_logs_v1',
  CURRENT_USER_EMAIL: 'absenku_current_user_email_v1'
};

export function getStoredEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading employees from localStorage', e);
  }
  return INITIAL_EMPLOYEES;
}

export function saveStoredEmployees(employees: Employee[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed saving employees to localStorage', e);
  }
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading attendance from localStorage', e);
  }
  const seeded = generateSeedAttendance();
  saveStoredAttendance(seeded);
  return seeded;
}

export function saveStoredAttendance(records: AttendanceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  } catch (e) {
    console.error('Failed saving attendance to localStorage', e);
  }
}

export function getStoredReminderSettings(): ReminderSetting {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading reminder settings', e);
  }
  return INITIAL_REMINDER_SETTINGS;
}

export function saveStoredReminderSettings(settings: ReminderSetting) {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving reminder settings', e);
  }
}

export function getStoredReminderLogs(): ReminderLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading reminder logs', e);
  }
  return INITIAL_REMINDER_LOGS;
}

export function saveStoredReminderLogs(logs: ReminderLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed saving reminder logs', e);
  }
}

export function getStoredUserEmail(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL) || 'budi.santoso@perusahaan.com';
  } catch {
    return 'budi.santoso@perusahaan.com';
  }
}

export function setStoredUserEmail(email: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, email);
  } catch (e) {
    console.error(e);
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.REMINDERS);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
}
