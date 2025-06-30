
import React, { useState } from 'react';
import { Bell, Menu, X, UserPlus, Calendar, Plus } from 'lucide-react';
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
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/toaster';

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
    return (
      <LoadingProvider>
        <SignIn onSignIn={handleSignIn} />
        <Toaster />
      </LoadingProvider>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-4 lg:space-y-6 relative w-full">
      {/* Background Illustration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <svg 
          viewBox="0 0 800 400" 
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Doctor figure */}
          <g transform="translate(100, 50)">
            {/* Doctor body */}
            <rect x="20" y="80" width="40" height="80" rx="5" fill="#0F52BA" opacity="0.3"/>
            {/* Doctor head */}
            <circle cx="40" cy="60" r="15" fill="#FFB68A" opacity="0.3"/>
            {/* Stethoscope */}
            <path d="M35 75 Q30 80 35 85 Q40 80 45 85" stroke="#0F52BA" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="35" cy="85" r="3" fill="#0F52BA" opacity="0.3"/>
            {/* Doctor's arm pointing to patient */}
            <line x1="60" y1="100" x2="120" y2="120" stroke="#FFB68A" strokeWidth="4" opacity="0.3"/>
          </g>

          {/* Patient figure */}
          <g transform="translate(200, 80)">
            {/* Patient body */}
            <rect x="20" y="60" width="35" height="70" rx="5" fill="#E5E7EB" opacity="0.3"/>
            {/* Patient head */}
            <circle cx="37.5" cy="45" r="12" fill="#FFB68A" opacity="0.3"/>
            {/* Bed */}
            <rect x="10" y="130" width="55" height="8" rx="2" fill="#94A3B8" opacity="0.3"/>
            <rect x="5" y="135" width="5" height="15" fill="#64748B" opacity="0.3"/>
            <rect x="60" y="135" width="5" height="15" fill="#64748B" opacity="0.3"/>
          </g>

          {/* Medical equipment */}
          <g transform="translate(300, 100)">
            {/* Monitor */}
            <rect x="0" y="0" width="40" height="30" rx="3" fill="#374151" opacity="0.2"/>
            <path d="M5 15 L15 10 L25 20 L35 5" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.3"/>
            {/* Stand */}
            <rect x="18" y="30" width="4" height="20" fill="#6B7280" opacity="0.2"/>
            <rect x="10" y="50" width="20" height="4" fill="#6B7280" opacity="0.2"/>
          </g>

          {/* Heart symbols floating */}
          <g opacity="0.1">
            <path d="M450 100 C450 95, 460 95, 460 100 C460 95, 470 95, 470 100 C470 110, 460 120, 460 120 C460 120, 450 110, 450 100 Z" fill="#EF4444"/>
            <path d="M500 150 C500 145, 510 145, 510 150 C510 145, 520 145, 520 150 C520 160, 510 170, 510 170 C510 170, 500 160, 500 150 Z" fill="#EF4444"/>
            <path d="M400 180 C400 175, 410 175, 410 180 C410 175, 420 175, 420 180 C420 190, 410 200, 410 200 C410 200, 400 190, 400 180 Z" fill="#EF4444"/>
          </g>

          {/* Medical cross */}
          <g transform="translate(600, 120)" opacity="0.1">
            <rect x="15" y="5" width="6" height="20" fill="#EF4444"/>
            <rect x="8" y="12" width="20" height="6" fill="#EF4444"/>
          </g>
        </svg>
      </div>

      {/* Quick Actions */}
      {(userRole === 'admin' || userRole === 'staff') && (
        <div className="relative z-10 w-full">
          <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6 w-full">
            <Button
              onClick={() => setCurrentView('register')}
              className="bg-primary hover:bg-primary-hover text-white h-10 sm:h-11 text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
            >
              <UserPlus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Register Patient</span>
            </Button>
            <Button
              onClick={() => setCurrentView('booking')}
              className="bg-primary hover:bg-primary-hover text-white h-10 sm:h-11 text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
            >
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Book Appointment</span>
            </Button>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 relative z-10 w-full">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 w-full">
          <CardHeader className="pb-2 lg:pb-3 px-3 sm:px-4 lg:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 truncate">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{appointments.length}</div>
            <p className="text-xs text-blue-600 mt-1 truncate">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 w-full">
          <CardHeader className="pb-2 lg:pb-3 px-3 sm:px-4 lg:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-700 truncate">Active Queue</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-green-600 mt-1 truncate">Patients waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 w-full">
          <CardHeader className="pb-2 lg:pb-3 px-3 sm:px-4 lg:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700 truncate">Return Queue</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-purple-600 mt-1 truncate">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 w-full">
          <CardHeader className="pb-2 lg:pb-3 px-3 sm:px-4 lg:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-700 truncate">Available Doctors</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">{mockDoctors.length}</div>
            <p className="text-xs text-orange-600 mt-1 truncate">On duty today</p>
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
    <LoadingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 w-full">
        <div className="flex h-screen overflow-hidden w-full">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
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
                    className="h-8 w-8 p-0"
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
              <div className="px-3 sm:px-4 lg:px-6 xl:px-8 w-full">
                <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16 w-full">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(true)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <div className="lg:hidden min-w-0">
                      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">Ayuu</h1>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <div className="text-xs sm:text-sm text-gray-600 capitalize hidden sm:block truncate">
                      {userRole}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto w-full min-w-0">
              <div className="max-w-full">
                {renderCurrentView()}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t px-3 sm:px-4 lg:px-6 xl:px-8 py-3 flex-shrink-0">
              <div className="text-center text-xs text-gray-500">
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
