
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PatientSearchForm from './patient-search/PatientSearchForm';
import PatientSearchResults from './patient-search/PatientSearchResults';
import PatientHistoryView from './patient-search/PatientHistoryView';
import VisitDetailsView from './patient-search/VisitDetailsView';
import { Patient_ScreenName } from '@/types';

interface PatientSearchProps {
  patients: Patient_ScreenName[];
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
  const [searchResults, setSearchResults] = useState<Patient_ScreenName[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient_ScreenName | null>(null);
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

  const handleViewHistory = (patient: Patient_ScreenName) => {
    setSelectedPatient(patient);
    setShowHistory(true);
  };

  const handleBookAppointmentForPatient = (patient: Patient_ScreenName) => {
    if (onSelectPatient) {
      onSelectPatient({
        mrNumber: patient.mrNumber,
        name: patient.name
      });
    }
    onBookAppointment();
  };

  const handleBackToSearch = () => {
    setShowHistory(false);
    setSelectedPatient(null);
  };

  const handleBackToHistory = () => {
    setSelectedVisit(null);
  };

  // Detailed visit view
  if (selectedVisit) {
    return (
      <VisitDetailsView
        selectedVisit={selectedVisit}
        selectedPatient={selectedPatient}
        onBack={handleBackToHistory}
      />
    );
  }

  // Patient history view
  if (showHistory && selectedPatient) {
    return (
      <PatientHistoryView
        selectedPatient={selectedPatient}
        onBack={handleBackToSearch}
        onBookAppointment={handleBookAppointmentForPatient}
        onViewVisitDetails={setSelectedVisit}
      />
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

      <PatientSearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        loading={loading}
      />

      <PatientSearchResults
        searchResults={searchResults}
        onViewHistory={handleViewHistory}
        onBookAppointment={handleBookAppointmentForPatient}
      />
    </div>
  );
};

export default PatientSearch;
