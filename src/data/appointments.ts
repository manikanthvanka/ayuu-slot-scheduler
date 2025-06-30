
import { Appointment } from '@/types';

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    doctor: 'Dr. Anil Sharma',
    time: '10:00 AM',
    date: '2024-12-30',
    status: 'Scheduled',
    type: 'General Consultation',
    token: 1,
    mrNumber: 'MR2024001'
  },
  {
    id: 2,
    patientId: 2,
    doctor: 'Dr. Meera Patel',
    time: '10:30 AM',
    date: '2024-12-30',
    status: 'In Progress',
    type: 'Follow-up',
    token: 2,
    mrNumber: 'MR2024002'
  },
  {
    id: 3,
    patientId: 3,
    doctor: 'Dr. Rajesh Kumar',
    time: '11:00 AM',
    date: '2024-12-30',
    status: 'Scheduled',
    type: 'Specialist Consultation',
    token: 3,
    mrNumber: 'MR2024003'
  },
  {
    id: 4,
    patientId: 4,
    doctor: 'Dr. Priya Singh',
    time: '2:00 PM',
    date: '2024-12-30',
    status: 'Completed',
    type: 'General Consultation',
    token: 4,
    mrNumber: 'MR2024004'
  },
  {
    id: 5,
    patientId: 5,
    doctor: 'Dr. Anil Sharma',
    time: '3:00 PM',
    date: '2024-12-30',
    status: 'Cancelled',
    type: 'Follow-up',
    token: 5,
    mrNumber: 'MR2024005'
  }
];
