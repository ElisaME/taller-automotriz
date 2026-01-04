import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from '../ui/select';

interface OrdersFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}
export function OrdersFilter({
  currentFilter,
  onFilterChange,
}: OrdersFilterProps) {
  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'CREATED', label: 'Creada' },
    { value: 'DIAGNOSED', label: 'Diagnóstico Completo' },
    { value: 'WAITING-APPROVAL', label: 'Esperando Aprobación' },
    { value: 'AUTHORIZED', label: 'Autorizada' },
    { value: 'IN-PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completada' },
    { value: 'DELIVERED', label: 'Entregada' },
    { value: 'CANCELLED', label: 'Cancelada' },
  ];
  return (
    <div className="w-1/2 md:w-1/4">
      <Select value={currentFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full border-gray-400 bg-gray-300/50 pl-10 text-secondary placeholder:text-secondary focus-visible:ring-lemon">
          <SelectValue placeholder="Selecciona un Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Estados</SelectLabel>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                onClick={() => onFilterChange(filter.value)}
              >
                {filter.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
