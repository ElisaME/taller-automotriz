/**
 * Representa un cliente del taller
 */

export interface Customer {
    /** Identificador único del cliente UUID */
    id:string;
    /** Nombre completo del cliente */
    name:string;
    /** Número de teléfono del cliente */
    phone:string;
    /** Correo electrónico del cliente */
    email?:string;
}