
import React from 'react';
import { ArrowLeft, RotateCcw, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Return Queue</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <RotateCcw className="w-4 h-4 text-purple-500" />
          <span>Patients awaiting re-check</span>
        </div>
      </div>

      {/* Return Queue Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Awaiting Re-check</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Wait</p>
                <p className="text-2xl font-bold text-gray-900">12m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Priority</p>
                <p className="text-2xl font-bold text-gray-900">High</p>
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
            <span>Ready for Re-check</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Wait Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {patient.token}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{patient.name}</p>
                          <p className="text-xs text-gray-500 sm:hidden">Status: {patient.status}</p>
                          {patient.phone && (
                            <p className="text-xs text-gray-500">{patient.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 30) + 5}m
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendBackToDoctor(patient.id)}
                            className="bg-primary hover:bg-primary-hover text-xs sm:text-sm"
                          >
                            To Doctor
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteRecheck(patient.id)}
                            className="text-xs sm:text-sm"
                          >
                            Complete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
              <p className="text-gray-500">All patients processed or still with doctors.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Patients appear after completing tests and lab work</p>
            <p>• Priority given to longest waiting patients</p>
            <p>• "To Doctor" moves patient back to consultation</p>
            <p>• "Complete" if no further consultation needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnQueue;
