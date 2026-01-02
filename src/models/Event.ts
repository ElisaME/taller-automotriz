/**
 * Representa un evento de una orden
 */

import type { EventType, OrderStatus } from "./enums";

export interface Event {
    /** Identificador único del evento */
    id:string;
    /** Referencia a la orden */
    orderId:string;
    /** Monto autorizado c/IVA, 2 decimales */
    type:EventType;
    /** Estado anterior de la orden */
    fromStatus?:OrderStatus | undefined | null;
    /** Estado nuevo de la orden */
    toStatus?:OrderStatus | undefined | null;
    /** Fecha y hora del evento */
    timeStamp:string;
}