
export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    availability: "Available today",
    experience: "15+ years"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Medicine",
    availability: "Available today",
    experience: "12+ years"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    availability: "Available today",
    experience: "8+ years"
  },
  {
    id: 4,
    name: "Dr. David Thompson",
    specialty: "Orthopedics",
    availability: "Available today",
    experience: "20+ years"
  }
];

export const mockTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM"
];

export const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "Consultation",
    status: "Scheduled",
    token: 5
  },
  {
    id: 2,
    patientId: 1,
    doctor: "Dr. Michael Chen",
    date: "2024-01-10",
    time: "02:30 PM",
    type: "Follow-up",
    status: "Completed",
    token: 12
  }
];
