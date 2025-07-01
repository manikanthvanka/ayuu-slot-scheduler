import React, { useState } from 'react';
import { ArrowLeft, Settings, Save, Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AppConfigurationPageProps {
  onBack: () => void;
}

const AppConfigurationPage: React.FC<AppConfigurationPageProps> = ({ onBack }) => {
  const [config, setConfig] = useState({
    appName: 'Ayuu',
    appDescription: 'Healthcare Management System',
    dashboardTitle: 'Healthcare Dashboard',
    registrationTitle: 'Patient Registration',
    bookingTitle: 'Appointment Booking',
    searchTitle: 'Patient Search',
    queueTitle: 'Live Queue Management',
    primaryColor: '#0F52BA',
    secondaryColor: '#4169E1',
    accentColor: '#088F8F',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444'
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to a database or configuration file
    toast({
      title: "✅ Configuration Saved",
      description: "Application configuration has been updated successfully.",
    });
  };

  const resetToDefaults = () => {
    setConfig({
      appName: 'Ayuu',
      appDescription: 'Healthcare Management System',
      dashboardTitle: 'Healthcare Dashboard',
      registrationTitle: 'Patient Registration',
      bookingTitle: 'Appointment Booking',
      searchTitle: 'Patient Search',
      queueTitle: 'Live Queue Management',
      primaryColor: '#0F52BA',
      secondaryColor: '#4169E1',
      accentColor: '#088F8F',
      successColor: '#10B981',
      warningColor: '#F59E0B',
      errorColor: '#EF4444'
    });
    
    toast({
      title: "🔄 Reset Complete",
      description: "Configuration has been reset to default values.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-[#0F52BA]">App Configuration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="appName">Application Name</Label>
              <Input
                id="appName"
                value={config.appName}
                onChange={(e) => handleInputChange('appName', e.target.value)}
                placeholder="Enter application name"
              />
            </div>

            <div>
              <Label htmlFor="appDescription">Application Description</Label>
              <Textarea
                id="appDescription"
                value={config.appDescription}
                onChange={(e) => handleInputChange('appDescription', e.target.value)}
                placeholder="Enter application description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Screen Titles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="w-5 h-5" />
              <span>Screen Titles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dashboardTitle">Dashboard Title</Label>
              <Input
                id="dashboardTitle"
                value={config.dashboardTitle}
                onChange={(e) => handleInputChange('dashboardTitle', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="registrationTitle">Registration Page Title</Label>
              <Input
                id="registrationTitle"
                value={config.registrationTitle}
                onChange={(e) => handleInputChange('registrationTitle', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bookingTitle">Booking Page Title</Label>
              <Input
                id="bookingTitle"
                value={config.bookingTitle}
                onChange={(e) => handleInputChange('bookingTitle', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="searchTitle">Search Page Title</Label>
              <Input
                id="searchTitle"
                value={config.searchTitle}
                onChange={(e) => handleInputChange('searchTitle', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="queueTitle">Queue Page Title</Label>
              <Input
                id="queueTitle"
                value={config.queueTitle}
                onChange={(e) => handleInputChange('queueTitle', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Color Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#0F52BA"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    placeholder="#4169E1"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    placeholder="#088F8F"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="successColor">Success Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="successColor"
                    type="color"
                    value={config.successColor}
                    onChange={(e) => handleInputChange('successColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.successColor}
                    onChange={(e) => handleInputChange('successColor', e.target.value)}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="warningColor">Warning Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="warningColor"
                    type="color"
                    value={config.warningColor}
                    onChange={(e) => handleInputChange('warningColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.warningColor}
                    onChange={(e) => handleInputChange('warningColor', e.target.value)}
                    placeholder="#F59E0B"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="errorColor">Error Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="errorColor"
                    type="color"
                    value={config.errorColor}
                    onChange={(e) => handleInputChange('errorColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.errorColor}
                    onChange={(e) => handleInputChange('errorColor', e.target.value)}
                    placeholder="#EF4444"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} className="bg-[#0F52BA] hover:bg-[#000080]">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default AppConfigurationPage;