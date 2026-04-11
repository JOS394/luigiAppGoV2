
  🚀 Especificaciones para el Backend de LuigiApp V3

  Este documento resume la estructura y necesidades del frontend (Next.js + TypeScript) para facilitar
  la creación de una API compatible.

  📋 Resumen del Proyecto
  LuigiApp V3 es un sistema ERP/Punto de Venta (POS) para una papelería/centro de servicios.
   - Frontend Stack: Next.js 15, TypeScript, TailwindCSS.
   - Estado Actual: Frontend funcional con datos "Mock" (simulados) y servicios asíncronos definidos
     en src/services/api.ts.

  ---

  🏗️ Modelos de Datos (Entidades)

  Basado en frontend/src/types/index.ts, el backend debe soportar las siguientes entidades:

  1. Inventario & Productos
   - Producto: id, nombre, precio, stock, categoria, tipo ('producto'|'servicio'), codigoBarras,
     imagen, descripcion, ubicacion, ubicacionEspecifica.
   - Movimiento de Inventario: Historial de Entrada, Salida o Ajuste con motivo y cantidad.

  2. Ventas (POS)
   - Venta: id, fecha, cliente, total, estado ('Completada'|'Pendiente'|'Cancelada').
   - DetalleVenta: productoId, cantidad, precioUnitario, subtotal.

  3. Finanzas
   - MovimientoFinanciero: id, fecha, tipo ('Ingreso'|'Egreso'), categoria ('Venta', 'Proveedor',
     'Servicios', 'Renta', 'Sueldos', 'Otros'), monto, metodoPago, descripcion.
   - ResumenFinanciero: Balance total, ingresos/egresos del mes, efectivo en caja.

  4. Compras & Proveedores
   - Proveedor: id, nombre, contacto, telefono, direccion, categoria.
   - Compra: id, fecha, proveedorId, total, estado, detalles (lista de productos comprados).

  5. Gestión de Usuarios
   - Usuario: id, nombre, email, rol ('administrador'|'vendedor'), estado ('Activo'|'Inactivo').

  ---

  🛠️ Requerimientos de la API (Endpoints Necesarios)

  El frontend ya espera los siguientes servicios (definidos en apiService):

  GET /api/productos
   - CRUD completo.
   - PATCH /api/productos/:id/stock: Actualización rápida de existencias.

  POST /api/ventas
   - Registrar una venta y sus detalles.
   - Regla de Negocio: Al crear una venta, se debe restar automáticamente el stock de los productos
     vendidos (si no son servicios) y generar un MovimientoFinanciero de tipo Ingreso.

  GET /api/inventario/resumen
   - Calcular valor total del inventario, items totales y productos sin stock.

  POST /api/finanzas/movimientos
   - CRUD de movimientos manuales (gastos de luz, renta, etc.).

  GET /api/reportes/resumen
   - Estadísticas: Ventas de hoy, ticket promedio, transacciones totales, crecimiento (%).

  ---

  🔐 Autenticación y Seguridad
   - El sistema maneja roles: administrador y vendedor.
   - El administrador tiene acceso total; el vendedor está limitado a Ventas y POS (por definir en
     backend).

  ---

  💡 Notas para la Implementación (Lógica de Negocio)
   1. Tipos vs Servicios: Diferenciar entre un "Producto" (físico, descuenta stock) y un "Servicio"
      (ej. Impresiones, stock infinito/9999).
   2. Integración: Cada venta o compra de mercancía debe impactar automáticamente el módulo de
      Finanzas (Balance) y el de Inventario (Stock).
   3. Identificadores: El frontend utiliza prefijos en los IDs (ej: P-001 para productos, V-001 para
      ventas, C-001 para clientes). Sería ideal mantener esta convención o adaptarla.

  ---

  Instrucción para la IA del Backend:
  > "Basado en estos modelos y servicios, genera una API (preferiblemente usando Node.js/Express,
  Python/FastAPI o el lenguaje de tu elección) que persista los datos en una base de datos. Asegúrate
  de incluir los endpoints CRUD para cada módulo y la lógica de negocio para la sincronización entre
  Ventas -> Inventario -> Finanzas."

  ---