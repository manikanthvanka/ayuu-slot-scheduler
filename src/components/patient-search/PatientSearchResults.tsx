
import React from 'react';
import { User, Phone, UserCheck, History, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Patient_ScreenName } from '@/types';

interface PatientSearchResultsProps {
  searchResults: Patient_ScreenName[];
  onViewHistory: (patient: Patient_ScreenName) => void;
  onBookAppointment: (patient: Patient_ScreenName) => void;
}

const PatientSearchResults: React.FC<PatientSearchResultsProps> = ({
  searchResults,
  onViewHistory,
  onBookAppointment
}) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Results ({searchResults.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searchResults.map((patient, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{patient.name}</span>
                    <Badge variant="outline">{patient.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3" />
                      <span>{patient.phone}</span>
                    </div>
                    {patient.guardianPhone && (
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-3 h-3" />
                        <span>Guardian: {patient.guardianPhone}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">MR Number: </span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{patient.mrNumber}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewHistory(patient)}
                  >
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onBookAppointment(patient)}
                    className="bg-primary text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSearchResults;
