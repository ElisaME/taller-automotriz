import './App.css';
import { seedData } from './lib/storage/seeder';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelector from './pages/RoleSelector';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardTaller from './pages/taller/page';
import DashboardCliente from './pages/client/page';

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
                <DashboardTaller />
              </ProtectedRoute>
            }
          ></Route>
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
