import React from 'react';
import { Calendar, Clock, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppointmentCard from './AppointmentCard';
import { getDateLabel } from './SchedulePrintUtils';

interface AppointmentsListProps {
  filteredAppointments: any[];
  selectedDate: string;
  quickDateOptions: any[];
  onReschedule: (appointment: any) => void;
  onCancel: (id: number) => void;
  onPrintSchedule: () => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  filteredAppointments,
  selectedDate,
  quickDateOptions,
  onReschedule,
  onCancel,
  onPrintSchedule
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm sm:text-base">
              Appointments for {selectedDate ? getDateLabel(quickDateOptions.find(opt => opt.value === selectedDate)?.days || 0) : 'Selected Date'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {filteredAppointments.length} appointments
            </Badge>
            <Button
              onClick={onPrintSchedule}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Schedule</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found for the selected criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={onReschedule}
                onCancel={onCancel}
                onPrint={() => window.print()}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;