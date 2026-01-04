import { Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export function WorkshopLayout() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <header>
        <div className="p-4 flex justify-between w-full">
          <div className="flex items-center gap-4 w-40">
            <div className="h-10 w-10 rounded-full bg-lemon flex justify-center items-center">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="font-bold">Taller Admin</h1>
          </div>
          <nav className="p-4 space-x-4 flex w-full ">
            <a href="/taller/ordenes">
              <span>Órdenes</span>
            </a>
            <a href="/taller/nueva">
              <span>Nueva Orden</span>
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
