/* eslint-disable no-case-declarations */
 
import { generateId, getTotalReal } from "@/lib/utils";
import { OrderStatus, type RepairOrder , type Event, EventType, ErrorType, type BusinessError} from "@/models";

type StateTransitions = {
    [key in OrderStatus]: OrderStatus[];
}

//Definir transiciones válidas entre status
export const validTransitionsWorkshop : StateTransitions = {
    [OrderStatus.CREATED]: [
        OrderStatus.DIAGNOSED,
        OrderStatus.CANCELLED
    ],
    [OrderStatus.DIAGNOSED]:[
        OrderStatus.AUTHORIZED,
        OrderStatus.CANCELLED,
        // OrderStatus.WAITING_FOR_APPROVAL,
    ],
    [OrderStatus.AUTHORIZED]:[
        OrderStatus.IN_PROGRESS,
        OrderStatus.CANCELLED
    ],
    [OrderStatus.IN_PROGRESS]:[
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.WAITING_FOR_APPROVAL]:[
        OrderStatus.AUTHORIZED,//sería también una reautorización
        OrderStatus.CANCELLED
    ],
    [OrderStatus.COMPLETED]:[
        OrderStatus.DELIVERED
    ],
    [OrderStatus.DELIVERED]:[],
    [OrderStatus.CANCELLED]:[]
}

/**
 * Excepción personalizada que incluye el BusinessError
 * para poder registrarlo en el catch
 */
export class OrderTransitionError extends Error {
  public readonly businessError: BusinessError;

  constructor(message: string, businessError: BusinessError) {
    super(message);
    this.name = 'OrderTransitionError';
    this.businessError = businessError;
  }
}

export class OrderStatusManager{
    /**
   * Verifica si una transición es válida
   */
    canTransition(from:OrderStatus, to:OrderStatus):boolean{
        const allowedTransitions = validTransitionsWorkshop[from];
        return allowedTransitions.includes(to);
    }

    /**
   * Ejecuta una transición de estado con validaciones
   * @throws Error si la transición no es válida o falla validación crítica
   * @returns Orden actualizada con nuevo estado y posibles errores registrados
   */
    transition(order:RepairOrder, newStatus: OrderStatus): RepairOrder{
        if(!this.canTransition(order.status, newStatus)){
            
            const error = this.createBusinessError(
            order.id,
            ErrorType.INVALID_TRANSITION,
            `Transición no permitida: ${order.status} → ${newStatus}`
        );
        
        throw new OrderTransitionError(
            `Transición no permitida: ${order.status} → ${newStatus}`,
            error
        );
        }

        //Validar reglas de negocio
        this.validateBusinessRules(order, newStatus);

        //===================FALTA LÓGICA ADICIONAL=========================
        //Lógica adicional par validaciones según estado
        //De DIAGNOSED - AUTHORIZED al menos un servicio, subtotal = laborEstimated + components estimated
        //eN aUTHORIZED no se pueden cambiar refacciones
        //Si ya hay un monto autorizado y se intenta cambiar servicios o refacciones se genera error REQUIRES_REAUTH y pasa a WaITING_FOR_APPROVAL
        //Si se intenta autorizar sin servicios se genera error No_Services
        //Si se intenta cambiar servicios o refacciones después de AuTHORIZED se genera error NOT_ALLOWED_AFTER_AUTHORIZATION
        //CUalquier acción después de CANCELLED genera error ORDER_CANCELLED

        //Crear evento
        const event: Event = {
            id: generateId(),
            timeStamp: new Date().toISOString(),
            fromStatus:order.status,
            toStatus: newStatus,
            orderId:order.id,
            type: EventType[newStatus as keyof typeof EventType]
        }

        return {
            ...order,
            status: newStatus,
            events:[...order.events, event],
            // errors:[...order.errors, ...businessErrors]
        }

    }

    private validateBusinessRules(order:RepairOrder, newStatus: OrderStatus): void{
        // const errors: BusinessError[] = [];
        //Reglas de negocio adicionales según transición
        console.log(`Validando reglas de negocio para transición ${order.status} → ${newStatus}`);
        switch(newStatus){
            case OrderStatus.AUTHORIZED:
                if(order.services.length === 0){
                    const error = this.createBusinessError(
                        order.id, 
                        ErrorType.NO_SERVICES, 
                        'No hay servicios en la orden')
                    throw new OrderTransitionError(
                        'No se puede autorizar una orden sin servicios',//NO_SERVICES: 
                        error
                    );
                }
                //Si no hay autorizaciones previas, debe existir al menos una  ?? lo agrego?
                if (order.authorizations.length === 0) {
                    const error = this.createBusinessError(
                        order.id, 
                        ErrorType.MISSING_AUTHORIZATION, 
                        'No hay autorizaciones en la orden')
                    throw new OrderTransitionError(
                        'No hay autorizaciones en la orden',//MISSING_AUTHORIZATION: 
                        error
                    );
                }

                // //El monto autorizado debe ser al menos igual al estimado ?? lo agrego?
                // const estimated = order.subtotalEstimated;
                // const authorized = order.authorizations[order.authorizations.length - 1].amount;
      
                // if (authorized < estimated) {
                //     throw new Error(
                //     `INSUFFICIENT_AUTHORIZATION: Monto autorizado ($${authorized}) es menor al estimado ($${estimated})`
                //     );
                // }
                break;
            case OrderStatus.IN_PROGRESS:
                //Si el costo real excede el autorizado, debe reautorizar
                const realTotal = getTotalReal(order);
                
                if (realTotal > order.authorizedAmount && order.authorizedAmount > 0) {
                const error = this.createBusinessError(
                    order.id,
                    ErrorType.REQUIRES_REAUTH,
                    `El costo real ($${realTotal}) excede el monto autorizado ($${order.authorizedAmount})`
                );
                
                throw new OrderTransitionError(
                    `Requiere reautorización del cliente`, //REQUIRED_REAUTH: 
                    error
                );
                }
                break;
                
            case OrderStatus.CANCELLED:
                //No se permiten acciones si la orden ya está cancelada
                if(order.status === OrderStatus.CANCELLED){
                    const error = this.createBusinessError(
                        order.id, 
                        ErrorType.ORDER_CANCELLED, 
                        'No se permiten acciones en una orden cancelada')
                    throw new OrderTransitionError(
                        'ORDER_CANCELLED: No se permiten acciones en una orden cancelada',
                        error
                    );
                }
                break;
        }
    }

     /**
   * Crea un BusinessError
   */
  private createBusinessError(
    orderId: string,
    type: ErrorType,
    message: string,
  ): BusinessError {
    return {
      id: generateId(),
      orderId,
      timestamp: new Date().toISOString(),
      type,
      message
    };
  }
}   
export const orderStatusManager = new OrderStatusManager();