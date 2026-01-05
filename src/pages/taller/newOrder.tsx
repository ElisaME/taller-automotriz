// src/pages/taller/TallerNuevaOrden.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, User } from 'lucide-react';
import { generateId, generateOrderId } from '@/lib/utils';
import { storageManager } from '@/lib/storage/storageManager';
import {
  OrderStatus,
  EventType,
  type RepairOrder,
  type Customer,
  type Vehicle,
  type Event,
} from '@/models';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type OrderSource } from '@/types';

interface CustomerForm {
  name: string;
  phone: string;
  email?: string;
}

interface VehicleForm {
  plate: string;
  model: string;
}

export default function TallerNuevaOrden() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Nuevo cliente
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const {
    register: registerCustomer,
    handleSubmit: handleSubmitCustomer,
    reset: resetCustomer,
    watch,
    formState: { errors: customerErrors },
  } = useForm<CustomerForm>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const {
    register: registerVehicle,
    handleSubmit: handleSubmitVehicle,
    reset: resetVehicle,
    watch: watchVehicle,
    formState: { errors: vehicleErrors },
  } = useForm<VehicleForm>({
    defaultValues: {
      plate: '',
      model: '',
    },
  });

  const newCustomerName = watch('name');
  const newCustomerPhone = watch('phone');
  const newVehicleModel = watchVehicle('model');
  const newVehiclePlate = watchVehicle('plate');

  const [isLoading, setIsLoading] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  // Cargar clientes al inicio
  useEffect(() => {
    const storedCustomers = storageManager.getAllCustomers();

    setCustomers(storedCustomers);
  }, []);

  // Traer vehículos de cliente
  useEffect(() => {
    if (selectedCustomerId) {
      // TODO: Filtrar vehículos del cliente seleccionado
      const storedVehicles =
        storageManager.getVehicleByCustomer(selectedCustomerId);

      setVehicles(storedVehicles);
    } else {
      setVehicles([]);
      setSelectedVehicleId('');
    }
  }, [selectedCustomerId]);

  //Nuevo cliente
  const onSubmit = (data: CustomerForm) => {
    const customer: Customer = {
      id: generateId(),
      name: data.name,
      phone: data.phone,
      email: data.email,
    };
    storageManager.saveCustomer(customer);
    setCustomers([...customers, customer]);
    setSelectedCustomerId(customer.id);
    setIsAddingCustomer(false);
    resetCustomer();
  };

  const cancelAddCustomer = () => {
    setIsAddingCustomer(false);
    resetCustomer();
  };

  // NUEVO VEHÍCULO ==========
  const handleAddVehicle = (data: VehicleForm) => {
    if (!selectedCustomerId) return;
    const vehicle: Vehicle = {
      id: generateId(),
      customerId: selectedCustomerId,
      plate: data.plate,
      model: data.model,
    };

    storageManager.saveVehicle(vehicle);
    setVehicles([...vehicles, vehicle]);
    setSelectedVehicleId(vehicle.id);
    setIsAddingVehicle(false);
    resetVehicle();
  };

  const cancelAddVehicle = () => {
    setIsAddingVehicle(false);
    resetVehicle();
  };

  // ========== FUNCIÓN PARA CREAR ORDEN ==========

  const handleCreateOrder = () => {
    // Validar que haya cliente y vehículo seleccionados
    if (!selectedCustomerId || !selectedVehicleId) {
      toast.error('Debe seleccionar un cliente y un vehículo');
      return;
    }

    setIsLoading(true);
    try {
      const orderId = generateOrderId(storageManager.getAllRepairOrders());
      const id = generateId();

      const firstEvent: Event = {
        id: generateId(),
        orderId: id,
        type: EventType.CREATED,
        fromStatus: null,
        toStatus: OrderStatus.CREATED,
        timeStamp: new Date().toISOString(),
      };

      const newOrder: RepairOrder = {
        id,
        orderId,
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        status: OrderStatus.CREATED,
        source: (localStorage.getItem('userRole') || 'TALLER') as OrderSource,
        subtotalEstimated: 0,
        authorizedAmount: 0,
        realTotal: 0,
        events: [firstEvent],
        errors: [],
        services: [],
        authorizations: [],
      };

      storageManager.saveRepairOrder(newOrder);
      toast.success(`Orden ${orderId} creada correctamente`);
      navigate(`/taller/ordenes/${id}`);
    } catch (error) {
      console.log('Error creating order:', error);
      toast.error('Ocurrió un error al crear la orden');
      setIsLoading(false);
    }
  };

  // ========== VALIDACIONES ==========

  const canCreate = selectedCustomerId && selectedVehicleId;

  // ========== RENDER ==========

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/taller/ordenes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold mt-2">Crear Nueva Orden</h1>
      </div>

      {/* ========== SECCIÓN: CLIENTE ========== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary uppercase tracking-wide">
            <div className="flex items-center">
              <div className=" bg-lemon w-8 h-8 rounded-full mr-2 flex items-center justify-center">
                <User className="text-primary w-4 h-4" />
              </div>
              Seleccionar Cliente
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAddingCustomer ? (
            <>
              <div>
                <Label htmlFor="customer" className="uppercase text-primary">
                  Cliente *
                </Label>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                >
                  <SelectTrigger
                    id="customer"
                    className="border border-gray-400 mt-2"
                  >
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingCustomer(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar nuevo cliente
              </Button>
            </>
          ) : (
            // Formulario inline para nuevo cliente
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h3 className="font-semibold">Nuevo Cliente</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newCustomerName">Nombre *</Label>
                  <Input
                    {...registerCustomer('name', { required: true })}
                    placeholder="Juan Pérez"
                  />
                  <p className="text-sm text-red-600 mt-1">
                    {customerErrors.name && 'El nombre es obligatorio'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="newCustomerPhone">Teléfono *</Label>
                  <Input
                    {...registerCustomer('phone', { required: true })}
                    placeholder="5551234567"
                  />
                  <p className="text-sm text-red-600 mt-1">
                    {customerErrors.phone && 'El teléfono es obligatorio'}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="newCustomerEmail">Email (opcional)</Label>
                <Input
                  {...registerCustomer('email')}
                  placeholder="cliente@example.com"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmitCustomer(onSubmit)}
                  disabled={!newCustomerName.trim() || !newCustomerPhone.trim()}
                >
                  Guardar cliente
                </Button>
                <Button variant="outline" onClick={cancelAddCustomer}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== SECCIÓN: VEHÍCULO ========== */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <div className=" bg-lemon w-8 h-8 rounded-full mr-2 flex items-center justify-center">
                <User className="text-primary w-4 h-4" />
              </div>
              Seleccionar Vehículo
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedCustomerId ? (
            <p className="text-sm text-gray-500">
              Primero selecciona un cliente
            </p>
          ) : !isAddingVehicle ? (
            <>
              <div>
                <Label htmlFor="vehicle" className="uppercase text-primary">
                  Vehículo *
                </Label>
                <Select
                  value={selectedVehicleId}
                  onValueChange={setSelectedVehicleId}
                >
                  <SelectTrigger
                    id="vehicle"
                    className="border border-gray-400 mt-2"
                  >
                    <SelectValue placeholder="Selecciona un vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No hay vehículos registrados
                      </SelectItem>
                    ) : (
                      vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.model}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingVehicle(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar nuevo vehículo
              </Button>
            </>
          ) : (
            // Formulario inline para nuevo vehículo
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h3 className="font-semibold">Nuevo Vehículo</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newVehiclePlate">Placas *</Label>
                  <Input
                    {...registerVehicle('plate', { required: true })}
                    placeholder="ABC-123"
                  />
                  <p className="text-sm text-red-600 mt-1">
                    {vehicleErrors.plate && 'Las placas son obligatorias'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="newVehicleModel">Modelo *</Label>
                  <Input
                    {...registerVehicle('model', { required: true })}
                    placeholder="Toyota Corolla 2020"
                  />
                  <p className="text-sm text-red-600 mt-1">
                    {vehicleErrors.model && 'El modelo es obligatorio'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmitVehicle(handleAddVehicle)}
                  disabled={!newVehiclePlate.trim() || !newVehicleModel.trim()}
                >
                  Guardar vehículo
                </Button>
                <Button variant="outline" onClick={cancelAddVehicle}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== BOTÓN ========== */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => navigate('/taller/ordenes')}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleCreateOrder}
          disabled={!canCreate || isLoading}
          className="bg-lemon text-primary hover:text-white cursor-pointer"
        >
          {isLoading ? 'Creando...' : 'Crear Orden'}
        </Button>
      </div>
    </div>
  );
}
