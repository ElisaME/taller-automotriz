import { UseAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { User, Wrench } from 'lucide-react';

export default function RoleSelector() {
  const { role, selectRole, isLoading } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'TALLER') {
      navigate('/taller');
    } else if (role === 'CLIENTE') {
      navigate('/cliente');
    }
  }, [role, navigate]);

  const handlSelectRole = (selectedRole: 'TALLER' | 'CLIENTE') => {
    selectRole(selectedRole);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl">Taller Automotriz</h1>
          <p className="text-lg">Selecciona tu rol:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-radial-[at_0%_10%] from-lemon to-white to-95%"
            onClick={() => handlSelectRole('TALLER')}
          >
            <CardContent className="text-center text-primary">
              <Wrench className="w-10 h-10 mx-auto" />
              <h2 className="text-2xl mb-4">TALLER</h2>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-radial-[at_0%_10%] from-lemon to-white to-95%"
            onClick={() => handlSelectRole('CLIENTE')}
          >
            <CardContent className="text-center text-primary">
              <User className="w-10 h-10 mx-auto" />
              <h2 className="text-2xl mb-4">CLIENTE</h2>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 
        {role && (
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        )} */}
    </div>
  );
}
