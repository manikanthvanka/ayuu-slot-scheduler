
import React from 'react';
import { ArrowLeft, FileText, TestTube, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Patient_ScreenName } from '@/types';

interface VisitDetailsViewProps {
  selectedVisit: any;
  selectedPatient: Patient_ScreenName | null;
  onBack: () => void;
}

const VisitDetailsView: React.FC<VisitDetailsViewProps> = ({
  selectedVisit,
  selectedPatient,
  onBack
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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Visit Details - {selectedVisit.date}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Visit Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visit Summary</span>
              <Badge className={getStatusColor(selectedVisit.status)}>
                {selectedVisit.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Patient & Doctor</h4>
                <p><strong>Patient:</strong> {selectedPatient?.name}</p>
                <p><strong>Doctor:</strong> {selectedVisit.doctor}</p>
                <p><strong>Date:</strong> {selectedVisit.date}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Timeline</h4>
                <p><strong>Vitals Taken:</strong> {selectedVisit.vitalsTime}</p>
                <p><strong>Consultation:</strong> {selectedVisit.consultationTime}</p>
                <p><strong>Completed:</strong> {selectedVisit.completedTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chief Complaint */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chief Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{selectedVisit.complaint}</p>
          </CardContent>
        </Card>

        {/* Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedVisit.vitals.bp}</div>
                <div className="text-sm text-blue-600">Blood Pressure</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{selectedVisit.vitals.temp}</div>
                <div className="text-sm text-red-600">Temperature</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedVisit.vitals.pulse}</div>
                <div className="text-sm text-green-600">Pulse Rate</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Vitals recorded by <strong>{selectedVisit.vitalsBy}</strong> at {selectedVisit.vitalsTime}
            </p>
          </CardContent>
        </Card>

        {/* Tests & Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                Tests Ordered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedVisit.testsOrdered.map((test: string, idx: number) => (
                  <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                    <TestTube className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm">{test}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Pill className="w-5 h-5 mr-2" />
                Medications Prescribed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedVisit.medications.map((med: string, idx: number) => (
                  <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                    <Pill className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">{med}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsView;
