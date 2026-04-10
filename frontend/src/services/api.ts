import { 
  MOCK_PRODUCTOS, MOCK_VENTAS, MOCK_REPORTE_RESUMEN, 
  MOCK_CLIENTES, MOCK_MOVIMIENTOS, MOCK_RESUMEN_FINANCIERO,
  MOCK_COMPRAS, MOCK_PROVEEDORES, MOCK_RESUMEN_COMPRAS
} from '../data/mockData';
import type { 
  Producto, Venta, ReporteResumen, Cliente, 
  MovimientoFinanciero, ResumenFinanciero,
  Compra, Proveedor, ResumenCompras,
  MovimientoInventario, ResumenInventario
} from '../types';

const MOCK_MOVIMIENTOS_INV: MovimientoInventario[] = [];

const USE_MOCKS = true;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_USUARIOS: Usuario[] = [
  { id: 'U-1', nombre: 'Luigi Admin', email: 'admin@luigiapp.com', rol: 'administrador', estado: 'Activo', fechaRegistro: '2026-01-01' },
  { id: 'U-2', nombre: 'Carlos Vendedor', email: 'carlos@luigiapp.com', rol: 'vendedor', estado: 'Activo', fechaRegistro: '2026-03-15' },
];

export const apiService = {
  usuarios: {
    getAll: async (): Promise<Usuario[]> => {
      await delay(500);
      return [...MOCK_USUARIOS];
    },
    create: async (data: Omit<Usuario, 'id' | 'fechaRegistro'>): Promise<Usuario> => {
      await delay(800);
      const nuevo: Usuario = {
        ...data,
        id: `U-${Math.floor(Math.random() * 1000)}`,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      MOCK_USUARIOS.push(nuevo);
      return nuevo;
    },
    update: async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
      await delay(500);
      const index = MOCK_USUARIOS.findIndex(u => u.id === id);
      if (index !== -1) {
        MOCK_USUARIOS[index] = { ...MOCK_USUARIOS[index], ...data };
        return MOCK_USUARIOS[index];
      }
      throw new Error("Usuario no encontrado");
    }
  },
  inventario: {
    getResumen: async (): Promise<ResumenInventario> => {
      await delay(400);
      const items = MOCK_PRODUCTOS.filter(p => p.tipo === 'producto');
      return {
        valorTotal: items.reduce((acc, p) => acc + (p.precio * p.stock), 0),
        itemsTotales: items.length,
        sinStock: items.filter(p => p.stock === 0).length
      };
    },
    getMovimientosByProducto: async (productoId: string): Promise<MovimientoInventario[]> => {
      await delay(500);
      return MOCK_MOVIMIENTOS_INV.filter(m => m.productoId === productoId);
    },
    ajustarStock: async (data: { productoId: string, cantidad: number, tipo: 'Entrada' | 'Salida', motivo: string }): Promise<void> => {
      await delay(800);
      const prod = MOCK_PRODUCTOS.find(p => p.id === data.productoId);
      if (!prod) throw new Error("Producto no encontrado");

      const stockPrevio = prod.stock;
      const cambio = data.tipo === 'Entrada' ? data.cantidad : -data.cantidad;
      const stockNuevo = stockPrevio + cambio;

      if (stockNuevo < 0) throw new Error("El stock no puede ser negativo");

      prod.stock = stockNuevo;

      MOCK_MOVIMIENTOS_INV.unshift({
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        productoId: prod.id,
        productoNombre: prod.nombre,
        tipo: data.tipo === 'Entrada' ? 'Entrada' : 'Salida',
        cantidad: data.cantidad,
        motivo: data.motivo,
        fecha: new Date().toISOString(),
        stockPrevio,
        stockNuevo
      });
    }
  },
  compras: {
    getAll: async (): Promise<Compra[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_COMPRAS]; }
      return [];
    },
    getResumen: async (): Promise<ResumenCompras> => {
      if (USE_MOCKS) { await delay(400); return { ...MOCK_RESUMEN_COMPRAS }; }
      return { totalMes: 0, comprasPendientes: 0, proveedoresActivos: 0 };
    },
    create: async (compra: Omit<Compra, 'id' | 'fecha'>): Promise<Compra> => {
      await delay(800);
      const nuevaCompra: Compra = {
        ...compra,
        id: `B-${Math.floor(Math.random() * 1000)}`,
        fecha: new Date().toISOString()
      };
      if (USE_MOCKS) {
        MOCK_COMPRAS.unshift(nuevaCompra);
      }
      return nuevaCompra;
    },
    updateStatus: async (id: string, estado: Compra['estado']): Promise<Compra> => {
      await delay(500);
      const index = MOCK_COMPRAS.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_COMPRAS[index].estado = estado;
        return MOCK_COMPRAS[index];
      }
      throw new Error("Compra no encontrada");
    }
  },
  proveedores: {
    getAll: async (): Promise<Proveedor[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_PROVEEDORES]; }
      return [];
    },
    create: async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
      await delay(800);
      const nuevo: Proveedor = {
        ...proveedor,
        id: `PR-${Math.floor(Math.random() * 1000)}`
      };
      if (USE_MOCKS) { MOCK_PROVEEDORES.unshift(nuevo); }
      return nuevo;
    },
    update: async (id: string, data: Partial<Proveedor>): Promise<Proveedor> => {
      await delay(500);
      const index = MOCK_PROVEEDORES.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROVEEDORES[index] = { ...MOCK_PROVEEDORES[index], ...data };
        return MOCK_PROVEEDORES[index];
      }
      throw new Error("Proveedor no encontrado");
    },
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const index = MOCK_PROVEEDORES.findIndex(p => p.id === id);
      if (index !== -1) { MOCK_PROVEEDORES.splice(index, 1); }
    }
  },
  ventas: {
    getAll: async (): Promise<Venta[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_VENTAS]; }
      return [];
    },
    create: async (venta: Omit<Venta, 'id'>): Promise<Venta> => {
      await delay(800);
      const newVenta = { ...venta, id: `V-${Math.floor(Math.random() * 1000)}` };
      if (USE_MOCKS) { MOCK_VENTAS.unshift(newVenta as Venta); }
      return newVenta as Venta;
    }
  },
  productos: {
    getAll: async (): Promise<Producto[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_PRODUCTOS]; }
      return [];
    },
    create: async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
      await delay(800);
      const nuevo: Producto = {
        ...producto,
        id: `P-${Math.floor(Math.random() * 1000)}`
      };
      if (USE_MOCKS) {
        MOCK_PRODUCTOS.unshift(nuevo);
      }
      return nuevo;
    },
    update: async (id: string, data: Partial<Producto>): Promise<Producto> => {
      await delay(500);
      const index = MOCK_PRODUCTOS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PRODUCTOS[index] = { ...MOCK_PRODUCTOS[index], ...data };
        return MOCK_PRODUCTOS[index];
      }
      throw new Error("Producto no encontrado");
    },
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const index = MOCK_PRODUCTOS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PRODUCTOS.splice(index, 1);
      }
    },
    updateStock: async (id: string, newStock: number): Promise<void> => {
      await delay(300);
      if (USE_MOCKS) {
        const prod = MOCK_PRODUCTOS.find(p => p.id === id);
        if (prod) prod.stock = newStock;
      }
    }
  },
  reportes: {
    getResumen: async (): Promise<ReporteResumen> => {
      await delay(600);
      return { 
        ventasHoy: 8450.50, 
        ticketsPromedio: 215.25, 
        transaccionesTotales: 38, 
        crecimiento: 15.4,
        utilidadBruta: 3240.00,
        proyeccionMes: 45000.00
      };
    },
    getDetallado: async (periodo: string): Promise<ReporteDetallado> => {
      await delay(800);
      return {
        topProductos: [
          { id: '1', nombre: 'Cuaderno Profesional', valor: 4500, cantidad: 120, porcentaje: 25 },
          { id: '2', nombre: 'Impresión Laser Color', valor: 3200, cantidad: 850, porcentaje: 18 },
          { id: '3', nombre: 'Kit Escolar Básico', valor: 2800, cantidad: 45, porcentaje: 15 },
          { id: '4', nombre: 'Memoria USB 64GB', valor: 1500, cantidad: 12, porcentaje: 8 },
        ],
        topCategorias: [
          { id: 'c1', nombre: 'Papelería', valor: 12000, cantidad: 0, porcentaje: 45 },
          { id: 'c2', nombre: 'Servicios Digitales', valor: 8500, cantidad: 0, porcentaje: 32 },
          { id: 'c3', nombre: 'Tecnología', valor: 6000, cantidad: 0, porcentaje: 23 },
        ],
        ventasSemanales: [
          { dia: 'Lun', monto: 1200 },
          { dia: 'Mar', monto: 1900 },
          { dia: 'Mie', monto: 1500 },
          { dia: 'Jue', monto: 2100 },
          { dia: 'Vie', monto: 2800 },
          { dia: 'Sab', monto: 3500 },
          { dia: 'Dom', monto: 800 },
        ]
      };
    }
  },
  clientes: {
    getAll: async (): Promise<Cliente[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_CLIENTES]; }
      return [];
    },
    create: async (cliente: Omit<Cliente, 'id' | 'totalCompras' | 'ultimaVisita'>): Promise<Cliente> => {
      await delay(800);
      const newCliente: Cliente = { 
        ...cliente, 
        id: `C-${Math.floor(Math.random() * 1000)}`,
        totalCompras: 0,
        ultimaVisita: new Date().toISOString()
      };
      if (USE_MOCKS) { MOCK_CLIENTES.unshift(newCliente); }
      return newCliente;
    },
    update: async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
      await delay(500);
      const index = MOCK_CLIENTES.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CLIENTES[index] = { ...MOCK_CLIENTES[index], ...data };
        return MOCK_CLIENTES[index];
      }
      throw new Error("Cliente no encontrado");
    },
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const index = MOCK_CLIENTES.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CLIENTES.splice(index, 1);
      }
    }
  },
  finanzas: {
    getResumen: async (): Promise<ResumenFinanciero> => {
      if (USE_MOCKS) { await delay(600); return { ...MOCK_RESUMEN_FINANCIERO }; }
      return { balanceTotal: 0, ingresosMes: 0, egresosMes: 0, efectivoEnCaja: 0 };
    },
    getMovimientos: async (): Promise<MovimientoFinanciero[]> => {
      if (USE_MOCKS) { await delay(500); return [...MOCK_MOVIMIENTOS]; }
      return [];
    },
    createMovimiento: async (movimiento: Omit<MovimientoFinanciero, 'id' | 'fecha'>): Promise<MovimientoFinanciero> => {
      await delay(800);
      const nuevoMovimiento: MovimientoFinanciero = {
        ...movimiento,
        id: `M-${Math.floor(Math.random() * 1000)}`,
        fecha: new Date().toISOString()
      };
      if (USE_MOCKS) {
        MOCK_MOVIMIENTOS.unshift(nuevoMovimiento);
        if (movimiento.tipo === 'Ingreso') {
          MOCK_RESUMEN_FINANCIERO.balanceTotal += movimiento.monto;
          MOCK_RESUMEN_FINANCIERO.ingresosMes += movimiento.monto;
          if (movimiento.metodoPago === 'Efectivo') MOCK_RESUMEN_FINANCIERO.efectivoEnCaja += movimiento.monto;
        } else {
          MOCK_RESUMEN_FINANCIERO.balanceTotal -= movimiento.monto;
          MOCK_RESUMEN_FINANCIERO.egresosMes += movimiento.monto;
          if (movimiento.metodoPago === 'Efectivo') MOCK_RESUMEN_FINANCIERO.efectivoEnCaja -= movimiento.monto;
        }
      }
      return nuevoMovimiento;
    }
  }
};
