/**
 * Representa una orden de reparación del taller
 */

import type { OrderSource } from "@/types";
import type { Authorization } from "./Authorization";
import type { OrderStatus } from "./enums";
import type { Event } from "./Event";
import type { Service } from "./Service";

export interface RepairOrder {
    /** Identificador único dela orden */
    id:string;
    /** Folio visible de la orden */
    orderId:string;
    /** Referencia al cliente */
    customerId:string;
    /** Referencia al vehìculo */
    vehicleId:string;
    /** Status de la orden */
    status:OrderStatus;
    /** subtotal estimado de la orden */
    subtotalEstimated:number;
    /** Monto autorizado */
    authorizedAmount:number;
    /** Monto real total */
    realTotal:number;
    /** Lista de Autorizaciones */
    authorizations:Authorization[];
    /** Lista de servicios/reparaciones asociados */
    services:Service[];
    /** Historial de eventos */
    events:Event[];
    /** Lista de errores de negocio asociados */
    errors:string[]; //Falta definirlos
    /** Lista de errores de negocio asociados */
    source:OrderSource;
}