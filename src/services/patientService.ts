import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/supabase';
import { userService } from './userService';

export const patientService = {
  async fetchPatients(): Promise<Patient[]> {
    return userService.fetchPatients().then(completeUsers => 
      completeUsers.map(completeUser => ({
        id: completeUser.user.id,
        mr_number: completeUser.patient_profile?.mr_number || '',
        name: `${completeUser.user.first_name} ${completeUser.user.last_name}`,
        age: completeUser.user.date_of_birth 
          ? new Date().getFullYear() - new Date(completeUser.user.date_of_birth).getFullYear()
          : undefined,
        gender: completeUser.user.gender,
        phone: completeUser.communication?.phone,
        email: completeUser.communication?.email,
        address: completeUser.communication?.address,
        emergency_contact: completeUser.communication?.emergency_contact,
        emergency_phone: completeUser.communication?.emergency_phone,
        blood_group: completeUser.patient_profile?.blood_group,
        allergies: completeUser.patient_profile?.allergies,
        medical_history: completeUser.patient_profile?.medical_history,
        current_medications: completeUser.patient_profile?.current_medications,
        status: completeUser.patient_profile?.status || 'registered',
        created_at: completeUser.user.created_at,
        updated_at: completeUser.user.updated_at
      }))
    );
  },

  async addPatient(patientData: any): Promise<Patient | null> {
    const newPatientData = {
      first_name: patientData.firstName || patientData.name?.split(' ')[0] || '',
      last_name: patientData.lastName || patientData.name?.split(' ').slice(1).join(' ') || '',
      gender: patientData.gender,
      date_of_birth: patientData.dateOfBirth,
      email: patientData.email,
      phone: patientData.phone,
      address: patientData.address,
      emergency_contact: patientData.emergencyContact,
      emergency_phone: patientData.emergency_phone,
      blood_group: patientData.blood_group,
      mr_number: patientData.mrNumber || `MR${Date.now()}`
    };

    const completeUser = await userService.addPatient(newPatientData);
    
    if (!completeUser) return null;

    return {
      id: completeUser.user.id,
      mr_number: completeUser.patient_profile?.mr_number || '',
      name: `${completeUser.user.first_name} ${completeUser.user.last_name}`,
      age: completeUser.user.date_of_birth 
        ? new Date().getFullYear() - new Date(completeUser.user.date_of_birth).getFullYear()
        : undefined,
      gender: completeUser.user.gender,
      phone: completeUser.communication?.phone,
      email: completeUser.communication?.email,
      address: completeUser.communication?.address,
      emergency_contact: completeUser.communication?.emergency_contact,
      emergency_phone: completeUser.communication?.emergency_phone,
      blood_group: completeUser.patient_profile?.blood_group,
      allergies: completeUser.patient_profile?.allergies,
      medical_history: completeUser.patient_profile?.medical_history,
      current_medications: completeUser.patient_profile?.current_medications,
      status: completeUser.patient_profile?.status || 'registered',
      created_at: completeUser.user.created_at,
      updated_at: completeUser.user.updated_at
    };
  },

  async updatePatientStatus(patientId: string, newStatus: string): Promise<void> {
    return userService.updatePatientStatus(patientId, newStatus);
  }
};