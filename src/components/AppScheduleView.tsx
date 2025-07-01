import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AppScheduleViewProps {
  onBack: () => void;
  appointments: any[];
}

const AppScheduleView: React.FC<AppScheduleViewProps> = ({ onBack, appointments }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getDateOffset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getDateLabel = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const quickDateOptions = [
    { label: 'Tomorrow', value: getDateOffset(1), days: 1 },
    { label: 'Day After Tomorrow', value: getDateOffset(2), days: 2 },
    { label: 'Next Week', value: getDateOffset(7), days: 7 }
  ];

  const mockScheduleData = [
    {
      id: 1,
      patientName: 'John Smith',
      mrNumber: 'MR240001',
      doctorName: 'Dr. Sarah Johnson',
      appointmentTime: '09:00 AM',
      appointmentType: 'Consultation',
      status: 'Scheduled',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      patientName: 'Mary Davis',
      mrNumber: 'MR240002',
      doctorName: 'Dr. Michael Brown',
      appointmentTime: '10:30 AM',
      appointmentType: 'Follow-up',
      status: 'Confirmed',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      patientName: 'Robert Wilson',
      mrNumber: 'MR240003',
      doctorName: 'Dr. Sarah Johnson',
      appointmentTime: '02:00 PM',
      appointmentType: 'Check-up',
      status: 'Scheduled',
      phone: '+1 (555) 345-6789'
    }
  ];

  const filteredAppointments = mockScheduleData.filter(appointment => {
    const matchesDoctor = !doctorFilter || appointment.doctorName === doctorFilter;
    const matchesSearch = !searchTerm || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.mrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDoctor && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueDoctors = [...new Set(mockScheduleData.map(apt => apt.doctorName))];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-[#0F52BA]">Appointment Schedule</h2>
      </div>

      {/* Quick Date Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Quick Date Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {quickDateOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedDate === option.value ? "default" : "outline"}
                onClick={() => setSelectedDate(option.value)}
                className="flex flex-col items-start p-4 h-auto"
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm opacity-75">{getDateLabel(option.days)}</span>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customDate">Custom Date</Label>
              <Input
                id="customDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="doctorFilter">Filter by Doctor</Label>
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Doctors</SelectItem>
                  {uniqueDoctors.map(doctor => (
                    <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search Patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  className="pl-10"
                  placeholder="Search by name or MR number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>
                Appointments for {selectedDate ? getDateLabel(quickDateOptions.find(opt => opt.value === selectedDate)?.days || 0) : 'Selected Date'}
              </span>
            </div>
            <Badge variant="secondary">
              {filteredAppointments.length} appointments
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found for the selected criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-[#0F52BA]" />
                        <div>
                          <p className="font-semibold">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.mrNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{appointment.appointmentTime}</span>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.phone}</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppScheduleView;