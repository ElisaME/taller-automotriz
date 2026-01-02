import { generateId } from "@/lib/utils";
import { OrderStatus, type RepairOrder , type Event, EventType} from "@/models";

type StateTransitions = {
    [key in OrderStatus]: OrderStatus[];
}

//Definir transiciones válidas entre status
const validTransitions : StateTransitions = {
    [OrderStatus.CREATED]: [
        OrderStatus.DIAGNOSED,
        OrderStatus.CANCELED
    ],
    [OrderStatus.DIAGNOSED]:[
        OrderStatus.AUTHORIZED,
        OrderStatus.CANCELED,
        OrderStatus.WAITING_FOR_APPROVAL,

    ],
    [OrderStatus.AUTHORIZED]:[
        OrderStatus.IN_PROGRESS,
        OrderStatus.CANCELED
    ],
    [OrderStatus.IN_PROGRESS]:[
        OrderStatus.COMPLETED,
        OrderStatus.CANCELED,
    ],
    [OrderStatus.WAITING_FOR_APPROVAL]:[
        OrderStatus.AUTHORIZED,//sería también una reautorización
        OrderStatus.CANCELED
    ],
    [OrderStatus.COMPLETED]:[
        OrderStatus.DELIVERED
    ],
    [OrderStatus.DELIVERED]:[],
    [OrderStatus.CANCELED]:[]
}

export class OrderStatusManager{
    //Validar transición entre estados
    canTransition(from:OrderStatus, to:OrderStatus):boolean{
        const allowedTransitions = validTransitions[from];
        return allowedTransitions.includes(to);
    }

    //Realizar transición entre estados
    transition(order:RepairOrder, newStatus: OrderStatus): RepairOrder{
        if(!this.canTransition(order.status, newStatus)){
            throw new Error('Transición no permitida')
        }

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
            events:[...order.events, event]
        }

    }

}   