import OrdersWorkshop from '@/components/orders/workshop/orders';
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { storageManager } from '@/lib/storage/storageManager';
import { OrderStatus } from '@/models';
import { NotepadText, Hammer, CircleCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardCliente() {
  //Simulación de obtener órdenes de un cliente autenticado
  const customer = storageManager.getAllCustomers()[0];
  const orders = storageManager.getOrdersByCustomer(customer.id);
  const totalOrders = orders.length;
  const ordersInProgress = orders.filter(
    (order) => order.status === OrderStatus.IN_PROGRESS
  ).length;
  const ordersCompleted = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED
  ).length;
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between space-y-6">
        <div>
          <h1 className="font-bold text-3xl">Mis Órdenes</h1>
          <p>
            Gestion y supervise todas las reparaciones activas en el taller.
          </p>
        </div>
        {/* Pentiende de implementar la orden nueva de un cliente */}
        {/* <Button
          className="bg-lemon text-primary hover:text-white cursor-pointer"
          onClick={() => navigate('/taller/nuevaOrden')}
        >
          <Plus />
          <span>Nueva Orden</span>
        </Button> */}
      </div>
      {/* Data Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="shadow-md bg-gray-300/70">
          <CardContent>
            <CardTitle>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">
                  Órdenes Totales
                </span>
                <NotepadText className="w-5 h-5 text-primary" />
              </div>
            </CardTitle>
            <CardDescription className="py-2">
              <p className="font-bold text-5xl text-primary">{totalOrders}</p>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-md bg-gray-300/70">
          <CardContent>
            <CardTitle>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">
                  Órdenes en progreso
                </span>
                <Hammer className="w-5 h-5 text-primary" />
              </div>
            </CardTitle>
            <CardDescription className="py-2">
              <p className="font-bold text-5xl text-primary">
                {ordersInProgress}
              </p>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-md bg-gray-300/70">
          <CardContent>
            <CardTitle>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">Completadas</span>
                <CircleCheckBig className="w-5 h-5 text-primary" />
              </div>
            </CardTitle>
            <CardDescription className="py-2">
              <p className="font-bold text-5xl text-primary">
                {ordersCompleted}
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <OrdersWorkshop
        orders={orders}
        handleOrderClick={(e) => navigate(`/cliente/orden/${e}`)}
      />
    </div>
  );
}
