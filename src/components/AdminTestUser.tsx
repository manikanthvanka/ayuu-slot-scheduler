import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Key } from 'lucide-react';

const AdminTestUser: React.FC = () => {
  const { signUp } = useAuth();

  const createTestAdmin = async () => {
    await signUp('admin@ayuu.com', 'ayuu123456', 'Admin User', 'admin');
  };

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <User className="w-5 h-5" />
          Test Admin User
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-amber-700">
          <p className="font-medium mb-2">Default test credentials:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email: admin@ayuu.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>Password: ayuu123456</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={createTestAdmin}
          variant="outline"
          className="w-full border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          Create Test Admin User
        </Button>
        
        <p className="text-xs text-amber-600">
          Click this button if the test admin user doesn't exist yet in your database.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminTestUser;