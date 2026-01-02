/**
 * Representa una autorización a una orden
 */

export interface Authorization {
    /** Identificador único de la autorización */
    id:string;
    /** Referencia a la orden */
    orderId:string;
    /** Monto autorizado c/IVA, 2 decimales */
    amount:number;
    /** Fecha de creación de la autorización */
    createdAt:string;
    /** Comentarios adicionales sobre la autorización */
    comment?:string;
}