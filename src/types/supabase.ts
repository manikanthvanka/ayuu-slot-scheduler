// Core User Types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface UserCommunication {
  id: string;
  user_id: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  specialty?: string;
  experience?: string;
  availability?: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  mr_number: string;
  blood_group?: string;
  allergies?: string[];
  medical_history?: string[];
  current_medications?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Legacy types for backward compatibility (will be removed)
export interface Patient {
  id: string;
  mr_number: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_group?: string;
  allergies?: string[];
  medical_history?: string[];
  current_medications?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  experience?: string;
  availability?: string;
  phone?: string;
  email?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  doctor_name?: string;
  appointment_date: string;
  appointment_time: string;
  department?: string;
  reason?: string;
  status: string;
  token?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  patient_profile?: PatientProfile;
  user_communication?: UserCommunication;
}