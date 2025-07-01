
import React from 'react';
import { Calendar, UserPlus, Search, Bell, Download, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';

// Simple mock data for doctors count - this should be replaced with actual data later
const mockDoctorsCount = 4;

interface DashboardStatsProps {
  appointments: any[];
  patients: any[];
  onDownloadReport: (reportType: string) => void;
  onShareReport: (reportType: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  appointments,
  patients,
  onDownloadReport,
  onShareReport
}) => {
  const { getFieldValue } = useScreenFields();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10 w-full">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-l-[#0F52BA] shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#0F52BA] flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {getFieldValue('todays_appointments_card', 'dashboard')}
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownloadReport('Appointments')}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShareReport('Appointments')}
                className="h-6 w-6 p-0"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#0F52BA] mb-2">{appointments.length}</div>
          <p className="text-xs text-blue-600 font-medium">+2 from yesterday</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-l-4 border-l-[#088F8F] shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#088F8F] flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              {getFieldValue('active_queue_card', 'dashboard')}
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownloadReport('Queue')}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShareReport('Queue')}
                className="h-6 w-6 p-0"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#088F8F] mb-2">{patients.filter(p => p.status !== 'Completed').length}</div>
          <p className="text-xs text-green-600 font-medium">Patients waiting</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-l-[#4169E1] shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#4169E1] flex items-center justify-between">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              {getFieldValue('return_queue_card', 'dashboard')}
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownloadReport('Return Queue')}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShareReport('Return Queue')}
                className="h-6 w-6 p-0"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#4169E1] mb-2">{patients.filter(p => p.status === 'Re-check Pending').length}</div>
          <p className="text-xs text-purple-600 font-medium">Awaiting re-check</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-l-[#FF5733] shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#FF5733] flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {getFieldValue('available_doctors_card', 'dashboard')}
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownloadReport('Doctors')}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShareReport('Doctors')}
                className="h-6 w-6 p-0"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#FF5733] mb-2">{mockDoctorsCount}</div>
          <p className="text-xs text-orange-600 font-medium">On duty today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
