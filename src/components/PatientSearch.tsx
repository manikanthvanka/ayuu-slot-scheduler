
import React, { useState } from 'react';
import { ArrowLeft, Search, User, Phone, UserCheck, Calendar, History, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PatientSearchProps {
  patients: any[];
  onBack: () => void;
  onBookAppointment: () => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ patients, onBack, onBookAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock patient history data
  const mockPatientHistory = [
    {
      id: 1,
      date: '2024-12-25',
      doctor: 'Dr. Anil Sharma',
      complaint: 'Fever and headache',
      vitals: { bp: '120/80', temp: '101°F', pulse: '85' },
      vitalsBy: 'Nurse Sarah',
      vitalsTime: '10:15 AM',
      consultationTime: '10:30 AM',
      testsOrdered: ['Blood Test', 'X-Ray Chest'],
      medications: ['Paracetamol 500mg', 'Azithromycin 250mg'],
      status: 'Completed',
      completedTime: '11:45 AM'
    },
    {
      id: 2,
      date: '2024-12-15',
      doctor: 'Dr. Meera Patel',
      complaint: 'Chest pain',
      vitals: { bp: '130/85', temp: '98.6°F', pulse: '92' },
      vitalsBy: 'Nurse John',
      vitalsTime: '2:15 PM',
      consultationTime: '2:45 PM',
      testsOrdered: ['ECG', 'Blood Test'],
      medications: ['Aspirin 75mg', 'Atorvastatin 20mg'],
      status: 'Completed',
      completedTime: '4:30 PM'
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'With Doctor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Vitals Done':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Sent for Tests':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (showHistory && selectedPatient) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Patient History - {selectedPatient.name}
          </h2>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>MR Number:</strong> MR{selectedPatient.mrNumber}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              </div>
              <div>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Address:</strong> {selectedPatient.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Visit History ({mockPatientHistory.length} visits)</h3>
          
          {mockPatientHistory.map((visit, index) => (
            <Card key={visit.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{visit.date}</CardTitle>
                    <p className="text-sm text-gray-600">Dr. {visit.doctor}</p>
                  </div>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Chief Complaint</h4>
                    <p className="text-sm">{visit.complaint}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Vitals</h4>
                      <div className="text-sm space-y-1">
                        <p>BP: {visit.vitals.bp}</p>
                        <p>Temperature: {visit.vitals.temp}</p>
                        <p>Pulse: {visit.vitals.pulse}</p>
                        <p className="text-xs text-gray-500">
                          Taken by {visit.vitalsBy} at {visit.vitalsTime}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Timeline</h4>
                      <div className="text-sm space-y-1">
                        <p>Vitals: {visit.vitalsTime}</p>
                        <p>Consultation: {visit.consultationTime}</p>
                        <p>Completed: {visit.completedTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Tests Ordered</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.testsOrdered.map((test, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Medications</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.medications.map((med, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Patient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="searchTerm">Search by Name, Phone, or MR Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-r-0 px-3 py-2 text-sm font-medium text-gray-700 rounded-l-md">
                    MR
                  </span>
                  <Input
                    id="searchTerm"
                    placeholder="Enter number or patient details"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="rounded-l-none"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
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
                        <span className="font-mono">MR{patient.mrNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(patient)}
                      >
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                      <Button
                        size="sm"
                        onClick={onBookAppointment}
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
      )}
    </div>
  );
};

export default PatientSearch;
