import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/supabase';

export const userRoleService = {
  async fetchUserRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }
};