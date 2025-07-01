import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import RescheduleModal from '@/components/RescheduleModal';
import AppScheduleFilters from '@/components/schedule/AppScheduleFilters';
import AppointmentsList from '@/components/schedule/AppointmentsList';
import { generateScheduleReport } from '@/components/schedule/SchedulePrintUtils';

interface AppScheduleViewProps {
  onBack: () => void;
  appointments: any[];
}

const AppScheduleView: React.FC<AppScheduleViewProps> = ({ onBack, appointments }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState<{ open: boolean; appointment: any | null }>({ open: false, appointment: null });
  const { toast } = useToast();

  const getDateOffset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const quickDateOptions = [
    { label: 'Tomorrow', value: getDateOffset(1), days: 1 },
    { label: 'Day After Tomorrow', value: getDateOffset(2), days: 2 },
    { label: 'Next Week', value: getDateOffset(7), days: 7 }
  ];

  const mockScheduleData = [
    {
      id: 1,
      patientName: 'John Smith',
      mrNumber: 'MR240001',
      doctorName: 'Dr. Sarah Johnson',
      appointmentTime: '09:00 AM',
      appointmentType: 'Consultation',
      status: 'Scheduled',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      patientName: 'Mary Davis',
      mrNumber: 'MR240002',
      doctorName: 'Dr. Michael Brown',
      appointmentTime: '10:30 AM',
      appointmentType: 'Follow-up',
      status: 'Confirmed',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      patientName: 'Robert Wilson',
      mrNumber: 'MR240003',
      doctorName: 'Dr. Sarah Johnson',
      appointmentTime: '02:00 PM',
      appointmentType: 'Check-up',
      status: 'Scheduled',
      phone: '+1 (555) 345-6789'
    }
  ];

  const filteredAppointments = mockScheduleData.filter(appointment => {
    const matchesDoctor = !doctorFilter || doctorFilter === 'all' || appointment.doctorName === doctorFilter;
    const matchesSearch = !searchTerm || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.mrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDoctor && matchesSearch;
  });

  const handleReschedule = (appointment: any) => {
    setRescheduleModal({ open: true, appointment });
  };

  const handleCancelAppointment = (appointmentId: number) => {
    toast({
      title: "✅ Appointment Cancelled",
      description: "The appointment has been cancelled successfully.",
    });
  };

  const handlePrintSchedule = () => {
    generateScheduleReport(filteredAppointments, selectedDate, doctorFilter);
  };

  const onRescheduleConfirm = (newDate: string, newTime: string) => {
    setRescheduleModal({ open: false, appointment: null });
  };

  const uniqueDoctors = [...new Set(mockScheduleData.map(apt => apt.doctorName))];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-[#0F52BA]">Appointment Schedule</h2>
      </div>

      <AppScheduleFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        doctorFilter={doctorFilter}
        setDoctorFilter={setDoctorFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        uniqueDoctors={uniqueDoctors}
      />

      <AppointmentsList
        filteredAppointments={filteredAppointments}
        selectedDate={selectedDate}
        quickDateOptions={quickDateOptions}
        onReschedule={handleReschedule}
        onCancel={handleCancelAppointment}
        onPrintSchedule={handlePrintSchedule}
      />

      <RescheduleModal
        isOpen={rescheduleModal.open}
        onClose={() => setRescheduleModal({ open: false, appointment: null })}
        onReschedule={onRescheduleConfirm}
        patientName={rescheduleModal.appointment?.patientName || ''}
        currentDate={selectedDate || 'N/A'}
        currentTime={rescheduleModal.appointment?.appointmentTime || 'N/A'}
      />
    </div>
  );
};

export default AppScheduleView;