import { EventType, OrderStatus, type Authorization, type Component, type Customer, type RepairOrder, type Service, type Vehicle } from "@/models";
import { storageManager } from "./storageManager"
import { generateId } from "../utils";
import type { OrderSource } from "@/types";

export const seedData = () : void =>{
    // storageManager.clearAll()
    //Revisar si hay datos
    if(storageManager.getAllRepairOrders().length > 0){
        console.log('Data already exists');
        return;
    }

    //Crea clientes
    const customer1 : Customer = {
        id: generateId(),
        name: 'Diana Rosales',
        phone: '5512345654',
        email: 'diana@example.com'
    }
    const customer2 : Customer = {
        id: generateId(),
        name: 'Elisa Martínez',
        phone: '5512345654',
        email: 'elisa@example.com'
    }
    const customer3 : Customer = {
        id: generateId(),
        name: 'José Pérez',
        phone: '5512345654',
        email: 'jose@example.com'
    }

    storageManager.saveCustomer(customer1);
    storageManager.saveCustomer(customer2);
    storageManager.saveCustomer(customer3);

    //Crea vehículos
    const vehicle1 : Vehicle = {
        id: generateId(),
        plate: 'ABC-123',
        model: 'Toyota Corolla 2015',
        customerId: customer1.id
    };
    const vehicle2 : Vehicle = {
        id: generateId(),
        plate: 'DEF-456',
        model: 'Honda Civic 2018',
        customerId: customer1.id
    };
    const vehicle3 : Vehicle = {
        id: generateId(),
        plate: 'OLI-123',
        model: 'Nissan Sentra 2020',
        customerId: customer2.id
    };
    const vehicle4 : Vehicle = {
        id: generateId(),
        plate: 'AKA-456',
        model: 'Renault Sandero 2017',
        customerId: customer3.id
    };

    storageManager.saveVehicle(vehicle1);
    storageManager.saveVehicle(vehicle2);
    storageManager.saveVehicle(vehicle3);
    storageManager.saveVehicle(vehicle4);

    //Crear Componentes
    const componentsAceite : Component[] = [
        {
            id: generateId(),
            name: 'Aceite de motor 5W-30',
            description: 'Acete sintético para motor',
            estimated:500,
            real:0,
            serviceId: ''
        }
    ]

    const componentsFrenos: Component[] = [
        {
        id: generateId(),
        name: 'Balatas delanteras',
        description: 'Juego completo',
        estimated: 800,
        real: 0,
        serviceId:''
        }
    ];

    // Servicios
    const service1: Service = {
        id: generateId(),
        orderId: '',
        name: 'Cambio de aceite y filtro',
        description: 'Servicio regular de mantenimiento',
        laborEstimated: 2,
        laborReal: 0,
        components: componentsAceite,
    };
    

    const service2: Service = {
        id: generateId(),
        orderId: '',
        name: 'Cambio de frenos',
        description: 'Balatas y discos',
        laborEstimated: 5,
        laborReal: 0,
        components: componentsFrenos,
    };


    //Crear órdenes

    const order1 : RepairOrder= {
        id: generateId(),
        orderId : 'RO-0001',
        customerId: customer1.id,
        vehicleId: vehicle1.id,
        status: OrderStatus.CREATED as OrderStatus,
        subtotalEstimated:0,
        authorizedAmount:0,
        realTotal:0,
        source: ' CLIENTE' as OrderSource,
        authorizations:[],
        services:[],
        events:[
            {
                id: generateId(),
                orderId:'',
                type: EventType.CREATED,
                fromStatus:null,
                toStatus: OrderStatus.CREATED,
                timeStamp: new Date().toISOString()
            }
        ],
        errors:[]
    }

    const order2: RepairOrder = {
        id: generateId(),
        orderId: 'RO-0002',
        customerId: customer2.id,
        vehicleId: vehicle3.id, // TODO: Usa un vehículo de customer2
        status: OrderStatus.DIAGNOSED,
        subtotalEstimated: 2200, // TODO: Calcula suma de labor + componentes
        authorizedAmount: 0,
        realTotal: 0,
        source: 'TALLER' as OrderSource,
        
        services: [service1, service2],
        authorizations: [],
        events: [
        {
            id: generateId(),
            orderId: '',
            type: EventType.CREATED,
            fromStatus: null,
            toStatus: OrderStatus.CREATED,
            timeStamp: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
        },
        {
            id: generateId(),
            orderId: '',
            type: EventType.DIAGNOSED,
            fromStatus: OrderStatus.CREATED,
            toStatus: OrderStatus.DIAGNOSED,
            timeStamp: new Date().toISOString(),
        }
        ],
        errors: [],
    };

    //Crear Autorización
     const authorization1: Authorization = {
        id: generateId(),
        orderId: '', 
        amount: 2500,
        createdAt: new Date().toISOString(),
        comment: 'Cliente aprobó la reparación',
  };

  const order3: RepairOrder = {
    id: generateId(),
    orderId: 'RO-0003',
     customerId: customer3.id,
        vehicleId: vehicle4.id, // TODO: Usa un vehículo de customer2
        subtotalEstimated: 2200, // TODO: Calcula suma de labor + componentes
        authorizedAmount: 2500,
        realTotal: 0,
        source: 'TALLER' as OrderSource,
        services: [service2],
        events: [
        {
            id: generateId(),
            orderId: '',
            type: EventType.CREATED,
            fromStatus: null,
            toStatus: OrderStatus.CREATED,
            timeStamp: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
        },
        {
            id: generateId(),
            orderId: '',
            type: EventType.DIAGNOSED,
            fromStatus: OrderStatus.CREATED,
            toStatus: OrderStatus.DIAGNOSED,
            timeStamp: new Date().toISOString(),
        }
        ],
        errors: [],
        status: OrderStatus.AUTHORIZED,
        authorizations: [authorization1],

        
    }

    //Hacer relaciones iniciales y fuardar ordene
     service1.orderId = order2.id;
    service2.orderId = order2.id;
    authorization1.orderId = order3.id;
    order1.events[0].orderId = order1.id;
    order2.events[0].orderId = order2.id;
    order2.events[1].orderId = order2.id; 
    order3.events[0].orderId = order3.id;
    order3.events[1].orderId = order3.id;
    storageManager.saveRepairOrder(order1);
    storageManager.saveRepairOrder(order2);
    storageManager.saveRepairOrder(order3);

    console.log('✅ Base de datos inicializada con éxito');
    console.log(`- ${storageManager.getAllCustomers().length} clientes`);
    console.log(`- ${storageManager.getAllVehicles().length} vehículos`);
    console.log(`- ${storageManager.getAllRepairOrders().length} órdenes`);
  };