
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseContextType {
  isConnected: boolean;
  connectionStatus: string;
  testConnection: () => Promise<void>;
  isLoading: boolean;
  connectionError: string | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  // Test Supabase connection
  const testConnection = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      console.log('Testing Supabase connection...');
      setConnectionStatus('Testing connection...');
      
      // Simple query to test connection - use a basic query instead
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      } else {
        setIsConnected(true);
        setConnectionStatus('Connected to Supabase');
        toast({
          title: "✅ Supabase Connected",
          description: "Database connection successful",
        });
      }
      
    } catch (error) {
      console.error('Supabase connection failed:', error);
      setIsConnected(false);
      setConnectionStatus('Connection failed');
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "❌ Database Connection Failed",
        description: `Failed to connect to Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <DatabaseContext.Provider value={{
      isConnected,
      connectionStatus,
      testConnection,
      isLoading,
      connectionError
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
