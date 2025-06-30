import React, { useState } from 'react';
import { Bell, Menu, X, UserPlus, Calendar, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/AppointmentBooking';
import LiveQueue from '@/components/LiveQueue';
import ReturnQueue from '@/components/ReturnQueue';
import SignIn from '@/components/SignIn';
import Sidebar from '@/components/Sidebar';
import AppointmentsDataTable from '@/components/AppointmentsDataTable';
import MRNumberSearch from '@/components/MRNumberSearch';
import PatientDashboard from '@/components/PatientDashboard';
import { mockPatients, mockAppointments, mockDoctors } from '@/data/mockData';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/toaster';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false by default
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);

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

  const handleBookAppointmentFromRegistration = (patientData: any) => {
    setPendingAppointmentData(patientData);
    setCurrentView('booking');
  };

  if (!isSignedIn) {
    return (
      <LoadingProvider>
        <SignIn onSignIn={handleSignIn} />
        <Toaster />
      </LoadingProvider>
    );
  }

  // Patient Dashboard
  if (userRole === 'patient') {
    return (
      <LoadingProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {currentView === 'booking' ? (
            <AppointmentBooking 
              onSubmit={(appointmentData) => {
                // Generate token number for the appointment
                const newAppointment = {
                  ...appointmentData,
                  token: appointments.length + 1,
                  patientId: 1 // Mock patient ID
                };
                addNewAppointment(newAppointment);
                setCurrentView('dashboard');
              }} 
              onBack={() => setCurrentView('dashboard')}
              prefilledMRData={pendingAppointmentData}
            />
          ) : (
            <PatientDashboard 
              onBookAppointment={() => setCurrentView('booking')}
              onSignOut={handleSignOut}
            />
          )}
        </div>
        <Toaster />
      </LoadingProvider>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6 relative w-full">
      {/* Quick Actions with improved styling */}
      {(userRole === 'admin' || userRole === 'staff') && (
        <div className="relative z-10 w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            <Button
              onClick={() => setCurrentView('register')}
              className="bg-primary hover:bg-primary/90 hover:shadow-lg text-white h-12 transition-all duration-200 ease-in-out transform hover:scale-105 flex-1 sm:flex-none"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register Patient
            </Button>
            <Button
              onClick={() => setCurrentView('booking')}
              className="bg-green-600 hover:bg-green-700 hover:shadow-lg text-white h-12 transition-all duration-200 ease-in-out transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
            <Button
              onClick={() => setCurrentView('search')}
              className="bg-purple-600 hover:bg-purple-700 hover:shadow-lg text-white h-12 transition-all duration-200 ease-in-out transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Search className="w-5 h-5 mr-2" />
              Search MR Number
            </Button>
          </div>
        </div>
      )}

      {/* Improved Header Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10 w-full">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">{appointments.length}</div>
            <p className="text-xs text-blue-600 bg-blue-200/50 px-2 py-1 rounded-full inline-block">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Active Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-green-600 bg-green-200/50 px-2 py-1 rounded-full inline-block">Patients waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Return Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-purple-600 bg-purple-200/50 px-2 py-1 rounded-full inline-block">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">{mockDoctors.length}</div>
            <p className="text-xs text-orange-600 bg-orange-200/50 px-2 py-1 rounded-full inline-block">On duty today</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Data Table */}
      <div className="relative z-10 w-full overflow-hidden">
        <AppointmentsDataTable
          appointments={appointments}
          patients={patients}
          userRole={userRole}
          onUpdateStatus={updatePatientStatus}
        />
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <PatientRegistration 
            onSubmit={addNewPatient} 
            onBack={() => setCurrentView('dashboard')}
            onBookAppointment={handleBookAppointmentFromRegistration}
          />
        );
      case 'booking':
        return (
          <AppointmentBooking 
            onSubmit={(appointmentData) => {
              // Generate token number for staff/admin bookings
              const newAppointment = {
                ...appointmentData,
                token: appointments.length + 1
              };
              addNewAppointment(newAppointment);
            }} 
            onBack={() => setCurrentView('dashboard')}
            prefilledMRData={pendingAppointmentData}
          />
        );
      case 'queue':
        return <LiveQueue patients={patients} onUpdateStatus={updatePatientStatus} onBack={() => setCurrentView('dashboard')} />;
      case 'return-queue':
        return <ReturnQueue patients={patients.filter(p => p.status === 'Re-check Pending')} onUpdateStatus={updatePatientStatus} onBack={() => setCurrentView('dashboard')} />;
      case 'search':
        return <MRNumberSearch patients={patients} onBack={() => setCurrentView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 w-full">
        <div className="flex h-screen overflow-hidden w-full">
          {/* Desktop Sidebar - Hidden by default on desktop too */}
          <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'lg:w-64' : 'lg:w-0'} flex-shrink-0`}>
            <div className={`${sidebarOpen ? 'block' : 'hidden'} h-full`}>
              <Sidebar
                currentView={currentView}
                onViewChange={setCurrentView}
                onSignOut={handleSignOut}
                userRole={userRole}
              />
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
                onClick={() => setSidebarOpen(false)} 
              />
              <div className="relative w-64 max-w-xs bg-white shadow-xl transform transition-transform">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
          <div className="flex-1 flex flex-col min-h-0 w-full min-w-0">
            {/* Top Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40 flex-shrink-0 w-full">
              <div className="px-4 lg:px-6 xl:px-8 w-full">
                <div className="flex justify-between items-center h-16 w-full">
                  <div className="flex items-center space-x-4 min-w-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0">
                      <h1 className="text-xl font-bold text-gray-900">Ayuu Healthcare</h1>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 w-10 p-0 hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-300 transition-colors duration-200"
                    >
                      <Bell className="w-4 h-4" />
                    </Button>
                    <div className="text-sm text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
                      {userRole}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-y-auto w-full min-w-0">
              <div className="max-w-full">
                {renderCurrentView()}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t px-6 lg:px-8 xl:px-10 py-4 flex-shrink-0">
              <div className="text-center text-sm text-gray-500">
                © 2024 Ayuu Healthcare System. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </div>
      <Toaster />
    </LoadingProvider>
  );
};

export default Index;
