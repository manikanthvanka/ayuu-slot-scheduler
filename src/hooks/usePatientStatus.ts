
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { appointmentService } from '@/services/appointmentService';

export const usePatientStatus = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    setUpdating(true);
    
    try {
      const success = await appointmentService.updatePatientStatus(patientId, newStatus);
      
      if (success) {
        toast({
          title: "✅ Status Updated",
          description: `Patient status updated to ${newStatus}`,
        });
        return true;
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast({
        title: "❌ Update Failed",
        description: "Failed to update patient status. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updatePatientStatus,
    updating
  };
};
