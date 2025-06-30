
import React from 'react';
import { Calendar, Clock, Users, UserPlus, Activity, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onSignOut: () => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onSignOut, userRole }) => {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', roles: ['admin', 'doctor', 'staff'] },
    { id: 'register', icon: UserPlus, label: 'Register Patient', roles: ['admin', 'staff'] },
    { id: 'booking', icon: Calendar, label: 'Book Appointment', roles: ['admin', 'staff'] },
    { id: 'queue', icon: Clock, label: 'Live Queue', roles: ['admin', 'doctor', 'staff'] },
    { id: 'return-queue', icon: Activity, label: 'Return Queue', roles: ['admin', 'doctor', 'staff'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 sm:p-4 lg:p-6 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Ayuu</h1>
            <p className="text-xs sm:text-sm text-gray-500 capitalize truncate">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 sm:px-4 py-2 overflow-y-auto">
        <div className="space-y-1 sm:space-y-2">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 sm:h-11 text-sm sm:text-base px-3 sm:px-4 ${
                  isActive 
                    ? "bg-primary hover:bg-primary-hover text-white" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => onViewChange(item.id as ViewMode)}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="truncate text-left">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 sm:h-11 text-sm sm:text-base text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 sm:px-4"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
          <span className="truncate text-left">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
