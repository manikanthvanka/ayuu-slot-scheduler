
import React from 'react';
import { UserPlus, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/types';

interface QuickActionsProps {
  hasRegisterPermission: boolean;
  hasBookingPermission: boolean;
  hasSearchPermission: boolean;
  onViewChange: (view: ViewMode) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  hasRegisterPermission,
  hasBookingPermission,
  hasSearchPermission,
  onViewChange
}) => {
  if (!hasRegisterPermission && !hasBookingPermission && !hasSearchPermission) {
    return null;
  }

  return (
    <div className="relative z-10 w-full">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
        {hasRegisterPermission && (
          <Button
            onClick={() => onViewChange('register')}
            className="bg-primary text-white h-12 flex-1 sm:flex-none"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Register Patient
          </Button>
        )}
        {hasBookingPermission && (
          <Button
            onClick={() => onViewChange('booking')}
            className="bg-green-600 text-white h-12 flex-1 sm:flex-none"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
        )}
        {hasSearchPermission && (
          <Button
            onClick={() => onViewChange('search')}
            className="bg-purple-600 text-white h-12 flex-1 sm:flex-none"
          >
            <Search className="w-5 h-5 mr-2" />
            Patient Search
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
