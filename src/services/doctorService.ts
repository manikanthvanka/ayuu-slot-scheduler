import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types/supabase';

export const doctorService = {
  async fetchDoctors(): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }
};