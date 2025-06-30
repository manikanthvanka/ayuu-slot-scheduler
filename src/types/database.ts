
export interface DatabaseConfig {
  type: 'sqlite' | 'supabase';
  sqlite?: {
    dbPath: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
  };
}

export interface Patient {
  id: string;
  mrNumber: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  appointmentDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  vitals?: any;
  notes?: string;
}

export interface DatabaseAdapter {
  // Patient operations
  createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient>;
  getPatient(id: string): Promise<Patient | null>;
  getPatientByMRNumber(mrNumber: string): Promise<Patient | null>;
  searchPatients(query: string): Promise<Patient[]>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient>;
  
  // Appointment operations
  createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment>;
  getAppointment(id: string): Promise<Appointment | null>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment>;
  
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}
