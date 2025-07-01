
import React, { useState } from 'react';
import { ArrowLeft, Search, User, Phone, UserCheck, Calendar, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PatientSearchProps {
  patients: any[];
  onBack: () => void;
  onBookAppointment: (patientId: string) => void;
  onViewHistory: (patient: any) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ 
  patients, 
  onBack, 
  onBookAppointment, 
  onViewHistory 
}) => {
  const [patientIdInput, setPatientIdInput] = useState('');
  const [namePhone, setNamePhone] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getFieldValue } = useScreenFields();

  // Get configurable field values
  const pageTitle = getFieldValue('page_title', 'search');
  const patientIdPrefix = getFieldValue('patient_id_prefix', 'search');
  const patientIdLabel = getFieldValue('patient_id_label', 'search');
  const patientIdPlaceholder = getFieldValue('patient_id_placeholder', 'search');
  const namePhoneLabel = getFieldValue('name_phone_label', 'search');
  const searchButtonText = getFieldValue('search_button_text', 'search');

  const handleSearch = async () => {
    if (!patientIdInput.trim() && !namePhone.trim()) {
      toast({
        title: "⚠️ Warning",
        description: `Please enter either ${patientIdLabel} or ${namePhoneLabel} to search`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let results: any[] = [];

    // Search by Patient ID if provided
    if (patientIdInput.trim()) {
      results = patients.filter(patient => 
        patient.mrNumber?.toString().includes(patientIdInput.trim())
      );
    }

    // Search by Name/Phone if provided
    if (namePhone.trim()) {
      const namePhoneResults = patients.filter(patient => 
        patient.name?.toLowerCase().includes(namePhone.toLowerCase()) ||
        patient.phone?.includes(namePhone) ||
        patient.guardianPhone?.includes(namePhone)
      );
      
      // Combine results and remove duplicates
      const combinedResults = [...results, ...namePhoneResults];
      results = combinedResults.filter((patient, index, self) =>
        index === self.findIndex(p => p.id === patient.id)
      );
    }

    setSearchResults(results);
    setLoading(false);

    if (results.length === 0) {
      toast({
        title: "ℹ️ No Results",
        description: "No patients found matching your search criteria",
      });
    } else {
      toast({
        title: "✅ Search Complete",
        description: `Found ${results.length} patient(s)`,
      });
    }
  };

  const handleBookAppointmentClick = (patient: any) => {
    onBookAppointment(`${patientIdPrefix}${patient.mrNumber}`);
  };

  const handleViewHistoryClick = (patient: any) => {
    onViewHistory(patient);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{pageTitle}</h2>
      </div>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#0F52BA]">
            <Search className="w-5 h-5" />
            <span>Search Patient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId">{patientIdLabel}</Label>
                <div className="flex">
                  <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm font-medium text-gray-700">
                    {patientIdPrefix}
                  </div>
                  <Input
                    id="patientId"
                    placeholder={patientIdPlaceholder}
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="rounded-l-none flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="namePhone">{namePhoneLabel}</Label>
                <Input
                  id="namePhone"
                  placeholder={`Enter patient name or phone number`}
                  value={namePhone}
                  onChange={(e) => setNamePhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#0F52BA] hover:bg-[#000080] w-full sm:w-auto"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Searching...</span>
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {searchButtonText}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-[#0F52BA]">Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((patient, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-lg">{patient.name}</span>
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
                        <span className="font-medium">{patientIdLabel}: </span>
                        <span className="font-mono text-[#0F52BA] font-bold">{patientIdPrefix}{patient.mrNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistoryClick(patient)}
                        className="border-[#088F8F] text-[#088F8F] hover:bg-[#088F8F] hover:text-white"
                      >
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBookAppointmentClick(patient)}
                        className="bg-[#4169E1] hover:bg-[#000080] text-white"
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
      )}
    </div>
  );
};

export default PatientSearch;
