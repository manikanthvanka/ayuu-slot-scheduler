import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DoctorsListProps {
  doctors: any[];
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5" />
          <span>Available Doctors</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map(doctor => (
            <div key={doctor.id} className="p-3 border rounded-lg">
              <h4 className="font-medium">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground mb-1">{doctor.specialty}</p>
              <p className="text-xs text-green-600">{doctor.availability}</p>
              <p className="text-xs text-gray-500">{doctor.experience} experience</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorsList;