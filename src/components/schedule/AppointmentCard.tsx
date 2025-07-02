import React from 'react';
import { Clock, User, Edit, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppointmentCardProps {
  appointment: {
    id: number;
    patientName: string;
    mrNumber: string;
    doctorName: string;
    appointmentTime: string;
    appointmentType: string;
    status: string;
    phone: string;
  };
  onReschedule: (appointment: any) => void;
  onCancel: (id: number) => void;
  onPrint: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onPrint
}) => {
  const { t } = useLanguage();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-2 md:p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-6 md:gap-4 md:items-center">
        <div className="md:lg:col-span-2">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3 md:w-4 md:h-4 text-[#0F52BA] flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-sm md:text-base truncate">{appointment.patientName}</p>
              <p className="text-xs md:text-sm text-gray-600">{appointment.mrNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="md:space-y-1">
          <p className="font-medium text-sm md:text-base">{appointment.doctorName}</p>
          <p className="text-xs md:text-sm text-gray-600">{appointment.appointmentType}</p>
        </div>
        
        <div className="md:space-y-1">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">{appointment.appointmentTime}</span>
          </div>
          <p className="text-xs md:text-sm text-gray-600">{appointment.phone}</p>
        </div>
        
        <div className="flex md:justify-center">
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1 md:gap-2 md:justify-end">
          <Button
            onClick={() => onReschedule(appointment)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1 text-xs md:text-sm px-2 py-1 h-auto"
          >
            <Edit className="w-3 h-3" />
            <span className="hidden sm:inline">{t('reschedule')}</span>
          </Button>
          <Button
            onClick={() => onCancel(appointment.id)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1 text-red-600 hover:bg-red-50 text-xs md:text-sm px-2 py-1 h-auto"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">{t('cancel')}</span>
          </Button>
          <Button
            onClick={onPrint}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1 text-xs md:text-sm px-2 py-1 h-auto"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">{t('print')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;