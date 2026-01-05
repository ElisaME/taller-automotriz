import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Wrench } from 'lucide-react';
import { formatCurrency, getTotalComponents } from '@/lib/utils';
import type { Service } from '@/models';
import { Button } from '@/components/ui/button';
import { storageManager } from '@/lib/storage/storageManager';

interface OrderServicesProps {
  services: Service[];
  openEditDialog?: (serviceId: Service) => void;
}

export default function OrderServiceItems({
  services,
  openEditDialog,
}: OrderServicesProps) {
  const role = storageManager.getUserRole();
  return (
    <>
      <div className="overflow-hidden rounded-lg bg-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="uppercase text-primary tracking-wide">
              <TableHead className="w-60 text-primary">Descripción</TableHead>
              <TableHead className="text-primary">Tipo</TableHead>
              <TableHead className="text-primary">
                Mano de Obra Estimado
              </TableHead>
              {role === 'TALLER' && (
                <>
                  <TableHead className="text-primary">
                    Mano de Obra Real
                  </TableHead>
                  <TableHead className="text-primary">Acciones</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
        </Table>
        {services.map((service) => (
          <div key={service.id} className="rounded-lg text-secondary">
            <Table>
              <TableBody>
                <TableRow className="border-t border-gray-300">
                  <TableCell className="w-60">
                    <p className="text-md">{service.name}</p>
                  </TableCell>
                  <TableCell className="text-blue-500">Servicio</TableCell>
                  <TableCell>
                    {formatCurrency(service.laborEstimated)}
                  </TableCell>
                  {role === 'TALLER' && openEditDialog && (
                    <>
                      <TableCell>
                        {service.laborReal > 0
                          ? formatCurrency(service.laborReal)
                          : 'Pendiente'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          className="cursor-pointer"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    {service.components.length > 0 && (
                      <div className="my-2 ml-7 border border-gray-300 p-4 rounded-lg">
                        <div className="font-medium text-secondary mb-2 flex items-center uppercase text-xs">
                          <Wrench className="h-5 w-5 text-secondary mr-2" />
                          Refacciones asociadas
                        </div>
                        <div className="space-y-1 pl-4">
                          <Table>
                            <TableHeader>
                              <TableRow className="text-xs border-b border-gray-300">
                                <TableHead className="text-primary">
                                  Refacción
                                </TableHead>
                                <TableHead className="text-primary">
                                  Costo Estimado
                                </TableHead>
                                <TableHead className="text-primary">
                                  Costo Real
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {service.components.map((component) => (
                                <TableRow key={component.id}>
                                  <TableCell className="">
                                    {component.name}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(component.estimated)}
                                  </TableCell>
                                  <TableCell>
                                    {component.real > 0
                                      ? formatCurrency(component.real)
                                      : 'Pendiente'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell className="font-bold">
                                  Total Refacciones
                                </TableCell>
                                <TableCell className="font-bold">
                                  {formatCurrency(
                                    getTotalComponents(service.components)
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </>
  );
}
