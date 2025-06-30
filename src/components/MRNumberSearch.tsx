
import React, { useState } from 'react';
import { ArrowLeft, Search, Copy, User, Phone, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface MRNumberSearchProps {
  patients: any[];
  onBack: () => void;
}

const MRNumberSearch: React.FC<MRNumberSearchProps> = ({ patients, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
      patient.mrNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const copyMRNumber = (mrNumber: string) => {
    navigator.clipboard.writeText(mrNumber);
    toast({
      title: "📋 Copied!",
      description: `MR Number ${mrNumber} copied to clipboard`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Search MR Number</h2>
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
              <Label htmlFor="searchTerm">Search by Name, Phone, or Guardian Phone</Label>
              <Input
                id="searchTerm"
                placeholder="Enter patient name, phone number, or guardian phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto"
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
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{patient.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{patient.phone}</span>
                      </div>
                      {patient.guardianPhone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <UserCheck className="w-3 h-3" />
                          <span>Guardian: {patient.guardianPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">MR Number</div>
                        <div className="font-mono font-medium">{patient.mrNumber}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyMRNumber(patient.mrNumber)}
                      >
                        <Copy className="w-4 h-4" />
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

export default MRNumberSearch;
