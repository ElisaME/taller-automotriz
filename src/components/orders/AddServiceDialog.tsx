import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useForm, useFieldArray } from 'react-hook-form';
import { formatCurrency, generateId } from '@/lib/utils';
import { storageManager } from '@/lib/storage/storageManager';
import type { Service } from '@/models';
import { toast } from 'sonner';

interface AddServiceDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceAdded: () => void;
}

type ComponentForm = {
  id: string;
  name: string;
  estimated: number;
  description: string;
};
type ServiceForm = {
  id: string;
  name: string;
  laborEstimated: number;
  description: string;
  components: ComponentForm[];
};

export default function AddServiceDialog({
  orderId,
  open,
  onOpenChange,
  onServiceAdded,
}: AddServiceDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ServiceForm>({
    defaultValues: {
      name: '',
      description: '',
      laborEstimated: 0,
      components: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  });
  const [isLoading, setIsLoading] = useState(false);
  const serviceName = watch('name');
  const laborEstimated = watch('laborEstimated');
  const components = watch('components');
  const componentsTotal = components.reduce(
    (sum, c) => sum + (c.estimated || 0),
    0
  );

  const onSubmit = async (data: ServiceForm) => {
    setIsLoading(true);
    try {
      const order = storageManager.getRepairOrder(orderId);
      if (!order) return;

      const service: Service = {
        id: generateId(),
        name: data.name,
        description: data.description,
        laborEstimated: data.laborEstimated,
        laborReal: 0,
        orderId: order.id,
        components: data.components.map((c) => ({
          id: generateId(),
          name: c.name,
          estimated: c.estimated,
          real: 0,
          serviceId: '',
          orderId: order.id,
          description: c.description,
        })),
      };

      order.services.push(service);
      order.subtotalEstimated += data.laborEstimated + componentsTotal;

      storageManager.saveRepairOrder(order);

      onServiceAdded();
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al agregar servicio:', error);
      toast.error('Error al agregar servicio');
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Servicio</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* ========== INFORMACIÓN DEL SERVICIO ========== */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceName" className="mb-2">
                  Nombre del servicio *
                </Label>
                <Input
                  className="border border-gray-400"
                  id="serviceName"
                  {...register('name', { required: true })}
                  placeholder="Ej: Cambio de aceite"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    El nombre del servicio es obligatorio
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="serviceDescription">Descripción</Label>
                <Textarea
                  className="border border-gray-400"
                  id="serviceDescription"
                  {...register('description', { required: true })}
                  placeholder="Descripción detallada del servicio"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    La descripción del servicio es obligatorio
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="laborEstimated">
                  Costo de mano de obra estimado
                </Label>
                <Input
                  className="border border-gray-400"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('laborEstimated', {
                    required: true,
                    valueAsNumber: true,
                    min: { value: 0, message: 'No puede ser negativo' },
                  })}
                />
                {errors.laborEstimated && (
                  <p className="text-sm text-red-600 mt-1">
                    El costo del servicio es obligatorio
                  </p>
                )}
              </div>
            </div>

            {/* ========== COMPONENTES/REFACCIONES ========== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Componentes/Refacciones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      id: generateId(),
                      name: '',
                      estimated: 0,
                      description: '',
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar componente
                </Button>
              </div>

              {/* Lista de componentes */}
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        className="border border-gray-400"
                        {...register(`components.${index}.name`, {
                          required: 'Nombre requerido',
                        })}
                      />
                      {errors.components?.[index]?.name && (
                        <p className="text-sm text-red-600">
                          {errors.components[index].name?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Costo</Label>
                      <Input
                        className="border border-gray-400"
                        type="number"
                        step="1"
                        min="0"
                        {...register(`components.${index}.estimated`, {
                          required: 'Costo requerido',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Costo inválido' },
                        })}
                      />
                      {errors.components?.[index]?.estimated && (
                        <p className="text-sm text-red-600">
                          {errors.components[index].estimated?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* ========== RESUMEN ========== */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mano de obra:</span>
                <span className="font-medium">
                  {formatCurrency(laborEstimated)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Componentes:</span>
                <span className="font-medium">
                  {formatCurrency(componentsTotal)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                <span>Total estimado:</span>
                <span>{formatCurrency(laborEstimated + componentsTotal)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !serviceName.trim()}
            >
              {isLoading ? 'Guardando...' : 'Guardar servicio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
