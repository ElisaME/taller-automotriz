import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { storageManager } from '@/lib/storage/storageManager';
import { type Customer, type RepairOrder, type Vehicle } from '@/models';
import { ArrowLeft, CarFront, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          {/* Dropdown con acciones disponibles según el estado */}
        </div>
      </div>
      <p>
        {`Orden creada el
              ${new Date(order.events[0].timeStamp).toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
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
      {/* Datos de servicios y refacciones */}
      <h2 className="font-bold text-2xl text-primary">
        Servicios y Refacciones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div className="overflow-hidden rounded-lg bg-gray-200 col-span-4">
          {order.services.map((service, index) => (
            <div key={service.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">
                    {index + 1}. {service.name}
                  </h4>
                  {service.description && (
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Labor */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Labor estimada:</span>
                  <span className="ml-2 font-medium">
                    ${service.laborEstimated}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Labor real:</span>
                  <span className="ml-2 font-medium">
                    {service.laborReal > 0
                      ? `$${service.laborReal}`
                      : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Componentes */}
              {service.components.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Componentes:
                  </p>
                  <div className="space-y-1 pl-4">
                    {service.components.map((component) => (
                      <div
                        key={component.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          • {component.name}
                        </span>
                        <div className="space-x-4">
                          <span className="text-gray-600">
                            Est: ${component.estimated}
                          </span>
                          <span className="font-medium">
                            Real:{' '}
                            {component.real > 0
                              ? `$${component.real}`
                              : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
