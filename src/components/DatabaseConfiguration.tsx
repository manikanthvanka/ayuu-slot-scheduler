import React from 'react';
import { ArrowLeft, Database, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDatabase } from '@/contexts/DatabaseContext';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface DatabaseConfigurationProps {
  onBack: () => void;
  userRole: UserRole;
}

const DatabaseConfiguration: React.FC<DatabaseConfigurationProps> = ({ onBack, userRole }) => {
  const { isConnected, connectionStatus, testConnection, isLoading, connectionError } = useDatabase();

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
            <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">Only administrators can manage database configuration.</p>
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
        <h2 className="text-2xl font-bold text-gray-900">Database Configuration</h2>
      </div>

      {/* Current Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Supabase Connection Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {connectionStatus}
                </span>
              </div>
              <Badge variant="outline" className="capitalize">
                Supabase
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={testConnection}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
          </div>
          
          {connectionError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {connectionError}
              </p>
            </div>
          )}
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Project URL:</strong> https://kgsuamhcarqmgjmgtmwo.supabase.co</p>
            <p><strong>Status:</strong> {isConnected ? 'Ready for use' : 'Connection issues detected'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Database Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Your app is configured to use Supabase as the primary database.</p>
            <p>SQLite configuration has been removed to focus on Supabase connectivity.</p>
            {!isConnected && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-600">
                  <li>Verify your Supabase project is active</li>
                  <li>Check your internet connection</li>
                  <li>Ensure the project URL is correct</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfiguration;