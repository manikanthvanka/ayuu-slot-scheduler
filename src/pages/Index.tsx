
import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/AppointmentBooking';
import LiveQueue from '@/components/LiveQueue';
import ReturnQueue from '@/components/ReturnQueue';
import SignIn from '@/components/SignIn';
import Sidebar from '@/components/Sidebar';
import AppointmentsDataTable from '@/components/AppointmentsDataTable';
import { mockPatients, mockAppointments, mockDoctors } from '@/data/mockData';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignIn = (role: UserRole) => {
    setUserRole(role);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentView('dashboard');
    setSidebarOpen(false);
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

  if (!isSignedIn) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{appointments.length}</div>
            <p className="text-xs text-blue-600 mt-1">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Active Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-green-600 mt-1">Patients waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">Return Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-purple-600 mt-1">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Available Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{mockDoctors.length}</div>
            <p className="text-xs text-orange-600 mt-1">On duty today</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Data Table */}
      <AppointmentsDataTable
        appointments={appointments}
        patients={patients}
        userRole={userRole}
        onUpdateStatus={updatePatientStatus}
      />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            onSignOut={handleSignOut}
            userRole={userRole}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="relative">
              <Sidebar
                currentView={currentView}
                onViewChange={(view) => {
                  setCurrentView(view);
                  setSidebarOpen(false);
                }}
                onSignOut={handleSignOut}
                userRole={userRole}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                  <div className="lg:hidden">
                    <h1 className="text-xl font-bold text-gray-900">Ayuu</h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-gray-600 capitalize hidden sm:block">
                    {userRole}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
