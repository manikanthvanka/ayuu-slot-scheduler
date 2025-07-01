
import { supabase } from '@/integrations/supabase/client';
import type { Patient } from '@/hooks/useSupabaseData';

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    console.log('Fetching all patients from Supabase...');
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }

    return data || [];
  },

  async getPatientById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }

    return data;
  },

  async getPatientByMR(mrNumber: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('mr_number', mrNumber)
      .maybeSingle();

    if (error) {
      console.error('Error fetching patient by MR:', error);
      throw error;
    }

    return data;
  },

  async createPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      throw error;
    }

    return data;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }

    return data;
  },

  async searchPatients(query: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,mr_number.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching patients:', error);
      throw error;
    }

    return data || [];
  }
};
