import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types/supabase';

export const doctorService = {
  async fetchDoctors(): Promise<Doctor[]> {
    try {
      // First try to fetch from new normalized structure
      const { data: users, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_communication (*),
          doctor_profiles (*),
          user_roles (*)
        `)
        .order('first_name', { ascending: true });

      if (!userError && users) {
        // Filter only users with doctor role and convert to legacy format
        const doctors = users
          .filter(user => user.user_roles?.some((role: any) => role.role === 'doctor'))
          .map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            specialty: user.doctor_profiles?.specialty || '',
            experience: user.doctor_profiles?.experience || '',
            availability: user.doctor_profiles?.availability || '',
            phone: user.user_communication?.phone || '',
            email: user.user_communication?.email || '',
            status: 'active',
            created_at: user.created_at,
            updated_at: user.updated_at
          }));

        if (doctors.length > 0) {
          return doctors;
        }
      }

      // Fallback to old structure if new structure has no data
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