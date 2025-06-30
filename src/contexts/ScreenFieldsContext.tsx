
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScreenField, dashboardScreenFields } from '@/data/screenFields';

interface ScreenFieldsContextType {
  screenFields: ScreenField[];
  getFieldValue: (key: string, screen: string) => string;
  updateFieldValue: (id: string, newValue: string) => void;
}

const ScreenFieldsContext = createContext<ScreenFieldsContextType | undefined>(undefined);

export const useScreenFields = () => {
  const context = useContext(ScreenFieldsContext);
  if (!context) {
    throw new Error('useScreenFields must be used within a ScreenFieldsProvider');
  }
  return context;
};

interface ScreenFieldsProviderProps {
  children: ReactNode;
}

export const ScreenFieldsProvider: React.FC<ScreenFieldsProviderProps> = ({ children }) => {
  const [screenFields, setScreenFields] = useState<ScreenField[]>(dashboardScreenFields);

  const getFieldValue = (key: string, screen: string): string => {
    const field = screenFields.find(f => f.key === key && f.screen === screen);
    return field?.value || key;
  };

  const updateFieldValue = (id: string, newValue: string) => {
    setScreenFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  return (
    <ScreenFieldsContext.Provider value={{
      screenFields,
      getFieldValue,
      updateFieldValue
    }}>
      {children}
    </ScreenFieldsContext.Provider>
  );
};
