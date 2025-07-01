import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppointmentStatsProps {
  availableSlots: string[];
  doctors: any[];
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ availableSlots, doctors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Today's Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Available Slots:</span>
            <span className="text-sm font-medium">{availableSlots.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Doctors On Duty:</span>
            <span className="text-sm font-medium">{doctors.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Average Wait:</span>
            <span className="text-sm font-medium">15 mins</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentStats;