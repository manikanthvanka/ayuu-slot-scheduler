
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PatientSearchForm from '@/components/appointment/PatientSearchForm';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import DoctorsList from '@/components/appointment/DoctorsList';
import AppointmentStats from '@/components/appointment/AppointmentStats';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import { appointmentService } from '@/services/appointmentService';

interface AppointmentBookingProps {
  onSubmit: (appointmentData: any) => void;
  onBack: () => void;
  prefilledMRData?: any;
  doctors: any[];
  timeSlots: any[];
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  onSubmit, 
  onBack, 
  prefilledMRData, 
  doctors, 
  timeSlots 
}) => {
  const [bookingResult, setBookingResult] = useState<{
    token: number;
    eta: string;
    appointmentData: any;
  } | null>(null);

  const {
    loading,
    setLoading,
    searchingPatient,
    patientFound,
    formData,
    availableSlots,
    handleMRSearch,
    handleInputChange,
    getTomorrowDate,
    toast
  } = useAppointmentForm(prefilledMRData, timeSlots);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientFound) {
      toast({
        title: "⚠️ Error",
        description: "Please search and verify patient details first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId);
      
      const appointmentData = {
        patient_id: prefilledMRData?.userId || null,
        appointment_date: formData.date,
        appointment_time: formData.time,
        doctor_name: selectedDoctor?.name || '',
        department: selectedDoctor?.specialty || '',
        reason: formData.type,
        notes: formData.notes,
        status: 'scheduled'
      };

      const result = await appointmentService.addAppointment(appointmentData);

      setBookingResult({
        token: result.token,
        eta: result.eta,
        appointmentData: {
          ...appointmentData,
          ...formData,
          doctor: selectedDoctor?.name || '',
          appointmentId: result.appointment?.id || `APT${Date.now()}`,
          status: 'Scheduled'
        }
      });

      toast({
        title: "✅ Appointment Booked Successfully!",
        description: `Token #${result.token} assigned. Estimated wait: ${result.eta}`,
      });

      onSubmit(appointmentData);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "❌ Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
              <Calendar className="w-6 h-6" />
              <span>Appointment Confirmed!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-800">Token #{bookingResult.token}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">Estimated Wait: {bookingResult.eta}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium">{formData.patientName}</p>
              <p className="text-gray-600">Dr. {formData.doctorId && doctors.find(d => d.id.toString() === formData.doctorId)?.name}</p>
              <p className="text-gray-600">{formData.date} at {formData.time}</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={onBack}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Book Appointment</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Appointment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <PatientSearchForm
                  mrNumber={formData.mrNumber}
                  patientName={formData.patientName}
                  phone={formData.phone}
                  searchingPatient={searchingPatient}
                  patientFound={patientFound}
                  loading={loading}
                  onMRNumberChange={(value) => handleInputChange('mrNumber', value)}
                  onSearch={handleMRSearch}
                />

                <AppointmentForm
                  formData={formData}
                  doctors={doctors}
                  availableSlots={availableSlots}
                  patientFound={patientFound}
                  loading={loading}
                  onInputChange={handleInputChange}
                  getTomorrowDate={getTomorrowDate}
                />

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!patientFound || loading}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Booking...</span>
                      </div>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <DoctorsList doctors={doctors} />
          <AppointmentStats availableSlots={availableSlots} doctors={doctors} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
