import {
  orderStatusManager,
  OrderTransitionError,
} from '@/domain/orderStatusManager';
import { storageManager } from '@/lib/storage/storageManager';
import { generateId } from '@/lib/utils';
import { OrderStatus, type Authorization, type RepairOrder } from '@/models';

/**
 * Resultado de una operación sobre una orden
 */
export interface OrderOperationResult {
  success: boolean;
  error?: string;
  order?: RepairOrder;
}

/**
 * Función genérica para ejecutar cualquier transición de estado
 * Maneja automáticamente el registro de errores en caso de fallo
 */
export const transitionOrder = (
  orderId: string,
  newStatus: OrderStatus,
): OrderOperationResult => {
  try {
    const order = storageManager.getRepairOrder(orderId);
    if (!order) {
      return { success: false, error: 'Orden no encontrada' };
    }

    const updatedOrder = orderStatusManager.transition(
      order,
      newStatus,
    );

    storageManager.saveRepairOrder(updatedOrder);

    return { success: true, order: updatedOrder };

  } catch (error) {
    //Si es OrderTransitionError, registrar el BusinessError
    if (error instanceof OrderTransitionError) {
      const order = storageManager.getRepairOrder(orderId);
      
      if (order) {
        const orderWithError = {
          ...order,
          errors: [...order.errors, error.businessError]
        };
        
        storageManager.saveRepairOrder(orderWithError);

        return { 
          success: false, 
          error: error.message,
          order: orderWithError 
        };
      }

      return { success: false, error: error.message };
    }

    // Error inesperado
    console.error('Error inesperado en transición:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error inesperado' 
    };
  }
};

export const authorizeOrder = (orderId: string, authorizedAmount: number, comment:string) => {
  try {
    // gET orden
    const order = storageManager.getRepairOrder(orderId);
    if (!order) throw new Error('Orden no encontrada');

    // Hacer la autorización a la orden
    const updatedOrder = {
      ...order,
      authorizedAmount,
      authorizations: [
        ...order.authorizations,
        {
          id: generateId(),
          orderId: order.id,
          amount: authorizedAmount,
          createdAt: new Date().toISOString(),
          comment: comment,
        },
      ],
    };

    //  Intentar transición
    const orderWithNewStatus = orderStatusManager.transition(
      updatedOrder,
      OrderStatus.AUTHORIZED
    );

    // Guardar
    storageManager.saveRepairOrder(orderWithNewStatus);

    return { success: true, order: orderWithNewStatus };
  } catch (error) {
    // La transición falló por regla de negocio
    if (error instanceof OrderTransitionError) {
      const order = storageManager.getRepairOrder(orderId);

      if (order) {
        // Agregar el error a la orden y guardar
        const orderWithError = {
          ...order,
          errors: [...order.errors, error.businessError],
        };

        storageManager.saveRepairOrder(orderWithError);
      }

      return { success: false, error: error.message };
    }

    // Error inesperado
    console.error('Error inesperado al autorizar:', error);
    return { success: false, error: 'Error inesperado' };
  }
};

/**
 * Reautoriza una orden (cuando se excede el monto)
 * Similar a authorizeOrder pero para reautorizaciones
 */
export const reauthorizeOrder = (
  orderId: string,
  newAuthorizedAmount: number,
  comment?: string
): OrderOperationResult => {
  try {
    const order = storageManager.getRepairOrder(orderId);
    
    if (!order) {
      return { success: false, error: 'Orden no encontrada' };
    }

    // Verificar que esté en WAITING_FOR_APPROVAL
    if (order.status !== OrderStatus.WAITING_FOR_APPROVAL) {
      return { 
        success: false, 
        error: 'La orden no está esperando aprobación' 
      };
    }

    // Crear nueva autorización
    const authorization: Authorization = {
      id: generateId(),
      orderId: order.id,
      amount: newAuthorizedAmount,
      createdAt: new Date().toISOString(),
      comment: comment || 'Reautorización por exceso de monto',
    };

    // Agregar la nueva autorización
    const orderWithReauth = {
      ...order,
      authorizedAmount: newAuthorizedAmount,
      authorizations: [...order.authorizations, authorization],
    };

    // Transición a AUTHORIZED (reautorizada)
    const updatedOrder = orderStatusManager.transition(
      orderWithReauth,
      OrderStatus.AUTHORIZED
    );

    storageManager.saveRepairOrder(updatedOrder);

    return { success: true, order: updatedOrder };

  } catch (error) {
    if (error instanceof OrderTransitionError) {
      const order = storageManager.getRepairOrder(orderId);
      
      if (order) {
        const orderWithError = {
          ...order,
          errors: [...order.errors, error.businessError]
        };
        
        storageManager.saveRepairOrder(orderWithError);

        return { 
          success: false, 
          error: error.message,
          order: orderWithError 
        };
      }

      return { success: false, error: error.message };
    }
   return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error inesperado' 
    };
  }
};