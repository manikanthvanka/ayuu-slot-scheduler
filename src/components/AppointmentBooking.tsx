import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PatientSearchForm from '@/components/appointment/PatientSearchForm';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import DoctorsList from '@/components/appointment/DoctorsList';
import AppointmentStats from '@/components/appointment/AppointmentStats';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId);
    const appointmentData = {
      ...formData,
      doctor: selectedDoctor?.name || '',
      appointmentId: `APT${Date.now()}`,
      status: 'Scheduled'
    };

    toast({
      title: "✅ Appointment Booked Successfully!",
      description: `Appointment scheduled for ${formData.patientName} on ${formData.date} at ${formData.time}`,
    });

    onSubmit(appointmentData);
    setLoading(false);
    onBack();
  };

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
