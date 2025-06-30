
import React from 'react';
import { ArrowLeft, User, Calendar, History, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPatientHistory } from '@/data/patientHistory';
import { Patient_ScreenName } from '@/types';

interface PatientHistoryViewProps {
  selectedPatient: Patient_ScreenName;
  onBack: () => void;
  onBookAppointment: (patient: Patient_ScreenName) => void;
  onViewVisitDetails: (visit: any) => void;
}

const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({
  selectedPatient,
  onBack,
  onBookAppointment,
  onViewVisitDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'With Doctor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Vitals Done':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Sent for Tests':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Patient History - {selectedPatient.name}
        </h2>
      </div>

      {/* Patient Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>MR Number:</strong> {selectedPatient.mrNumber}</p>
            </div>
            <div>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            </div>
            <div>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Status:</strong> {selectedPatient.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Visit History ({mockPatientHistory.length} visits)
          </h3>
          <Button onClick={() => onBookAppointment(selectedPatient)}>
            <Calendar className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>
        
        {mockPatientHistory.map((visit, index) => (
          <Card key={visit.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{visit.date}</h4>
                  <p className="text-gray-600">{visit.doctor}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewVisitDetails(visit)}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Complaint:</strong> {visit.complaint}</p>
                  <p><strong>Timeline:</strong> {visit.vitalsTime} → {visit.consultationTime} → {visit.completedTime}</p>
                </div>
                <div>
                  <p><strong>Vitals:</strong> BP: {visit.vitals.bp}, Temp: {visit.vitals.temp}</p>
                  <p><strong>Tests:</strong> {visit.testsOrdered.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientHistoryView;
