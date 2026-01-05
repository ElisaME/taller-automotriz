import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';
import { authorizeOrder } from '@/hooks/orderService';
import type { RepairOrder } from '@/models';

interface AuthorizeOrderDialogProps {
  order: RepairOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface AuthorizationFormData {
  amount: number;
  comment?: string;
}

export default function AuthorizeOrderDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: AuthorizeOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AuthorizationFormData>({
    defaultValues: {
      amount: order?.subtotalEstimated || 0,
      comment: '',
    },
    mode: 'onSubmit',
  });

  const watchedAmount = watch('amount');

  useEffect(() => {
    if (order) {
      reset({
        amount: order.subtotalEstimated,
        comment: '',
      });
    }
  }, [open, order, reset]);

  const onSubmit = async (data: AuthorizationFormData) => {
    if (!order) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // TODO:
    // 1. Llamar a authorizeOrder(order.id, data.amount, data.comment)
    // 2. Si result.success:
    //    - Llamar onSuccess()
    //    - Cerrar modal
    //    - Reset form
    // 3. Si result.error:
    //    - Mostrar error en setError()

    try {
      const result = authorizeOrder(order.id, data.amount, data.comment || '');

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setSubmitError(result.error || 'Error al autorizar la orden');
      }
    } catch (error) {
      setSubmitError('Error inesperado al autorizar');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onOpenChange(false);
  };

  if (!order) return null;

  const subtotalEstimated = order.subtotalEstimated;
  const isAmountLower = watchedAmount > 0 && watchedAmount < subtotalEstimated;
  const difference = subtotalEstimated - watchedAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Autorizar Orden {order.orderId}</DialogTitle>
          <DialogDescription>
            Registra el monto autorizado por el cliente para iniciar la
            reparación
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/*  RESUMEN  */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm">Resumen de servicios</h4>

            {order.services.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay servicios registrados
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {order.services.map((service) => (
                  <li key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span className="font-medium">
                      $
                      {(
                        service.laborEstimated +
                        service.components.reduce(
                          (sum, c) => sum + c.estimated,
                          0
                        )
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Subtotal estimado:</span>
              <span>${subtotalEstimated.toFixed(2)}</span>
            </div>
          </div>

          {/*  MONTO AUTORIZADO  */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto autorizado por el cliente *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-9"
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/*  ADVERTENCIA SI EL MONTO ES MENOR  */}
          {isAmountLower && (
            <p className="text-sm text-red-600 flex items-center">
              El monto autorizado (${watchedAmount.toFixed(2)}) es{' '}
              <strong>${difference.toFixed(2)}</strong> menor al estimado.
            </p>
          )}

          {/*  COMENTARIO  */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comentarios / Notas (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Comentarios"
              rows={3}
              {...register('comment')}
            />
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment.message}</p>
            )}
          </div>

          {/* ERROR */}
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          {/*  FOOTER  */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Autorizando...' : 'Autorizar orden'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
