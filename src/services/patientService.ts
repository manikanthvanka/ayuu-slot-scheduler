import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/supabase';

export const patientService = {
  async fetchPatients(): Promise<Patient[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  async addPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  async updatePatientStatus(patientId: string, newStatus: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
      throw error;
    }
  }
};