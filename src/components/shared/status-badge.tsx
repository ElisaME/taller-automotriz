import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/models';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    CREATED: 'bg-gray-600/10 text-gray-600 border-gray-600/20',
    DIAGNOSED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    AUTHORIZED: 'bg-lime-600/10 text-lime-600 border-lime-600/20',
    IN_PROGRESS: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    WAITING_FOR_APPROVAL: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    DELIVERED: 'bg-green-600/10 text-green-600 border-green-600/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const labels = {
    CREATED: 'Creada',
    DIAGNOSED: 'Diagnóstico Completo',
    AUTHORIZED: 'Autorizada',
    IN_PROGRESS: 'En Progreso',
    WAITING_FOR_APPROVAL: 'Esperando Aprobación',
    COMPLETED: 'Completada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada',
  };

  return (
    <Badge
      className={cn(
        'font-medium text-xs border px-3 py-1',
        variants[OrderStatus[status] as keyof typeof variants],
        className
      )}
    >
      {labels[OrderStatus[status] as keyof typeof labels]}
    </Badge>
  );
}
