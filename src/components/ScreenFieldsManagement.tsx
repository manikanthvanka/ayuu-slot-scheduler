
import React, { useState } from 'react';
import { ArrowLeft, Save, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import { useToast } from '@/hooks/use-toast';

interface ScreenFieldsManagementProps {
  onBack: () => void;
}

const ScreenFieldsManagement: React.FC<ScreenFieldsManagementProps> = ({ onBack }) => {
  const { screenFields, updateFieldValue } = useScreenFields();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredFields = screenFields.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStart = (field: any) => {
    setEditingField(field.id);
    setEditValue(field.value);
  };

  const handleEditSave = (fieldId: string) => {
    updateFieldValue(fieldId, editValue);
    setEditingField(null);
    setEditValue('');
    toast({
      title: "✅ Field Updated",
      description: "Screen field has been updated successfully.",
    });
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Screen Fields Management</h1>
            <p className="text-gray-600">Manage dynamic text content across the application</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Dashboard Screen Fields</CardTitle>
              <CardDescription>
                Edit text fields that appear on the dashboard screen
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Screen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {field.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      {editingField === field.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(field.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="font-medium">{field.value}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {field.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{field.screen}</Badge>
                    </TableCell>
                    <TableCell>
                      {editingField !== field.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(field)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenFieldsManagement;
