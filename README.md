# 🛠️ Taller Automotriz – Gestión de Órdenes de Reparación

Aplicación web para la **gestión de órdenes de reparación de un taller automotriz**, que permite registrar clientes, vehículos, servicios, refacciones y controlar el flujo completo de una orden desde su creación hasta la entrega del auto.

El proyecto busca tener **buenas prácticas de frontend** que permitan su escalabilidad y mantenimiento, para este ejercicio se tomaron en cuenta las reglas de negocio proporcionadas, se emplearon mocks almacenados en localStorage simulando un entorno real sin backend.

---

## 🚀 Funcionalidades principales

### 👤 Gestión de usuarios (simulada)

- Se creo una pantalla principal para elegir el rol del usuario:
  - **TALLER**
  - **CLIENTE**
- El rol seleccionado persiste en `localStorage`
- Rutas protegidas según rol

### 📋 Órdenes de reparación

- El rol del taller permite crear órdenes asociadas a cliente y vehículo o bien crear nuevos.
- Nota: El rol del cliente no tiene la opción de crear ordenes por el momento.
- Flujo de estados:
  - `CREATED`
  - `DIAGNOSED`
  - `WAITING_FOR_APPROVAL`
  - `AUTHORIZED`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `DELIVERED`
  - `CANCELLED`
- Se implementó la validación de transiciones permitidas entre estados de acuerdo a las reglas de negocio.

### 🔧 Servicios y refacciones

- Se pueden agregar y editar servicios dentro de una orden mientras esté en estado de Creación o Diagnóstico.
- Cada servicio puede contener:
  - Mano de obra estimada y real (resta editar el monto real)
  - Refacciones / componentes
- Se puede editar un servicio para:
  - Crear refacciones
  - Editar refacciones
  - Eliminar refacciones
- Reutilización del mismo formulario para **crear y editar** servicios

### 💰 Autorización de órdenes

- El rol del cliente puede autorizar una orden y autorizar un monto
- Advertencia cuando el monto autorizado es menor al estimado
- Registro de comentarios del cliente
- Pendiente mostrar registro de autorizaciones en vista del Taller.

### 🔍 Búsqueda y filtros

- Búsqueda global de órdenes por:
  - Placas del vehículo
  - Nombre del cliente
  - Modelo del vehículo

---

## 🧱 Arquitectura y decisiones técnicas

- **React + TypeScript**
- **React Router DOM** para navegación
- **React Hook Form** para manejo de formularios
- **Componentes shadcn** componentes pre-construidos de fácil personalización
- Formularios reutilizables (create / edit)
- Estado global simple mediante **Context API**
- Persistencia con `localStorage` simulando un backend
- Separación clara entre:
  - Componentes contenedores
  - Componentes presentacionales
  - Lógica de negocio (services / storage)

---

## 🧠 Manejo de estado

- `AuthContext` para el rol del usuario
- `storageManager` como capa de acceso a datos del localStorage
- Estados locales para modales y formularios
- `useEffect` controlado para carga inicial de datos

---

## 📝 Validaciones

- Validaciones declarativas con `react-hook-form`
- Campos obligatorios
- Validaciones numéricas (mínimos, positivos)
- Manejo de errores visuales y de submit

---

## 📦 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/ElisaME/taller-automotriz.git

# Entrar al proyecto
cd taller-automotriz

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## Comentarios finales

Por último quisiera compartir algunos comentarios, este fue un reto muy interesante de realizar, la prueba contemplaba un alcance considerable, cercano al desarrollo de un módulo completo de la aplicación. Dentro del tiempo asignado, me enfoqué en resolver los casos más representativos y de constuir una base sólida y escalable con el objetico de demostrar mi forma de trabajar y toma de decisiones.

Dentro de las cosas que me gustaría completar están: la creación de órdenes con el rol de cliente, pulir la experiencia móvil, realizar unit testing e incorporar animaciones para una mejor experiencia de usuario.
