import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  mr_number: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_group?: string;
  allergies?: string[];
  medical_history?: string[];
  current_medications?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  experience?: string;
  availability?: string;
  phone?: string;
  email?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_name: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  doctor_name?: string;
  appointment_date: string;
  appointment_time: string;
  department?: string;
  reason?: string;
  status: string;
  token?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  patients?: Patient;
}

export const useSupabaseData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fetch appointments with patient data
  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (*)
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching doctors:', error);
        return;
      }

      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch time slots
  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_available', true)
        .order('slot_time', { ascending: true });

      if (error) {
        console.error('Error fetching time slots:', error);
        return;
      }

      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  // Fetch user roles
  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
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
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        toast({
          title: "❌ Error",
          description: "Failed to add patient: " + error.message,
          variant: "destructive",
        });
        return null;
      }

      setPatients(prev => [data, ...prev]);
      toast({
        title: "✅ Success",
        description: "Patient added successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding patient:', error);
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
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          patients (*)
        `)
        .single();

      if (error) {
        toast({
          title: "❌ Error",
          description: "Failed to add appointment: " + error.message,
          variant: "destructive",
        });
        return null;
      }

      setAppointments(prev => [...prev, data]);
      toast({
        title: "✅ Success",
        description: "Appointment scheduled successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding appointment:', error);
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
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId);

      if (error) {
        toast({
          title: "❌ Error",
          description: "Failed to update patient status: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setPatients(prev => prev.map(patient => 
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      ));

      toast({
        title: "✅ Success",
        description: "Patient status updated successfully",
      });
    } catch (error) {
      console.error('Error updating patient status:', error);
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