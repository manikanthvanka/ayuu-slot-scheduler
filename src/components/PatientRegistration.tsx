
import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, UserCheck, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PatientRegistrationProps {
  onSubmit: (patientData: any) => void;
  onBack: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onSubmit, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    insuranceDetails: '',
    existingConditions: '',
    privacyConsent: false,
    isDependent: false,
    guardianName: '',
    guardianPhone: ''
  });
  const { toast } = useToast();

  const generateMRNumber = () => {
    const prefix = 'MR';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${month}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mrNumber = generateMRNumber();
    const patientData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
      mrNumber,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    toast({
      title: "Patient Registered Successfully!",
      description: `MR Number: ${mrNumber} has been assigned to ${patientData.name}`,
    });

    onSubmit(patientData);
    setLoading(false);
    onBack();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Registration</h2>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>New Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="pl-10"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="address"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Number *</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="emergencyContact"
                  className="pl-10"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Dependent Support */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDependent"
                checked={formData.isDependent}
                onCheckedChange={(checked) => handleInputChange('isDependent', checked)}
                disabled={loading}
              />
              <Label htmlFor="isDependent">Register as dependent (child/elder under guardian)</Label>
            </div>

            {formData.isDependent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="guardianName">Guardian Name *</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    required={formData.isDependent}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                  <Input
                    id="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                    required={formData.isDependent}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Insurance and Medical Information */}
            <div>
              <Label htmlFor="insuranceDetails">Insurance Details</Label>
              <Textarea
                id="insuranceDetails"
                value={formData.insuranceDetails}
                onChange={(e) => handleInputChange('insuranceDetails', e.target.value)}
                rows={2}
                placeholder="Insurance provider, policy number, etc."
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="existingConditions">Existing Medical Conditions</Label>
              <Textarea
                id="existingConditions"
                value={formData.existingConditions}
                onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                rows={3}
                placeholder="Please list any existing medical conditions, allergies, or medications"
                disabled={loading}
              />
            </div>

            {/* Privacy Consent */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
                required
                disabled={loading}
              />
              <Label htmlFor="privacyConsent">
                I consent to the collection and processing of my personal data for healthcare purposes *
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.privacyConsent || loading}
                className="min-w-[140px]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Register Patient'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;
