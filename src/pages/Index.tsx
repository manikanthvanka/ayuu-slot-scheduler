
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientDashboard from '@/components/PatientDashboard';
import SignIn from '@/components/SignIn';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ViewRenderer from '@/components/ViewRenderer';
import AppointmentBooking from '@/components/AppointmentBooking';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Index = () => {
  const { isSignedIn, userRole, signOut, loading: authLoading } = useAuth();
  const { 
    patients, 
    appointments, 
    doctors,
    timeSlots,
    userRoles,
    addPatient, 
    addAppointment, 
    updatePatientStatus,
    loading: dataLoading 
  } = useSupabaseData();
  
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'user-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking' | 'doctor-consultation' | 'app-schedule' | 'app-configuration'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = React.useState<any>(null);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = React.useState<any>(null);

  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = React.useState<any>(null);

  const { toast } = useToast();

  // Helper functions
  const handleViewChange = (view: typeof currentView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const handleBookAppointmentFromRegistration = (patientData: any) => {
    setPendingAppointmentData(patientData);
    setCurrentView('booking');
  };

  const handleBookAppointmentFromSearch = (mrNumber: string) => {
    setPendingAppointmentData({ mrNumber });
    setCurrentView('booking');
  };

  const handleViewPatientHistory = (patient: any) => {
    setSelectedPatientForHistory(patient);
    setCurrentView('patient-history');
  };

  const handleViewPatientConsultation = (patient: any) => {
    setSelectedPatientForConsultation(patient);
    handleViewChange('doctor-consultation');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('dashboard');
    setSidebarOpen(false);
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "📄 Report Downloaded",
      description: `${reportType} report has been downloaded successfully.`,
    });
  };

  const handleShareReport = (reportType: string) => {
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

  if (authLoading) {
    return (
      <LoadingProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Toaster />
      </LoadingProvider>
    );
  }

  if (!isSignedIn) {
    return (
      <LoadingProvider>
        <SignIn />
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
              onSubmit={async (appointmentData) => {
                const result = await addAppointment({
                  ...appointmentData,
                  token: appointments.length + 1,
                });
                if (result) {
                  handleViewChange('dashboard');
                }
              }} 
              onBack={() => handleViewChange('dashboard')}
              prefilledMRData={pendingAppointmentData}
              doctors={doctors}
              timeSlots={timeSlots}
            />
          ) : (
            <PatientDashboard 
              onBookAppointment={() => handleViewChange('booking')}
              onSignOut={handleSignOut}
            />
          )}
        </div>
        <Toaster />
      </LoadingProvider>
    );
  }

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
            <DashboardHeader 
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              userRole={userRole}
            />

            {/* Page Content */}
            <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-y-auto w-full min-w-0">
              <div className="max-w-full">
                <ViewRenderer
                  currentView={currentView}
                  userRole={userRole}
                  patients={patients}
                  appointments={appointments}
                  doctors={doctors}
                  timeSlots={timeSlots}
                  userRoles={userRoles}
                  pendingAppointmentData={pendingAppointmentData}
                  selectedPatientForHistory={selectedPatientForHistory}
                  selectedPatientForConsultation={selectedPatientForConsultation}
                  onViewChange={handleViewChange}
                  onAddNewPatient={addPatient}
                  onAddNewAppointment={addAppointment}
                  onUpdatePatientStatus={updatePatientStatus}
                  onBookAppointmentFromRegistration={handleBookAppointmentFromRegistration}
                  onBookAppointmentFromSearch={handleBookAppointmentFromSearch}
                  onViewPatientHistory={handleViewPatientHistory}
                  onViewPatientConsultation={handleViewPatientConsultation}
                  onDownloadReport={handleDownloadReport}
                  onShareReport={handleShareReport}
                />
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
