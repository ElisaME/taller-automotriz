import type { Component, Customer, RepairOrder, Service, Vehicle } from "@/models";

class StorageManager {
    private readonly KEYS = {
        ORDERS:'taller_orders',
        CUSTOMERS: 'taller_customers',
        VEHICLES: 'taller_vehicles',
        SERVICES : 'taller_services',
        COMPONENTS: 'taller_components'
    };
     
    /**
     * Función auxiliar para guardar data en localStorage
     * @param key Nombre de la llave
     * @param data Contenido 
     */
    private saveToStorage(key: string, data: unknown) : void{
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error al guardar:', error);
            throw new Error('Error al guardar')
        }
    }
    
     /**
     * Función auxiliar para leer data de localStorage
     * @param key Nombre de la llave que queremos leer
     */
    private readFromStorage<T>(key: string) : T[]{
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) as T[] : [];
        } catch (error) {
            console.error('Error al leer información:', error);
            return []
        }
    }

    //============CUSTOMERS=============
    getAllCustomers() : Customer[]{
        return this.readFromStorage<Customer>(this.KEYS.CUSTOMERS);
    }

    getCustomer(id:string): Customer | null{
        const customers = this.getAllCustomers();
        return customers.find(c=> c.id === id) || null;
    }

    //Para el seeder
    saveCustomer(customer:Customer):void {
        const customers = this.getAllCustomers();
        const customerIndex = customers.findIndex(c => c.id === customer.id);
        if (customerIndex >= 0) {
            customers[customerIndex] = customer;
        }else{
            customers.push(customer);
        }
        this.saveToStorage(this.KEYS.CUSTOMERS, customers);
    }

    //============VEHICLES=============
    getAllVehicles(): Vehicle[]{
        return this.readFromStorage<Vehicle>(this.KEYS.VEHICLES);
    }

    getVehicle(id:string): Vehicle | null{
        const vehicles = this.getAllVehicles();
        return vehicles.find(v=> v.id === id) || null;
    }

    getVehicleByCustomer(customerId:string): Vehicle[]{
        const vehicles = this.getAllVehicles();
        return vehicles.filter(v=> v.customerId === customerId);
    }

    //Para el seeder
    saveVehicle(vehicle:Vehicle):void {
        const vehicles = this.getAllVehicles();
        const vehicleIndex = vehicles.findIndex(c => c.id === vehicle.id);
        if (vehicleIndex >= 0) {
            vehicles[vehicleIndex] = vehicle;
        }else{
            vehicles.push(vehicle);
        }
        this.saveToStorage(this.KEYS.VEHICLES, vehicles);
    }

    //============REPAIR ORDERS=============
    getAllRepairOrders() {
        return this.readFromStorage<RepairOrder>(this.KEYS.ORDERS);
    }

    getRepairOrder(id:string) : RepairOrder | null {
        const orders = this.getAllRepairOrders();
        return orders.find(o=> o.id === id) || null;
    }

    saveRepairOrder(order:RepairOrder):void {
        const orders = this.getAllRepairOrders();
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex >= 0) {
            orders[orderIndex] = order;
        }else{
            orders.push(order);
        }
        this.saveToStorage(this.KEYS.ORDERS, orders);
    }

    getOrdersByCustomer(customerId:string): RepairOrder[] {
        const orders = this.getAllRepairOrders();
        return orders.filter(o=> o.customerId === customerId);
    }

    //==========COMPONENTS===========
    getAllComponents() {
        return this.readFromStorage<Component>(this.KEYS.COMPONENTS);
    }

    getComponent(id:string) : Component | null {
        const components = this.getAllComponents();
        return components.find(s=> s.id === id) || null;
    }

    saveComponent(component:Component):void {
        const components = this.getAllComponents();
        const componentIndex = components.findIndex(s => s.id === component.id);
         if (componentIndex >= 0) {
            components[componentIndex] = component;
        }else{
            components.push(component);
        }
        this.saveToStorage(this.KEYS.COMPONENTS, components);
    }

    //==========SERVICES===========
    getAllServices() {
        return this.readFromStorage<Service>(this.KEYS.SERVICES);
    }

    getService(id:string) : Service | null {
        const services = this.getAllServices();
        return services.find(s=> s.id === id) || null;
    }

    saveService(service:Service):void {
        const services = this.getAllServices();
        const serviceIndex = services.findIndex(s => s.id === service.id);
         if (serviceIndex >= 0) {
            services[serviceIndex] = service;
        }else{
            services.push(service);
        }
        this.saveToStorage(this.KEYS.SERVICES, services);
    }

    //Role
    getUserRole(): string | null {
        return localStorage.getItem('user-role');
    }

    //Para testing
    clearAll(): void{
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    }
}

export const storageManager = new StorageManager();