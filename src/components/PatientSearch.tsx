
import React, { useState } from 'react';
import { ArrowLeft, Search, User, Phone, UserCheck, Calendar, History, FileText, ChevronRight, Clock, TestTube, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { mockPatientHistory } from '@/data/patientHistory';
import { Patient } from '@/types';

interface PatientSearchProps {
  patients: Patient[];
  onBack: () => void;
  onBookAppointment: () => void;
  onSelectPatient?: (patient: any) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ 
  patients, 
  onBack, 
  onBookAppointment, 
  onSelectPatient 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
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

  const handleViewHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowHistory(true);
  };

  const handleBookAppointmentForPatient = (patient: Patient) => {
    if (onSelectPatient) {
      onSelectPatient({
        mrNumber: patient.mrNumber,
        name: patient.name
      });
    }
    onBookAppointment();
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

  // Detailed visit view
  if (selectedVisit) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setSelectedVisit(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Visit Details - {selectedVisit.date}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Visit Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Visit Summary</span>
                <Badge className={getStatusColor(selectedVisit.status)}>
                  {selectedVisit.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Patient & Doctor</h4>
                  <p><strong>Patient:</strong> {selectedPatient?.name}</p>
                  <p><strong>Doctor:</strong> {selectedVisit.doctor}</p>
                  <p><strong>Date:</strong> {selectedVisit.date}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Timeline</h4>
                  <p><strong>Vitals Taken:</strong> {selectedVisit.vitalsTime}</p>
                  <p><strong>Consultation:</strong> {selectedVisit.consultationTime}</p>
                  <p><strong>Completed:</strong> {selectedVisit.completedTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chief Complaint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chief Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{selectedVisit.complaint}</p>
            </CardContent>
          </Card>

          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedVisit.vitals.bp}</div>
                  <div className="text-sm text-blue-600">Blood Pressure</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedVisit.vitals.temp}</div>
                  <div className="text-sm text-red-600">Temperature</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedVisit.vitals.pulse}</div>
                  <div className="text-sm text-green-600">Pulse Rate</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Vitals recorded by <strong>{selectedVisit.vitalsBy}</strong> at {selectedVisit.vitalsTime}
              </p>
            </CardContent>
          </Card>

          {/* Tests & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  Tests Ordered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedVisit.testsOrdered.map((test: string, idx: number) => (
                    <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                      <TestTube className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="text-sm">{test}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Medications Prescribed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedVisit.medications.map((med: string, idx: number) => (
                    <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                      <Pill className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{med}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Patient history view
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

        {/* Patient Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>MR Number:</strong> {selectedPatient.mrNumber}</p>
              </div>
              <div>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              </div>
              <div>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>Status:</strong> {selectedPatient.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Visit History ({mockPatientHistory.length} visits)
            </h3>
            <Button onClick={() => handleBookAppointmentForPatient(selectedPatient)}>
              <Calendar className="w-4 h-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
          
          {mockPatientHistory.map((visit, index) => (
            <Card key={visit.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{visit.date}</h4>
                    <p className="text-gray-600">{visit.doctor}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVisit(visit)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Complaint:</strong> {visit.complaint}</p>
                    <p><strong>Timeline:</strong> {visit.vitalsTime} → {visit.consultationTime} → {visit.completedTime}</p>
                  </div>
                  <div>
                    <p><strong>Vitals:</strong> BP: {visit.vitals.bp}, Temp: {visit.vitals.temp}</p>
                    <p><strong>Tests:</strong> {visit.testsOrdered.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Main search view
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
                <div className="flex items-center flex-1">
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
                        onClick={() => handleViewHistory(patient)}
                      >
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBookAppointmentForPatient(patient)}
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
