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

export interface UserRole {
  id: string;
  user_id: string;
  role_name: string;
  permissions: string[];
  is_active: boolean;
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
  patients?: Patient;
}