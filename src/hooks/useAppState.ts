
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

  // Use Supabase data - always fetch when signed in
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
    console.log('User signing in with role:', role);
    setUserRole(role);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    console.log('User signing out');
    setIsSignedIn(false);
    setCurrentView('dashboard');
    setSidebarOpen(false);
  };

  const addNewPatient = async (patientData: any) => {
    try {
      console.log('Adding new patient:', patientData);
      const newPatient = {
        mr_number: patientData.mrNumber || `MR${Date.now()}`,
        name: patientData.name,
        age: parseInt(String(patientData.age)),
        phone: patientData.phone,
        email: patientData.email || null,
        address: patientData.address || null,
        status: 'Registered',
        token: patients.length + 1
      };
      
      await createPatient(newPatient);
      console.log('Patient added successfully');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const addNewAppointment = async (appointmentData: any) => {
    try {
      console.log('Adding new appointment:', appointmentData);
      const newAppointment = {
        patient_name: appointmentData.patientName,
        mr_number: appointmentData.mrNumber,
        appointment_date: appointmentData.appointmentDate,
        status: 'Scheduled',
        notes: appointmentData.notes || null,
        token: appointments.length + 1
      };
      
      await createAppointment(newAppointment);
      console.log('Appointment added successfully');
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleBookAppointmentFromRegistration = (patientData: any) => {
    console.log('Booking appointment from registration:', patientData);
    setPendingAppointmentData(patientData);
    setCurrentView('booking');
  };

  const handleViewChange = (view: ViewMode) => {
    console.log('Changing view to:', view);
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const handleBookAppointmentFromSearch = (mrNumber: string) => {
    console.log('Booking appointment from search for MR:', mrNumber);
    setSelectedMRNumber(mrNumber);
    setCurrentView('booking');
  };

  const handleViewPatientHistory = (patient: any) => {
    console.log('Viewing patient history for:', patient.name);
    setSelectedPatientForHistory(patient);
    setCurrentView('patient-history');
  };

  const handleUpdatePatientStatus = async (patientId: number | string, newStatus: string) => {
    try {
      console.log('Updating patient status:', patientId, newStatus);
      // Convert legacy numeric IDs to UUID string if needed
      let stringId: string;
      
      if (typeof patientId === 'number') {
        // Find patient by token number
        const patient = patients.find(p => p.token === patientId);
        if (!patient) {
          console.error('Patient not found with token:', patientId);
          return;
        }
        stringId = patient.id;
      } else {
        stringId = patientId;
      }
      
      await updatePatientStatus(stringId, newStatus);
      console.log('Patient status updated successfully');
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  return {
    // State
    isSignedIn,
    userRole,
    currentView,
    patients: patients.map(p => ({ 
      ...p, 
      id: p.token || parseInt(p.id.slice(-3)) // Add legacy id mapping for backward compatibility
    })),
    appointments: appointments.map(a => ({ 
      ...a, 
      id: a.token || parseInt(a.id.slice(-3)), // Add legacy mapping
      patientId: a.patient_id 
    })),
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
