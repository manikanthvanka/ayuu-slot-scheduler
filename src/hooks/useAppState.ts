
import { useState } from 'react';
import { mockPatients, mockAppointments } from '@/data/mockData';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking' | 'doctor-consultation' | 'app-schedule' | 'app-configuration';

export const useAppState = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);
  const [selectedMRNumber, setSelectedMRNumber] = useState<string>('');
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null);

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

  return {
    // State
    isSignedIn,
    userRole,
    currentView,
    patients,
    appointments,
    sidebarOpen,
    pendingAppointmentData,
    selectedMRNumber,
    selectedPatientForHistory,
    
    // Actions
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
  };
};
