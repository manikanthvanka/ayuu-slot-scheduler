
import React, { useState } from 'react';
import { ArrowLeft, Search, User, Phone, UserCheck, Calendar, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PatientHistoryModal from '@/components/PatientHistoryModal';

interface PatientSearchProps {
  patients: any[];
  onBack: () => void;
  onBookAppointment: (mrNumber: string) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ patients, onBack, onBookAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "⚠️ Warning",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const results = patients.filter(patient => 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.guardianPhone?.includes(searchTerm) ||
      patient.mrNumber?.includes(searchTerm)
    );

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

  const handleViewHistory = (patient: any) => {
    setSelectedPatient(patient);
    setShowHistory(true);
  };

  const handleBookAppointmentClick = (patient: any) => {
    onBookAppointment(`MR${patient.mrNumber}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Search</h2>
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
            <div>
              <Label htmlFor="searchTerm">Search by MR Number, Name, or Phone</Label>
              <div className="flex gap-2">
                <Input
                  id="searchTerm"
                  placeholder="Enter MR Number, patient name, or phone number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-[#0F52BA] hover:bg-[#000080]"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
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
                        <span className="font-medium">MR Number: </span>
                        <span className="font-mono text-[#0F52BA] font-bold">MR{patient.mrNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(patient)}
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

      {showHistory && selectedPatient && (
        <PatientHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

export default PatientSearch;
