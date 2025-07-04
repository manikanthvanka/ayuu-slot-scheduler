
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/supabase';
import { tokenService } from './tokenService';

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

  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'user' | 'patient_profile' | 'user_communication' | 'token'>): Promise<{ appointment: Appointment | null; token: number; eta: string }> {
    try {
      // Get next token and ETA
      const { token, eta } = await tokenService.getNextToken(appointmentData.appointment_date);

      // Add appointment with token
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...appointmentData, token }])
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

      return { appointment: data, token, eta };
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  },

  async updatePatientStatus(patientId: string, newStatus: string): Promise<boolean> {
    try {
      console.log('Updating patient status:', { patientId, newStatus });

      // Update in appointments table
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('patient_id', patientId);

      if (appointmentError) {
        console.error('Error updating appointment status:', appointmentError);
        throw appointmentError;
      }

      // Update in patient_profiles table
      const { error: profileError } = await supabase
        .from('patient_profiles')
        .update({ status: newStatus })
        .eq('user_id', patientId);

      if (profileError) {
        console.error('Error updating patient profile status:', profileError);
        throw profileError;
      }

      // Update in patients table if it exists
      const { error: patientError } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId);

      // Don't throw error for patients table as it might not have the record
      if (patientError) {
        console.warn('Could not update patients table:', patientError);
      }

      return true;
    } catch (error) {
      console.error('Error updating patient status:', error);
      return false;
    }
  }
};
