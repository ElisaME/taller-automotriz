import './App.css';
import { seedData } from './lib/storage/seeder';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelector from './pages/RoleSelector';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardTaller from './pages/taller/page';
import DashboardCliente from './pages/client/page';
import { WorkshopLayout } from '@/components/layout/WorkshopLayout';
import { OrderDetails } from './pages/taller/orderDetails';
// import { storageManager } from './lib/storage/storageManager';
// storageManager.clearAll();
seedData();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RoleSelector />} />

          <Route
            path="/taller"
            element={
              <ProtectedRoute requiredRole="TALLER">
                <WorkshopLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardTaller />} />
            <Route path="ordenes/:id" element={<OrderDetails />} />
          </Route>
          <Route
            path="/cliente"
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <DashboardCliente />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
