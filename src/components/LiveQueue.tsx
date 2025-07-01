
import React from 'react';
import { ArrowLeft, Clock, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Patient {
  id: string;
  name: string;
  token: number;
  status: string;
  phone?: string;
}

interface LiveQueueProps {
  patients: Patient[];
  onUpdateStatus: (patientId: string, newStatus: string) => void;
  onBack: () => void;
}

const LiveQueue: React.FC<LiveQueueProps> = ({ patients, onUpdateStatus, onBack }) => {
  const activePatients = patients.filter(p => p.status !== 'Completed');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vitals Done': return 'bg-blue-100 text-blue-800';
      case 'With Doctor': return 'bg-green-100 text-green-800';
      case 'Sent for Tests': return 'bg-yellow-100 text-yellow-800';
      case 'Re-check Pending': return 'bg-purple-100 text-purple-800';
      case 'Registered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Registered': return 'Vitals Done';
      case 'Vitals Done': return 'With Doctor';
      case 'With Doctor': return 'Sent for Tests';
      case 'Sent for Tests': return 'Re-check Pending';
      case 'Re-check Pending': return 'Completed';
      default: return 'Completed';
    }
  };

  const sendNotification = (patient: Patient, type: 'SMS' | 'WhatsApp') => {
    // Mock notification function
    console.log(`Sending ${type} to ${patient.name} (${patient.phone}): Your appointment status has been updated to ${patient.status}`);
    alert(`${type} notification sent to ${patient.name}!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Live Queue Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Real-time updates</span>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold">{activePatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">With Doctor</p>
                <p className="text-2xl font-bold">{activePatients.filter(p => p.status === 'With Doctor').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">For Tests</p>
                <p className="text-2xl font-bold">{activePatients.filter(p => p.status === 'Sent for Tests').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Re-check</p>
                <p className="text-2xl font-bold">{activePatients.filter(p => p.status === 'Re-check Pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Token</th>
                  <th className="text-left p-3">Patient Name</th>
                  <th className="text-left p-3">Current Status</th>
                  <th className="text-left p-3">Quick Actions</th>
                  <th className="text-left p-3">Notifications</th>
                  <th className="text-left p-3">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {activePatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
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
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(patient.id, getNextStatus(patient.status))}
                        disabled={patient.status === 'Completed'}
                      >
                        Next Step
                      </Button>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendNotification(patient, 'SMS')}
                        >
                          SMS
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendNotification(patient, 'WhatsApp')}
                        >
                          WhatsApp
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <Select onValueChange={(value) => onUpdateStatus(patient.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Change" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Registered">Registered</SelectItem>
                          <SelectItem value="Vitals Done">Vitals Done</SelectItem>
                          <SelectItem value="With Doctor">With Doctor</SelectItem>
                          <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
                          <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {activePatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients in queue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQueue;
