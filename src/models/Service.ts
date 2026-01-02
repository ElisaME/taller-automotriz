/**
 * Representa un servicio o reparación del taller
 */

import type { Component } from "./Component";

export interface Service {
    /** Identificador único del servicio */
    id:string;
    /** Referencia a la orden */
    orderId:string;
    /** Nombre del servicio */
    name:string;
    /** Descripción del servicio */
    description:string;
    /** Valor estimado de mano de obra */
    laborEstimated:number;
    /** Valor real de mano de obra */
    laborReal:number;
    /** Componentes o refacciones asociados */
    components: Component[];
}