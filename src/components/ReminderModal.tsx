import React, { useState } from 'react';
import { Employee, AttendanceRecord, ReminderSetting, ReminderLog } from '../types/attendance';
import { 
  Bell, 
  Send, 
  Clock, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Smartphone, 
  X, 
  Users, 
  Radio, 
  History,
  Sparkles
} from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  reminderSettings: ReminderSetting;
  onUpdateSettings: (settings: ReminderSetting) => void;
  reminderLogs: ReminderLog[];
  onAddReminderLog: (log: ReminderLog) => void;
  todayDateStr?: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  employees,
  attendanceRecords,
  reminderSettings,
  onUpdateSettings,
  reminderLogs,
  onAddReminderLog,
  todayDateStr = '2026-10-15',
}) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'settings' | 'history'>('broadcast');
  const [isSending, setIsSending] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Settings form local state
  const [cutoffTime, setCutoffTime] = useState(reminderSettings.cutoffTime);
  const [reminderTime, setReminderTime] = useState(reminderSettings.reminderTime);
  const [enableBrowserPush, setEnableBrowserPush] = useState(reminderSettings.enableBrowserPush);
  const [enableWhatsApp, setEnableWhatsApp] = useState(reminderSettings.enableWhatsApp);
  const [enableInAppBanner, setEnableInAppBanner] = useState(reminderSettings.enableInAppBanner);
  const [template, setTemplate] = useState(reminderSettings.messageTemplate);

  if (!isOpen) return null;

  // Find employees who haven't checked in today
  const pendingEmployees = employees.filter((emp) => {
    return !attendanceRecords.some(
      (r) => r.employeeId === emp.id && r.date === todayDateStr
    );
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ReminderSetting = {
      enabled: true,
      cutoffTime,
      reminderTime,
      enableBrowserPush,
      enableWhatsApp,
      enableInAppBanner,
      messageTemplate: template
    };
    onUpdateSettings(updated);
    setSuccessBanner('Pengaturan notifikasi pengingat otomatis berhasil disimpan!');
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('AbsenKu HR: Izin Notifikasi Aktif', {
          body: 'Notifikasi pengingat absensi harian otomatis telah diaktifkan untuk perangkat ini.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleSendBroadcast = () => {
    if (pendingEmployees.length === 0) return;
    setIsSending(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newLog: ReminderLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeStr,
        employeeIds: pendingEmployees.map((e) => e.id),
        employeeNames: pendingEmployees.map((e) => e.name),
        channel: 'Broadcast Otomatis',
        status: 'Terkirim',
        notes: `Pengingat otomatis berhasil dikirimkan ke ${pendingEmployees.length} karyawan via In-App Banner & WhatsApp link.`
      };

      onAddReminderLog(newLog);
      setIsSending(false);
      setSuccessBanner(`Pengingat otomatis berhasil dikirimkan ke ${pendingEmployees.length} karyawan!`);

      // Trigger web notification if granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pengingat Absensi Dikirim', {
          body: `Telah mengingatkan ${pendingEmployees.length} karyawan yang belum absen sebelum batas waktu ${cutoffTime} WIB.`,
        });
      }

      setTimeout(() => setSuccessBanner(null), 4000);
    }, 600);
  };

  // Generate WhatsApp reminder link
  const getWhatsAppLink = (emp: Employee) => {
    const rawMsg = template
      .replace('[Nama]', emp.name)
      .replace('[Tanggal]', '15 Oktober 2026')
      .replace('[BatasWaktu]', cutoffTime);
    return `https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(rawMsg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bell className="w-5 h-5 animate-wiggle" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Pusat Pengingat Otomatis Absensi
              </h3>
              <p className="text-xs text-blue-100">
                Otomatisasi notifikasi kehadiran karyawan sebelum batas jam kerja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'broadcast'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Karyawan Belum Absen ({pendingEmployees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Otomatis</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Pengingat ({reminderLogs.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          
          {/* Notification Feedback Banner */}
          {successBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in duration-150">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* TAB 1: BROADCAST & PENDING EMPLOYEES */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4">
              
              {/* Status Overview Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="font-bold text-slate-800 text-xs">Status Hari Ini (15 Okt 2026)</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {pendingEmployees.length} dari {employees.length} Karyawan Belum Absen
                  </p>
                  <p className="text-xs text-slate-500">
                    Batas waktu pengisian absensi hari ini: <span className="font-bold text-rose-600">{cutoffTime} WIB</span>
                  </p>
                </div>

                <button
                  onClick={handleSendBroadcast}
                  disabled={isSending || pendingEmployees.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pengingat Otomatis ({pendingEmployees.length})</span>
                    </>
                  )}
                </button>
              </div>

              {/* List of Pending Employees */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-600">
                  <span>Daftar Karyawan Belum Absen:</span>
                  <span>Aksi Pengingat Langsung:</span>
                </div>

                {pendingEmployees.length === 0 ? (
                  <div className="p-8 text-center text-xs text-emerald-600 font-bold flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <span>Luar biasa! Seluruh karyawan sudah melakukan absensi hari ini.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingEmployees.map((emp) => (
                      <div key={emp.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-xs text-slate-800">{emp.name}</p>
                            <p className="text-[11px] text-slate-500">{emp.email}</p>
                            <span className="inline-block mt-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md">
                              {emp.division}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={getWhatsAppLink(emp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title="Kirim pesan WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: AUTOMATED SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  Konfigurasi Jadwal & Notifikasi Otomatis
                </h4>
                <p className="text-xs text-slate-500">
                  Tentukan jam peringatan otomatis dan saluran pengiriman notifikasi
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Waktu Kirim Pengingat</span>
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Peringatan otomatis pagi (WIB)</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Batas Waktu Absensi (Cutoff)</span>
                  </label>
                  <input
                    type="time"
                    value={cutoffTime}
                    onChange={(e) => setCutoffTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-rose-600"
                  />
                  <p className="text-[10px] text-slate-400">Batas toleransi hadir tepat waktu</p>
                </div>
              </div>

              {/* Channels checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Saluran Pengingat yang Diaktifkan:
                </label>
                
                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={enableInAppBanner}
                    onChange={(e) => setEnableInAppBanner(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Banner Pengingat In-App</p>
                    <p className="text-[11px] text-slate-500">Muncul di layar HP karyawan jika belum melakukan absensi hari ini</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={enableBrowserPush}
                    onChange={(e) => setEnableBrowserPush(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Web Push Notification (HP / Browser)</p>
                    <p className="text-[11px] text-slate-500">Notifikasi popup sistem Android / iOS / Desktop</p>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={handleRequestPushPermission}
                  className="text-[11px] text-blue-600 hover:underline font-bold pl-7"
                >
                  + Uji Coba Izin Notifikasi Browser Sekarang
                </button>

                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={enableWhatsApp}
                    onChange={(e) => setEnableWhatsApp(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Integrasi WhatsApp Reminder</p>
                    <p className="text-[11px] text-slate-500">Tombol pemicu pesan instan langsung ke nomor WhatsApp karyawan</p>
                  </div>
                </label>
              </div>

              {/* Template Text */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Template Teks Pesan Pengingat:
                </label>
                <textarea
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-sans"
                />
                <p className="text-[10px] text-slate-400">
                  Tag pengganti otomatis: [Nama], [Tanggal], [BatasWaktu]
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOGS HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-2">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>Riwayat Pengiriman Pengingat:</span>
                <span>Status:</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {reminderLogs.map((log) => (
                  <div key={log.id} className="p-3.5 space-y-1 hover:bg-slate-50/70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{log.timeStr}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                          {log.channel}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> {log.status}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px]">{log.notes}</p>
                    <p className="text-[10px] text-slate-400">
                      Tujuan: {log.employeeNames.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <span>AbsenKu Automated Dispatcher Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
