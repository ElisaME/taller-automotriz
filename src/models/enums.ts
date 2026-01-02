/**
 * Estados posibles de la orden de reparaciòn
 */
export enum OrderStatus {
    CREATED = "CREATED",
    DIAGNOSED = "DIAGNOSED",
    AUTHORIZED = "AUTHORIZED",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL",
    COMPLETED = "COMPLETED",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED"
}

/**
 * Origen de una orden de reparación
 */
export type OrderSource = 'TALLER' | ' CLIENTE';

/**
 * Tipos de eventos en una orden de reparación
 */
export enum EventType {
    ORDEN_CREADA = 'ORDEN_CREADA',
    ORDEN_DIAGNOSTICADA = 'ORDEN_DIAGNOSTICADA',
    ORDEN_AUTORIZADA = 'ORDEN_AUTORIZADA',
    ORDEN_INICIADA = 'ORDEN_INICIADA',
    ORDEN_REAUTORIZADA = 'ORDEN_REAUTORIZADA',
    ORDEN_COMPLETADA = 'ORDEN_COMPLETADA',
    ORDEN_ENTREGADA = 'ORDEN_ENTREGADA',
    ORDEN_CANCELADA = 'ORDEN_CANCELADA'
}
