import { Card, CardContent } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import type { Event } from '@/models';

interface OrderTimelineEventsProps {
  events: Event[];
}
export default function OrderTimelineEvents({
  events,
}: OrderTimelineEventsProps) {
  const variants = {
    ORDEN_CREADA: 'bg-gray-600',
    ORDEN_DIAGNOSTICADA: 'bg-purple-500',
    ORDEN_AUTORIZADA: 'bg-lime-600',
    ORDEN_INICIADA: 'bg-sky-500',
    ORDEN_COMPLETADA: 'bg-blue-500',
    ORDEN_ENTREGADA: 'bg-green-600',
    ORDEN_CANCELADA: 'bg-red-500',
  };
  const labels = {
    ORDEN_CREADA: 'Creada',
    ORDEN_DIAGNOSTICADA: 'Diagnóstico Completo',
    ORDEN_AUTORIZADA: 'Autorizada',
    ORDEN_INICIADA: 'En Progreso',
    ORDEN_COMPLETADA: 'Completada',
    ORDEN_ENTREGADA: 'Entregada',
    ORDEN_CANCELADA: 'Cancelada',
  };

  const labels_status = {
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
    <Card>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-2">
            No hay eventos registrados
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="flex space-x-3">
                {/* Círculo indicador */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      variants[event.type as keyof typeof variants]
                    )}
                  />
                  {index < events.length - 1 && (
                    <div className="w-0.5 h-[70%] bg-gray-300 my-1" />
                  )}
                </div>

                {/* Contenido del evento */}
                <div className="flex-1 pb-4">
                  <p className="font-bold text-secondary">
                    {labels[event.type as keyof typeof labels]}
                  </p>
                  <p className="text-sm text-secondary">
                    {formatDate(event.timeStamp)}
                  </p>
                  {event.fromStatus && event.toStatus && (
                    <p className="text-sm text-primary">
                      {
                        labels_status[
                          event.fromStatus as keyof typeof labels_status
                        ]
                      }{' '}
                      →{' '}
                      {
                        labels_status[
                          event.toStatus as keyof typeof labels_status
                        ]
                      }
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
