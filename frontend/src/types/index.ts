export interface MovimientoFinanciero {
  id: string;
  fecha: string;
  tipo: 'Ingreso' | 'Egreso';
  categoria: 'Venta' | 'Proveedor' | 'Servicios' | 'Renta' | 'Sueldos' | 'Otros';
  monto: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  descripcion: string;
}

export interface ResumenFinanciero {
  balanceTotal: number;
  ingresosMes: number;
  egresosMes: number;
  efectivoEnCaja: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  notas?: string;
  totalCompras: number;
  ultimaVisita: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  costo?: number;
  costoUnitario?: number;
  stock: number;
  sku?: string;
  categoria: string;
  tipo: 'producto' | 'servicio';
  codigoBarras?: string;
  codigoBarrasSecundario?: string;
  imagen?: string;
  descripcion?: string; // Detalle ampliado del producto o servicio
  ubicacion?: string; // Ej: Bodega, Tienda
  ubicacionEspecifica?: string; // Ej: Pasillo 1, Estante A
  createdAt?: string;
  updatedAt?: string;
}

export interface DetalleVenta {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  detalles: DetalleVenta[];
  total: number;
  estado: 'Completada' | 'Pendiente' | 'Cancelada';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReporteResumen {
  ventasHoy: number;
  ticketsPromedio: number;
  transaccionesTotales: number;
  crecimiento: number;
  utilidadBruta: number;
  proyeccionMes: number;
}

export interface ReporteItem {
  id: string;
  nombre: string;
  valor: number;
  cantidad: number;
  porcentaje: number;
}

export interface ReporteDetallado {
  topProductos: ReporteItem[];
  topCategorias: ReporteItem[];
  ventasSemanales: { dia: string, monto: number }[];
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  direccion?: string;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DetalleCompra {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: string;
  fecha: string;
  proveedorId: string;
  proveedorNombre: string;
  detalles: DetalleCompra[];
  total: number;
  estado: 'Completada' | 'Pendiente' | 'Cancelada';
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  createdAt?: string;
  updatedAt?: string;
}

export interface MovimientoInventario {
  id: string;
  productoId: string;
  productoNombre: string;
  tipo: 'Entrada' | 'Salida' | 'Ajuste';
  cantidad: number;
  motivo: string;
  fecha: string;
  usuario?: string;
  stockPrevio: number;
  stockNuevo: number;
}

export type Rol = 'administrador' | 'vendedor';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  avatar?: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
}

export interface ResumenInventario {
  valorTotal: number;
  itemsTotales: number;
  sinStock: number;
}
