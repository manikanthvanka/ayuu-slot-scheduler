
import { Patient } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    phone: '+91 9876543210',
    address: '123 Main St, Chennai',
    mrNumber: 'MR2024001',
    status: 'Registered',
    token: 1,
    registrationDate: '2024-12-30'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    phone: '+91 9876543211',
    guardianPhone: '+91 9876543200',
    address: '456 Oak Ave, Mumbai',
    mrNumber: 'MR2024002',
    status: 'Vitals Taken',
    token: 2,
    registrationDate: '2024-12-30'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 42,
    gender: 'Male',
    phone: '+91 9876543212',
    address: '789 Pine Rd, Delhi',
    mrNumber: 'MR2024003',
    status: 'With Doctor',
    token: 3,
    registrationDate: '2024-12-29'
  },
  {
    id: 4,
    name: 'Emily Davis',
    age: 31,
    gender: 'Female',
    phone: '+91 9876543213',
    address: '321 Elm St, Bangalore',
    mrNumber: 'MR2024004',
    status: 'Re-check Pending',
    token: 4,
    registrationDate: '2024-12-29'
  },
  {
    id: 5,
    name: 'Michael Brown',
    age: 55,
    gender: 'Male',
    phone: '+91 9876543214',
    address: '654 Maple Dr, Hyderabad',
    mrNumber: 'MR2024005',
    status: 'Completed',
    token: 5,
    registrationDate: '2024-12-28'
  }
];
