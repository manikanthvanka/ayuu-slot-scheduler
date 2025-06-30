import React, { useState } from 'react';
import { Bell, Menu, X, UserPlus, Calendar, Plus, Search, Settings, Moon, Sun, Palette, Clock, Download, Share } from 'lucide-react';
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
import PatientHistoryPage from '@/components/PatientHistoryPage';
import ScreenFieldsManagement from '@/components/ScreenFieldsManagement';
import ColorCustomization from '@/components/ColorCustomization';
import PatientStageTracking from '@/components/PatientStageTracking';
import { mockPatients, mockAppointments, mockDoctors } from '@/data/mockData';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);
  const [selectedMRNumber, setSelectedMRNumber] = useState<string>('');
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null);
  const { getFieldValue } = useScreenFields();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();

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

  const handleBookAppointmentFromSearch = (mrNumber: string) => {
    setSelectedMRNumber(mrNumber);
    setCurrentView('booking');
  };

  const handleViewPatientHistory = (patient: any) => {
    setSelectedPatientForHistory(patient);
    setCurrentView('patient-history');
  };

  const handleDownloadReport = (reportType: string) => {
    // Mock download functionality
    toast({
      title: "📄 Report Downloaded",
      description: `${reportType} report has been downloaded successfully.`,
    });
  };

  const handleShareReport = (reportType: string) => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: `${reportType} Report`,
        text: `Sharing ${reportType} report from Ayuu Healthcare System`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "🔗 Link Copied",
        description: `${reportType} report link copied to clipboard.`,
      });
    }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
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
      {(userRole === 'admin' || userRole === 'staff') && (
        <div className="relative z-10 w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            <Button
              onClick={() => setCurrentView('register')}
              className="bg-[#0F52BA] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {getFieldValue('register_patient_btn', 'dashboard')}
            </Button>
            <Button
              onClick={() => setCurrentView('booking')}
              className="bg-[#4169E1] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {getFieldValue('book_appointment_btn', 'dashboard')}
            </Button>
            <Button
              onClick={() => setCurrentView('search')}
              className="bg-[#088F8F] hover:bg-[#000080] text-white h-12 flex-1 sm:flex-none shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {getFieldValue('patient_search_btn', 'dashboard')}
            </Button>
            {userRole === 'admin' && (
              <>
                <Button
                  onClick={() => setCurrentView('screen-fields')}
                  className="bg-[#6B46C1] hover:bg-[#553C9A] text-white h-12 flex-1 sm:flex-none shadow-lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Screen Fields
                </Button>
                <Button
                  onClick={() => setCurrentView('color-customization')}
                  className="bg-[#EC4899] hover:bg-[#DB2777] text-white h-12 flex-1 sm:flex-none shadow-lg"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  Colors
                </Button>
                <Button
                  onClick={() => setCurrentView('stage-tracking')}
                  className="bg-[#10B981] hover:bg-[#059669] text-white h-12 flex-1 sm:flex-none shadow-lg"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Stage Tracking
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10 w-full">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-l-[#0F52BA] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#0F52BA] flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {getFieldValue('todays_appointments_card', 'dashboard')}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadReport('Appointments')}
                  className="h-6 w-6 p-0"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShareReport('Appointments')}
                  className="h-6 w-6 p-0"
                >
                  <Share className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#0F52BA] mb-2">{appointments.length}</div>
            <p className="text-xs text-blue-600 font-medium">+2 from yesterday</p>
          </CardContent>
        </Card>

        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-l-4 border-l-[#088F8F] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#088F8F] flex items-center justify-between">
              <div className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                {getFieldValue('active_queue_card', 'dashboard')}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadReport('Queue')}
                  className="h-6 w-6 p-0"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShareReport('Queue')}
                  className="h-6 w-6 p-0"
                >
                  <Share className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#088F8F] mb-2">{patients.filter(p => p.status !== 'Completed').length}</div>
            <p className="text-xs text-green-600 font-medium">Patients waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-l-[#4169E1] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4169E1] flex items-center justify-between">
              <div className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                {getFieldValue('return_queue_card', 'dashboard')}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadReport('Return Queue')}
                  className="h-6 w-6 p-0"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShareReport('Return Queue')}
                  className="h-6 w-6 p-0"
                >
                  <Share className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#4169E1] mb-2">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
            <p className="text-xs text-purple-600 font-medium">Awaiting re-check</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-l-[#FF5733] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#FF5733] flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                {getFieldValue('available_doctors_card', 'dashboard')}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadReport('Doctors')}
                  className="h-6 w-6 p-0"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShareReport('Doctors')}
                  className="h-6 w-6 p-0"
                >
                  <Share className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#FF5733] mb-2">{mockDoctors.length}</div>
            <p className="text-xs text-orange-600 font-medium">On duty today</p>
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
        return (
          <PatientSearch 
            patients={patients} 
            onBack={() => setCurrentView('dashboard')} 
            onBookAppointment={handleBookAppointmentFromSearch}
            onViewHistory={handleViewPatientHistory}
          />
        );
      case 'patient-history':
        return (
          <PatientHistoryPage
            patient={selectedPatientForHistory}
            onBack={() => setCurrentView('search')}
          />
        );
      case 'role-management':
        return <RoleManagement onBack={() => setCurrentView('dashboard')} userRole={userRole} />;
      case 'screen-fields':
        return <ScreenFieldsManagement onBack={() => setCurrentView('dashboard')} />;
      case 'color-customization':
        return <ColorCustomization onBack={() => setCurrentView('dashboard')} />;
      case 'stage-tracking':
        return <PatientStageTracking onBack={() => setCurrentView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 w-full">
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
              <div className="relative w-64 max-w-xs bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
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
            {/* Top Header with enhanced colors */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 shadow-lg border-b sticky top-0 z-40 flex-shrink-0 w-full">
              <div className="px-4 lg:px-6 xl:px-8 w-full">
                <div className="flex justify-between items-center h-16 w-full">
                  <div className="flex items-center space-x-4 min-w-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="h-10 w-10 p-0 text-white hover:bg-white/10"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0">
                      <h1 className="text-xl font-bold text-white">{getFieldValue('page_title', 'dashboard')}</h1>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleDarkMode}
                      className="h-10 w-10 p-0 text-white hover:bg-white/10"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-white hover:bg-white/10">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <div className="text-sm text-white capitalize bg-white/20 px-3 py-1 rounded-full">
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
            <footer className="bg-white dark:bg-gray-800 border-t px-6 lg:px-8 xl:px-10 py-4 flex-shrink-0">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
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
