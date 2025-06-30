
import React from 'react';
import { ArrowLeft, User, Phone, Calendar, Clock, TestTube, Pill, Activity, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PatientHistoryPageProps {
  patient: any;
  onBack: () => void;
}

const PatientHistoryPage: React.FC<PatientHistoryPageProps> = ({
  patient,
  onBack
}) => {
  // Mock patient history data
  const mockPatientHistory = [
    {
      id: 1,
      date: '2024-12-25',
      doctor: 'Dr. Anil Sharma',
      complaint: 'Fever and headache',
      vitals: { bp: '120/80', temp: '101°F', pulse: '85', weight: '70kg', height: '170cm' },
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
      vitals: { bp: '130/85', temp: '98.6°F', pulse: '92', weight: '69kg', height: '170cm' },
      vitalsBy: 'Nurse John',
      vitalsTime: '2:15 PM',
      consultationTime: '2:45 PM',
      testsOrdered: ['ECG', 'Blood Test', 'Chest X-Ray'],
      medications: ['Aspirin 75mg OD', 'Atorvastatin 20mg', 'Pantoprazole 40mg'],
      notes: 'ECG normal. Patient advised lifestyle changes and follow-up in 2 weeks.',
      status: 'Completed',
      completedTime: '4:30 PM'
    }
  ];

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

  if (!patient) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Patient History</h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No patient selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <h2 className="text-2xl font-bold text-[#0F52BA]">Patient History - {patient.name}</h2>
      </div>

      {/* Patient Information Card */}
      <Card className="mb-8 border-[#0F52BA] border-t-4 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
            <User className="w-6 h-6" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-xl font-semibold">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">MR Number</p>
                <p className="text-xl font-mono font-bold text-[#0F52BA]">MR{patient.mrNumber}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                <p className="text-xl flex items-center"><Phone className="w-4 h-4 mr-2" />{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Age & Gender</p>
                <p className="text-xl">{patient.age} years, {patient.gender}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                <p className="text-xl">{patient.address}</p>
              </div>
              {patient.guardianName && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Guardian</p>
                  <p className="text-xl">{patient.guardianName}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit History */}
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-[#0F52BA]" />
          <h3 className="text-2xl font-semibold text-[#0F52BA]">Visit History ({mockPatientHistory.length} visits)</h3>
        </div>
        
        {mockPatientHistory.map((visit, index) => (
          <Card key={visit.id} className="border-l-4 border-l-[#4169E1] shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-[#0F52BA] flex items-center space-x-3">
                    <Calendar className="w-6 h-6" />
                    <span>{visit.date}</span>
                  </CardTitle>
                  <p className="text-gray-600 font-medium text-lg mt-1">Dr. {visit.doctor}</p>
                </div>
                <Badge className={`${getStatusColor(visit.status)} text-sm px-3 py-1`}>
                  {visit.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {/* Chief Complaint */}
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-l-red-400">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Chief Complaint
                </h4>
                <p className="text-red-700 text-lg">{visit.complaint}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vitals Section */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-l-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center text-lg">
                    <Activity className="w-5 h-5 mr-2" />
                    Vital Signs
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Blood Pressure:</span>
                      <span className="ml-2 text-blue-700 font-semibold">{visit.vitals.bp}</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Temperature:</span>
                      <span className="ml-2 text-blue-700 font-semibold">{visit.vitals.temp}</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Pulse:</span>
                      <span className="ml-2 text-blue-700 font-semibold">{visit.vitals.pulse}</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="ml-2 text-blue-700 font-semibold">{visit.vitals.weight}</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mt-3 bg-white p-2 rounded">
                    <Clock className="w-4 h-4 inline mr-1" />  
                    Recorded by {visit.vitalsBy} at {visit.vitalsTime}
                  </p>
                </div>
                
                {/* Timeline */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-l-green-400">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2" />
                    Visit Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Vitals Recorded:</span>
                      <span className="text-green-700 font-semibold">{visit.vitalsTime}</span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Consultation:</span>
                      <span className="text-green-700 font-semibold">{visit.consultationTime}</span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-700">Completed:</span>
                      <span className="text-green-700 font-semibold">{visit.completedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tests */}
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-l-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-4 flex items-center text-lg">
                    <TestTube className="w-5 h-5 mr-2" />
                    Tests Ordered
                  </h4>
                  <div className="space-y-2">
                    {visit.testsOrdered.map((test, idx) => (
                      <div key={idx} className="bg-white p-3 rounded shadow-sm border-l-2 border-l-purple-300">
                        <span className="text-purple-700 font-medium">{test}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Medications */}
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-l-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-4 flex items-center text-lg">
                    <Pill className="w-5 h-5 mr-2" />
                    Medications Prescribed
                  </h4>
                  <div className="space-y-2">
                    {visit.medications.map((med, idx) => (
                      <div key={idx} className="bg-white p-3 rounded shadow-sm border-l-2 border-l-orange-300">
                        <span className="text-orange-700 font-medium">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor's Notes */}
              {visit.notes && (
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-l-gray-400">
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg">Doctor's Notes & Recommendations</h4>
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="text-gray-700 italic leading-relaxed">{visit.notes}</p>
                  </div>
                </div>
              )}
              
              {index < mockPatientHistory.length - 1 && <Separator className="my-6" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientHistoryPage;
