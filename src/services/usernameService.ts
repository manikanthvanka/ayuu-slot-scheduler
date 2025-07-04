
import { supabase } from '@/integrations/supabase/client';

export const usernameService = {
  async checkAvailability(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('is_username_available', { check_username: username });

      if (error) {
        console.error('Error checking username availability:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error in username service:', error);
      return false;
    }
  },

  async getEmailByUsername(username: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_email_by_username', { check_username: username });

      if (error) {
        console.error('Error getting email by username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in username service:', error);
      return null;
    }
  }
};
