import type { RepairOrder } from '@/models';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { storageManager } from '@/lib/storage/storageManager';
import { StatusBadge } from '../shared/status-badge';

interface TableOrdersProps {
  orders: RepairOrder[];
  onOrderClick: (orderId: string) => void;
}

export function TableOrders({ orders, onOrderClick }: TableOrdersProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-300">
              <TableHead className="text-primary">ID Orden</TableHead>
              <TableHead className="text-primary">Vehículo</TableHead>
              <TableHead className="text-primary">Placa</TableHead>
              <TableHead className="text-primary">Cliente</TableHead>
              <TableHead className="text-primary">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const vehicle = storageManager.getVehicle(order.vehicleId);
              const customer = storageManager.getCustomer(order.customerId);
              if (!vehicle || !customer) return null;
              return (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-300 font-light"
                  onClick={() => onOrderClick(order.id)}
                >
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.plate}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
