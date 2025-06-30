
import React, { useState } from 'react';
import { Eye, EyeOff, Stethoscope, User, Lock, UserCheck, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { toast } = useToast();

  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      description: 'Book appointments, view medical records',
      icon: User,
      color: 'bg-blue-500 hover:bg-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      description: 'Manage consultations, patient records',
      icon: Stethoscope,
      color: 'bg-green-500 hover:bg-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'staff' as UserRole,
      title: 'Staff',
      description: 'Patient registration, appointment management',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      description: 'Full system access and management',
      icon: Shield,
      color: 'bg-red-500 hover:bg-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData({ username: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!formData.username || !formData.password) {
      toast({
        title: "❌ Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    toast({
      title: "✅ Success",
      description: "Welcome to Ayuu Healthcare System!",
    });

    setLoading(false);
    onSignIn(selectedRole!);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const goBack = () => {
    setSelectedRole(null);
    setFormData({ username: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayuu</h1>
          <p className="text-gray-600">Healthcare Management System</p>
        </div>

        {!selectedRole ? (
          // Role Selection Screen
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Your Role</h2>
              <p className="text-gray-600">Choose how you want to access the system</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${role.bgColor} ${role.borderColor} border-2 hover:scale-105`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 ${role.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-semibold">{role.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button className={`${role.color} text-white w-full`}>
                        Continue as {role.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // Login Form Screen
          <div className="max-w-md mx-auto">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Button variant="ghost" size="sm" onClick={goBack} className="absolute left-4">
                    ←
                  </Button>
                  <div className={`w-12 h-12 ${roles.find(r => r.id === selectedRole)?.color} text-white rounded-full flex items-center justify-center`}>
                    {React.createElement(roles.find(r => r.id === selectedRole)?.icon || User, { className: "w-6 h-6" })}
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold">
                  Sign In as {roles.find(r => r.id === selectedRole)?.title}
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <Label htmlFor="username">
                      {selectedRole === 'patient' ? 'Username' : 'Staff ID / Username'}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        className="pl-10 h-11"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                        placeholder={selectedRole === 'patient' ? 'Enter username' : 'Enter staff ID'}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Password</Label>
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
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className={`w-full h-11 ${roles.find(r => r.id === selectedRole)?.color} text-white font-medium`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-8 text-xs text-gray-500">
          © 2024 Ayuu Healthcare System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignIn;
