import { useNavigate, Outlet } from 'react-router-dom';
import { User } from 'lucide-react';
import { Toaster } from 'sonner';
import { UseAuth } from '@/contexts/AuthContext';

export function ClientLayout() {
  const navigate = useNavigate();
  const { logout } = UseAuth();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <header className="flex justify-between items-center">
        <div className="p-4 flex justify-between w-full">
          <div className="flex items-center gap-4 w-40">
            <div className="h-10 w-10 rounded-full bg-lemon flex justify-center items-center">
              <User className="h-5 w-5" />
            </div>
            <h1 className="font-bold">Client Admin</h1>
          </div>
        </div>
        {/* Logout */}
        <button
          className="bg-secondary text-white px-4 py-1 rounded cursor-pointer mx-4"
          onClick={handleLogout}
        >
          Salir
        </button>
      </header>
      <main className="container mx-auto flex-1 p-6 bg-gray-100">
        <Outlet />
        <Toaster richColors position="top-right" />
      </main>
    </div>
  );
}
