
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VitalsModal from './VitalsModal';
import RescheduleModal from './RescheduleModal';
import DoctorConsultationPage from './DoctorConsultationPage';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  token: number;
  status: string;
  gender: string;
  age: number;
  address: string;
  emergencyContact: string;
  mrNumber?: string;
}

interface Appointment {
  id: number;
  patientId: number;
  doctor: string;
  time: string;
  date: string;
  status: string;
  type: string;
}

interface AppointmentsDataTableProps {
  appointments: Appointment[];
  patients: Patient[];
  userRole: string;
  onUpdateStatus: (patientId: number, newStatus: string) => void;
}

const AppointmentsDataTable: React.FC<AppointmentsDataTableProps> = ({
  appointments,
  patients,
  userRole,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showConsultationPage, setShowConsultationPage] = useState(false);
  const [selectedPatientVitals, setSelectedPatientVitals] = useState<any>(null);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vitals Done': return 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100';
      case 'With Doctor': return 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100';
      case 'Sent for Tests': return 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100';
      case 'Re-check Pending': return 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100';
      case 'Completed': return 'bg-green-50 text-green-900 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100';
    }
  };

  const getMRNumber = (patient: Patient) => {
    return `MR${String(patient.id).padStart(6, '0')}`;
  };

  const filteredAppointments = useMemo(() => {
    const appointmentsWithPatients = appointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      return { ...appointment, patient };
    }).filter(item => item.patient);

    if (!searchTerm) return appointmentsWithPatients;

    return appointmentsWithPatients.filter(item =>
      item.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient?.token.toString().includes(searchTerm) ||
      getMRNumber(item.patient!).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, patients, searchTerm]);

  // Sort appointments: Completed ones go to the end, others by token number
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      return (a.patient?.token || 0) - (b.patient?.token || 0);
    });
  }, [filteredAppointments]);

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleVitalsClick = (appointment: any) => {
    // Prevent vitals update for completed patients
    if (appointment.status === 'Completed') {
      toast({
        title: "⚠️ Cannot Update Vitals",
        description: "Vitals cannot be updated for completed patients",
        variant: "destructive"
      });
      return;
    }

    setSelectedAppointment(appointment);
    // Mock existing vitals data - in real app, fetch from backend
    const mockVitals = appointment.status === 'Vitals Done' ? {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6',
      weight: '150',
      height: '5\'6"',
      oxygenSaturation: '98',
      notes: 'Patient appears comfortable'
    } : null;
    setSelectedPatientVitals(mockVitals);
    setVitalsModalOpen(true);
  };

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleWithDoctorClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowConsultationPage(true);
  };

  const handleVitalsSave = (vitalsData: any) => {
    onUpdateStatus(selectedAppointment.patientId, 'Vitals Done');
    setVitalsModalOpen(false);
  };

  const handleReschedule = (newDate: string, newTime: string) => {
    toast({
      title: "✅ Appointment Rescheduled",
      description: `Appointment rescheduled to ${newDate} at ${newTime}`,
    });
    setRescheduleModalOpen(false);
  };

  const handleConsultationUpdate = (consultationData: any) => {
    onUpdateStatus(selectedAppointment.patientId, 'With Doctor');
    setShowConsultationPage(false);
  };

  const getActionButtons = (appointment: any) => {
    const buttons = [];

    if (userRole === 'staff') {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          className="bg-[#088F8F] hover:bg-[#000080] text-white mr-2"
        >
          <Activity className="w-4 h-4 mr-1" />
          Vitals
        </Button>
      );
      buttons.push(
        <Button
          key="reschedule"
          size="sm"
          variant="outline"
          onClick={() => handleRescheduleClick(appointment)}
          className="border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white mr-2"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Reschedule
        </Button>
      );
    }

    if (userRole === 'doctor') {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          className="bg-[#088F8F] hover:bg-[#000080] text-white mr-2"
        >
          <Activity className="w-4 h-4 mr-1" />
          {appointment.status === 'Vitals Done' ? 'Update Vitals' : 'Record Vitals'}
        </Button>
      );
      
      buttons.push(
        <Select onValueChange={(value) => {
          if (value === 'With Doctor') {
            handleWithDoctorClick(appointment);
          } else {
            onUpdateStatus(appointment.patientId, value);
          }
        }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="With Doctor">With Doctor</SelectItem>
            <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
            <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (userRole === 'admin') {
      buttons.push(
        <Select onValueChange={(value) => onUpdateStatus(appointment.patientId, value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Update" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Vitals Done">Vitals Done</SelectItem>
            <SelectItem value="With Doctor">With Doctor</SelectItem>
            <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
            <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return buttons;
  };

  if (showConsultationPage && selectedAppointment) {
    return (
      <DoctorConsultationPage
        patient={selectedAppointment.patient}
        appointment={selectedAppointment}
        onBack={() => setShowConsultationPage(false)}
        onUpdateConsultation={handleConsultationUpdate}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl">Today's Appointments</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>MR Number</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {appointment.patient?.token}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[#0F52BA] font-bold">
                        {getMRNumber(appointment.patient!)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patient?.name}</p>
                        <p className="text-sm text-gray-500">{appointment.patient?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(appointment.status)} border transition-colors`}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getActionButtons(appointment)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAppointments.length)} of {sortedAppointments.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-primary hover:bg-primary-hover" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedAppointment && (
        <>
          <VitalsModal
            isOpen={vitalsModalOpen}
            onClose={() => setVitalsModalOpen(false)}
            onSave={handleVitalsSave}
            patientName={selectedAppointment.patient?.name || ''}
            mrNumber={getMRNumber(selectedAppointment.patient!)}
            existingVitals={selectedPatientVitals}
            patientAge={selectedAppointment.patient?.age || 35}
            isCompleted={selectedAppointment.status === 'Completed'}
          />
          <RescheduleModal
            isOpen={rescheduleModalOpen}
            onClose={() => setRescheduleModalOpen(false)}
            onReschedule={handleReschedule}
            patientName={selectedAppointment.patient?.name || ''}
            currentDate={selectedAppointment.date}
            currentTime={selectedAppointment.time}
          />
        </>
      )}
    </>
  );
};

export default AppointmentsDataTable;
