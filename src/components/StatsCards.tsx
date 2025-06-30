
import React from 'react';
import { Calendar, UserPlus, Search, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDoctors } from '@/data/doctors';
import type { Patient_ScreenName, Appointment } from '@/types';

interface StatsCardsProps {
  appointments: Appointment[];
  patients: Patient_ScreenName[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ appointments, patients }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10 w-full">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-blue-700 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 mb-2">{appointments.length}</div>
          <p className="text-xs text-blue-600">+2 from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-green-700 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Active Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900 mb-2">{patients.filter(p => p.status !== 'Completed').length}</div>
          <p className="text-xs text-green-600">Patients waiting</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-purple-700 flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Return Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900 mb-2">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
          <p className="text-xs text-purple-600">Awaiting re-check</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-orange-700 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Available Doctors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900 mb-2">{mockDoctors.length}</div>
          <p className="text-xs text-orange-600">On duty today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
