# LuigiApp V3 - Frontend Professional Management System

Este es el frontend de **LuigiApp V3**, un sistema integral de Punto de Venta (POS), Gestión de Inventarios y Business Intelligence diseñado para operar en entornos de alta movilidad (Móvil, Tablet y Escritorio).

## 🚀 Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4 + DaisyUI 5
- **Iconografía:** Lucide React
- **Notificaciones:** Sonner
- **Gestión de Estado:** Zustand
- **Posicionamiento Pro:** Floating UI (Portales para Dropdowns y Autocompletes)
- **Validaciones:** Integradas en formularios responsivos

---

## 📂 Estructura del Proyecto

```text
src/
├── app/                # Rutas y páginas principales
├── components/         # Componentes modulares
│   ├── shared/         # UI Genérica (Portales, Autocomplete, Dialogs)
│   ├── pos/            # Lógica de la terminal de venta
│   ├── clientes/       # Modales y tablas de clientes
│   ├── finanzas/       # Resumen y movimientos financieros
│   ├── compras/        # Gestión de abasto y órdenes
│   ├── productos/      # Catálogo maestro y formularios
│   └── inventario/     # Herramientas de campo y ajustes
├── services/           # Capa de comunicación API (Axios Ready)
├── types/              # Definiciones de interfaces (Contrato Frontend-Backend)
└── store/              # Estado global (UI, Carrito, Sesión)
```

---

## 🛠 Módulos y Funcionalidades

### 1. Ventas (POS)
- Terminal de venta rápida con carrito dinámico.
- Historial de ventas con vista híbrida (Cards en móvil / Tabla en PC).
- Buscador global de folios y clientes.

### 2. Inventario Operativo (Field-Ready)
- **Ubicación Dual:** Gestión por Ubicación (Bodega, Tienda) y Ubicación Específica (Pasillo, Estante, Cajón).
- **Ajustes Rápidos:** Entradas y salidas manuales con registro de motivo (Merma, Conteo, etc).
- **Kardex:** Historial detallado de movimientos por cada producto.

### 3. Logística de Compras (Ciclo Inteligente)
- **Flujo de Estado:** Pendiente -> Completada (Recibida).
- **Automatización:** Al marcar una compra como "Completada", el sistema debe:
    1. Aumentar el stock de los productos incluidos.
    2. Generar un registro de "Egreso" en Finanzas automáticamente.
- **Creación On-the-fly:** Registro de nuevos productos sin abandonar el formulario de compra.

### 4. Business Intelligence (Reportes)
- Dashboard analítico con cálculo de Utilidad Bruta, Ticket Promedio y Proyecciones.
- Gráficos de rendimiento semanal y rankings de productos estrella.

### 5. Usuarios y Seguridad
- **Roles:** `administrador` (Acceso total) y `vendedor` (POS y Clientes solamente).
- **Login:** Protección de rutas mediante middleware simulado en `RootLayout`.

---

## 📡 Contrato para el Backend (API Endpoints Requeridos)

Para que el backend sea compatible, debe implementar los siguientes recursos:

### 🔹 Productos & Servicios
- `GET /productos` - Lista completa (incluye ubicaciones y descripciones).
- `POST /productos` - Creación con soporte para imágenes (Base64/URL).
- `PATCH /productos/:id` - Actualización parcial.
- `PATCH /productos/:id/stock` - Incremento/Decremento atómico de existencias.

### 🔹 Compras
- `GET /compras` - Historial de órdenes.
- `POST /compras` - Generar orden (Estado: Pendiente).
- `PUT /compras/:id/status` - Cambiar a 'Completada' (Dispara triggers de stock y finanzas).

### 🔹 Finanzas
- `GET /finanzas/resumen` - Totales de balance, ingresos y egresos.
- `GET /finanzas/movimientos` - Lista de transacciones.
- `POST /finanzas/movimientos` - Crear ingreso/egreso manual.

### 🔹 Clientes & Proveedores
- Crud completo para ambos directorios.

### 🔹 Usuarios
- `POST /auth/login` - Retorna JWT y perfil del usuario (rol).
- `GET /usuarios` - Lista para administración de roles.

---

## 📱 Notas de UX/UI
- **Responsividad:** El sistema utiliza la técnica de *Flow Responsivity* para barras de herramientas y vistas híbridas (Grid/Table) para asegurar operatividad en bodegas.
- **Dropdowns:** No se cortan por el overflow gracias al uso de `FloatingPortal`.

---
*Desarrollado con ❤️ para LuigiApp - 2026*
