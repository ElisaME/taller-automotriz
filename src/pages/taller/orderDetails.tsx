import OrderServiceItems from '@/components/orders/workshop/OrderServiceItems';
import OrderTimelineEvents from '@/components/orders/OrderTimelineEvents';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { storageManager } from '@/lib/storage/storageManager';
import {
  formatCurrency,
  formatDate,
  getAvailableTransitions,
  getTotalComponents,
  getTotalServicesLabor,
  transitionActionsWorkshop,
} from '@/lib/utils';
import {
  OrderStatus,
  type BusinessError,
  type Customer,
  type RepairOrder,
  type Vehicle,
} from '@/models';
import { ArrowLeft, CarFront, CirclePlus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transitionOrder } from '@/hooks/orderService';
import { toast } from 'sonner';
import AddServiceDialog from '@/components/orders/AddServiceDialog';

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addServiceDialog, setAddServiceDialog] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const loadOrder = () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const orderData = storageManager.getRepairOrder(id);
        if (!orderData) {
          setOrder(null);
          return;
        }
        const customer = storageManager.getCustomer(orderData.customerId);
        const vehicle = storageManager.getVehicle(orderData.vehicleId);
        setOrder(orderData);
        setCustomer(customer);
        setVehicle(vehicle);
      } catch (error) {
        console.log('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const totalServices = getTotalServicesLabor(order?.services || []);
  const totalComponents = getTotalComponents(
    order?.services.flatMap((s) => s.components) || []
  );

  const totalEstimated = (totalComponents + totalServices) * 1.16;
  const transitions = getAvailableTransitions(order?.status as OrderStatus);

  const transitionOrderAction = (orderId: string, newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      const result = transitionOrder(orderId, newStatus);
      if (result.success && result.order) {
        setOrder(result.order);
        toast.success('Estado de la orden actualizado correctamente');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error al actualizar el estado de la orden');
      console.error('Error al actualizar el estado de la orden:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-16 w-16" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">Orden no encontrada</h2>
      </div>
    );
  }
  return (
    <div className="container">
      {/* Header con botón volver y estado */}
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="sm"
        onClick={() => navigate('/taller/ordenes')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Orden {order.orderId}</h1>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center space-x-3">
          {/* Menú de acciones (solo para taller) */}
          {transitions.map((nextStatus) => {
            const action = transitionActionsWorkshop[nextStatus];
            if (!action.label) return null;
            return (
              <Button
                key={nextStatus}
                className={`cursor-pointer ${action.variant}`}
                onClick={() => transitionOrderAction(order.id, nextStatus)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
      <p>
        {`Orden creada el
              ${formatDate(order.events[0].timeStamp)}`}
      </p>
      <Separator className="my-4" orientation="horizontal" />
      {/* Datos cliente y vehículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md shadow-gray-300 p-6 bg-gray-400/30">
          <CardTitle className="flex items-center font-medium text-primary">
            <div className="w-8 h-8 rounded-full bg-lemon flex items-center justify-center mr-2">
              <User className="w-5 h-5 text-secondary " />
            </div>
            Datos del Cliente
          </CardTitle>
          <CardContent className="grid grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-secondary">Nombre</p>
                <p>{customer?.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-secondary">Email</p>
                <p>{customer?.email}</p>
              </div>
            </div>
            <div>
              <div>
                <p className="text-xs uppercase text-secondary">Teléfono</p>
                <p>{customer?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md shadow-gray-300 p-6 bg-gray-400/30">
          <CardTitle className="flex items-center font-medium text-primary">
            <div className="w-8 h-8 rounded-full bg-lemon flex items-center justify-center mr-2">
              <CarFront className="w-5 h-5 text-secondary" />
            </div>
            Datos del Vehículo
          </CardTitle>
          <CardContent className="grid grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-secondary">Modelo</p>
                <p>{vehicle?.model}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-secondary">Placa</p>
                <p>{vehicle?.plate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-4" orientation="horizontal" />
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Datos de servicios y refacciones */}
        <div className="col-span-4">
          <h2 className="font-bold text-xl text-primary">
            Servicios y Refacciones
          </h2>
          <OrderServiceItems services={order.services} />
          {/* Agregar servicio o refacción */}
          <button
            role="button"
            className="group cursor-pointer disabled:cursor-not-allowed w-full border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center p-4 disabled:text-primary/50"
            onClick={() => setAddServiceDialog(true)}
            disabled={
              order.status !== OrderStatus.DIAGNOSED &&
              order.status !== OrderStatus.CREATED
            }
          >
            <CirclePlus className="w-8 h-8 text-primary mr-2 group-disabled:text-primary/50" />
            <span>Agregar Servicio o Refacción</span>
          </button>
          <AddServiceDialog
            orderId={order.id}
            open={addServiceDialog}
            onOpenChange={(e) => setAddServiceDialog(e)}
            onServiceAdded={() => {
              // Recargar la orden después de agregar el servicio
              setAddServiceDialog(false);
              const updatedOrder = storageManager.getRepairOrder(order.id);
              if (updatedOrder) setOrder(updatedOrder);
            }}
          />
        </div>
        <div className="col-span-2 space-y-6">
          {/* Datos Costos */}
          <div>
            <h2 className="font-bold text-xl text-secondary border-b-2">
              Resumen Financiero
            </h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Subtotal Servicios</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totalServices)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subtotal Refacciones</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totalComponents)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-lg text-secondary">
                    Total Estimado:
                  </TableCell>
                  <TableCell className="text-right font-bold text-xl">
                    {formatCurrency(totalEstimated)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          {/* Historial de Eventos */}
          <h2 className="font-bold text-xl text-secondary border-b-2 mb-0">
            Historial de Eventos
          </h2>
          <OrderTimelineEvents events={order.events} />
          {/* Registro de Errores */}
          <h2 className="font-bold text-xl text-secondary border-b-2 mb-0">
            Registro de Errores
          </h2>
          <Table>
            <TableBody>
              {order.errors.length > 0 ? (
                order.errors.map((error: BusinessError) => (
                  <TableRow>
                    <TableCell>{formatDate(error.timestamp)}</TableCell>
                    <TableCell>{error.type}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
