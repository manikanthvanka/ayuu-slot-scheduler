
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Clock, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorConsultationPageProps {
  patient: any;
  appointment: any;
  onBack: () => void;
  onUpdateConsultation: (consultationData: any) => void;
}

const DoctorConsultationPage: React.FC<DoctorConsultationPageProps> = ({
  patient,
  appointment,
  onBack,
  onUpdateConsultation
}) => {
  const [consultation, setConsultation] = useState({
    chiefComplaint: '',
    examination: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    followUp: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleSave = () => {
    const consultationData = {
      ...consultation,
      doctorName: appointment.doctor,
      consultationDate: new Date().toISOString(),
      patientId: patient.id,
      appointmentId: appointment.id
    };

    onUpdateConsultation(consultationData);
    
    toast({
      title: "✅ Consultation Updated",
      description: "Patient consultation has been saved successfully",
    });

    onBack();
  };

  const mockVitals = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6',
    weight: '150',
    height: '5\'6"',
    oxygenSaturation: '98'
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-[#0F52BA]">Doctor Consultation</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#0F52BA]">
              <User className="w-5 h-5 mr-2" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Name</Label>
              <p className="font-semibold">{patient.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">MR Number</Label>
              <p className="font-mono font-bold text-[#0F52BA]">MR{String(patient.id).padStart(6, '0')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Age</Label>
              <p>{patient.age} years</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Gender</Label>
              <p>{patient.gender}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Phone</Label>
              <p>{patient.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
              <p>{patient.emergencyContact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Appointment & Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#0F52BA]">
              <Calendar className="w-5 h-5 mr-2" />
              Appointment & Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Appointment Time</Label>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.time}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge className="bg-orange-50 text-orange-900 border-orange-200">
                {appointment.status}
              </Badge>
            </div>
            
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-600 flex items-center mb-2">
                <Heart className="w-4 h-4 mr-1" />
                Latest Vitals
              </Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">BP:</span> {mockVitals.bloodPressure}
                </div>
                <div>
                  <span className="text-gray-600">HR:</span> {mockVitals.heartRate} bpm
                </div>
                <div>
                  <span className="text-gray-600">Temp:</span> {mockVitals.temperature}°F
                </div>
                <div>
                  <span className="text-gray-600">SpO2:</span> {mockVitals.oxygenSaturation}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0F52BA]">Patient History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">Last Visit: Dec 15, 2024</p>
                <p className="text-gray-600">Routine checkup - Normal</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">Allergies</p>
                <p className="text-gray-600">Penicillin, Peanuts</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">Current Medications</p>
                <p className="text-gray-600">None reported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F52BA]">Consultation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Patient's main concern or reason for visit..."
                value={consultation.chiefComplaint}
                onChange={(e) => setConsultation({...consultation, chiefComplaint: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="examination">Physical Examination</Label>
              <Textarea
                id="examination"
                placeholder="Examination findings..."
                value={consultation.examination}
                onChange={(e) => setConsultation({...consultation, examination: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Primary and secondary diagnoses..."
                value={consultation.diagnosis}
                onChange={(e) => setConsultation({...consultation, diagnosis: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea
                id="treatment"
                placeholder="Treatment recommendations..."
                value={consultation.treatment}
                onChange={(e) => setConsultation({...consultation, treatment: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                placeholder="Medications prescribed..."
                value={consultation.prescription}
                onChange={(e) => setConsultation({...consultation, prescription: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="followUp">Follow-up Instructions</Label>
              <Textarea
                id="followUp"
                placeholder="Follow-up care instructions..."
                value={consultation.followUp}
                onChange={(e) => setConsultation({...consultation, followUp: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or notes..."
              value={consultation.notes}
              onChange={(e) => setConsultation({...consultation, notes: e.target.value})}
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#0F52BA] hover:bg-[#000080]">
              Save Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorConsultationPage;
