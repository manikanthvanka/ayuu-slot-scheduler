
import React, { useState } from 'react';
import { ArrowLeft, Database, Server, HardDrive, Settings, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDatabase } from '@/contexts/DatabaseContext';
import { DatabaseConfig } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface DatabaseConfigurationProps {
  onBack: () => void;
  userRole: UserRole;
}

const DatabaseConfiguration: React.FC<DatabaseConfigurationProps> = ({ onBack, userRole }) => {
  const { database, config, isConnected, switchDatabase, isLoading } = useDatabase();
  const { toast } = useToast();
  
  const [selectedType, setSelectedType] = useState<'sqlite' | 'supabase'>(config?.type || 'sqlite');
  const [sqliteConfig, setSqliteConfig] = useState({
    dbPath: config?.sqlite?.dbPath || './medical-app.db'
  });
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: config?.supabase?.url || '',
    anonKey: config?.supabase?.anonKey || ''
  });

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

  const handleSaveConfiguration = async () => {
    try {
      let newConfig: DatabaseConfig;

      if (selectedType === 'sqlite') {
        newConfig = {
          type: 'sqlite',
          sqlite: { dbPath: sqliteConfig.dbPath }
        };
      } else {
        if (!supabaseConfig.url || !supabaseConfig.anonKey) {
          toast({
            title: "❌ Validation Error",
            description: "Please fill in all Supabase configuration fields",
            variant: "destructive",
          });
          return;
        }
        
        newConfig = {
          type: 'supabase',
          supabase: {
            url: supabaseConfig.url,
            anonKey: supabaseConfig.anonKey
          }
        };
      }

      await switchDatabase(newConfig);
    } catch (error) {
      console.error('Failed to save database configuration:', error);
    }
  };

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
            <span>Current Database Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {config && (
              <Badge variant="outline" className="capitalize">
                {config.type}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Database Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Database Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="database-type">Database Type</Label>
            <Select value={selectedType} onValueChange={(value: 'sqlite' | 'supabase') => setSelectedType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sqlite">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4" />
                    <span>SQLite (Local)</span>
                  </div>
                </SelectItem>
                <SelectItem value="supabase">
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4" />
                    <span>Supabase (Cloud)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType === 'sqlite' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium flex items-center space-x-2">
                <HardDrive className="w-4 h-4" />
                <span>SQLite Configuration</span>
              </h4>
              <div className="space-y-2">
                <Label htmlFor="sqlite-path">Database File Path</Label>
                <Input
                  id="sqlite-path"
                  value={sqliteConfig.dbPath}
                  onChange={(e) => setSqliteConfig({ dbPath: e.target.value })}
                  placeholder="./medical-app.db"
                />
                <p className="text-sm text-gray-600">
                  Path to the SQLite database file. Will be created if it doesn't exist.
                </p>
              </div>
            </div>
          )}

          {selectedType === 'supabase' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium flex items-center space-x-2">
                <Server className="w-4 h-4" />
                <span>Supabase Configuration</span>
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase URL</Label>
                  <Input
                    id="supabase-url"
                    type="url"
                    value={supabaseConfig.url}
                    onChange={(e) => setSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Anonymous Key</Label>
                  <Input
                    id="supabase-key"
                    type="password"
                    value={supabaseConfig.anonKey}
                    onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                    placeholder="Your Supabase anonymous key"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Get these values from your Supabase project settings.
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Connecting...' : 'Save Configuration'}
            </Button>
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfiguration;
