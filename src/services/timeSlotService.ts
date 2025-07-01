import { supabase } from '@/integrations/supabase/client';
import { TimeSlot } from '@/types/supabase';

export const timeSlotService = {
  async fetchTimeSlots(): Promise<TimeSlot[]> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_available', true)
        .order('slot_time', { ascending: true });

      if (error) {
        console.error('Error fetching time slots:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  }
};