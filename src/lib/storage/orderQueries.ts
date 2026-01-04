//Queries para filtrados de dashboard de taller

import type { RepairOrder } from "@/models";
import { storageManager } from "./storageManager";

const normalizeString = (value:string) : string => {
    return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // acentos
    .trim();
}

export const searchOrders = ( query:string) : RepairOrder[] => {
    const value = normalizeString(query)
    return storageManager
        .getAllRepairOrders()
        .filter(order => {
            const vehicle = storageManager.getVehicle(order.vehicleId);
            const customer = storageManager.getCustomer(order.customerId);
            if(!vehicle || !customer) return false;
            return (
                customer && vehicle && (
                    normalizeString(customer.name).includes(value) ||
                    normalizeString(vehicle.plate).includes(value) ||
                    normalizeString(vehicle.model).includes(value) ||
                    normalizeString(order.orderId).includes(value)
                )
            )
        })
    
}