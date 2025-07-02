import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
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
    { label: t('tomorrow'), value: getDateOffset(1), days: 1 },
    { label: t('day_after_tomorrow'), value: getDateOffset(2), days: 2 },
    { label: t('next_week'), value: getDateOffset(7), days: 7 }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{t('quick_date_selection')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4">
          {quickDateOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedDate === option.value ? "default" : "outline"}
              onClick={() => setSelectedDate(option.value)}
              className="flex flex-col items-start p-2 md:p-4 h-auto text-xs md:text-sm"
            >
              <span className="font-semibold text-left">{option.label}</span>
              <span className="text-xs opacity-75 text-left">{getDateLabel(option.days)}</span>
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          <div className="space-y-1">
            <Label htmlFor="customDate" className="text-xs md:text-sm">{t('custom_date')}</Label>
            <Input
              id="customDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="text-xs md:text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="doctorFilter" className="text-xs md:text-sm">{t('filter_by_doctor')}</Label>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="text-xs md:text-sm">
                <SelectValue placeholder={t('all_doctors')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_doctors')}</SelectItem>
                {uniqueDoctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="search" className="text-xs md:text-sm">{t('search_patient')}</Label>
            <div className="relative">
              <Search className="absolute left-2 md:left-3 top-2 md:top-3 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <Input
                id="search"
                className="pl-8 md:pl-10 text-xs md:text-sm"
                placeholder={t('search_by_name_mr')}
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