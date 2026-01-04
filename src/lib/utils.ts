import type { Component, RepairOrder } from "@/models";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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