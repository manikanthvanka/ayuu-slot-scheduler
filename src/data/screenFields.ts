
export interface ScreenField {
  id: string;
  key: string;
  label: string;
  value: string;
  description: string;
  screen: string;
}

export const dashboardScreenFields: ScreenField[] = [
  {
    id: '1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Ayuu Healthcare',
    description: 'Main page title shown in header',
    screen: 'dashboard'
  },
  {
    id: '2',
    key: 'register_patient_btn',
    label: 'Register Patient Button',
    value: 'Register Patient',
    description: 'Text for register patient button',
    screen: 'dashboard'
  },
  {
    id: '3',
    key: 'book_appointment_btn',
    label: 'Book Appointment Button',
    value: 'Book Appointment',
    description: 'Text for book appointment button',
    screen: 'dashboard'
  },
  {
    id: '4',
    key: 'patient_search_btn',
    label: 'Patient Search Button',
    value: 'Patient Search',
    description: 'Text for patient search button',
    screen: 'dashboard'
  },
  {
    id: '5',
    key: 'todays_appointments_card',
    label: 'Today\'s Appointments Card',
    value: 'Today\'s Appointments',
    description: 'Title for appointments statistics card',
    screen: 'dashboard'
  },
  {
    id: '6',
    key: 'active_queue_card',
    label: 'Active Queue Card',
    value: 'Active Queue',
    description: 'Title for active queue statistics card',
    screen: 'dashboard'
  },
  {
    id: '7',
    key: 'return_queue_card',
    label: 'Return Queue Card',
    value: 'Return Queue',
    description: 'Title for return queue statistics card',
    screen: 'dashboard'
  },
  {
    id: '8',
    key: 'available_doctors_card',
    label: 'Available Doctors Card',
    value: 'Available Doctors',
    description: 'Title for available doctors statistics card',
    screen: 'dashboard'
  },
  {
    id: '9',
    key: 'appointments_table_title',
    label: 'Appointments Table Title',
    value: 'Today\'s Appointments',
    description: 'Title for the appointments data table',
    screen: 'dashboard'
  },
  {
    id: '10',
    key: 'token_column',
    label: 'Token Column Header',
    value: 'Token',
    description: 'Column header for token number',
    screen: 'dashboard'
  },
  {
    id: '11',
    key: 'mr_number_column',
    label: 'MR Number Column Header',
    value: 'MR Number',
    description: 'Column header for MR number',
    screen: 'dashboard'
  },
  {
    id: '12',
    key: 'patient_name_column',
    label: 'Patient Name Column Header',
    value: 'Patient Name',
    description: 'Column header for patient name',
    screen: 'dashboard'
  },
  {
    id: '13',
    key: 'doctor_column',
    label: 'Doctor Column Header',
    value: 'Doctor',
    description: 'Column header for doctor name',
    screen: 'dashboard'
  },
  {
    id: '14',
    key: 'time_column',
    label: 'Time Column Header',
    value: 'Time',
    description: 'Column header for appointment time',
    screen: 'dashboard'
  },
  {
    id: '15',
    key: 'status_column',
    label: 'Status Column Header',
    value: 'Status',
    description: 'Column header for appointment status',
    screen: 'dashboard'
  },
  {
    id: '16',
    key: 'actions_column',
    label: 'Actions Column Header',
    value: 'Actions',
    description: 'Column header for action buttons',
    screen: 'dashboard'
  }
];
