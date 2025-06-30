
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
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ayuu</h1>
            <p className="text-sm text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive 
                    ? "bg-primary hover:bg-primary-hover text-white" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => onViewChange(item.id as ViewMode)}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
