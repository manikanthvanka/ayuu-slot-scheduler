
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, Heart, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVitalRanges, getVitalStatus, calculateBMI, getBMICategory } from '@/utils/vitalsUtils';
import { calculateCardiovascularRisk, CardiovascularRisk } from '@/utils/mlPrediction';
import { createCriticalVitalsNotification, notificationStore } from '@/utils/notificationUtils';

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
  const [riskAssessment, setRiskAssessment] = useState<CardiovascularRisk | null>(null);
  const { toast } = useToast();

  const vitalRanges = getVitalRanges(patientAge);

  // Convert Celsius to Fahrenheit for temperature ranges
  const tempRangeF = {
    min: (vitalRanges.temperature.min * 9/5) + 32,
    max: (vitalRanges.temperature.max * 9/5) + 32,
    unit: '°F'
  };

  useEffect(() => {
    if (existingVitals && isOpen) {
      const bpParts = existingVitals.bloodPressure?.split('/') || ['', ''];
      const tempF = existingVitals.temperature ? 
        (parseFloat(existingVitals.temperature) * 9/5) + 32 : '';
      
      setVitals({
        systolic: bpParts[0] || '',
        diastolic: bpParts[1] || '',
        pulse: existingVitals.heartRate || '',
        temperature: tempF.toString(),
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

  // Auto-calculate BMI, check for critical values, and run ML prediction
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
    if (vitals.temperature) {
      const tempC = (parseFloat(vitals.temperature) - 32) * 5/9;
      if (getVitalStatus(tempC, vitalRanges.temperature) === 'critical') {
        warnings.push('Temperature is in critical range');
      }
    }
    if (vitals.spo2 && getVitalStatus(parseFloat(vitals.spo2), vitalRanges.spo2) === 'critical') {
      warnings.push('SpO2 is in critical range');
    }

    setCriticalWarnings(warnings);

    // Run ML prediction if all vital signs are available
    if (vitals.systolic && vitals.diastolic && vitals.pulse && vitals.temperature && vitals.spo2) {
      const mlInput = {
        systolic: parseFloat(vitals.systolic),
        diastolic: parseFloat(vitals.diastolic),
        pulse: parseFloat(vitals.pulse),
        temperature: parseFloat(vitals.temperature),
        spo2: parseFloat(vitals.spo2),
        age: patientAge
      };
      
      const risk = calculateCardiovascularRisk(mlInput);
      setRiskAssessment(risk);
    } else {
      setRiskAssessment(null);
    }
  }, [vitals, vitalRanges, patientAge]);

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

    // Convert temperature back to Celsius for storage
    const tempC = (parseFloat(vitals.temperature) - 32) * 5/9;

    const vitalsData = {
      bloodPressure: `${vitals.systolic}/${vitals.diastolic}`,
      heartRate: vitals.pulse,
      temperature: tempC.toFixed(1),
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

    // Check for critical vitals and send notification
    const systolic = parseFloat(vitals.systolic);
    const spo2 = parseFloat(vitals.spo2);
    
    if (systolic > 180 || spo2 < 90) {
      const notification = createCriticalVitalsNotification(
        patientName,
        mrNumber,
        { systolic, spo2 }
      );
      notificationStore.addNotification(notification);
      
      toast({
        title: "🚨 Critical Alert Sent",
        description: "Doctor has been notified of critical vitals",
        variant: "destructive"
      });
    }

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
    setRiskAssessment(null);

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

  const getTemperatureInputClassName = (value: string) => {
    if (!value) return "border-gray-300";
    const tempF = parseFloat(value);
    const tempC = (tempF - 32) * 5/9;
    const status = getVitalStatus(tempC, vitalRanges.temperature);
    
    switch (status) {
      case 'critical': return "border-red-500 bg-red-50";
      case 'abnormal': return "border-yellow-500 bg-yellow-50";
      default: return "border-green-500 bg-green-50";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0F52BA] text-xl">
            {existingVitals ? 'Update Vitals' : 'Record Vitals'}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p><strong>Patient:</strong> {patientName} (Age: {patientAge})</p>
            <p><strong>MR Number:</strong> {mrNumber}</p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vitals Input */}
          <div className="lg:col-span-2 space-y-6">
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
                <Label htmlFor="temperature">Temperature * (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                  className={getTemperatureInputClassName(vitals.temperature)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Normal: {tempRangeF.min.toFixed(1)}-{tempRangeF.max.toFixed(1)} °F
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
          </div>

          {/* Right Column - ML Risk Assessment */}
          <div className="space-y-4">
            {riskAssessment && (
              <Card className={`border-2 ${getRiskColor(riskAssessment.level)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Heart className="w-5 h-5" />
                    <span>CV Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {riskAssessment.score}
                    </div>
                    <Badge className={`${getRiskColor(riskAssessment.level)} text-sm px-3 py-1`}>
                      {riskAssessment.level.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-2">{riskAssessment.message}</p>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {riskAssessment.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <p className="font-medium mb-2">Smart Vitals System:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Values validated by patient age ({patientAge} years)</li>
                  <li>Temperature in Fahrenheit (°F)</li>
                  <li>Auto BMI calculation</li>
                  <li>ML-based cardiovascular risk assessment</li>
                  <li>Critical alerts sent to doctors automatically</li>
                </ul>
              </AlertDescription>
            </Alert>
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
