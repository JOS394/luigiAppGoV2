-- sql/schema.sql

-- 1. Usuarios y Autenticación
CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('administrador', 'vendedor')),
    estado TEXT DEFAULT 'Activo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 2. Inventario y Productos
CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    costo REAL NOT NULL,
    costo_unitario REAL NOT NULL,
    stock INTEGER NOT NULL,
    categoria TEXT,
    tipo TEXT CHECK(tipo IN ('producto', 'servicio')),
    codigo_barras TEXT UNIQUE,
    ubicacion TEXT,
    ubicacion_especifica TEXT,
    imagen_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 3. Movimientos de Inventario (Kardex)
CREATE TABLE IF NOT EXISTS inventario_movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT,
    tipo TEXT CHECK(tipo IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- 4. Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    cliente TEXT,
    total REAL NOT NULL,
    estado TEXT CHECK(estado IN ('Completada', 'Pendiente', 'Cancelada')) DEFAULT 'Completada',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 5. Detalle de Ventas
CREATE TABLE IF NOT EXISTS venta_detalles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id TEXT,
    producto_id TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY(venta_id) REFERENCES ventas(id),
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- 6. Finanzas
CREATE TABLE IF NOT EXISTS movimientos_financieros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('Ingreso', 'Egreso')),
    categoria TEXT, -- 'Venta', 'Proveedor', 'Sueldos', etc.
    monto REAL NOT NULL,
    metodo_pago TEXT,
    descripcion TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 7. Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 8. Compras a Proveedores
CREATE TABLE IF NOT EXISTS compras (
    id TEXT PRIMARY KEY,
    proveedor_id TEXT,
    total REAL NOT NULL,
    metodo_pago TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY(proveedor_id) REFERENCES proveedores(id)
);

-- 9. Detalle de Compras
CREATE TABLE IF NOT EXISTS compra_detalles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id TEXT,
    producto_id TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    precio_sugerido REAL NOT NULL,
    subtotal REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY(compra_id) REFERENCES compras(id),
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- 10. Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    notas TEXT,
    total_compras REAL DEFAULT 0,
    ultima_visita DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
