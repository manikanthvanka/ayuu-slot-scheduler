
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseAdapter, DatabaseConfig } from '../types/database';
import { DatabaseFactory } from '../database/database-factory';
import { useToast } from '@/hooks/use-toast';

interface DatabaseContextType {
  database: DatabaseAdapter | null;
  config: DatabaseConfig | null;
  isConnected: boolean;
  switchDatabase: (newConfig: DatabaseConfig) => Promise<void>;
  isLoading: boolean;
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
  const [database, setDatabase] = useState<DatabaseAdapter | null>(null);
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('database-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        switchDatabase(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved database config:', error);
        // Set default to SQLite
        const defaultConfig: DatabaseConfig = {
          type: 'sqlite',
          sqlite: { dbPath: './medical-app.db' }
        };
        switchDatabase(defaultConfig);
      }
    } else {
      // Set default to SQLite
      const defaultConfig: DatabaseConfig = {
        type: 'sqlite',
        sqlite: { dbPath: './medical-app.db' }
      };
      switchDatabase(defaultConfig);
    }
  }, []);

  const switchDatabase = async (newConfig: DatabaseConfig) => {
    setIsLoading(true);
    
    try {
      // Disconnect existing database
      if (database) {
        await database.disconnect();
      }

      // Create new database connection
      const newDatabase = await DatabaseFactory.create(newConfig);
      
      setDatabase(newDatabase);
      setConfig(newConfig);
      
      // Save configuration to localStorage
      localStorage.setItem('database-config', JSON.stringify(newConfig));
      
      toast({
        title: "✅ Database Connected",
        description: `Successfully connected to ${newConfig.type} database`,
      });
      
    } catch (error) {
      console.error('Failed to switch database:', error);
      toast({
        title: "❌ Database Connection Failed",
        description: `Failed to connect to ${newConfig.type} database: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = database?.isConnected() || false;

  return (
    <DatabaseContext.Provider value={{
      database,
      config,
      isConnected,
      switchDatabase,
      isLoading
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
