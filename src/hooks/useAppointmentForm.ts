import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  mrNumber: string;
  patientName: string;
  phone: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  paymentMode: string;
  notes: string;
}

export const useAppointmentForm = (prefilledMRData?: any, timeSlots: any[] = []) => {
  const [loading, setLoading] = useState(false);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    mrNumber: '',
    patientName: '',
    phone: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
    paymentMode: 'Cash',
    notes: ''
  });
  const { toast } = useToast();

  const [availableSlots, setAvailableSlots] = useState(
    timeSlots.map(slot => slot.slot_time || slot)
  );

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

  // Update available slots when timeSlots change
  useEffect(() => {
    setAvailableSlots(timeSlots.map(slot => slot.slot_time || slot));
  }, [timeSlots]);

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

  const handleInputChange = (field: string, value: string) => {
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

  return {
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
  };
};