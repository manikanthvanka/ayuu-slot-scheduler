
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
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center space-x-2 min-w-0">
            <Clock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="text-xs md:text-sm lg:text-base truncate">
              Appointments for {selectedDate ? getDateLabel(quickDateOptions.find(opt => opt.value === selectedDate)?.days || 0) : 'Selected Date'}
            </span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {filteredAppointments.length} appointments
            </Badge>
            <Button
              onClick={onPrintSchedule}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 px-2 py-1 h-auto"
            >
              <Printer className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline text-xs md:text-sm">Print Schedule</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <Calendar className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 md:mb-4" />
            <p className="text-gray-500 text-sm md:text-base">No appointments found for the selected criteria</p>
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
