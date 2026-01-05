import { useNavigate, Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { Toaster } from 'sonner';
import { UseAuth } from '@/contexts/AuthContext';

export function WorkshopLayout() {
  const navigate = useNavigate();
  const { logout } = UseAuth();
  const handleLogout = () => {
    logout();
    navigate('/login'); // o '/'
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <header className="flex justify-between items-center">
        <div className="p-4 flex justify-between w-full">
          <div className="flex items-center gap-4 w-40">
            <div className="h-10 w-10 rounded-full bg-lemon flex justify-center items-center">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="font-bold">Taller Admin</h1>
          </div>
          {/* <nav className="p-4 space-x-4 flex w-full ">
            <a href="/taller/ordenes">
              <span>Órdenes</span>
            </a>
            <a href="/taller/nuevaOrden">
              <span>Nueva Orden</span>
            </a>
          </nav> */}
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
