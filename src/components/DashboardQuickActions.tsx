
import React from 'react';
import { UserPlus, Calendar, Search, Settings, Palette, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';

type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking' | 'doctor-consultation' | 'app-schedule' | 'app-configuration';

interface DashboardQuickActionsProps {
  userRole: string;
  onViewChange: (view: ViewMode) => void;
}

const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ userRole, onViewChange }) => {
  const { getFieldValue } = useScreenFields();

  if (userRole !== 'admin' && userRole !== 'staff') {
    return null;
  }

  return (
    <div className="relative z-10 w-full">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
        <Button
          onClick={() => onViewChange('register')}
          className="bg-[#0F52BA] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          {getFieldValue('register_patient_btn', 'dashboard')}
        </Button>
        <Button
          onClick={() => onViewChange('booking')}
          className="bg-[#4169E1] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          {getFieldValue('book_appointment_btn', 'dashboard')}
        </Button>
        <Button
          onClick={() => onViewChange('search')}
          className="bg-[#088F8F] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
        >
          <Search className="w-5 h-5 mr-2" />
          {getFieldValue('patient_search_btn', 'dashboard')}
        </Button>
      </div>
    </div>
  );
};

export default DashboardQuickActions;
