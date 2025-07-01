import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserCommunication, PatientProfile, DoctorProfile } from '@/types/supabase';

export interface CompleteUser {
  user: User;
  communication?: UserCommunication;
  patient_profile?: PatientProfile;
  doctor_profile?: DoctorProfile;
  roles: UserRole[];
}

export interface PatientData {
  first_name: string;
  last_name: string;
  gender?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_group?: string;
  mr_number: string;
}

export const userService = {
  async fetchPatients(): Promise<CompleteUser[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          *,
          user_communication (*),
          patient_profiles (*),
          user_roles (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return [];
      }

      // Filter only users with patient role
      const patients = users?.filter(user => 
        user.user_roles?.some((role: any) => role.role === 'patient')
      ) || [];

      return patients.map(user => ({
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        communication: user.user_communication,
        patient_profile: user.patient_profiles,
        roles: user.user_roles || []
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  async fetchDoctors(): Promise<CompleteUser[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          *,
          user_communication (*),
          doctor_profiles (*),
          user_roles (*)
        `)
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }

      // Filter only users with doctor role
      const doctors = users?.filter(user => 
        user.user_roles?.some((role: any) => role.role === 'doctor')
      ) || [];

      return doctors.map(user => ({
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        communication: user.user_communication,
        doctor_profile: user.doctor_profiles,
        roles: user.user_roles || []
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  },

  async addPatient(patientData: PatientData): Promise<CompleteUser | null> {
    try {
      // Calculate age from date of birth
      const age = patientData.date_of_birth 
        ? new Date().getFullYear() - new Date(patientData.date_of_birth).getFullYear()
        : undefined;

      // 1. Create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
          first_name: patientData.first_name,
          last_name: patientData.last_name,
          gender: patientData.gender,
          date_of_birth: patientData.date_of_birth
        }])
        .select()
        .single();

      if (userError) throw userError;

      // 2. Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: user.id,
          role: 'patient'
        }]);

      if (roleError) throw roleError;

      // 3. Create communication details
      const { data: communication, error: commError } = await supabase
        .from('user_communication')
        .insert([{
          user_id: user.id,
          email: patientData.email,
          phone: patientData.phone,
          address: patientData.address,
          emergency_contact: patientData.emergency_contact,
          emergency_phone: patientData.emergency_phone
        }])
        .select()
        .single();

      if (commError) throw commError;

      // 4. Create patient profile
      const { data: patientProfile, error: profileError } = await supabase
        .from('patient_profiles')
        .insert([{
          user_id: user.id,
          mr_number: patientData.mr_number,
          blood_group: patientData.blood_group,
          status: 'registered'
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        user,
        communication,
        patient_profile: patientProfile,
        roles: [{ id: '', user_id: user.id, role: 'patient', is_active: true, created_at: new Date().toISOString() }]
      };
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  async updatePatientStatus(userId: string, newStatus: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('patient_profiles')
        .update({ status: newStatus })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating patient status:', error);
      throw error;
    }
  },

  async searchPatientByMR(mrNumber: string): Promise<CompleteUser | null> {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select(`
          *,
          users (*),
          user_communication (*)
        `)
        .eq('mr_number', mrNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No data found
        throw error;
      }

      if (!data || !data.users) return null;

      return {
        user: data.users as User,
        communication: Array.isArray(data.user_communication) ? data.user_communication[0] : data.user_communication,
        patient_profile: {
          id: data.id,
          user_id: data.user_id,
          mr_number: data.mr_number,
          blood_group: data.blood_group,
          allergies: data.allergies,
          medical_history: data.medical_history,
          current_medications: data.current_medications,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at
        },
        roles: []
      };
    } catch (error) {
      console.error('Error searching patient by MR:', error);
      return null;
    }
  }
};