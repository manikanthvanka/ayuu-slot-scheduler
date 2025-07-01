import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppScheduleFiltersProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  doctorFilter: string;
  setDoctorFilter: (doctor: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  uniqueDoctors: string[];
}

const AppScheduleFilters: React.FC<AppScheduleFiltersProps> = ({
  selectedDate,
  setSelectedDate,
  doctorFilter,
  setDoctorFilter,
  searchTerm,
  setSearchTerm,
  uniqueDoctors
}) => {
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

  return (
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
                <SelectItem value="all">All Doctors</SelectItem>
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
  );
};

export default AppScheduleFilters;