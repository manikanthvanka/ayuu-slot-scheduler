import React, { useState, useEffect } from 'react';
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
import PatientSearch from '@/components/PatientSearch';
import PatientDashboard from '@/components/PatientDashboard';
import RoleManagement from '@/components/RoleManagement';
import { mockPatients } from '@/data/patients';
import { mockAppointments } from '@/data/appointments';
import { mockDoctors } from '@/data/doctors';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/toaster';
import type { UserRole, ViewMode, Patient, Appointment } from '@/types';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);
  const [rolePermissions, setRolePermissions] = useState<any>({});

  // Load role permissions from localStorage or set defaults
  useEffect(() => {
    const savedPermissions = localStorage.getItem('rolePermissions');
    if (savedPermissions) {
      setRolePermissions(JSON.parse(savedPermissions));
    } else {
      const defaultPermissions = {
        admin: {
          register_patient: true,
          book_appointment: true,
          view_queue: true,
          update_vitals: true,
          vitals_done: true,
          consultation: true,
          prescribe: true,
          order_tests: true,
          view_history: true,
          manage_roles: true,
          view_reports: true,
          patient_search: true
        },
        doctor: {
          register_patient: false,
          book_appointment: false,
          view_queue: true,
          update_vitals: false,
          vitals_done: false,
          consultation: true,
          prescribe: true,
          order_tests: true,
          view_history: true,
          manage_roles: false,
          view_reports: false,
          patient_search: true
        },
        staff: {
          register_patient: true,
          book_appointment: true,
          view_queue: true,
          update_vitals: true,
          vitals_done: true,
          consultation: false,
          prescribe: false,
          order_tests: false,
          view_history: true,
          manage_roles: false,
          view_reports: true,
          patient_search: true
        },
        patient: {
          register_patient: false,
          book_appointment: true,
          view_queue: false,
          update_vitals: false,
          vitals_done: false,
          consultation: false,
          prescribe: false,
          order_tests: false,
          view_history: false,
          manage_roles: false,
          view_reports: false,
          patient_search: false
        }
      };
      setRolePermissions(defaultPermissions);
      localStorage.setItem('rolePermissions', JSON.stringify(defaultPermissions));
    }
  }, []);

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

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const updateRolePermissions = (newPermissions: any) => {
    setRolePermissions(newPermissions);
    localStorage.setItem('rolePermissions', JSON.stringify(newPermissions));
  };

  const hasPermission = (permission: string) => {
    return rolePermissions[userRole]?.[permission] || false;
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
                const newAppointment = {
                  ...appointmentData,
                  token: appointments.length + 1,
                  patientId: 1
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
      {/* Quick Actions */}
      {(hasPermission('register_patient') || hasPermission('book_appointment') || hasPermission('patient_search')) && (
        <div className="relative z-10 w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            {hasPermission('register_patient') && (
              <Button
                onClick={() => setCurrentView('register')}
                className="bg-primary text-white h-12 flex-1 sm:flex-none"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register Patient
              </Button>
            )}
            {hasPermission('book_appointment') && (
              <Button
                onClick={() => setCurrentView('booking')}
                className="bg-green-600 text-white h-12 flex-1 sm:flex-none"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            )}
            {hasPermission('patient_search') && (
              <Button
                onClick={() => setCurrentView('search')}
                className="bg-purple-600 text-white h-12 flex-1 sm:flex-none"
              >
                <Search className="w-5 h-5 mr-2" />
                Patient Search
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10 w-full">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">{appointments.length}</div>
            <p className="text-xs text-blue-600">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Active Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-green-600">Patients waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Return Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-purple-600">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">{mockDoctors.length}</div>
            <p className="text-xs text-orange-600">On duty today</p>
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
          hasVitalsDonePermission={hasPermission('vitals_done')}
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
            canBookAppointment={hasPermission('book_appointment')}
          />
        );
      case 'booking':
        return (
          <AppointmentBooking 
            onSubmit={(appointmentData) => {
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
        return <PatientSearch patients={patients} onBack={() => setCurrentView('dashboard')} onBookAppointment={() => setCurrentView('booking')} onSelectPatient={setPendingAppointmentData} />;
      case 'role-management':
        return <RoleManagement onBack={() => setCurrentView('dashboard')} userRole={userRole} onUpdatePermissions={updateRolePermissions} currentPermissions={rolePermissions} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 w-full">
        <div className="flex h-screen overflow-hidden w-full">
          {/* Desktop Sidebar */}
          <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'lg:w-64' : 'lg:w-0'} flex-shrink-0`}>
            <div className={`${sidebarOpen ? 'block' : 'hidden'} h-full`}>
              <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
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
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Sidebar
                  currentView={currentView}
                  onViewChange={handleViewChange}
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
                      className="h-10 w-10 p-0"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0">
                      <h1 className="text-xl font-bold text-gray-900">Ayuu Healthcare</h1>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0">
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
