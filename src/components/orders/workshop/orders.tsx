import { useState } from 'react';
import { SearchBar } from '@/components/shared/search-bar';
import { OrdersFilter } from '../orders-filter';
import { TableOrders } from '../orders-table';
import { searchOrders } from '@/lib/storage/orderQueries';
import type { RepairOrder } from '@/models';

interface OrdersProps {
  orders: RepairOrder[];
  handleOrderClick: (orderId: string) => void;
}
export default function Orders({ orders, handleOrderClick }: OrdersProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = searchOrders(orders, searchValue);
  const sortedOrders =
    statusFilter === 'all'
      ? filteredOrders
      : filteredOrders.filter((order) => order.status === statusFilter);

  return (
    <>
      <div className=" mt-6 space-y-6">
        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="w-1/2 md:w-1/3">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Buscar por placa, cliente, modelo"
            />
          </div>
          <OrdersFilter
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          ></OrdersFilter>
        </div>
        {/* Tabla de órdenes */}
        <TableOrders
          orders={sortedOrders}
          onOrderClick={(id) => {
            handleOrderClick(id);
            // navigate(`/taller/ordenes/${id}`);
          }}
        ></TableOrders>
      </div>
    </>
  );
}
