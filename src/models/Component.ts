/**
 * Representa un componente o refacción
 */

export interface Component {
    /** Identificador único del componente */
    id:string;
    /** Referencia al servicio */
    serviceId:string;
    /** Nombre del componente/refacción */
    name:string;
    /** Descripción del componente/refacción */
    description:string;
    /** Costo estimado del componente/refacción */
    estimated:number;
    /** Costo real del componente/refacción */
    real:number;
}