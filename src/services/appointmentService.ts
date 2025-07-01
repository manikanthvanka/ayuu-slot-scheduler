import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/supabase';

export const appointmentService = {
  async fetchAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          users (
            *,
            user_communication (*),
            patient_profiles (*)
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'user' | 'patient_profile' | 'user_communication'>): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          users (
            *,
            user_communication (*),
            patient_profiles (*)
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  }
};