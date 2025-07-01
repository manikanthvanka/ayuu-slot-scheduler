
import { supabase } from '@/integrations/supabase/client';
import type { Appointment } from '@/hooks/useSupabaseData';

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    console.log('Fetching all appointments from Supabase...');
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data || [];
  },

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }

    return data;
  },

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }

    return data || [];
  },

  async getAppointmentsByMR(mrNumber: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('mr_number', mrNumber)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by MR:', error);
      throw error;
    }

    return data || [];
  },

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    return data;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }

    return data;
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', startOfDay.toISOString())
      .lte('appointment_date', endOfDay.toISOString())
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }

    return data || [];
  }
};
