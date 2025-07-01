import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Patient, Doctor, TimeSlot, UserRole, Appointment } from '@/types/supabase';
import { patientService } from '@/services/patientService';
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
    const data = await patientService.fetchPatients();
    setPatients(data);
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
  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPatient = await patientService.addPatient(patientData);
      
      if (newPatient) {
        setPatients(prev => [newPatient, ...prev]);
        toast({
          title: "✅ Success",
          description: "Patient added successfully",
        });
      }
      
      return newPatient;
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
      await patientService.updatePatientStatus(patientId, newStatus);
      
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