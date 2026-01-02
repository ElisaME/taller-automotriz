import type { RepairOrder } from "@/models";
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