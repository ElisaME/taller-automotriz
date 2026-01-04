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
    CANCELLED = "CANCELLED"
}

/**
 * Tipos de eventos en una orden de reparación
 */
export enum EventType {
    CREATED = 'ORDEN_CREADA',
    DIAGNOSED = 'ORDEN_DIAGNOSTICADA',
    AUTHORIZED = 'ORDEN_AUTORIZADA',
    IN_PROGRESS = 'ORDEN_INICIADA',
    REAUTHORIZED = 'ORDEN_REAUTORIZADA',
    COMPLETED = 'ORDEN_COMPLETADA',
    DELIVERED = 'ORDEN_ENTREGADA',
    CANCELED = 'ORDEN_CANCELADA'
}

/** 
 * Tipos de errores
 */
export enum ErrorType {
    INVALID_TRANSITION = 'INVALID_TRANSITION',
    MISSING_AUTHORIZATION = 'MISSING_AUTHORIZATION',
    REQUIRES_REAUTH = 'REQUIRES_REAUTH',
    NO_SERVICES = 'NO_SERVICES',
    NOT_ALLOWED_AFTER_AUTHORIZATION = 'NOT_ALLOWED_AFTER_AUTHORIZATION',
    ORDER_CANCELLED = 'ORDER_CANCELLED'
}

export interface BusinessError {
  id: string;
  orderId: string;
  timestamp: string;
  type: ErrorType;
  message: string;
}
