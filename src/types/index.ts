
export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
export type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  emergencyContact?: string;
  guardianPhone?: string;
  address: string;
  mrNumber: string;
  status: string;
  token: number;
  registrationDate: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctor: string;
  time: string;
  date: string;
  status: string;
  type: string;
  token: number;
  mrNumber: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  [key: string]: {
    name: string;
    icon: any;
    color: string;
    permissions: { [key: string]: boolean };
  };
}

export interface PatientHistory {
  id: number;
  date: string;
  doctor: string;
  complaint: string;
  vitals: {
    bp: string;
    temp: string;
    pulse: string;
  };
  vitalsBy: string;
  vitalsTime: string;
  consultationTime: string;
  testsOrdered: string[];
  medications: string[];
  status: string;
  completedTime: string;
}
