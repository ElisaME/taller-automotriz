import OrdersWorkshop from '@/components/orders/workshop/orders-workshop';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { storageManager } from '@/lib/storage/storageManager';
import { OrderStatus } from '@/models';
import { Plus, NotepadText, Hammer, CircleCheckBig } from 'lucide-react';

export default function DashboardTaller() {
  const orders = storageManager.getAllRepairOrders();
  const totalOrders = orders.length;
  const ordersInProgress = orders.filter(
    (order) => order.status === OrderStatus.IN_PROGRESS
  ).length;
  return (
    <div>
      <div className="flex justify-between space-y-6">
        <div>
          <h1 className="font-bold text-3xl">Panel de Órdenes</h1>
          <p>
            Gestion y supervise todas las reparaciones activas en el taller.
          </p>
        </div>
        <Button className="bg-lemon text-primary">
          <Plus />
          <span>Nueva Orden</span>
        </Button>
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
                {ordersInProgress}
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <OrdersWorkshop />
    </div>
  );
}
