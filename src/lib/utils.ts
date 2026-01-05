import { OrderStatus, type Component, type RepairOrder } from "@/models";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TransitionAction } from '@/types';
import { validTransitionsWorkshop } from "@/domain/orderStatusManager";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un identificador único UUID
 * @returns string
 */
export const generateId = ():string => {
  return crypto.randomUUID();
}

export const generateOrderId = (existingOrders: RepairOrder[]): string => {
  if(existingOrders.length === 0) {
    return 'RO-0001';
  }
  const lastOrder = existingOrders.reduce((prev, current) => {
    return (prev.orderId > current.orderId) ? prev : current;
  });
  const lastOrderNumber = parseInt(lastOrder.orderId.split('-')[1]);
  const newOrderNumber = (lastOrderNumber + 1).toString().padStart(4, '0');
  return `RO-${newOrderNumber}`;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount);
}

export const getTotalComponents = (components : Component[]) : number => {
  return components.reduce((total, component) => total + component.estimated, 0);
}
export const getTotalServicesLabor = (services : RepairOrder["services"]) : number => {
  return services.reduce((total, service) => total + service.laborEstimated, 0);
}

export const getTotalReal = (order : RepairOrder) : number => {
  return order.services.reduce((total, service) => {
      const laborCost = service.laborReal > 0 ? service.laborReal : service.laborEstimated;
      const componentsCost = service.components.reduce(
        (sum, comp) => sum + (comp.real > 0 ? comp.real : comp.estimated),
        0
      );
      return total + laborCost + componentsCost;
    }, 0);
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
   year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
  });
}

export const transitionActionsWorkshop: Record<OrderStatus, TransitionAction> = {
  [OrderStatus.DIAGNOSED]: { label: 'Diagnosticar', variant: 'bg-gray-600' },
  [OrderStatus.AUTHORIZED]: { label: ''},//Solo el cliente autoriza
  [OrderStatus.IN_PROGRESS]: { label: 'Iniciar reparación', variant: 'bg-sky-500' },
  [OrderStatus.COMPLETED]: { label: 'Completar reparación', variant: 'bg-blue-500' },
  [OrderStatus.DELIVERED]: { label: 'Entregar vehículo', variant: 'primary' },
  [OrderStatus.CANCELLED]: { label: 'Cancelar orden', variant: 'bg-red-500' },
  [OrderStatus.WAITING_FOR_APPROVAL]: { label: 'Solicitar reautorización', variant: 'bg-amber-500' },
  [OrderStatus.CREATED]: { label: '' }, //NA
};

export const transitionActionsClient: Record<OrderStatus, TransitionAction> = {
  [OrderStatus.DIAGNOSED]: { label: '' },
  [OrderStatus.AUTHORIZED]: { label: 'Autorizar', variant: 'bg-green-500'},//Solo el cliente autoriza
  [OrderStatus.IN_PROGRESS]: { label: '' },
  [OrderStatus.COMPLETED]: { label: '' },
  [OrderStatus.DELIVERED]: { label: '' },
  [OrderStatus.CANCELLED]: { label: '' },
  [OrderStatus.WAITING_FOR_APPROVAL]: { label: '' },
  [OrderStatus.CREATED]: { label: '' }, //NA
};

export const getAvailableTransitions = (
  currentStatus: OrderStatus
): OrderStatus[] => {
  return validTransitionsWorkshop[currentStatus] ?? [];
};