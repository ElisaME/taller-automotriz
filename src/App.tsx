import './App.css';
import { Button } from '@/components/ui/button';
import { seedData } from './lib/storage/seeder';
import { storageManager } from './lib/storage/storageManager';

seedData();

function App() {
  const getOrders = storageManager.getAllRepairOrders();
  console.log(getOrders);
  const getVehicles = storageManager.getAllVehicles();
  console.log('vehiculos', getVehicles);
  const getCustomers = storageManager.getAllCustomers();
  console.log('clientes', getCustomers);
  const vehicle1 = storageManager.getVehicleByCustomer(
    'b2069a08-d40e-423e-845c-43aa54b7c327'
  );
  console.log('vehiculos de cliente 1', vehicle1);
  const orden1 = storageManager.getOrdersByCustomer(
    'b2069a08-d40e-423e-845c-43aa54b7c327'
  );
  console.log('ordenes de cliente 1', orden1);
  return (
    <>
      <h1 className="text-blue-800">Hola</h1>
      <Button className="bg-amber-400">Click me</Button>
    </>
  );
}

export default App;
