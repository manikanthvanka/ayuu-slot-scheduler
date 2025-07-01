import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentFormProps {
  formData: {
    doctorId: string;
    date: string;
    time: string;
    type: string;
    paymentMode: string;
  };
  doctors: any[];
  availableSlots: string[];
  patientFound: boolean;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  getTomorrowDate: () => string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  formData,
  doctors,
  availableSlots,
  patientFound,
  loading,
  onInputChange,
  getTomorrowDate
}) => {
  return (
    <>
      {/* Doctor Selection */}
      <div>
        <Label htmlFor="doctor">Select Doctor *</Label>
        <Select 
          value={formData.doctorId} 
          onValueChange={(value) => onInputChange('doctorId', value)} 
          required
          disabled={loading || !patientFound}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{doctor.name}</span>
                  <span className="text-sm text-muted-foreground">{doctor.specialty}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Appointment Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="date"
              type="date"
              className="pl-10"
              value={formData.date}
              min={getTomorrowDate()}
              onChange={(e) => onInputChange('date', e.target.value)}
              required
              disabled={loading || !patientFound}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="time">Preferred Time *</Label>
          <Select 
            value={formData.time} 
            onValueChange={(value) => onInputChange('time', value)} 
            required
            disabled={loading || !patientFound}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map(slot => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointment Type and Payment Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Appointment Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => onInputChange('type', value)}
            disabled={loading || !patientFound}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Check-up">Regular Check-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentMode">Payment Mode *</Label>
          <Select 
            value={formData.paymentMode} 
            onValueChange={(value) => onInputChange('paymentMode', value)}
            disabled={loading || !patientFound}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default AppointmentForm;