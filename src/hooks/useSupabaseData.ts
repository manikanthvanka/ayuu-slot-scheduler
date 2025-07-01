import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Patient, Doctor, TimeSlot, UserRole, Appointment } from '@/types/supabase';
import { userService, CompleteUser, PatientData } from '@/services/userService';
import { appointmentService } from '@/services/appointmentService';
import { doctorService } from '@/services/doctorService';
import { timeSlotService } from '@/services/timeSlotService';
import { userRoleService } from '@/services/userRoleService';

export const useSupabaseData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch functions
  const fetchPatients = async () => {
    const completeUsers = await userService.fetchPatients();
    // Convert to legacy Patient format for backward compatibility
    const legacyPatients: Patient[] = completeUsers.map(completeUser => ({
      id: completeUser.user.id,
      mr_number: completeUser.patient_profile?.mr_number || '',
      name: `${completeUser.user.first_name} ${completeUser.user.last_name}`,
      age: completeUser.user.date_of_birth 
        ? new Date().getFullYear() - new Date(completeUser.user.date_of_birth).getFullYear()
        : undefined,
      gender: completeUser.user.gender,
      phone: completeUser.communication?.phone,
      email: completeUser.communication?.email,
      address: completeUser.communication?.address,
      emergency_contact: completeUser.communication?.emergency_contact,
      emergency_phone: completeUser.communication?.emergency_phone,
      blood_group: completeUser.patient_profile?.blood_group,
      allergies: completeUser.patient_profile?.allergies,
      medical_history: completeUser.patient_profile?.medical_history,
      current_medications: completeUser.patient_profile?.current_medications,
      status: completeUser.patient_profile?.status || 'registered',
      created_at: completeUser.user.created_at,
      updated_at: completeUser.user.updated_at
    }));
    setPatients(legacyPatients);
  };

  const fetchAppointments = async () => {
    const data = await appointmentService.fetchAppointments();
    setAppointments(data);
  };

  const fetchDoctors = async () => {
    const data = await doctorService.fetchDoctors();
    setDoctors(data);
  };

  const fetchTimeSlots = async () => {
    const data = await timeSlotService.fetchTimeSlots();
    setTimeSlots(data);
  };

  const fetchUserRoles = async () => {
    const data = await userRoleService.fetchUserRoles();
    setUserRoles(data);
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPatients(),
        fetchAppointments(),
        fetchDoctors(),
        fetchTimeSlots(),
        fetchUserRoles()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Add new patient
  const addPatient = async (patientData: any) => {
    try {
      // Convert legacy patient data to new structure
      const newPatientData: PatientData = {
        first_name: patientData.firstName || patientData.name?.split(' ')[0] || '',
        last_name: patientData.lastName || patientData.name?.split(' ').slice(1).join(' ') || '',
        gender: patientData.gender,
        date_of_birth: patientData.dateOfBirth,
        email: patientData.email,
        phone: patientData.phone,
        address: patientData.address,
        emergency_contact: patientData.emergencyContact,
        emergency_phone: patientData.emergency_phone,
        blood_group: patientData.blood_group,
        mr_number: patientData.mrNumber || `MR${Date.now()}`
      };

      const completeUser = await userService.addPatient(newPatientData);
      
      if (completeUser) {
        // Convert to legacy format and add to state
        const legacyPatient: Patient = {
          id: completeUser.user.id,
          mr_number: completeUser.patient_profile?.mr_number || '',
          name: `${completeUser.user.first_name} ${completeUser.user.last_name}`,
          age: completeUser.user.date_of_birth 
            ? new Date().getFullYear() - new Date(completeUser.user.date_of_birth).getFullYear()
            : undefined,
          gender: completeUser.user.gender,
          phone: completeUser.communication?.phone,
          email: completeUser.communication?.email,
          address: completeUser.communication?.address,
          emergency_contact: completeUser.communication?.emergency_contact,
          emergency_phone: completeUser.communication?.emergency_phone,
          blood_group: completeUser.patient_profile?.blood_group,
          allergies: completeUser.patient_profile?.allergies,
          medical_history: completeUser.patient_profile?.medical_history,
          current_medications: completeUser.patient_profile?.current_medications,
          status: completeUser.patient_profile?.status || 'registered',
          created_at: completeUser.user.created_at,
          updated_at: completeUser.user.updated_at
        };

        setPatients(prev => [legacyPatient, ...prev]);
        toast({
          title: "✅ Success",
          description: "Patient added successfully",
        });
        
        return legacyPatient;
      }
      
      return null;
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add new appointment
  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patients'>) => {
    try {
      const newAppointment = await appointmentService.addAppointment(appointmentData);
      
      if (newAppointment) {
        setAppointments(prev => [...prev, newAppointment]);
        toast({
          title: "✅ Success",
          description: "Appointment scheduled successfully",
        });
      }
      
      return newAppointment;
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add appointment",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update patient status
  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      await userService.updatePatientStatus(patientId, newStatus);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      ));

      toast({
        title: "✅ Success",
        description: "Patient status updated successfully",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update patient status",
        variant: "destructive",
      });
    }
  };

  return {
    patients,
    appointments,
    doctors,
    timeSlots,
    userRoles,
    loading,
    addPatient,
    addAppointment,
    updatePatientStatus,
    fetchPatients,
    fetchAppointments,
    fetchDoctors,
    fetchTimeSlots,
    fetchUserRoles,
  };
};