
export const mockPatients = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi.kumar@email.com",
    phone: "+91 98765 43210",
    token: 1,
    status: "Vitals Done",
    gender: "Male",
    age: 45,
    address: "123 MG Road, Bangalore",
    emergencyContact: "+91 98765 43211"
  },
  {
    id: 2,
    name: "Sita Devi",
    email: "sita.devi@email.com",
    phone: "+91 98765 43212",
    token: 2,
    status: "With Doctor",
    gender: "Female",
    age: 32,
    address: "456 Brigade Road, Bangalore",
    emergencyContact: "+91 98765 43213"
  },
  {
    id: 3,
    name: "Arjun Rao",
    email: "arjun.rao@email.com",
    phone: "+91 98765 43214",
    token: 3,
    status: "Sent for Tests",
    gender: "Male",
    age: 28,
    address: "789 Commercial Street, Bangalore",
    emergencyContact: "+91 98765 43215"
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43216",
    token: 4,
    status: "Re-check Pending",
    gender: "Female",
    age: 35,
    address: "321 Koramangala, Bangalore",
    emergencyContact: "+91 98765 43217"
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43218",
    token: 5,
    status: "Completed",
    gender: "Male",
    age: 52,
    address: "654 Indiranagar, Bangalore",
    emergencyContact: "+91 98765 43219"
  }
];

export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Anil Sharma",
    specialty: "General Medicine",
    experience: "15 years",
    availability: "9:00 AM - 1:00 PM"
  },
  {
    id: 2,
    name: "Dr. Meera Patel",
    specialty: "Cardiology",
    experience: "12 years",
    availability: "2:00 PM - 6:00 PM"
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    specialty: "Orthopedics",
    experience: "18 years",
    availability: "10:00 AM - 2:00 PM"
  },
  {
    id: 4,
    name: "Dr. Sunita Reddy",
    specialty: "Pediatrics",
    experience: "10 years",
    availability: "9:00 AM - 5:00 PM"
  }
];

export const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    doctor: "Dr. Anil Sharma",
    time: "10:00 AM",
    date: "2024-12-30",
    status: "Vitals Done",
    type: "Consultation"
  },
  {
    id: 2,
    patientId: 2,
    doctor: "Dr. Meera Patel",
    time: "2:30 PM",
    date: "2024-12-30",
    status: "With Doctor",
    type: "Follow-up"
  },
  {
    id: 3,
    patientId: 3,
    doctor: "Dr. Rajesh Kumar",
    time: "11:00 AM",
    date: "2024-12-30",
    status: "Sent for Tests",
    type: "Consultation"
  },
  {
    id: 4,
    patientId: 4,
    doctor: "Dr. Anil Sharma",
    time: "10:30 AM",
    date: "2024-12-30",
    status: "Re-check Pending",
    type: "Follow-up"
  },
  {
    id: 5,
    patientId: 5,
    doctor: "Dr. Sunita Reddy",
    time: "9:30 AM",
    date: "2024-12-30",
    status: "Completed",
    type: "Consultation"
  }
];

export const mockTimeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
  "4:30 PM", "5:00 PM", "5:30 PM"
];
