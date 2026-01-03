import { UseAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Spinner } from './ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'TALLER' | 'CLIENTE';
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { role, isLoading } = UseAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-16 w-16 text-lemon" />
      </div>
    );
  }

  if (role === null) {
    return <Navigate to="/" />;
  }

  if (role !== requiredRole) {
    if (role === 'CLIENTE') {
      return <Navigate to="/cliente" />;
    } else if (role === 'TALLER') {
      return <Navigate to="/taller" />;
    }
  }

  return <>{children}</>;
}
