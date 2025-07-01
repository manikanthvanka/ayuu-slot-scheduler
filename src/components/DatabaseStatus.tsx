
import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DatabaseStatusProps {
  isConnected: boolean;
  databaseType: string;
  connectionStatus?: 'checking' | 'connected' | 'error';
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ 
  isConnected, 
  databaseType, 
  connectionStatus = 'checking' 
}) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      case 'checking':
      default:
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'checking':
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      <Badge variant="outline" className="capitalize">
        {databaseType}
      </Badge>
    </div>
  );
};

export default DatabaseStatus;
