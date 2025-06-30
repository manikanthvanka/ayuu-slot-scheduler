
import React from 'react';
import { ArrowLeft, RotateCcw, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: number;
  name: string;
  token: number;
  status: string;
  phone?: string;
}

interface ReturnQueueProps {
  patients: Patient[];
  onUpdateStatus: (patientId: number, newStatus: string) => void;
  onBack: () => void;
}

const ReturnQueue: React.FC<ReturnQueueProps> = ({ patients, onUpdateStatus, onBack }) => {
  const handleCompleteRecheck = (patientId: number) => {
    onUpdateStatus(patientId, 'Completed');
  };

  const handleSendBackToDoctor = (patientId: number) => {
    onUpdateStatus(patientId, 'With Doctor');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Return Queue Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-purple-500" />
          <span className="text-sm text-gray-500">Patients awaiting re-check</span>
        </div>
      </div>

      {/* Return Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Awaiting Re-check</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Average Wait Time</p>
                <p className="text-2xl font-bold">12m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Priority Level</p>
                <p className="text-2xl font-bold">High</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Return Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Patients Ready for Re-check</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Token</th>
                    <th className="text-left p-3">Patient Name</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Wait Time</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                          {patient.token}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-purple-100 text-purple-800">
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 30) + 5} mins
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendBackToDoctor(patient.id)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Send to Doctor
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteRecheck(patient.id)}
                          >
                            Mark Complete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in return queue</h3>
              <p className="text-gray-500">All patients have been processed or are still with doctors.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Return Queue Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Patients appear here after completing tests and lab work</p>
            <p>• Priority is given to patients who have been waiting longest</p>
            <p>• Use "Send to Doctor" to move patient back to consultation</p>
            <p>• Use "Mark Complete" if no further consultation is needed</p>
            <p>• Notifications are automatically sent to patients when status changes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnQueue;
