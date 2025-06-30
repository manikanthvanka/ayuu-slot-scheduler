
import { useState } from 'react';
import { mockPatients } from '@/data/patients';
import { mockAppointments } from '@/data/appointments';
import type { Patient_ScreenName, Appointment } from '@/types';

export const usePatientData = () => {
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);

  const updatePatientStatus = (patientId: number, newStatus: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    ));
    setAppointments(prev => prev.map(appointment => 
      appointment.patientId === patientId ? { ...appointment, status: newStatus } : appointment
    ));
  };

  const addNewPatient = (patientData: any) => {
    const newPatient = {
      id: patients.length + 1,
      ...patientData,
      token: patients.length + 1,
      status: 'Registered'
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addNewAppointment = (appointmentData: any) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: 'Scheduled'
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  return {
    patients,
    appointments,
    updatePatientStatus,
    addNewPatient,
    addNewAppointment
  };
};
