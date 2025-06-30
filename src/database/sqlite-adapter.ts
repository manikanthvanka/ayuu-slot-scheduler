
import { DatabaseAdapter, Patient, Appointment } from '../types/database';

export class SQLiteAdapter implements DatabaseAdapter {
  private db: any = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  async connect(): Promise<void> {
    // Note: In a real implementation, you'd use a library like better-sqlite3
    // For this demo, we'll simulate the connection
    console.log(`Connecting to SQLite database at ${this.dbPath}`);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.db = {
      connected: true,
      patients: new Map(),
      appointments: new Map()
    };
    
    console.log('SQLite database connected');
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.connected = false;
      this.db = null;
      console.log('SQLite database disconnected');
    }
  }

  isConnected(): boolean {
    return this.db?.connected || false;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    this.db.patients.set(newPatient.id, newPatient);
    console.log('Created patient in SQLite:', newPatient.mrNumber);
    return newPatient;
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.db.patients.get(id) || null;
  }

  async getPatientByMRNumber(mrNumber: string): Promise<Patient | null> {
    for (const patient of this.db.patients.values()) {
      if (patient.mrNumber === mrNumber) {
        return patient;
      }
    }
    return null;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const results: Patient[] = [];
    for (const patient of this.db.patients.values()) {
      if (patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.mrNumber.includes(query) ||
          patient.phone.includes(query)) {
        results.push(patient);
      }
    }
    return results;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const patient = this.db.patients.get(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient = { ...patient, ...updates };
    this.db.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.db.appointments.set(newAppointment.id, newAppointment);
    console.log('Created appointment in SQLite:', newAppointment.id);
    return newAppointment;
  }

  async getAppointment(id: string): Promise<Appointment | null> {
    return this.db.appointments.get(id) || null;
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const results: Appointment[] = [];
    const targetDate = date.toDateString();
    
    for (const appointment of this.db.appointments.values()) {
      if (appointment.appointmentDate.toDateString() === targetDate) {
        results.push(appointment);
      }
    }
    return results;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const results: Appointment[] = [];
    for (const appointment of this.db.appointments.values()) {
      if (appointment.patientId === patientId) {
        results.push(appointment);
      }
    }
    return results;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.db.appointments.get(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = { ...appointment, ...updates };
    this.db.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
}
