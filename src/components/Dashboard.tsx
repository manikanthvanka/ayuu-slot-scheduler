
import React from 'react';
import QuickActions from './QuickActions';
import StatsCards from './StatsCards';
import AppointmentsDataTable from './AppointmentsDataTable';
import type { Patient_ScreenName, Appointment, UserRole, ViewMode } from '@/types';

interface DashboardProps {
  appointments: Appointment[];
  patients: Patient_ScreenName[];
  userRole: UserRole;
  onUpdateStatus: (patientId: number, newStatus: string) => void;
  onViewChange: (view: ViewMode) => void;
  hasRegisterPermission: boolean;
  hasBookingPermission: boolean;
  hasSearchPermission: boolean;
  hasVitalsDonePermission: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  appointments,
  patients,
  userRole,
  onUpdateStatus,
  onViewChange,
  hasRegisterPermission,
  hasBookingPermission,
  hasSearchPermission,
  hasVitalsDonePermission
}) => {
  return (
    <div className="space-y-6 relative w-full">
      <QuickActions
        hasRegisterPermission={hasRegisterPermission}
        hasBookingPermission={hasBookingPermission}
        hasSearchPermission={hasSearchPermission}
        onViewChange={onViewChange}
      />

      <StatsCards appointments={appointments} patients={patients} />

      <div className="relative z-10 w-full overflow-hidden">
        <AppointmentsDataTable
          appointments={appointments}
          patients={patients}
          userRole={userRole}
          onUpdateStatus={onUpdateStatus}
          hasVitalsDonePermission={hasVitalsDonePermission}
        />
      </div>
    </div>
  );
};

export default Dashboard;
