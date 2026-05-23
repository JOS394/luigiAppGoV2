import type { 
  Producto, Venta, ReporteResumen, Cliente, 
  MovimientoFinanciero, ResumenFinanciero,
  Compra, Proveedor, ResumenCompras,
  MovimientoInventario, ResumenInventario,
  Usuario, ReporteDetallado
} from '../types';

const BASE_URL = 'http://localhost:8080/api';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const fetcher = async (endpoint: string, options?: RequestInit) => {
  // Asegurar que el endpoint no empiece con / si BASE_URL ya lo tiene o viceversa
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  console.log(`[API] Fetching ${url}`, { 
    method: options?.method || 'GET',
    hasToken: !!token 
  });
  
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (response.status === 401) {
      console.warn(`[API] 401 Unauthorized at ${cleanEndpoint}. Clearing session.`);
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[API] Error ${response.status} in ${cleanEndpoint}:`, errorData);
      throw new Error(errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) return null;
    const data = await response.json();
    console.log(`[API] Success ${cleanEndpoint}:`, data);
    return data;
  } catch (err: any) {
    console.error(`[API] Fatal error in ${cleanEndpoint}:`, err);
    throw err;
  }
};

const downloader = async (endpoint: string, filename: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Error al descargar el archivo");

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Download failed", err);
    throw err;
  }
};

// Mapeadores para convertir entre Backend (snake_case) y Frontend (camelCase)
const mapProductoFromBackend = (p: any): Producto => {
  // Debug para ver qué llega del backend
  const id = p.id || p.ID || p.Id;
  if (!id) {
    console.error("⚠️ Producto recibido sin ID:", p);
    console.warn("Estructura de p:", Object.keys(p));
  }

  return {
    id: id,
    nombre: p.nombre,
    precio: p.precio,
    costo: p.costo,
    costoUnitario: p.costo_unitario,
    stock: p.stock,
    sku: p.sku,
    categoria: p.categoria || 'General',
    tipo: p.tipo as 'producto' | 'servicio',
    codigoBarras: p.codigo_barras,
    codigoBarrasSecundario: p.codigo_barras_secundario,
    imagen: p.imagen_url ? (p.imagen_url.startsWith('http') ? p.imagen_url : `http://localhost:8080${p.imagen_url}`) : undefined,
    descripcion: p.descripcion,
    ubicacion: p.ubicacion,
    ubicacionEspecifica: p.ubicacion_especifica,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
};

const mapProductoToBackend = (p: any) => ({
  id: p.id,
  nombre: p.nombre,
  precio: p.precio,
  costo: p.costo || 0,
  costo_unitario: p.costoUnitario || 0,
  stock: p.stock,
  sku: p.sku || '',
  descripcion: p.descripcion || '',
  categoria: p.categoria,
  tipo: p.tipo,
  codigo_barras: p.codigoBarras || '',
  codigo_barras_secundario: p.codigoBarrasSecundario || '',
  ubicacion: p.ubicacion,
  ubicacion_especifica: p.ubicacionEspecifica,
  imagen_url: p.imagen && !p.imagen.startsWith('data:image/') ? p.imagen.replace('http://localhost:8080', '') : '',
});

const mapVentaFromBackend = (v: any): Venta => ({
  id: v.id,
  fecha: v.fecha || v.created_at || new Date().toISOString(),
  cliente: v.cliente || v.cliente_nombre || 'Cliente General',
  total: typeof v.total === 'number' ? v.total : (v.total_total || 0),
  estado: v.estado as any,
  createdAt: v.created_at,
  updatedAt: v.updated_at,
  detalles: (v.detalle || []).map((d: any) => ({
    productoId: d.producto_id,
    cantidad: d.cantidad,
    precioUnitario: d.precio_unitario,
    subtotal: d.subtotal,
  })),
});

const mapMovimientoFromBackend = (m: any): MovimientoFinanciero => ({
  id: m.id.toString(),
  fecha: m.fecha,
  tipo: m.tipo as 'Ingreso' | 'Egreso',
  categoria: m.categoria as any,
  monto: m.monto,
  metodoPago: m.metodo_pago as any,
  descripcion: m.descripcion,
});

const mapProveedorFromBackend = (p: any): Proveedor => ({
  id: p.id,
  nombre: p.nombre,
  contacto: p.email,
  telefono: p.telefono,
  direccion: p.direccion,
  categoria: 'Proveedor',
});

const mapCompraFromBackend = (c: any): Compra => ({
  id: c.id,
  fecha: c.fecha,
  proveedorId: c.proveedor_id,
  proveedorNombre: `Proveedor ${c.proveedor_id}`,
  total: c.total,
  estado: 'Completada',
  metodoPago: c.metodo_pago as any,
  detalles: (c.detalles || []).map((d: any) => ({
    productoId: d.producto_id,
    productoNombre: `Producto ${d.producto_id}`,
    cantidad: d.cantidad,
    costoUnitario: d.precio_unitario,
    subtotal: d.subtotal,
  })),
});

const mapClienteFromBackend = (c: any): Cliente => ({
  id: c.id,
  nombre: c.nombre,
  email: c.email,
  telefono: c.telefono,
  direccion: c.direccion,
  notas: c.notas,
  totalCompras: c.total_compras || 0,
  ultimaVisita: c.ultima_visita,
  createdAt: c.created_at,
  updatedAt: c.updated_at,
});

export const apiService = {
  auth: {
    login: async (credentials: any): Promise<any> => {
      const data = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.usuario));
      }
      return data;
    },
    register: async (userData: any): Promise<any> => {
      return await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    },
    getCurrentUser: () => {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('user_data');
        return data ? JSON.parse(data) : null;
      }
      return null;
    }
  },
  usuarios: {
    getAll: async (): Promise<Usuario[]> => {
      return [
        { id: 'U-1', nombre: 'Luigi Admin', email: 'admin@luigiapp.com', rol: 'administrador', estado: 'Activo', fechaRegistro: '2026-01-01' },
      ];
    }
  },
  inventario: {
    getResumen: async (): Promise<ResumenInventario> => {
      const data = await fetcher('/productos/valor-inventario');
      return {
        valorTotal: data.valor_total || 0,
        itemsTotales: 0,
        sinStock: 0
      };
    },
    getMovimientosByProducto: async (productoId: string): Promise<MovimientoInventario[]> => {
      const data = await fetcher(`/productos/${productoId}/movimientos`);
      return (data || []).map((m: any) => ({
        id: m.id.toString(),
        productoId: m.producto_id,
        tipo: m.tipo,
        cantidad: m.cantidad,
        motivo: m.motivo || '',
        createdAt: m.created_at
      }));
    },
    ajustarStock: async (data: { productoId: string, cantidad: number, tipo: 'Entrada' | 'Salida' | 'Ajuste', motivo: string }): Promise<void> => {

      if (!data.productoId) throw new Error("[Frontend] ID del producto no encontrado en la petición");
      await fetcher(`/productos/${data.productoId}/stock`, {
        method: 'POST',
        body: JSON.stringify({
          cantidad: data.cantidad,
          tipo: data.tipo,
          motivo: data.motivo,
        }),
      });
    }
  },
  compras: {
    getAll: async (): Promise<Compra[]> => {
      const data = await fetcher('/compras');
      return (data || []).map(mapCompraFromBackend);
    },
    getResumen: async (): Promise<ResumenCompras> => {
      return { totalMes: 0, comprasPendientes: 0, proveedoresActivos: 0 };
    },
    create: async (compra: any): Promise<Compra> => {
      const body = {
        id: `C-${Math.floor(Math.random() * 10000)}`,
        proveedor_id: compra.proveedorId,
        total: compra.total,
        metodo_pago: compra.metodoPago,
        detalles: compra.detalles.map((d: any) => ({
          producto_id: d.productoId,
          cantidad: d.cantidad,
          precio_unitario: d.costoUnitario,
          precio_sugerido: d.precioSugerido || (d.costoUnitario * 1.3),
          subtotal: d.subtotal
        }))
      };
      const res = await fetcher('/compras', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return mapCompraFromBackend(res);
    },
  },
  proveedores: {
    getAll: async (): Promise<Proveedor[]> => {
      const data = await fetcher('/proveedores');
      return (data || []).map(mapProveedorFromBackend);
    },
    create: async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
      const body = {
        nombre: proveedor.nombre,
        email: proveedor.contacto,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
      };
      const res = await fetcher('/proveedores', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return mapProveedorFromBackend(res);
    },
    update: async (id: string, data: Partial<Proveedor>): Promise<Proveedor> => {
      const body = {
        nombre: data.nombre,
        email: data.contacto,
        telefono: data.telefono,
        direccion: data.direccion,
      };
      const res = await fetcher(`/proveedores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      return mapProveedorFromBackend(res);
    },
    delete: async (id: string): Promise<void> => {
      await fetcher(`/proveedores/${id}`, { method: 'DELETE' });
    }
  },
  ventas: {
    getAll: async (): Promise<Venta[]> => {
      const data = await fetcher('/ventas');
      return (data || []).map(mapVentaFromBackend);
    },
    create: async (venta: Omit<Venta, 'id' | 'fecha'>): Promise<Venta> => {
      const generatedId = generateUUID();
      const body = {
        id: generatedId,
        cliente_nombre: venta.cliente,
        total_neto: venta.total,
        impuesto: 0,
        total_total: venta.total,
        estado: venta.estado || 'Completada',
        detalle: venta.detalles.map(d => ({
          producto_id: d.productoId,
          cantidad: d.cantidad,
          precio_unitario: d.precioUnitario,
          subtotal: d.subtotal,
        })),
      };
      const res = await fetcher('/ventas', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return { ...venta, id: res?.id || generatedId, fecha: new Date().toISOString() } as unknown as Venta;
    }
  },
  productos: {
    getAll: async (): Promise<Producto[]> => {
      const data = await fetcher('/productos');
      return (data || []).map(mapProductoFromBackend);
    },
    create: async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
      const res = await fetcher('/productos', {
        method: 'POST',
        body: JSON.stringify(mapProductoToBackend(producto)),
      });
      return mapProductoFromBackend(res);
    },
    update: async (id: string, data: Partial<Producto>): Promise<Producto> => {
      const res = await fetcher(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(mapProductoToBackend(data)),
      });
      return mapProductoFromBackend(res);
    },
    delete: async (id: string): Promise<void> => {
      await fetcher(`/productos/${id}`, { method: 'DELETE' });
    },
    getAlertas: async (): Promise<any[]> => {
      return await fetcher('/productos/alertas');
    },
    uploadImagen: async (id: string, base64Image: string): Promise<{ url: string }> => {
      const arr = base64Image.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) throw new Error("Formato de imagen inválido");
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const extension = mime.split('/')[1] || 'png';
      const file = new File([u8arr], `imagen.${extension}`, { type: mime });

      const formData = new FormData();
      formData.append('imagen', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      const response = await fetch(`http://localhost:8080/api/productos/${id}/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      return await response.json();
    }
  },
  clientes: {
    getAll: async (): Promise<Cliente[]> => {
      const data = await fetcher('/clientes');
      return (data || []).map(mapClienteFromBackend);
    },
    create: async (cliente: Omit<Cliente, 'id' | 'totalCompras' | 'ultimaVisita'>): Promise<Cliente> => {
      const body = {
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        notas: cliente.notas,
      };
      const res = await fetcher('/clientes', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return mapClienteFromBackend(res);
    },
    update: async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
      const body = {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        notas: data.notas,
      };
      await fetcher(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      return { ...data, id } as Cliente;
    },
    delete: async (id: string): Promise<void> => {
      await fetcher(`/clientes/${id}`, { method: 'DELETE' });
    }
  },
  reportes: {
    getResumen: async (): Promise<ReporteResumen> => {
      const data = await fetcher('/reportes/resumen');
      return { 
        ventasHoy: data.ventas_hoy || 0, 
        ticketsPromedio: data.tickets_promedio || 0, 
        transaccionesTotales: data.transacciones_totales || 0, 
        crecimiento: data.crecimiento || 0,
        utilidadBruta: data.utilidad_bruta || 0,
        proyeccionMes: data.proyeccion_mes || 0
      };
    },
    getDetallado: async (periodo: string): Promise<ReporteDetallado> => {
      const data = await fetcher('/reportes/detallado');
      return {
        topProductos: (data.top_productos || []).map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          valor: p.valor,
          cantidad: p.cantidad,
          porcentaje: 0 // Podríamos calcularlo si fuera necesario
        })),
        topCategorias: (data.top_categorias || []).map((c: any) => ({
          id: c.nombre,
          nombre: c.nombre,
          valor: c.valor,
          porcentaje: 0
        })),
        ventasSemanales: (data.ventas_semanales || []).map((v: any) => ({
          dia: v.dia,
          monto: v.monto
        }))
      };
    }
  },
  finanzas: {
    getResumen: async (): Promise<ResumenFinanciero> => {
      const data = await fetcher('/reportes/resumen');
      return {
        balanceTotal: data.balance || 0,
        ingresosMes: data.ingresos || 0,
        egresosMes: data.egresos || 0,
        efectivoEnCaja: data.balance || 0,
      };
    },
    getMovimientos: async (): Promise<MovimientoFinanciero[]> => {
      const data = await fetcher('/finanzas/movimientos');
      return (data || []).map(mapMovimientoFromBackend);
    },
    createMovimiento: async (movimiento: Omit<MovimientoFinanciero, 'id' | 'fecha'>): Promise<MovimientoFinanciero> => {
      const body = {
        tipo: movimiento.tipo,
        categoria: movimiento.categoria,
        monto: movimiento.monto,
        metodo_pago: movimiento.metodoPago,
        descripcion: movimiento.descripcion,
      };
      const res = await fetcher('/finanzas/movimientos', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return mapMovimientoFromBackend(res);
    }
  },
  export: {
    productos: (format: string = 'csv') => {
      const ext = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      return downloader(`/export/productos?format=${format}`, `productos_${new Date().toISOString().split('T')[0]}.${ext}`);
    },
    servicios: (format: string = 'csv') => {
      const ext = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      return downloader(`/export/productos?format=${format}&tipo=servicio`, `servicios_${new Date().toISOString().split('T')[0]}.${ext}`);
    },
    ventas: (format: string = 'csv') => {
      const ext = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      return downloader(`/export/ventas?format=${format}`, `ventas_${new Date().toISOString().split('T')[0]}.${ext}`);
    },
    clientes: (format: string = 'csv') => {
      const ext = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      return downloader(`/export/clientes?format=${format}`, `clientes_${new Date().toISOString().split('T')[0]}.${ext}`);
    },
    finanzas: (format: string = 'csv') => {
      const ext = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      return downloader(`/export/finanzas?format=${format}`, `finanzas_${new Date().toISOString().split('T')[0]}.${ext}`);
    },
  },
  import: {
    productos: async (file: File, tipo?: string): Promise<any> => {
      const formData = new FormData();
      formData.append('file', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = tipo ? `http://localhost:8080/api/import/productos?tipo=${tipo}` : `http://localhost:8080/api/import/productos`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al importar el archivo");
      }

      return await response.json();
    },
    downloadTemplate: (context: string) => {
      return downloader(`/import/template?context=${context}`, `plantilla_${context}.xlsx`);
    }
  }
};
