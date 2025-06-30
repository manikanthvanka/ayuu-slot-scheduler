
import React from 'react';
import { Download, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDownloadProps {
  appointment: any;
  patient: any;
}

const AppointmentDownload: React.FC<AppointmentDownloadProps> = ({ appointment, patient }) => {
  const { toast } = useToast();

  const handleDownloadAppointment = () => {
    const appointmentDetails = `
APPOINTMENT CONFIRMATION
========================

Patient Information:
Name: ${patient?.name || 'N/A'}
MR Number: MR${patient?.mrNumber || 'N/A'}
Phone: ${patient?.phone || 'N/A'}
Age: ${patient?.age || 'N/A'} years
Gender: ${patient?.gender || 'N/A'}

Appointment Details:
Doctor: ${appointment.doctor}
Date: ${appointment.date}
Time: ${appointment.time}
Token Number: #${appointment.token}
Type: ${appointment.type}
Mode of Payment: ${appointment.paymentMode || 'Cash'}
Amount: ₹${appointment.amount || '500'}

Location:
Ayuu Healthcare System
123 Healthcare Street
Medical District, City - 123456
Phone: +91-1234567890

Important Instructions:
- Please arrive 15 minutes before your appointment time
- Bring your ID proof and any previous medical records
- Fasting may be required for certain tests (if applicable)
- Please inform us in advance if you need to reschedule

Doctor's Notes:
${appointment.doctorNotes || 'No specific notes provided'}

Thank you for choosing Ayuu Healthcare System!
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([appointmentDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment_${appointment.token}_${appointment.date.replace(/\//g, '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "📄 Appointment Downloaded",
      description: "Appointment details have been downloaded successfully.",
    });
  };

  return (
    <Button
      onClick={handleDownloadAppointment}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <Download className="w-4 h-4" />
      <span>Download Details</span>
    </Button>
  );
};

export default AppointmentDownload;
