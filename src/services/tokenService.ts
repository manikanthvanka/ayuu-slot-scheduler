
import { supabase } from '@/integrations/supabase/client';

export const tokenService = {
  async getNextToken(appointmentDate: string): Promise<{ token: number; eta: string }> {
    try {
      // Get next token number
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('get_next_token', { appointment_date: appointmentDate });

      if (tokenError) {
        console.error('Error getting next token:', tokenError);
        throw tokenError;
      }

      const token = tokenData;

      // Calculate ETA (assuming 15 minutes per appointment)
      const appointmentsBeforeMe = token - 1;
      const estimatedMinutes = appointmentsBeforeMe * 15;
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;

      let eta = '';
      if (hours > 0) {
        eta = `${hours}h ${minutes}m`;
      } else {
        eta = `${minutes}m`;
      }

      return { token, eta };
    } catch (error) {
      console.error('Error in token service:', error);
      throw error;
    }
  },

  async getCurrentTokenForDate(appointmentDate: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('appointment_tokens')
        .select('current_token')
        .eq('appointment_date', appointmentDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.current_token || 0;
    } catch (error) {
      console.error('Error getting current token:', error);
      return 0;
    }
  }
};
