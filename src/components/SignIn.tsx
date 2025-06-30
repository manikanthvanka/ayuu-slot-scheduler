
import React, { useState } from 'react';
import { UserCheck, Stethoscope, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
}

const roleData = {
  doctor: {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Access patient records, manage appointments, and update treatment status',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
  staff: {
    icon: Users,
    title: 'Staff',
    description: 'Register patients, book appointments, and manage daily operations',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600'
  },
  admin: {
    icon: Shield,
    title: 'Admin',
    description: 'Full system access, user management, and system configuration',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600'
  },
  patient: {
    icon: UserCheck,
    title: 'Patient',
    description: 'View appointments, check status, and manage personal information',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconColor: 'text-orange-600'
  }
};

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setIsSignUp(false);
  };

  const handleAuth = () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    
    if (!username.trim()) {
      setError('Please enter username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter password');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simple validation (in real app, this would be more secure)
    if (selectedRole === 'patient') {
      if (isSignUp) {
        // For sign up, just proceed (in real app, would create account)
        onSignIn(selectedRole);
      } else {
        // For sign in, check demo credentials
        if (username === 'patient' && password === 'patient123') {
          onSignIn(selectedRole);
        } else {
          setError('Invalid username or password');
        }
      }
    } else {
      // For other roles, check username and password
      const validCredentials = {
        doctor: { username: 'doctor', password: 'doc123' },
        staff: { username: 'staff', password: 'staff123' },
        admin: { username: 'admin', password: 'admin123' }
      };

      const roleCredentials = validCredentials[selectedRole];
      if (username === roleCredentials.username && password === roleCredentials.password) {
        onSignIn(selectedRole);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Ayuu</h1>
          </div>
          <p className="text-gray-600 text-lg">Healthcare Management System</p>
          <p className="text-gray-500 mt-2">Select your role to continue</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(roleData).map(([role, data]) => {
              const IconComponent = data.icon;
              return (
                <Card
                  key={role}
                  className={`cursor-pointer transition-all duration-200 ${data.color} border-2`}
                  onClick={() => handleRoleSelect(role as UserRole)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <IconComponent className={`w-8 h-8 ${data.iconColor}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{data.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">
                      {data.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full ${roleData[selectedRole].color} flex items-center justify-center`}>
                  {React.createElement(roleData[selectedRole].icon, {
                    className: `w-8 h-8 ${roleData[selectedRole].iconColor}`
                  })}
                </div>
              </div>
              <CardTitle>
                {isSignUp ? 'Sign up' : 'Sign in'} as {roleData[selectedRole].title}
              </CardTitle>
              <CardDescription>
                {isSignUp ? 'Create your account' : 'Enter your credentials to continue'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleAuth}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>
              {selectedRole === 'patient' && (
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-sm"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </Button>
                </div>
              )}
              <div className="text-xs text-gray-500 text-center mt-4">
                <p>Demo credentials:</p>
                <p>Doctor: doctor/doc123 | Staff: staff/staff123 | Admin: admin/admin123</p>
                <p>Patient: patient/patient123 or create new account</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignIn;
