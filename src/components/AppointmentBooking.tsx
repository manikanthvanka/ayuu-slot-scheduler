import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Hash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDoctors, mockTimeSlots } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AppointmentBookingProps {
  onSubmit: (appointmentData: any) => void;
  onBack: () => void;
  prefilledMRData?: any;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onSubmit, onBack, prefilledMRData }) => {
  const [loading, setLoading] = useState(false);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [formData, setFormData] = useState({
    mrNumber: '',
    patientName: '',
    phone: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: ''
  });
  const { toast } = useToast();

  const [availableSlots, setAvailableSlots] = useState(mockTimeSlots);

  // Handle prefilled data when component mounts or prefilledMRData changes
  useEffect(() => {
    if (prefilledMRData) {
      setFormData(prev => ({
        ...prev,
        mrNumber: prefilledMRData.mrNumber || '',
        patientName: prefilledMRData.name || '',
        phone: prefilledMRData.phone || ''
      }));
      setPatientFound(true);
      
      toast({
        title: "✅ Patient Data Loaded",
        description: `Patient details loaded for ${prefilledMRData.name}`,
      });
    }
  }, [prefilledMRData, toast]);

  const handleMRSearch = async () => {
    if (!formData.mrNumber) {
      toast({
        title: "⚠️ Error",
        description: "Please enter a valid MR Number",
        variant: "destructive"
      });
      return;
    }

    setSearchingPatient(true);
    
    // Simulate API call to search patient
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock patient data based on MR Number
    const mockPatientData = {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      mrNumber: formData.mrNumber
    };

    setFormData(prev => ({
      ...prev,
      patientName: mockPatientData.name,
      phone: mockPatientData.phone
    }));

    setPatientFound(true);
    setSearchingPatient(false);

    toast({
      title: "✅ Patient Found",
      description: `Patient details loaded for MR: ${formData.mrNumber}`,
    });
  };

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

    const selectedDoctor = mockDoctors.find(d => d.id.toString() === formData.doctorId);
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset patient found status if MR number changes
    if (field === 'mrNumber' && patientFound) {
      setPatientFound(false);
      setFormData(prev => ({ ...prev, patientName: '', phone: '' }));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
                {/* MR Number Search */}
                <div>
                  <Label htmlFor="mrNumber">Patient MR Number *</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="mrNumber"
                        className="pl-10"
                        value={formData.mrNumber}
                        onChange={(e) => handleInputChange('mrNumber', e.target.value)}
                        placeholder="Enter MR Number (e.g., MR240001)"
                        required
                        disabled={loading || searchingPatient}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleMRSearch}
                      disabled={!formData.mrNumber || loading || searchingPatient}
                      className="min-w-[100px]"
                    >
                      {searchingPatient ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Searching...</span>
                        </div>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Patient Information (Auto-filled after search) */}
                {patientFound && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Patient Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Patient Name</Label>
                        <Input
                          value={formData.patientName}
                          disabled
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={formData.phone}
                          disabled
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Doctor Selection */}
                <div>
                  <Label htmlFor="doctor">Select Doctor *</Label>
                  <Select 
                    value={formData.doctorId} 
                    onValueChange={(value) => handleInputChange('doctorId', value)} 
                    required
                    disabled={loading || !patientFound}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map(doctor => (
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
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                        disabled={loading || !patientFound}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Select 
                      value={formData.time} 
                      onValueChange={(value) => handleInputChange('time', value)} 
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

                {/* Appointment Type */}
                <div>
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange('type', value)}
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

        {/* Available Doctors Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Available Doctors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDoctors.map(doctor => (
                  <div key={doctor.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{doctor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{doctor.specialty}</p>
                    <p className="text-xs text-green-600">{doctor.availability}</p>
                    <p className="text-xs text-gray-500">{doctor.experience} experience</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Today's Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Available Slots:</span>
                  <span className="text-sm font-medium">{availableSlots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Doctors On Duty:</span>
                  <span className="text-sm font-medium">{mockDoctors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Wait:</span>
                  <span className="text-sm font-medium">15 mins</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
