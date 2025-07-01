
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  mr_number: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  address?: string;
  status: string;
  token?: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  patient_name: string;
  mr_number: string;
  appointment_date: string;
  status: string;
  vitals?: any;
  notes?: string;
  token?: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive",
      });
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    }
  };

  // Create patient
  const createPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPatients(); // Refresh the list
      toast({
        title: "Success",
        description: "Patient registered successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to register patient",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update patient status
  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', patientId);

      if (error) throw error;

      // Also update appointments with the same patient
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('mr_number', patient.mr_number);
      }

      await fetchPatients();
      await fetchAppointments();
      
      toast({
        title: "Success",
        description: "Patient status updated",
      });
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast({
        title: "Error",
        description: "Failed to update patient status",
        variant: "destructive",
      });
    }
  };

  // Search patients
  const searchPatients = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`name.ilike.%${query}%,mr_number.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching patients:', error);
      toast({
        title: "Error",
        description: "Failed to search patients",
        variant: "destructive",
      });
      return [];
    }
  };

  // Find patient by MR number
  const findPatientByMR = async (mrNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('mr_number', mrNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding patient by MR:', error);
      return null;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPatients(), fetchAppointments()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    patients,
    appointments,
    isLoading,
    createPatient,
    createAppointment,
    updatePatientStatus,
    searchPatients,
    findPatientByMR,
    fetchPatients,
    fetchAppointments
  };
};
