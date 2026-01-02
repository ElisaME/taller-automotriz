/**
 * Representa un vehículo del taller
 */

export interface Vehicle {
    /** Identificador único del cliente UUID */
    id:string;
    /** Placas del vehículo */
    plate:string;
    /** Modelo del vehículo */
    model:string;
    /** Referencia al cliente dueño del vehículo */
    customerId:string;
}