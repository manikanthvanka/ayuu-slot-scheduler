
import React, { useState } from 'react';
import { ArrowLeft, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface ColorCustomizationProps {
  onBack: () => void;
}

const ColorCustomization: React.FC<ColorCustomizationProps> = ({ onBack }) => {
  const { primaryColor, setPrimaryColor, accentColor, setAccentColor } = useTheme();
  const [tempPrimaryColor, setTempPrimaryColor] = useState(primaryColor);
  const [tempAccentColor, setTempAccentColor] = useState(accentColor);
  const { toast } = useToast();

  const presetColors = [
    { name: 'Default Blue', primary: '#0F52BA', accent: '#4169E1' },
    { name: 'Green', primary: '#10B981', accent: '#059669' },
    { name: 'Purple', primary: '#8B5CF6', accent: '#7C3AED' },
    { name: 'Red', primary: '#F59E0B', accent: '#D97706' },
    { name: 'Teal', primary: '#14B8A6', accent: '#0D9488' },
  ];

  const handleSave = () => {
    setPrimaryColor(tempPrimaryColor);
    setAccentColor(tempAccentColor);
    toast({
      title: "🎨 Colors Updated",
      description: "App colors have been updated successfully.",
    });
  };

  const handlePresetSelect = (preset: typeof presetColors[0]) => {
    setTempPrimaryColor(preset.primary);
    setTempAccentColor(preset.accent);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Color Customization</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize the app's color scheme</p>
          </div>
        </div>
        <Button onClick={handleSave} className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Color Settings
            </CardTitle>
            <CardDescription>
              Customize primary and accent colors for the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="primary-color"
                  type="color"
                  value={tempPrimaryColor}
                  onChange={(e) => setTempPrimaryColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={tempPrimaryColor}
                  onChange={(e) => setTempPrimaryColor(e.target.value)}
                  className="flex-1"
                  placeholder="#0F52BA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="accent-color"
                  type="color"
                  value={tempAccentColor}
                  onChange={(e) => setTempAccentColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={tempAccentColor}
                  onChange={(e) => setTempAccentColor(e.target.value)}
                  className="flex-1"
                  placeholder="#4169E1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Presets</CardTitle>
            <CardDescription>
              Choose from predefined color combinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {presetColors.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => handlePresetSelect(preset)}
                  className="flex items-center justify-between p-4 h-auto"
                >
                  <span>{preset.name}</span>
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your colors will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button style={{ backgroundColor: tempPrimaryColor }} className="text-white">
              Primary Button
            </Button>
            <Button 
              variant="outline" 
              style={{ 
                borderColor: tempAccentColor, 
                color: tempAccentColor 
              }}
            >
              Accent Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorCustomization;
