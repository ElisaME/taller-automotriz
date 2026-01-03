import type { UserRole } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'user-role';

interface AuthContextType {
  role: UserRole | null;
  selectRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

//Crear contexto, inicia como undefined

export function AuthProvider({ children }: AuthProviderProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedRole = localStorage.getItem(STORAGE_KEY);
        if (storedRole === 'TALLER' || storedRole === 'CLIENTE') {
          setRole(storedRole);
        }
      } catch (error) {
        console.error(
          'Error al cargar el rol del usuario desde el almacenamiento local:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const selectRole = (newRole: UserRole) => {
    try {
      setRole(newRole);
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch (error) {
      console.error('Error al guardar rol en localStorage:', error);
      setRole(null);
    }
  };

  const logout = () => {
    try {
      setRole(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        selectRole,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}
