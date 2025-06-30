
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Copy, AlertCircle, CheckCircle, XCircle, Download, History, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockAppointments } from '@/data/mockData';
import PatientHistoryPage from '@/components/PatientHistoryPage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientDashboardProps {
  onBookAppointment: () => void;
  onSignOut: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onBookAppointment, onSignOut }) => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showHistory, setShowHistory] = useState(false);
  const [downloadDateFrom, setDownloadDateFrom] = useState('');
  const [downloadDateTo, setDownloadDateTo] = useState('');
  const { toast } = useToast();

  // Mock patient data
  const mockPatient = {
    id: 1,
    name: 'John Doe',
    mrNumber: '12345',
    phone: '+1234567890',
    age: 35,
    gender: 'Male',
    address: '123 Main St, City, State'
  };

  const calculateWaitingTime = (tokenNumber: number, date: string) => {
    const todayAppointments = appointments.filter(apt => 
      apt.date === date && apt.status !== 'Completed' && apt.status !== 'Cancelled'
    );
    
    const currentToken = todayAppointments.find(apt => apt.status === 'In Progress')?.token || 1;
    const tokensAhead = Math.max(0, tokenNumber - currentToken);
    const estimatedMinutes = tokensAhead * 15;
    
    if (estimatedMinutes === 0) return "Your turn now!";
    if (estimatedMinutes < 60) return `~${estimatedMinutes} minutes`;
    return `~${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`;
  };

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
      )
    );
    toast({
      title: "✅ Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const copyTokenNumber = (tokenNumber: number) => {
    navigator.clipboard.writeText(tokenNumber.toString());
    toast({
      title: "📋 Copied",
      description: "Token number copied to clipboard",
    });
  };

  const handleDownloadHistory = () => {
    if (!downloadDateFrom || !downloadDateTo) {
      toast({
        title: "❌ Error",
        description: "Please select both from and to dates",
        variant: "destructive"
      });
      return;
    }

    // Create a simple CSV content
    const csvContent = `Visit History Report
Patient: ${mockPatient.name}
MR Number: ${mockPatient.mrNumber}
Date Range: ${downloadDateFrom} to ${downloadDateTo}

Date,Doctor,Complaint,BP,Temperature,Pulse,Status
2024-12-25,Dr. Anil Sharma,Fever and headache,120/80,101°F,85,Completed
2024-12-15,Dr. Meera Patel,Chest pain,130/85,98.6°F,92,Completed`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_history_${mockPatient.mrNumber}_${downloadDateFrom}_to_${downloadDateTo}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "📄 History Downloaded",
      description: "Visit history has been downloaded successfully.",
    });
  };

  const userAppointments = appointments.filter(apt => apt.patientId === 1);

  if (showHistory) {
    return (
      <PatientHistoryPage
        patient={mockPatient}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your healthcare appointments</p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onBookAppointment} className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
              <Button onClick={() => setShowHistory(true)} variant="outline" className="w-full">
                <History className="w-4 h-4 mr-2" />
                View Medical History
              </Button>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Today's Queue Status</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Current Token: #12</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Average Wait: 15 mins</p>
              </div>
            </CardContent>
          </Card>

          {/* Download History Card */}
          <Card className="mt-4 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="dateFrom" className="dark:text-gray-200">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={downloadDateFrom}
                  onChange={(e) => setDownloadDateFrom(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="dark:text-gray-200">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={downloadDateTo}
                  onChange={(e) => setDownloadDateTo(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button onClick={handleDownloadHistory} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Your Appointments</CardTitle>
              <CardDescription className="dark:text-gray-400">View and manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {userAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
                  <Button onClick={onBookAppointment} className="mt-4">
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAppointments.map((appointment) => (
                    <div key={appointment.id} className="border dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg dark:text-white">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {appointment.status === 'Scheduled' && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                          {appointment.status === 'In Progress' && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-xs flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              In Progress
                            </span>
                          )}
                          {appointment.status === 'Cancelled' && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full text-xs flex items-center">
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {appointment.time}
                        </div>
                      </div>

                      {appointment.token && (
                        <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium dark:text-gray-200">Token Number</p>
                              <p className="text-lg font-bold text-primary dark:text-blue-400">#{appointment.token}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Wait</p>
                              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                {calculateWaitingTime(appointment.token, appointment.date)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyTokenNumber(appointment.token)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {appointment.status === 'Scheduled' && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Change Doctor
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
