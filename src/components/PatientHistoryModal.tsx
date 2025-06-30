
import React from 'react';
import { X, User, Phone, Calendar, Clock, TestTube, Pill, Activity, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VitalsChart from './VitalsChart';

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  // Mock patient history data with more visits for trending
  const mockPatientHistory = [
    {
      id: 1,
      date: '2024-12-25',
      doctor: 'Dr. Anil Sharma',
      complaint: 'Fever and headache',
      vitals: { bp: '120/80', temp: '101', pulse: '85', weight: '70kg', height: '170cm', systolic: 120, diastolic: 80, pulse_num: 85, temp_num: 101, spo2: 98 },
      vitalsBy: 'Nurse Sarah',
      vitalsTime: '10:15 AM',
      consultationTime: '10:30 AM',
      testsOrdered: ['Blood Test', 'X-Ray Chest', 'CBC'],
      medications: ['Paracetamol 500mg BD', 'Azithromycin 250mg OD', 'Crocin SOS'],
      notes: 'Patient reported improvement in symptoms. Continue medication for 3 more days.',
      status: 'Completed',
      completedTime: '11:45 AM'
    },
    {
      id: 2,
      date: '2024-12-15',
      doctor: 'Dr. Meera Patel',
      complaint: 'Chest pain and breathing difficulty',
      vitals: { bp: '130/85', temp: '98.6', pulse: '92', weight: '69kg', height: '170cm', systolic: 130, diastolic: 85, pulse_num: 92, temp_num: 98.6, spo2: 96 },
      vitalsBy: 'Nurse John',
      vitalsTime: '2:15 PM',
      consultationTime: '2:45 PM',
      testsOrdered: ['ECG', 'Blood Test', 'Chest X-Ray'],
      medications: ['Aspirin 75mg OD', 'Atorvastatin 20mg', 'Pantoprazole 40mg'],
      notes: 'ECG normal. Patient advised lifestyle changes and follow-up in 2 weeks.',
      status: 'Completed',
      completedTime: '4:30 PM'
    },
    {
      id: 3,
      date: '2024-12-10',
      doctor: 'Dr. Anil Sharma',
      complaint: 'Follow-up visit',
      vitals: { bp: '125/82', temp: '98.8', pulse: '88', weight: '70kg', height: '170cm', systolic: 125, diastolic: 82, pulse_num: 88, temp_num: 98.8, spo2: 97 },
      vitalsBy: 'Nurse Sarah',
      vitalsTime: '9:30 AM',
      consultationTime: '9:45 AM',
      testsOrdered: ['Blood Sugar', 'Lipid Profile'],
      medications: ['Metformin 500mg BD'],
      notes: 'Blood sugar levels stable. Continue current medication.',
      status: 'Completed',
      completedTime: '10:30 AM'
    }
  ];

  // Prepare chart data
  const chartData = mockPatientHistory.map(visit => ({
    date: visit.date,
    systolic: visit.vitals.systolic,
    diastolic: visit.vitals.diastolic,
    pulse: visit.vitals.pulse_num,
    temperature: visit.vitals.temp_num,
    spo2: visit.vitals.spo2
  })).reverse(); // Reverse to show chronological order

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'With Doctor':
        return 'bg-blue-100 text-blue-800';
      case 'Vitals Done':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sent for Tests':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-[#0F52BA]">
            <span className="text-xl">Patient History - {patient.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Patient Information Card */}
        <Card className="mb-6 border-[#0F52BA] border-t-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
              <User className="w-5 h-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">MR Number</p>
                  <p className="text-lg font-mono font-bold text-[#0F52BA]">MR{patient.mrNumber}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age & Gender</p>
                  <p className="text-lg">{patient.age} years, {patient.gender}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-lg">{patient.address}</p>
                </div>
                {patient.guardianName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Guardian</p>
                    <p className="text-lg">{patient.guardianName}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs Trends */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
              <Activity className="w-5 h-5" />
              <span>Vital Signs Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <VitalsChart data={chartData} type="bp" title="Blood Pressure Trend" />
              <VitalsChart data={chartData} type="pulse" title="Pulse Rate Trend" />
              <VitalsChart data={chartData} type="temperature" title="Temperature Trend (°F)" />
              <VitalsChart data={chartData} type="spo2" title="SpO2 Trend" />
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#0F52BA]" />
            <h3 className="text-xl font-semibold text-[#0F52BA]">Visit History ({mockPatientHistory.length} visits)</h3>
          </div>
          
          {mockPatientHistory.map((visit, index) => (
            <Card key={visit.id} className="border-l-4 border-l-[#4169E1] shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-[#0F52BA] flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{visit.date}</span>
                    </CardTitle>
                    <p className="text-gray-600 font-medium">Dr. {visit.doctor}</p>
                  </div>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chief Complaint */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Chief Complaint
                  </h4>
                  <p className="text-red-700">{visit.complaint}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Vital Signs
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">BP:</span>
                        <span className="ml-2 text-blue-700">{visit.vitals.bp}</span>
                      </div>
                      <div>
                        <span className="font-medium">Temp:</span>
                        <span className="ml-2 text-blue-700">{visit.vitals.temp}°F</span>
                      </div>
                      <div>
                        <span className="font-medium">Pulse:</span>
                        <span className="ml-2 text-blue-700">{visit.vitals.pulse}</span>
                      </div>
                      <div>
                        <span className="font-medium">Weight:</span>
                        <span className="ml-2 text-blue-700">{visit.vitals.weight}</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Recorded by {visit.vitalsBy} at {visit.vitalsTime}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Vitals:</span>
                        <span className="text-green-700">{visit.vitalsTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Consultation:</span>
                        <span className="text-green-700">{visit.consultationTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Completed:</span>
                        <span className="text-green-700">{visit.completedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                      <TestTube className="w-4 h-4 mr-2" />
                      Tests Ordered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visit.testsOrdered.map((test, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-purple-300 text-purple-700">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                      <Pill className="w-4 h-4 mr-2" />
                      Medications
                    </h4>
                    <div className="space-y-1">
                      {visit.medications.map((med, idx) => (
                        <div key={idx} className="text-sm text-orange-700 bg-white px-2 py-1 rounded">
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {visit.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Doctor's Notes</h4>
                    <p className="text-gray-700 text-sm italic">{visit.notes}</p>
                  </div>
                )}
                
                {index < mockPatientHistory.length - 1 && <Separator className="mt-4" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHistoryModal;
