
import React from 'react';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  userRole: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar, userRole }) => {
  const { getFieldValue } = useScreenFields();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 shadow-lg border-b sticky top-0 z-40 flex-shrink-0 w-full">
      <div className="px-4 lg:px-6 xl:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex items-center space-x-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-10 w-10 p-0 text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white">{getFieldValue('page_title', 'dashboard')}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="h-10 w-10 p-0 text-white hover:bg-white/10"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-white hover:bg-white/10">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="text-sm text-white capitalize bg-white/20 px-3 py-1 rounded-full">
              {userRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
