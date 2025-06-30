
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <svg 
          viewBox="0 0 1200 800" 
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hospital Building */}
          <g transform="translate(50, 200)">
            <rect x="0" y="0" width="200" height="300" fill="#3B82F6" opacity="0.3"/>
            <rect x="20" y="50" width="30" height="40" fill="#60A5FA" opacity="0.4"/>
            <rect x="70" y="50" width="30" height="40" fill="#60A5FA" opacity="0.4"/>
            <rect x="120" y="50" width="30" height="40" fill="#60A5FA" opacity="0.4"/>
            <rect x="170" y="50" width="30" height="40" fill="#60A5FA" opacity="0.4"/>
            {/* Medical Cross on building */}
            <rect x="85" y="150" width="30" height="8" fill="#EF4444" opacity="0.6"/>
            <rect x="96" y="139" width="8" height="30" fill="#EF4444" opacity="0.6"/>
          </g>

          {/* Ambulance */}
          <g transform="translate(300, 400)">
            <rect x="0" y="0" width="120" height="60" rx="10" fill="#FFFFFF" opacity="0.4"/>
            <rect x="100" y="10" width="40" height="40" fill="#EF4444" opacity="0.5"/>
            <circle cx="25" cy="65" r="12" fill="#374151" opacity="0.3"/>
            <circle cx="95" cy="65" r="12" fill="#374151" opacity="0.3"/>
            {/* Red cross on ambulance */}
            <rect x="15" y="20" width="20" height="5" fill="#EF4444" opacity="0.7"/>
            <rect x="22" y="13" width="6" height="19" fill="#EF4444" opacity="0.7"/>
          </g>

          {/* Medical Stethoscope */}
          <g transform="translate(600, 300)">
            <path d="M0 0 Q20 20 40 0 Q60 -20 80 0" stroke="#10B981" strokeWidth="8" fill="none" opacity="0.4"/>
            <circle cx="0" cy="0" r="15" fill="#10B981" opacity="0.4"/>
            <circle cx="80" cy="0" r="15" fill="#10B981" opacity="0.4"/>
            <circle cx="40" cy="50" r="20" fill="#10B981" opacity="0.3"/>
          </g>

          {/* Heart Monitor Line */}
          <g transform="translate(800, 200)">
            <path d="M0 50 L50 50 L70 20 L90 80 L110 10 L130 90 L150 50 L200 50" 
                  stroke="#EF4444" strokeWidth="4" fill="none" opacity="0.4"/>
          </g>

          {/* Pills */}
          <g transform="translate(900, 500)">
            <circle cx="20" cy="20" r="12" fill="#F59E0B" opacity="0.4"/>
            <circle cx="60" cy="30" r="12" fill="#EC4899" opacity="0.4"/>
            <circle cx="100" cy="15" r="12" fill="#8B5CF6" opacity="0.4"/>
          </g>

          {/* Medical Kit */}
          <g transform="translate(1000, 100)">
            <rect x="0" y="20" width="80" height="50" rx="5" fill="#FFFFFF" opacity="0.4"/>
            <rect x="10" y="0" width="60" height="20" rx="3" fill="#DC2626" opacity="0.5"/>
            <rect x="30" y="35" width="20" height="5" fill="#EF4444" opacity="0.7"/>
            <rect x="37" y="28" width="6" height="19" fill="#EF4444" opacity="0.7"/>
          </g>
        </svg>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ayuu</h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">Healthcare Management System</p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Select your role to continue</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
            {Object.entries(roleData).map(([role, data]) => {
              const IconComponent = data.icon;
              return (
                <Card
                  key={role}
                  className={`cursor-pointer transition-all duration-200 ${data.color} border-2 hover:shadow-lg transform hover:scale-105`}
                  onClick={() => handleRoleSelect(role as UserRole)}
                >
                  <CardHeader className="text-center pb-3 md:pb-4">
                    <div className="flex justify-center mb-2 md:mb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${data.iconColor}`} />
                      </div>
                    </div>
                    <CardTitle className="text-lg md:text-xl">{data.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6">
                    <CardDescription className="text-center text-xs md:text-sm leading-relaxed">
                      {data.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-sm md:max-w-md mx-auto shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${roleData[selectedRole].color} flex items-center justify-center`}>
                  {React.createElement(roleData[selectedRole].icon, {
                    className: `w-6 h-6 md:w-8 md:h-8 ${roleData[selectedRole].iconColor}`
                  })}
                </div>
              </div>
              <CardTitle className="text-lg md:text-xl">
                {isSignUp ? 'Sign up' : 'Sign in'} as {roleData[selectedRole].title}
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                {isSignUp ? 'Create your account' : 'Enter your credentials to continue'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm md:text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 md:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 md:h-11"
                />
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 md:h-11"
                  />
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1 h-10 md:h-11"
                >
                  Back
                </Button>
                <Button
                  onClick={handleAuth}
                  className="flex-1 h-10 md:h-11 bg-primary hover:bg-primary-hover"
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
                    className="text-xs md:text-sm"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </Button>
                </div>
              )}
              <div className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
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
