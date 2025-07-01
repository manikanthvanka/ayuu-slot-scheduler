
import { useState } from 'react';
import { useSupabaseData } from './useSupabaseData';
import type { UserRole, ViewMode } from '@/types/app';

export const useAppState = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);
  const [selectedMRNumber, setSelectedMRNumber] = useState<string>('');
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null);

  // Only use Supabase data if user is signed in
  const {
    patients,
    appointments,
    isLoading,
    createPatient,
    createAppointment,
    updatePatientStatus,
    searchPatients,
    findPatientByMR
  } = useSupabaseData(isSignedIn);

  const handleSignIn = (role: UserRole) => {
    setUserRole(role);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentView('dashboard');
    setSidebarOpen(false);
  };

  const addNewPatient = async (patientData: any) => {
    try {
      const newPatient = {
        mr_number: patientData.mrNumber || `MR${Date.now()}`,
        name: patientData.name,
        age: parseInt(patientData.age),
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        status: 'Registered',
        token: patients.length + 1
      };
      
      await createPatient(newPatient);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const addNewAppointment = async (appointmentData: any) => {
    try {
      const newAppointment = {
        patient_name: appointmentData.patientName,
        mr_number: appointmentData.mrNumber,
        appointment_date: appointmentData.appointmentDate,
        status: 'Scheduled',
        notes: appointmentData.notes,
        token: appointments.length + 1
      };
      
      await createAppointment(newAppointment);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
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

  const handleUpdatePatientStatus = async (patientId: number | string, newStatus: string) => {
    // Convert legacy numeric IDs to string if needed
    const stringId = typeof patientId === 'number' ? 
      patients.find(p => p.token === patientId)?.id || patientId.toString() : 
      patientId;
    
    await updatePatientStatus(stringId, newStatus);
  };

  return {
    // State
    isSignedIn,
    userRole,
    currentView,
    patients: patients.map(p => ({ ...p, id: p.token || parseInt(p.id.slice(-3)) })), // Add legacy id mapping
    appointments: appointments.map(a => ({ ...a, id: a.token || parseInt(a.id.slice(-3)), patientId: a.patient_id })), // Add legacy mapping
    sidebarOpen,
    pendingAppointmentData,
    selectedMRNumber,
    selectedPatientForHistory,
    isLoading,
    
    // Actions
    handleSignIn,
    handleSignOut,
    updatePatientStatus: handleUpdatePatientStatus,
    addNewPatient,
    addNewAppointment,
    handleBookAppointmentFromRegistration,
    handleViewChange,
    handleBookAppointmentFromSearch,
    handleViewPatientHistory,
    setSidebarOpen,
    searchPatients,
    findPatientByMR
  };
};
