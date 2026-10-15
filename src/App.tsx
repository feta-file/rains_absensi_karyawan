import React, { useState, useEffect, useMemo } from 'react';
import { 
  Employee, 
  AttendanceRecord, 
  ReminderSetting, 
  ReminderLog, 
  WorkProofFile 
} from './types/attendance';
import { 
  getStoredEmployees, 
  saveStoredEmployees, 
  getStoredAttendance, 
  saveStoredAttendance, 
  getStoredReminderSettings, 
  saveStoredReminderSettings, 
  getStoredReminderLogs, 
  saveStoredReminderLogs, 
  getStoredUserEmail, 
  setStoredUserEmail, 
  resetAllData 
} from './data/mockData';
import { Header } from './components/Header';
import { EmployeeCheckIn } from './components/EmployeeCheckIn';
import { EmployeeHistory } from './components/EmployeeHistory';
import { HRDashboard } from './components/HRDashboard';
import { ReminderBanner } from './components/ReminderBanner';
import { ReminderModal } from './components/ReminderModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { 
  Smartphone, 
  History, 
  FileCheck, 
  Info, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText 
} from 'lucide-react';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => getStoredEmployees());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStoredAttendance());
  const [reminderSettings, setReminderSettings] = useState<ReminderSetting>(() => getStoredReminderSettings());
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => getStoredReminderLogs());
  const [currentEmail, setCurrentEmail] = useState<string>(() => getStoredUserEmail());

  const [appRole, setAppRole] = useState<'employee' | 'hr'>('employee');
  const [employeeSubTab, setEmployeeSubTab] = useState<'checkin' | 'history' | 'guide'>('checkin');
  const [isMobileFrameActive, setIsMobileFrameActive] = useState<boolean>(true);

  // PDF Viewer Modal State
  const [pdfModal, setPdfModal] = useState<{
    file: WorkProofFile;
    employeeName: string;
    division: string;
    dateStr: string;
  } | null>(null);

  // Reminder Modal State
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const todayDateStr = '2026-10-15';

  // Matched employee from current email
  const currentEmployee = useMemo(() => {
    return employees.find((e) => e.email.toLowerCase() === currentEmail.toLowerCase()) || employees[0];
  }, [employees, currentEmail]);

  // Today check-in for active employee
  const currentEmployeeTodayRecord = useMemo(() => {
    if (!currentEmployee) return null;
    return attendanceRecords.find(
      (r) => r.employeeId === currentEmployee.id && r.date === todayDateStr
    ) || null;
  }, [attendanceRecords, currentEmployee, todayDateStr]);

  // Pending count for the day
  const pendingCheckInCount = useMemo(() => {
    return employees.filter((emp) => {
      return !attendanceRecords.some((r) => r.employeeId === emp.id && r.date === todayDateStr);
    }).length;
  }, [employees, attendanceRecords, todayDateStr]);

  // Handlers
  const handleEmailChange = (email: string) => {
    setCurrentEmail(email);
    setStoredUserEmail(email);
  };

  const handleSubmitAttendance = (record: AttendanceRecord) => {
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => !(r.employeeId === record.employeeId && r.date === record.date));
      const updated = [record, ...filtered];
      saveStoredAttendance(updated);
      return updated;
    });
  };

  const handleUpdateReminderSettings = (settings: ReminderSetting) => {
    setReminderSettings(settings);
    saveStoredReminderSettings(settings);
  };

  const handleAddReminderLog = (log: ReminderLog) => {
    setReminderLogs((prev) => {
      const updated = [log, ...prev];
      saveStoredReminderLogs(updated);
      return updated;
    });
  };

  const handleOpenPdfViewer = (file: WorkProofFile, empName: string, division: string, dateStr: string) => {
    setPdfModal({
      file,
      employeeName: empName,
      division,
      dateStr
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset semua data absensi dan pengaturan ke data awal bawaan?')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Header
        appRole={appRole}
        onRoleChange={setAppRole}
        isMobileFrameActive={isMobileFrameActive}
        onToggleMobileFrame={() => setIsMobileFrameActive(!isMobileFrameActive)}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
        onResetData={handleResetData}
        pendingCheckInCount={pendingCheckInCount}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        
        {/* EMPLOYEE PORTAL (MOBILE-OPTIMIZED) */}
        {appRole === 'employee' ? (
          <MobileFrameWrapper
            isMobileFrameActive={isMobileFrameActive}
            onToggleFrame={() => setIsMobileFrameActive(!isMobileFrameActive)}
            title="AbsenKu HP Karyawan"
          >
            {/* Automated Reminder Alert Banner */}
            {reminderSettings.enableInAppBanner && (
              <ReminderBanner
                currentEmployee={currentEmployee}
                todayRecord={currentEmployeeTodayRecord}
                cutoffTime={reminderSettings.cutoffTime}
                onGoToCheckIn={() => setEmployeeSubTab('checkin')}
              />
            )}

            {/* Mobile Employee Segment Tabs */}
            <div className="bg-white rounded-2xl p-1 border border-slate-200 grid grid-cols-3 gap-1 text-xs font-bold shadow-2xs mb-4">
              <button
                onClick={() => setEmployeeSubTab('checkin')}
                className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  employeeSubTab === 'checkin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Absensi</span>
              </button>
              
              <button
                onClick={() => setEmployeeSubTab('history')}
                className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  employeeSubTab === 'history'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Riwayat Saya</span>
              </button>

              <button
                onClick={() => setEmployeeSubTab('guide')}
                className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  employeeSubTab === 'guide'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Panduan HP</span>
              </button>
            </div>

            {/* Tab 1: Form Absensi Harian */}
            {employeeSubTab === 'checkin' && (
              <EmployeeCheckIn
                employees={employees}
                attendanceRecords={attendanceRecords}
                currentEmail={currentEmail}
                onEmailChange={handleEmailChange}
                onSubmitAttendance={handleSubmitAttendance}
                onViewPdf={handleOpenPdfViewer}
              />
            )}

            {/* Tab 2: Riwayat Presensi Pribadi Karyawan */}
            {employeeSubTab === 'history' && (
              <EmployeeHistory
                currentEmployee={currentEmployee}
                attendanceRecords={attendanceRecords}
                onViewPdf={handleOpenPdfViewer}
              />
            )}

            {/* Tab 3: Petunjuk & SOP Karyawan */}
            {employeeSubTab === 'guide' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Ketentuan Absensi Online Mobile</h3>
                    <p className="text-[11px] text-slate-500">PT Nusantara Digital Indonesia</p>
                  </div>
                </div>

                <div className="space-y-3 text-slate-600">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Batas Waktu Pengisian (Cutoff)</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Karyawan wajib melakukan pengisian absensi harian paling lambat pukul <strong className="text-rose-600">09:00 WIB</strong> setiap hari kerja. Sistem akan otomatis memicu pengingat bagi yang belum absen.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>Kewajiban Unggah Berkas PDF</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Untuk status Hadir, wajib melampirkan berkas hasil kerja (PDF max 15MB). Untuk status Sakit, wajib menyertakan foto/scan Surat Keterangan Dokter dalam format PDF.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pencocokan Otomatis Email</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Sistem mencocokkan identitas Nama dan Divisi Anda secara otomatis di halaman belakang melalui inputan alamat email terdaftar perusahaan.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </MobileFrameWrapper>
        ) : (
          /* HR PORTAL */
          <HRDashboard
            employees={employees}
            attendanceRecords={attendanceRecords}
            onViewPdf={handleOpenPdfViewer}
            onOpenReminderModal={() => setIsReminderModalOpen(true)}
            todayDateStr={todayDateStr}
          />
        )}

      </main>

      {/* Automated Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        employees={employees}
        attendanceRecords={attendanceRecords}
        reminderSettings={reminderSettings}
        onUpdateSettings={handleUpdateReminderSettings}
        reminderLogs={reminderLogs}
        onAddReminderLog={handleAddReminderLog}
        todayDateStr={todayDateStr}
      />

      {/* PDF Document Viewer Modal */}
      <PdfViewerModal
        file={pdfModal?.file || null}
        employeeName={pdfModal?.employeeName}
        division={pdfModal?.division}
        dateStr={pdfModal?.dateStr}
        onClose={() => setPdfModal(null)}
      />

    </div>
  );
}
