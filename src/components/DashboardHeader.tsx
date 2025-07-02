
import React from 'react';
import { Bell, Menu, Sun, Moon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  userRole: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar, userRole }) => {
  const { getFieldValue } = useScreenFields();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 flex-shrink-0 w-full">
      <div className="px-4 lg:px-6 xl:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex items-center space-x-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-10 w-10 p-0 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{getFieldValue('page_title', 'dashboard')}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24 lg:w-32 h-8 lg:h-10">
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 lg:w-4 lg:h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="te">{t('telugu')}</SelectItem>
                <SelectItem value="hi">{t('hindi')}</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-3 h-3 lg:w-4 lg:h-4" /> : <Moon className="w-3 h-3 lg:w-4 lg:h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
            <div className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 capitalize bg-gray-100 dark:bg-gray-700 px-2 lg:px-3 py-1 rounded-full">
              {userRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
