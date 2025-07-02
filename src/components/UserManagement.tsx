import React, { useState } from 'react';
import { ArrowLeft, Users, UserPlus, Mail, User, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface UserManagementProps {
  onBack: () => void;
  userRole: UserRole;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack, userRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    role: 'patient' as UserRole,
    confirmPassword: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullName || !formData.username) {
      toast({
        title: "❌ Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "❌ Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "❌ Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await signUp(formData.email, formData.password, formData.fullName, formData.role, formData.username);
      
      if (result.error) {
        toast({
          title: "❌ Failed to Create User",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ User Created",
          description: `${formData.fullName} has been created successfully with role: ${formData.role}`,
        });
        // Reset form
        setFormData({
          email: '',
          password: '',
          fullName: '',
          username: '',
          role: 'patient',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">Only administrators can manage users.</p>
          </CardContent>
        </Card>
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
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Create New User</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 h-11"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="Enter email address"
                    disabled={isCreating}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    className="pl-10 h-11"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    placeholder="Choose a username"
                    disabled={isCreating}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    className="pl-10 h-11"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    placeholder="Enter full name"
                    disabled={isCreating}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">Role *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 z-10" />
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled={isCreating}>
                    <SelectTrigger className="pl-10 h-11">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10 h-11"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="Enter password"
                    disabled={isCreating}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isCreating}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10 h-11"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Confirm password"
                    disabled={isCreating}
                    minLength={6}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="h-11 px-8"
                disabled={isCreating || formData.password !== formData.confirmPassword || formData.password.length < 6}
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Creating User...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Create User</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;