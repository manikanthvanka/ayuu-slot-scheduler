
import React from 'react';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/AppointmentBooking';
import LiveQueue from '@/components/LiveQueue';
import ReturnQueue from '@/components/ReturnQueue';
import PatientSearch from '@/components/PatientSearch';
import PatientHistoryPage from '@/components/PatientHistoryPage';
import RoleManagement from '@/components/RoleManagement';
import ScreenFieldsManagement from '@/components/ScreenFieldsManagement';
import ColorCustomization from '@/components/ColorCustomization';
import PatientStageTracking from '@/components/PatientStageTracking';
import AppointmentsDataTable from '@/components/AppointmentsDataTable';
import DashboardQuickActions from '@/components/DashboardQuickActions';
import DashboardStats from '@/components/DashboardStats';
import DoctorConsultationPage from '@/components/DoctorConsultationPage';
import AppScheduleView from '@/components/AppScheduleView';
import AppConfigurationPage from '@/components/AppConfigurationPage';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking' | 'doctor-consultation' | 'app-schedule' | 'app-configuration';

interface ViewRendererProps {
  currentView: ViewMode;
  userRole: UserRole;
  patients: any[];
  appointments: any[];
  pendingAppointmentData: any;
  selectedPatientForHistory: any;
  selectedPatientForConsultation?: any;
  onViewChange: (view: ViewMode) => void;
  onAddNewPatient: (patientData: any) => void;
  onAddNewAppointment: (appointmentData: any) => void;
  onUpdatePatientStatus: (patientId: string, newStatus: string) => void;
  onBookAppointmentFromRegistration: (patientData: any) => void;
  onBookAppointmentFromSearch: (mrNumber: string) => void;
  onViewPatientHistory: (patient: any) => void;
  onViewPatientConsultation?: (patient: any) => void;
  onDownloadReport: (reportType: string) => void;
  onShareReport: (reportType: string) => void;
}

const ViewRenderer: React.FC<ViewRendererProps> = ({
  currentView,
  userRole,
  patients,
  appointments,
  pendingAppointmentData,
  selectedPatientForHistory,
  selectedPatientForConsultation,
  onViewChange,
  onAddNewPatient,
  onAddNewAppointment,
  onUpdatePatientStatus,
  onBookAppointmentFromRegistration,
  onBookAppointmentFromSearch,
  onViewPatientHistory,
  onViewPatientConsultation,
  onDownloadReport,
  onShareReport
}) => {
  const renderDashboard = () => (
    <div className="space-y-6 relative w-full">
      <DashboardQuickActions 
        userRole={userRole}
        onViewChange={onViewChange}
      />

      <DashboardStats
        appointments={appointments}
        patients={patients}
        onDownloadReport={onDownloadReport}
        onShareReport={onShareReport}
      />

      <div className="relative z-10 w-full overflow-hidden">
        <AppointmentsDataTable
          appointments={appointments}
          patients={patients}
          userRole={userRole}
          onUpdateStatus={onUpdatePatientStatus}
        />
      </div>
    </div>
  );

  switch (currentView) {
    case 'register':
      return (
        <PatientRegistration 
          onSubmit={onAddNewPatient} 
          onBack={() => onViewChange('dashboard')}
          onBookAppointment={onBookAppointmentFromRegistration}
        />
      );
    case 'booking':
      return (
        <AppointmentBooking 
          onSubmit={(appointmentData) => {
            const newAppointment = {
              ...appointmentData,
              token: appointments.length + 1
            };
            onAddNewAppointment(newAppointment);
          }} 
          onBack={() => onViewChange('dashboard')}
          prefilledMRData={pendingAppointmentData}
        />
      );
    case 'queue':
      return <LiveQueue patients={patients} onUpdateStatus={onUpdatePatientStatus} onBack={() => onViewChange('dashboard')} />;
    case 'return-queue':
      return <ReturnQueue patients={patients.filter(p => p.status === 'Re-check Pending')} onUpdateStatus={onUpdatePatientStatus} onBack={() => onViewChange('dashboard')} />;
    case 'search':
      return (
        <PatientSearch 
          patients={patients} 
          onBack={() => onViewChange('dashboard')} 
          onBookAppointment={onBookAppointmentFromSearch}
          onViewHistory={onViewPatientHistory}
        />
      );
    case 'patient-history':
      return (
        <PatientHistoryPage
          patient={selectedPatientForHistory}
          onBack={() => onViewChange('search')}
        />
      );
    case 'doctor-consultation':
      return (
        <DoctorConsultationPage
          patient={selectedPatientForConsultation}
          onBack={() => onViewChange('queue')}
          onUpdatePatientStatus={onUpdatePatientStatus}
        />
      );
    case 'role-management':
      return <RoleManagement onBack={() => onViewChange('dashboard')} userRole={userRole} />;
    case 'screen-fields':
      return <ScreenFieldsManagement onBack={() => onViewChange('dashboard')} />;
    case 'color-customization':
      return <ColorCustomization onBack={() => onViewChange('dashboard')} />;
    case 'stage-tracking':
      return <PatientStageTracking onBack={() => onViewChange('dashboard')} />;
    case 'app-schedule':
      return <AppScheduleView onBack={() => onViewChange('dashboard')} appointments={appointments} />;
    case 'app-configuration':
      return <AppConfigurationPage onBack={() => onViewChange('dashboard')} />;
    default:
      return renderDashboard();
  }
};

export default ViewRenderer;
