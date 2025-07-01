
import { DatabaseAdapter, Patient, Appointment } from '../types/database';

export class SupabaseAdapter implements DatabaseAdapter {
  private client: any = null;
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async connect(): Promise<void> {
    console.log(`Connecting to Supabase at ${this.url}`);
    
    // Simulate connection - in real implementation you'd use @supabase/supabase-js
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.client = {
      connected: true,
      patients: new Map(),
      appointments: new Map()
    };
    
    console.log('Supabase database connected');
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.connected = false;
      this.client = null;
      console.log('Supabase database disconnected');
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: `supabase_patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    this.client.patients.set(newPatient.id, newPatient);
    console.log('Created patient in Supabase:', newPatient.mrNumber);
    return newPatient;
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.client.patients.get(id) || null;
  }

  async getPatientByMRNumber(mrNumber: string): Promise<Patient | null> {
    for (const patient of this.client.patients.values()) {
      if (patient.mrNumber === mrNumber) {
        return patient;
      }
    }
    return null;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const results: Patient[] = [];
    for (const patient of this.client.patients.values()) {
      if (patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.mrNumber.includes(query) ||
          patient.phone.includes(query)) {
        results.push(patient);
      }
    }
    return results;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const patient = this.client.patients.get(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient = { ...patient, ...updates };
    this.client.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: `supabase_appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.client.appointments.set(newAppointment.id, newAppointment);
    console.log('Created appointment in Supabase:', newAppointment.id);
    return newAppointment;
  }

  async getAppointment(id: string): Promise<Appointment | null> {
    return this.client.appointments.get(id) || null;
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const results: Appointment[] = [];
    const targetDate = date.toDateString();
    
    for (const appointment of this.client.appointments.values()) {
      if (appointment.appointmentDate.toDateString() === targetDate) {
        results.push(appointment);
      }
    }
    return results;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const results: Appointment[] = [];
    for (const appointment of this.client.appointments.values()) {
      if (appointment.patientId === patientId) {
        results.push(appointment);
      }
    }
    return results;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.client.appointments.get(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = { ...appointment, ...updates };
    this.client.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
}
