
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Copy, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockAppointments } from '@/data/mockData';

interface PatientDashboardProps {
  onBookAppointment: () => void;
  onSignOut: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onBookAppointment, onSignOut }) => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const { toast } = useToast();

  const calculateWaitingTime = (tokenNumber: number, date: string) => {
    const todayAppointments = appointments.filter(apt => 
      apt.date === date && apt.status !== 'Completed' && apt.status !== 'Cancelled'
    );
    
    const currentToken = todayAppointments.find(apt => apt.status === 'In Progress')?.token || 1;
    const tokensAhead = Math.max(0, tokenNumber - currentToken);
    const estimatedMinutes = tokensAhead * 15; // 15 minutes per patient average
    
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

  const userAppointments = appointments.filter(apt => apt.patientId === 1); // Mock patient ID

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onBookAppointment} className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Today's Queue Status</h4>
                <p className="text-sm text-blue-700">Current Token: #12</p>
                <p className="text-sm text-blue-700">Average Wait: 15 mins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>View and manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {userAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments found</p>
                  <Button onClick={onBookAppointment} className="mt-4">
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {appointment.status === 'Scheduled' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                          {appointment.status === 'In Progress' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              In Progress
                            </span>
                          )}
                          {appointment.status === 'Cancelled' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {appointment.time}
                        </div>
                      </div>

                      {appointment.token && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">Token Number</p>
                              <p className="text-lg font-bold text-primary">#{appointment.token}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Estimated Wait</p>
                              <p className="text-sm font-medium text-orange-600">
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
