
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
import { useAppState } from '@/hooks/useAppState';

const Index = () => {
  const {
    isSignedIn,
    userRole,
    currentView,
    patients,
    appointments,
    sidebarOpen,
    pendingAppointmentData,
    selectedPatientForHistory,
    handleSignIn,
    handleSignOut,
    updatePatientStatus,
    addNewPatient,
    addNewAppointment,
    handleBookAppointmentFromRegistration,
    handleViewChange,
    handleBookAppointmentFromSearch,
    handleViewPatientHistory,
    setSidebarOpen
  } = useAppState();

  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = React.useState<any>(null);

  const { toast } = useToast();

  const handleViewPatientConsultation = (patient: any) => {
    setSelectedPatientForConsultation(patient);
    handleViewChange('doctor-consultation');
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
                handleViewChange('dashboard');
              }} 
              onBack={() => handleViewChange('dashboard')}
              prefilledMRData={pendingAppointmentData}
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
                  pendingAppointmentData={pendingAppointmentData}
                  selectedPatientForHistory={selectedPatientForHistory}
                  selectedPatientForConsultation={selectedPatientForConsultation}
                  onViewChange={handleViewChange}
                  onAddNewPatient={addNewPatient}
                  onAddNewAppointment={addNewAppointment}
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
