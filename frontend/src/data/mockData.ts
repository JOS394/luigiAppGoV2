import type { 
  Producto, Venta, ReporteResumen, Cliente, 
  MovimientoFinanciero, ResumenFinanciero,
  Proveedor, Compra, ResumenCompras
} from '../types';

export const MOCK_PROVEEDORES: Proveedor[] = [
  {
    id: 'PR-001',
    nombre: 'Distribuidora Pedregal',
    contacto: 'Sr. Alberto Ramos',
    telefono: '555-9876',
    direccion: 'Zona Industrial Sur #45',
    categoria: 'Papelería'
  },
  {
    id: 'PR-002',
    nombre: 'Papeles de México S.A.',
    contacto: 'Lic. Martha Silva',
    telefono: '555-1122',
    direccion: 'Av. Constituyentes 405',
    categoria: 'Hojas y Resmas'
  }
];

export const MOCK_COMPRAS: Compra[] = [
  {
    id: 'B-001',
    fecha: new Date().toISOString(),
    proveedorId: 'PR-001',
    proveedorNombre: 'Distribuidora Pedregal',
    total: 8500.00,
    estado: 'Completada',
    metodoPago: 'Transferencia',
    detalles: [
      { productoId: 'P-001', productoNombre: 'Cuaderno Profesional', cantidad: 100, costoUnitario: 65.00, subtotal: 6500.00 },
      { productoId: 'P-002', productoNombre: 'Caja Lápices HB', cantidad: 50, costoUnitario: 40.00, subtotal: 2000.00 }
    ]
  },
  {
    id: 'B-002',
    fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
    proveedorId: 'PR-002',
    proveedorNombre: 'Papeles de México S.A.',
    total: 12500.00,
    estado: 'Pendiente',
    metodoPago: 'Transferencia',
    detalles: [
      { productoId: 'P-004', productoNombre: 'Resma Papel Bond A4', cantidad: 200, costoUnitario: 62.50, subtotal: 12500.00 }
    ]
  }
];

export const MOCK_RESUMEN_COMPRAS: ResumenCompras = {
  totalMes: 21000.00,
  comprasPendientes: 1,
  proveedoresActivos: 12
};

export const MOCK_MOVIMIENTOS: MovimientoFinanciero[] = [
  {
    id: 'M-001',
    fecha: new Date().toISOString(),
    tipo: 'Ingreso',
    categoria: 'Venta',
    monto: 1250.00,
    metodoPago: 'Efectivo',
    descripcion: 'Venta de mostrador #V-102'
  },
  {
    id: 'M-002',
    fecha: new Date().toISOString(),
    tipo: 'Egreso',
    categoria: 'Proveedor',
    monto: 800.00,
    metodoPago: 'Transferencia',
    descripcion: 'Pago a Distribuidora Pedregal - Cuadernos'
  },
  {
    id: 'M-003',
    fecha: new Date().toISOString(),
    tipo: 'Egreso',
    categoria: 'Servicios',
    monto: 450.00,
    metodoPago: 'Efectivo',
    descripcion: 'Pago de Luz - Recibo Marzo'
  }
];

export const MOCK_RESUMEN_FINANCIERO: ResumenFinanciero = {
  balanceTotal: 15420.50,
  ingresosMes: 28400.00,
  egresosMes: 12979.50,
  efectivoEnCaja: 3200.00
};

export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'C-001',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '555-0123',
    totalCompras: 2450.50,
    ultimaVisita: new Date().toISOString(),
  },
  {
    id: 'C-002',
    nombre: 'Maria Lopez',
    email: 'maria@example.com',
    telefono: '555-0456',
    totalCompras: 1200.00,
    ultimaVisita: new Date().toISOString(),
  },
  {
    id: 'C-003',
    nombre: 'Carlos Ruiz',
    totalCompras: 450.00,
    ultimaVisita: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTOS: Producto[] = [
  { 
    id: 'P-001', 
    nombre: 'Cuaderno Profesional Raya 100hj', 
    precio: 85.50, 
    stock: 120, 
    categoria: 'Cuadernos', 
    tipo: 'producto',
    codigoBarras: '7501055300001',
    imagen: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'P-002', 
    nombre: 'Caja Lápices HB #2 (12 pzas)', 
    precio: 45.00, 
    stock: 50, 
    categoria: 'Escritura', 
    tipo: 'producto',
    codigoBarras: '7501011115002',
    imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop'
  },
  { 
    id: 'S-001', 
    nombre: 'Impresión Color Láser (Hoja)', 
    precio: 15.00, 
    stock: 9999, 
    categoria: 'Servicios', 
    tipo: 'servicio',
    imagen: 'https://images.unsplash.com/photo-1563223552-30d01fda3ead?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'S-002', 
    nombre: 'Escaneo de Documento (PDF)', 
    precio: 10.00, 
    stock: 9999, 
    categoria: 'Servicios', 
    tipo: 'servicio',
    imagen: 'https://images.unsplash.com/photo-1586075010623-26c50dee8038?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'S-003', 
    nombre: 'Engargolado Térmico', 
    precio: 45.00, 
    stock: 9999, 
    categoria: 'Servicios', 
    tipo: 'servicio',
    imagen: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop'
  },
  { 
    id: 'P-003', 
    nombre: 'Calculadora Científica Pro', 
    precio: 450.00, 
    stock: 12, 
    categoria: 'Electrónica',
    tipo: 'producto',
    imagen: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?q=80&w=2074&auto=format&fit=crop'
  }
];

export const MOCK_VENTAS: Venta[] = [
  {
    id: 'V-001',
    fecha: new Date().toISOString(),
    cliente: 'Papelería El Centro',
    total: 1200.00,
    estado: 'Completada',
    detalles: []
  },
];

export const MOCK_REPORTE_RESUMEN: ReporteResumen = {
  ventasHoy: 8450,
  ticketsPromedio: 215,
  transaccionesTotales: 38,
  crecimiento: 15
};
