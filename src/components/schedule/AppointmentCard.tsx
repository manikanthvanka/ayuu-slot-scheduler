import React from 'react';
import { Clock, User, Edit, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-[#0F52BA]" />
            <div>
              <p className="font-semibold">{appointment.patientName}</p>
              <p className="text-sm text-gray-600">{appointment.mrNumber}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="font-medium">{appointment.doctorName}</p>
          <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{appointment.appointmentTime}</span>
          </div>
          <p className="text-sm text-gray-600">{appointment.phone}</p>
        </div>
        
        <div className="flex justify-center">
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={() => onReschedule(appointment)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Edit className="w-3 h-3" />
            <span className="hidden sm:inline">Reschedule</span>
          </Button>
          <Button
            onClick={() => onCancel(appointment.id)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1 text-red-600 hover:bg-red-50"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
          <Button
            onClick={onPrint}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;