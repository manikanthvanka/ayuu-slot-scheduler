
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Stethoscope, User, Lock, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    fullName: '',
    username: '',
    role: 'patient',
    confirmPassword: ''
  });
  const { signIn, signUp, loading, checkUsernameAvailability } = useAuth();

  // Check username availability with debounce
  useEffect(() => {
    if (isSignUp && formData.username && formData.username.length >= 3) {
      setCheckingUsername(true);
      const timeoutId = setTimeout(async () => {
        const available = await checkUsernameAvailability(formData.username);
        setUsernameAvailable(available);
        setCheckingUsername(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsernameAvailable(null);
      setCheckingUsername(false);
    }
  }, [formData.username, isSignUp, checkUsernameAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!formData.emailOrUsername || !formData.password || !formData.fullName || !formData.username) {
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      if (!usernameAvailable) {
        return;
      }
      await signUp(formData.emailOrUsername, formData.password, formData.fullName, formData.role as any, formData.username);
    } else {
      if (!formData.emailOrUsername || !formData.password) {
        return;
      }
      await signIn(formData.emailOrUsername, formData.password);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getUsernameIcon = () => {
    if (checkingUsername) {
      return <LoadingSpinner size="sm" />;
    }
    if (usernameAvailable === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (usernameAvailable === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              {isSignUp 
                ? 'Create your account to access the system' 
                : 'Enter your username/email and password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email/Username */}
              <div>
                <Label htmlFor="emailOrUsername">
                  {isSignUp ? 'Email' : 'Username or Email'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    id="emailOrUsername"
                    type={isSignUp ? 'email' : 'text'}
                    className="pl-10 h-11"
                    value={formData.emailOrUsername}
                    onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                    required
                    placeholder={isSignUp ? 'Enter your email' : 'Enter username or email'}
                    disabled={loading}
                  />
                </div>
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
                      required
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Username (Sign Up only) */}
              {isSignUp && (
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      className="pl-10 pr-10 h-11"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      required
                      placeholder="Choose a username"
                      disabled={loading}
                      minLength={3}
                    />
                    <div className="absolute right-3 top-3.5">
                      {getUsernameIcon()}
                    </div>
                  </div>
                  {formData.username && formData.username.length >= 3 && (
                    <p className={`text-xs mt-1 ${usernameAvailable === true ? 'text-green-600' : usernameAvailable === false ? 'text-red-600' : 'text-gray-500'}`}>
                      {checkingUsername ? 'Checking availability...' : 
                       usernameAvailable === true ? 'Username is available' :
                       usernameAvailable === false ? 'Username is already taken' : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Role (Sign Up only) */}
              {isSignUp && (
                <div>
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 z-10" />
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled={loading}>
                      <SelectTrigger className="pl-10 h-11">
                        <SelectValue placeholder="Select your role" />
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
              )}

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
                    minLength={6}
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

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10 h-11"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      placeholder="Confirm your password"
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={loading || (isSignUp && (formData.password !== formData.confirmPassword || !usernameAvailable))}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>

              {/* Toggle between Sign In and Sign Up */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </button>
              </div>
            </form>
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
