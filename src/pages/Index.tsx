
import React, { useState } from 'react';
import { Calendar, Clock, Users, UserPlus, Activity, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/AppointmentBooking';
import LiveQueue from '@/components/LiveQueue';
import ReturnQueue from '@/components/ReturnQueue';
import { mockPatients, mockAppointments, mockDoctors } from '@/data/mockData';

type UserRole = 'admin' | 'doctor' | 'staff';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue';

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);

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

  const updatePatientStatus = (patientId: number, newStatus: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    ));
    setAppointments(prev => prev.map(appointment => 
      appointment.patientId === patientId ? { ...appointment, status: newStatus } : appointment
    ));
  };

  const addNewPatient = (patientData: any) => {
    const newPatient = {
      id: patients.length + 1,
      ...patientData,
      token: patients.length + 1,
      status: 'Registered'
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addNewAppointment = (appointmentData: any) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: 'Scheduled'
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Queue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-muted-foreground">Patients waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Queue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDoctors.length}</div>
            <p className="text-xs text-muted-foreground">On duty today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
          <CardDescription>Real-time appointment status and queue management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Token</th>
                  <th className="text-left p-2">Patient Name</th>
                  <th className="text-left p-2">Doctor</th>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-bold">#{patient?.token}</td>
                      <td className="p-2">{patient?.name}</td>
                      <td className="p-2">{appointment.doctor}</td>
                      <td className="p-2">{appointment.time}</td>
                      <td className="p-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {userRole === 'admin' && (
                          <Select onValueChange={(value) => updatePatientStatus(appointment.patientId, value)}>
                            <SelectTrigger className="w-32">
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
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return <PatientRegistration onSubmit={addNewPatient} onBack={() => setCurrentView('dashboard')} />;
      case 'booking':
        return <AppointmentBooking onSubmit={addNewAppointment} onBack={() => setCurrentView('dashboard')} />;
      case 'queue':
        return <LiveQueue patients={patients} onUpdateStatus={updatePatientStatus} onBack={() => setCurrentView('dashboard')} />;
      case 'return-queue':
        return <ReturnQueue patients={patients.filter(p => p.status === 'Re-check Pending')} onUpdateStatus={updatePatientStatus} onBack={() => setCurrentView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Ayuu</h1>
              </div>
              <Badge variant="outline" className="text-xs">Healthcare Management</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === 'queue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('queue')}
                className="hidden sm:flex"
              >
                <Clock className="w-4 h-4 mr-2" />
                Live Queue
              </Button>

              <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {currentView === 'dashboard' && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('register')}
                className="flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Patient</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('booking')}
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('return-queue')}
                className="flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Return Queue</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
