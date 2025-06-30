
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PatientSearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  loading: boolean;
}

const PatientSearchForm: React.FC<PatientSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  loading
}) => {
  return (
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
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  className="rounded-l-none"
                />
              </div>
              <Button 
                onClick={onSearch}
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
  );
};

export default PatientSearchForm;
