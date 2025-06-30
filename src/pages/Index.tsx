
import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/AppointmentBooking';
import LiveQueue from '@/components/LiveQueue';
import ReturnQueue from '@/components/ReturnQueue';
import SignIn from '@/components/SignIn';
import Sidebar from '@/components/Sidebar';
import PatientSearch from '@/components/PatientSearch';
import PatientDashboard from '@/components/PatientDashboard';
import RoleManagement from '@/components/RoleManagement';
import Dashboard from '@/components/Dashboard';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/toaster';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { usePatientData } from '@/hooks/usePatientData';
import type { UserRole, ViewMode } from '@/types';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);

  const { rolePermissions, updateRolePermissions, hasPermission } = useRolePermissions(userRole);
  const { patients, appointments, updatePatientStatus, addNewPatient, addNewAppointment } = usePatientData();

  const handleSignIn = (role: UserRole) => {
    setUserRole(role);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentView('dashboard');
    setSidebarOpen(false);
  };

  const handleBookAppointmentFromRegistration = (patientData: any) => {
    setPendingAppointmentData(patientData);
    setCurrentView('booking');
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
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
        return (
          <Dashboard
            appointments={appointments}
            patients={patients}
            userRole={userRole}
            onUpdateStatus={updatePatientStatus}
            onViewChange={setCurrentView}
            hasRegisterPermission={hasPermission('register_patient')}
            hasBookingPermission={hasPermission('book_appointment')}
            hasSearchPermission={hasPermission('patient_search')}
            hasVitalsDonePermission={hasPermission('vitals_done')}
          />
        );
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
