import React from 'react';
import { Hash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PatientSearchFormProps {
  mrNumber: string;
  patientName: string;
  phone: string;
  searchingPatient: boolean;
  patientFound: boolean;
  loading: boolean;
  onMRNumberChange: (value: string) => void;
  onSearch: () => void;
}

const PatientSearchForm: React.FC<PatientSearchFormProps> = ({
  mrNumber,
  patientName,
  phone,
  searchingPatient,
  patientFound,
  loading,
  onMRNumberChange,
  onSearch
}) => {
  return (
    <>
      {/* MR Number Search */}
      <div>
        <Label htmlFor="mrNumber">Patient MR Number *</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="mrNumber"
              className="pl-10"
              value={mrNumber}
              onChange={(e) => onMRNumberChange(e.target.value)}
              placeholder="Enter MR Number (e.g., MR240001)"
              required
              disabled={loading || searchingPatient}
            />
          </div>
          <Button
            type="button"
            onClick={onSearch}
            disabled={!mrNumber || loading || searchingPatient}
            className="min-w-[100px]"
          >
            {searchingPatient ? (
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

      {/* Patient Information (Auto-filled after search) */}
      {patientFound && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Patient Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Patient Name</Label>
              <Input
                value={patientName}
                disabled
                className="bg-white"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={phone}
                disabled
                className="bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientSearchForm;