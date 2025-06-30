
import React, { useState } from 'react';
import { Eye, EyeOff, Stethoscope, User, Lock, Mail, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && selectedRole === 'patient' && !formData.email) {
      toast({
        title: "Error",
        description: "Email is required for patient registration",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: isSignUp ? "Account created successfully!" : "Welcome to Ayuu Healthcare System!",
    });

    setLoading(false);
    onSignIn(selectedRole);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', password: '', email: '', fullName: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background SVG Illustration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          {/* Doctor illustration */}
          <g transform="translate(50, 50)">
            {/* Doctor body */}
            <rect x="40" y="120" width="60" height="120" rx="8" fill="#0F52BA" opacity="0.6"/>
            {/* Doctor head */}
            <circle cx="70" cy="80" r="25" fill="#FFB68A" opacity="0.6"/>
            {/* Stethoscope */}
            <path d="M55 100 Q45 110 55 120 Q65 110 75 120" stroke="#0F52BA" strokeWidth="3" fill="none" opacity="0.6"/>
            <circle cx="55" cy="120" r="5" fill="#0F52BA" opacity="0.6"/>
            {/* Medical cross */}
            <rect x="65" y="85" width="3" height="15" fill="#EF4444" opacity="0.6"/>
            <rect x="58" y="92" width="15" height="3" fill="#EF4444" opacity="0.6"/>
          </g>
          
          {/* Hospital building */}
          <g transform="translate(200, 80)">
            <rect x="0" y="80" width="120" height="160" rx="8" fill="#E5E7EB" opacity="0.4"/>
            {/* Windows */}
            <rect x="20" y="100" width="15" height="15" fill="#60A5FA" opacity="0.6"/>
            <rect x="45" y="100" width="15" height="15" fill="#60A5FA" opacity="0.6"/>
            <rect x="70" y="100" width="15" height="15" fill="#60A5FA" opacity="0.6"/>
            <rect x="95" y="100" width="15" height="15" fill="#60A5FA" opacity="0.6"/>
            {/* Medical cross on building */}
            <rect x="55" y="40" width="8" height="30" fill="#EF4444" opacity="0.6"/>
            <rect x="44" y="51" width="30" height="8" fill="#EF4444" opacity="0.6"/>
          </g>

          {/* Floating medical elements */}
          <g opacity="0.3">
            <circle cx="320" cy="60" r="15" fill="#10B981"/>
            <rect x="313" y="53" width="4" height="14" fill="white"/>
            <rect x="306" y="60" width="14" height="4" fill="white"/>
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayuu</h1>
          <p className="text-gray-600">Healthcare Management System</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Join Ayuu Healthcare System' : 'Access your healthcare dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      className="pl-10 h-11"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required={isSignUp}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email (Required for patient sign up) */}
              {isSignUp && selectedRole === 'patient' && (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 h-11"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <Label htmlFor="username">{selectedRole === 'patient' ? 'Username' : 'Staff ID / Username'}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    className="pl-10 h-11"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    placeholder={selectedRole === 'patient' ? 'Choose a username' : 'Enter your staff ID'}
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                )}
              </Button>
            </form>

            {/* Toggle between Sign In/Sign Up */}
            {selectedRole === 'patient' && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={toggleMode}
                  className="text-primary font-medium p-0 h-auto"
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs text-gray-500">
          © 2024 Ayuu Healthcare System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignIn;
