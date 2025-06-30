
import { PatientHistory } from '@/types';

export const mockPatientHistory: PatientHistory[] = [
  {
    id: 1,
    date: '2024-12-25',
    doctor: 'Dr. Anil Sharma',
    complaint: 'Fever and headache for 3 days, body aches',
    vitals: { bp: '120/80', temp: '101°F', pulse: '85 bpm' },
    vitalsBy: 'Nurse Sarah Johnson',
    vitalsTime: '10:15 AM',
    consultationTime: '10:30 AM',
    testsOrdered: ['Complete Blood Count (CBC)', 'X-Ray Chest PA View', 'Urine Analysis'],
    medications: ['Paracetamol 500mg - TID', 'Azithromycin 250mg - OD', 'ORS Solution'],
    status: 'Completed',
    completedTime: '11:45 AM'
  },
  {
    id: 2,
    date: '2024-12-15',
    doctor: 'Dr. Meera Patel',
    complaint: 'Chest pain and shortness of breath during physical activity',
    vitals: { bp: '130/85', temp: '98.6°F', pulse: '92 bpm' },
    vitalsBy: 'Nurse John Williams',
    vitalsTime: '2:15 PM',
    consultationTime: '2:45 PM',
    testsOrdered: ['ECG 12-Lead', 'Echocardiography', 'Lipid Profile', 'Troponin I'],
    medications: ['Aspirin 75mg - OD', 'Atorvastatin 20mg - HS', 'Metoprolol 25mg - BD'],
    status: 'Completed',
    completedTime: '4:30 PM'
  },
  {
    id: 3,
    date: '2024-12-10',
    doctor: 'Dr. Priya Singh',
    complaint: 'Persistent cough with mild fever for 1 week',
    vitals: { bp: '118/76', temp: '99.2°F', pulse: '78 bpm' },
    vitalsBy: 'Nurse Maria Garcia',
    vitalsTime: '9:45 AM',
    consultationTime: '10:15 AM',
    testsOrdered: ['Chest X-Ray', 'Sputum Culture', 'CBC with ESR'],
    medications: ['Amoxicillin 500mg - TID', 'Dextromethorphan Syrup', 'Steam Inhalation'],
    status: 'Completed',
    completedTime: '12:00 PM'
  }
];
