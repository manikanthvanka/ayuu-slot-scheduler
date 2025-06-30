
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface VitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vitalsData: any) => void;
  patientName: string;
  mrNumber: string;
  existingVitals?: any;
}

const VitalsModal: React.FC<VitalsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientName,
  mrNumber,
  existingVitals
}) => {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (existingVitals && isOpen) {
      setVitals({
        bloodPressure: existingVitals.bloodPressure || '',
        heartRate: existingVitals.heartRate || '',
        temperature: existingVitals.temperature || '',
        weight: existingVitals.weight || '',
        height: existingVitals.height || '',
        oxygenSaturation: existingVitals.oxygenSaturation || '',
        notes: existingVitals.notes || ''
      });
    } else if (isOpen) {
      setVitals({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        notes: ''
      });
    }
  }, [existingVitals, isOpen]);

  const handleSave = () => {
    // Validate required fields
    if (!vitals.bloodPressure || !vitals.heartRate || !vitals.temperature) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in Blood Pressure, Heart Rate, and Temperature",
        variant: "destructive"
      });
      return;
    }

    const vitalsData = {
      ...vitals,
      takenBy: 'Current Staff User', // In real app, get from auth context
      takenAt: new Date().toISOString(),
      patientName,
      mrNumber
    };

    onSave(vitalsData);
    
    // Reset form
    setVitals({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: '',
      notes: ''
    });

    toast({
      title: "✅ Vitals Recorded",
      description: "Patient vitals have been successfully recorded",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0F52BA]">
            {existingVitals ? 'Update Vitals' : 'Record Vitals'}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p><strong>Patient:</strong> {patientName}</p>
            <p><strong>MR Number:</strong> {mrNumber}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bloodPressure">Blood Pressure *</Label>
              <Input
                id="bloodPressure"
                placeholder="120/80"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="heartRate">Heart Rate * (bpm)</Label>
              <Input
                id="heartRate"
                placeholder="72"
                value={vitals.heartRate}
                onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature * (°F)</Label>
              <Input
                id="temperature"
                placeholder="98.6"
                value={vitals.temperature}
                onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="oxygenSaturation">Oxygen Sat (%)</Label>
              <Input
                id="oxygenSaturation"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({...vitals, oxygenSaturation: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                placeholder="150"
                value={vitals.weight}
                onChange={(e) => setVitals({...vitals, weight: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (ft/in)</Label>
              <Input
                id="height"
                placeholder="5'6&quot;"
                value={vitals.height}
                onChange={(e) => setVitals({...vitals, height: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional observations..."
              value={vitals.notes}
              onChange={(e) => setVitals({...vitals, notes: e.target.value})}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#0F52BA] hover:bg-[#000080]">
            {existingVitals ? 'Update Vitals' : 'Save Vitals'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VitalsModal;
