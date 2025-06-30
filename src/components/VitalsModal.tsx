
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVitalRanges, getVitalStatus, calculateBMI, getBMICategory } from '@/utils/vitalsUtils';

interface VitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vitalsData: any) => void;
  patientName: string;
  mrNumber: string;
  existingVitals?: any;
  patientAge?: number;
  isCompleted?: boolean;
}

const VitalsModal: React.FC<VitalsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientName,
  mrNumber,
  existingVitals,
  patientAge = 35,
  isCompleted = false
}) => {
  const [vitals, setVitals] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    temperature: '',
    spo2: '',
    height: '',
    weight: '',
    notes: ''
  });
  const [bmi, setBmi] = useState(0);
  const [criticalWarnings, setCriticalWarnings] = useState<string[]>([]);
  const { toast } = useToast();

  const vitalRanges = getVitalRanges(patientAge);

  useEffect(() => {
    if (existingVitals && isOpen) {
      // Parse existing blood pressure if it exists
      const bpParts = existingVitals.bloodPressure?.split('/') || ['', ''];
      setVitals({
        systolic: bpParts[0] || '',
        diastolic: bpParts[1] || '',
        pulse: existingVitals.heartRate || '',
        temperature: existingVitals.temperature || '',
        spo2: existingVitals.oxygenSaturation || '',
        height: existingVitals.height || '',
        weight: existingVitals.weight || '',
        notes: existingVitals.notes || ''
      });
    } else if (isOpen) {
      setVitals({
        systolic: '',
        diastolic: '',
        pulse: '',
        temperature: '',
        spo2: '',
        height: '',
        weight: '',
        notes: ''
      });
    }
  }, [existingVitals, isOpen]);

  // Auto-calculate BMI and check for critical values
  useEffect(() => {
    const height = parseFloat(vitals.height);
    const weight = parseFloat(vitals.weight);
    
    if (height > 0 && weight > 0) {
      const calculatedBMI = calculateBMI(height, weight);
      setBmi(calculatedBMI);
    } else {
      setBmi(0);
    }

    // Check for critical values
    const warnings: string[] = [];
    
    if (vitals.systolic && getVitalStatus(parseFloat(vitals.systolic), vitalRanges.systolic) === 'critical') {
      warnings.push('Systolic BP is in critical range');
    }
    if (vitals.diastolic && getVitalStatus(parseFloat(vitals.diastolic), vitalRanges.diastolic) === 'critical') {
      warnings.push('Diastolic BP is in critical range');
    }
    if (vitals.pulse && getVitalStatus(parseFloat(vitals.pulse), vitalRanges.pulse) === 'critical') {
      warnings.push('Pulse rate is in critical range');
    }
    if (vitals.temperature && getVitalStatus(parseFloat(vitals.temperature), vitalRanges.temperature) === 'critical') {
      warnings.push('Temperature is in critical range');
    }
    if (vitals.spo2 && getVitalStatus(parseFloat(vitals.spo2), vitalRanges.spo2) === 'critical') {
      warnings.push('SpO2 is in critical range');
    }

    setCriticalWarnings(warnings);
  }, [vitals, vitalRanges]);

  const handleSave = () => {
    // Validate required fields
    if (!vitals.systolic || !vitals.diastolic || !vitals.pulse || !vitals.temperature) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in Blood Pressure, Pulse Rate, and Temperature",
        variant: "destructive"
      });
      return;
    }

    const vitalsData = {
      bloodPressure: `${vitals.systolic}/${vitals.diastolic}`,
      heartRate: vitals.pulse,
      temperature: vitals.temperature,
      oxygenSaturation: vitals.spo2,
      height: vitals.height,
      weight: vitals.weight,
      bmi: bmi > 0 ? bmi.toString() : '',
      notes: vitals.notes,
      takenBy: 'Current Staff User',
      takenAt: new Date().toISOString(),
      patientName,
      mrNumber
    };

    onSave(vitalsData);
    
    // Reset form
    setVitals({
      systolic: '',
      diastolic: '',
      pulse: '',
      temperature: '',
      spo2: '',
      height: '',
      weight: '',
      notes: ''
    });
    setBmi(0);

    toast({
      title: "✅ Vitals Recorded",
      description: "Patient vitals have been successfully recorded",
    });

    onClose();
  };

  const getInputClassName = (value: string, range: any) => {
    if (!value) return "border-gray-300";
    const numValue = parseFloat(value);
    const status = getVitalStatus(numValue, range);
    
    switch (status) {
      case 'critical': return "border-red-500 bg-red-50";
      case 'abnormal': return "border-yellow-500 bg-yellow-50";
      default: return "border-green-500 bg-green-50";
    }
  };

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0F52BA]">Vitals - Completed Patient</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Cannot update vitals for completed patients.</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0F52BA] text-xl">
            {existingVitals ? 'Update Vitals' : 'Record Vitals'}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p><strong>Patient:</strong> {patientName} (Age: {patientAge})</p>
            <p><strong>MR Number:</strong> {mrNumber}</p>
          </div>
        </DialogHeader>

        {criticalWarnings.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Values Detected:</strong>
              <ul className="list-disc list-inside mt-2">
                {criticalWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Blood Pressure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systolic">Systolic BP * (mmHg)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={vitals.systolic}
                onChange={(e) => setVitals({...vitals, systolic: e.target.value})}
                className={getInputClassName(vitals.systolic, vitalRanges.systolic)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: {vitalRanges.systolic.min}-{vitalRanges.systolic.max} {vitalRanges.systolic.unit}
              </p>
            </div>
            <div>
              <Label htmlFor="diastolic">Diastolic BP * (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={vitals.diastolic}
                onChange={(e) => setVitals({...vitals, diastolic: e.target.value})}
                className={getInputClassName(vitals.diastolic, vitalRanges.diastolic)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: {vitalRanges.diastolic.min}-{vitalRanges.diastolic.max} {vitalRanges.diastolic.unit}
              </p>
            </div>
          </div>

          {/* Pulse and Temperature */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pulse">Pulse Rate * (bpm)</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={vitals.pulse}
                onChange={(e) => setVitals({...vitals, pulse: e.target.value})}
                className={getInputClassName(vitals.pulse, vitalRanges.pulse)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: {vitalRanges.pulse.min}-{vitalRanges.pulse.max} {vitalRanges.pulse.unit}
              </p>
            </div>
            <div>
              <Label htmlFor="temperature">Temperature * (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={vitals.temperature}
                onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                className={getInputClassName(vitals.temperature, vitalRanges.temperature)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: {vitalRanges.temperature.min}-{vitalRanges.temperature.max} {vitalRanges.temperature.unit}
              </p>
            </div>
          </div>

          {/* SpO2 and Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spo2">SpO2 (%)</Label>
              <Input
                id="spo2"
                type="number"
                placeholder="98"
                value={vitals.spo2}
                onChange={(e) => setVitals({...vitals, spo2: e.target.value})}
                className={getInputClassName(vitals.spo2, vitalRanges.spo2)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: {vitalRanges.spo2.min}-{vitalRanges.spo2.max} {vitalRanges.spo2.unit}
              </p>
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={vitals.height}
                onChange={(e) => setVitals({...vitals, height: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Enter height in centimeters</p>
            </div>
          </div>

          {/* Weight and BMI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={vitals.weight}
                onChange={(e) => setVitals({...vitals, weight: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms</p>
            </div>
            <div>
              <Label>BMI</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {bmi > 0 ? (
                  <div>
                    <span className="text-lg font-semibold">{bmi}</span>
                    <Badge className="ml-2" variant="outline">
                      {getBMICategory(bmi)}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-gray-500">Enter height & weight</span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional clinical observations, patient complaints, or relevant notes..."
              value={vitals.notes}
              onChange={(e) => setVitals({...vitals, notes: e.target.value})}
              rows={3}
            />
          </div>

          {/* Information Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Values are automatically validated based on patient age ({patientAge} years). 
              Abnormal values are highlighted in yellow, critical values in red.
            </AlertDescription>
          </Alert>
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
