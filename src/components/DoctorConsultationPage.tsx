
import React, { useState } from 'react';
import { ArrowLeft, User, Clock, TestTube, Pill, Calendar, Save, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import InvoiceModal from '@/components/InvoiceModal';

interface DoctorConsultationPageProps {
  patient: any;
  onBack: () => void;
  onUpdatePatientStatus: (patientId: number, newStatus: string) => void;
}

const DoctorConsultationPage: React.FC<DoctorConsultationPageProps> = ({
  patient,
  onBack,
  onUpdatePatientStatus
}) => {
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState('');
  const [testsOrdered, setTestsOrdered] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');
  const [nextVisitReason, setNextVisitReason] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = (newStatus: string) => {
    onUpdatePatientStatus(patient.id, newStatus);
    toast({
      title: "✅ Status Updated",
      description: `Patient status changed to ${newStatus}`,
    });
  };

  const handleSaveConsultation = () => {
    // Here you would typically save the consultation data
    toast({
      title: "💾 Consultation Saved",
      description: "Patient consultation details have been saved successfully.",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Queue
        </Button>
        <h2 className="text-2xl font-bold text-[#0F52BA]">Doctor Consultation - {patient.name}</h2>
      </div>

      {/* Patient Information Card */}
      <Card className="mb-6 border-[#0F52BA] border-t-4 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
            <User className="w-6 h-6" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">MR Number</p>
              <p className="text-lg font-mono font-bold text-[#0F52BA]">MR{patient.mrNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Age & Gender</p>
              <p className="text-lg">{patient.age} years, {patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Token</p>
              <p className="text-lg font-bold text-green-600">#{patient.token}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Actions */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
            <Clock className="w-6 h-6" />
            <span>Patient Status Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatusUpdate('Sent for Tests')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Send for Tests
            </Button>
            <Button
              onClick={() => handleStatusUpdate('Completed')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Mark Completed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Doctor Notes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0F52BA]">Doctor's Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your consultation notes, diagnosis, and observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Medications */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
                <Pill className="w-5 h-5" />
                <span>Medications Prescribed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List medications with dosage and frequency (e.g., Paracetamol 500mg BD)"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tests Ordered */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
                <TestTube className="w-5 h-5" />
                <span>Tests Ordered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List tests to be conducted (e.g., Blood Test, X-Ray, ECG)"
                value={testsOrdered}
                onChange={(e) => setTestsOrdered(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Next Visit */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
                <Calendar className="w-5 h-5" />
                <span>Prescribed Next Visit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nextVisitDate">Next Visit Date</Label>
                <Input
                  id="nextVisitDate"
                  type="date"
                  value={nextVisitDate}
                  onChange={(e) => setNextVisitDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nextVisitReason">Reason for Next Visit</Label>
                <Select value={nextVisitReason} onValueChange={setNextVisitReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                    <SelectItem value="test-results">Test Results Review</SelectItem>
                    <SelectItem value="medication-review">Medication Review</SelectItem>
                    <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save and Generate Invoice Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
        <Button onClick={handleSaveConsultation} variant="outline" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Consultation
        </Button>
        <Button 
          onClick={() => setShowInvoiceModal(true)} 
          className="bg-[#0F52BA] hover:bg-[#000080] text-white"
        >
          <Receipt className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        patient={patient}
        appointment={{
          doctorName: 'Dr. Smith',
          appointmentType: 'Consultation'
        }}
        consultationData={{
          notes,
          medications,
          testsOrdered,
          nextVisitDate,
          nextVisitReason
        }}
      />
    </div>
  );
};

export default DoctorConsultationPage;
