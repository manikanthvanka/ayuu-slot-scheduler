
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DatabaseStatusProps {
  isConnected: boolean;
  databaseType: string;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ isConnected, databaseType }) => {
  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
      <span className="text-sm font-medium">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
      <Badge variant="outline" className="capitalize">
        {databaseType}
      </Badge>
    </div>
  );
};

export default DatabaseStatus;
