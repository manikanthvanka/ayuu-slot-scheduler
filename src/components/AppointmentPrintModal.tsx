
import React from 'react';
import { Printer, X, Calendar, Clock, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AppointmentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: {
    mrNumber: string;
    patientName: string;
    phone: string;
    doctor: string;
    date: string;
    time: string;
    token: number;
    appointmentType: string;
  };
}

const AppointmentPrintModal: React.FC<AppointmentPrintModalProps> = ({
  isOpen,
  onClose,
  appointmentData
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById('appointment-print-content');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Appointment Confirmation</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div id="appointment-print-content" className="space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-[#0F52BA]">Ayuu Healthcare System</h1>
            <p className="text-gray-600">Appointment Confirmation</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0F52BA]">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{appointmentData.patientName}</p>
                  <p className="text-sm text-gray-600">MR Number: {appointmentData.mrNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <p>{appointmentData.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0F52BA]">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <p>{appointmentData.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <p>{appointmentData.time}</p>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <p>Dr. {appointmentData.doctor}</p>
              </div>
              <div className="bg-[#0F52BA] text-white p-4 rounded-lg text-center">
                <p className="text-sm">Your Token Number</p>
                <p className="text-3xl font-bold">#{appointmentData.token}</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Please arrive 15 minutes before your appointment time</p>
            <p>Bring this confirmation and a valid ID</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <Button onClick={handlePrint} className="bg-[#0F52BA] hover:bg-[#000080]">
            <Printer className="w-4 h-4 mr-2" />
            Print Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentPrintModal;
