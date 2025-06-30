
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vitals Done': return 'bg-blue-100 text-blue-800';
      case 'With Doctor': return 'bg-green-100 text-green-800';
      case 'Sent for Tests': return 'bg-yellow-100 text-yellow-800';
      case 'Re-check Pending': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      item.patient?.token.toString().includes(searchTerm)
    );
  }, [appointments, patients, searchTerm]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
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
              <SelectContent>
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
                <TableHead>Patient Name</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                {userRole === 'admin' && <TableHead>Actions</TableHead>}
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
                    <div>
                      <p className="font-medium">{appointment.patient?.name}</p>
                      <p className="text-sm text-gray-500">{appointment.patient?.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  {userRole === 'admin' && (
                    <TableCell>
                      <Select onValueChange={(value) => onUpdateStatus(appointment.patientId, value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vitals Done">Vitals Done</SelectItem>
                          <SelectItem value="With Doctor">With Doctor</SelectItem>
                          <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
                          <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} results
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
  );
};

export default AppointmentsDataTable;
