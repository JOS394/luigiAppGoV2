-- sql/schema.sql (PostgreSQL Version)

-- 1. Usuarios y Autenticación
CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('administrador', 'vendedor')),
    estado TEXT DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 2. Inventario y Productos
CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio DOUBLE PRECISION NOT NULL,
    costo DOUBLE PRECISION NOT NULL,
    costo_unitario DOUBLE PRECISION NOT NULL,
    stock INTEGER NOT NULL,
    categoria TEXT,
    tipo TEXT CHECK(tipo IN ('producto', 'servicio')),
    codigo_barras TEXT UNIQUE,
    ubicacion TEXT,
    ubicacion_especifica TEXT,
    imagen_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 3. Movimientos de Inventario (Kardex)
CREATE TABLE IF NOT EXISTS inventario_movimientos (
    id SERIAL PRIMARY KEY,
    producto_id TEXT,
    tipo TEXT CHECK(tipo IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- 4. Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    cliente TEXT,
    total DOUBLE PRECISION NOT NULL,
    estado TEXT CHECK(estado IN ('Completada', 'Pendiente', 'Cancelada')) DEFAULT 'Completada',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 5. Detalle de Ventas
CREATE TABLE IF NOT EXISTS venta_detalles (
    id SERIAL PRIMARY KEY,
    venta_id TEXT,
    producto_id TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario DOUBLE PRECISION NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY(venta_id) REFERENCES ventas(id),
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- 6. Finanzas
CREATE TABLE IF NOT EXISTS movimientos_financieros (
    id SERIAL PRIMARY KEY,
    tipo TEXT CHECK(tipo IN ('Ingreso', 'Egreso')),
    categoria TEXT, -- 'Venta', 'Proveedor', 'Sueldos', etc.
    monto DOUBLE PRECISION NOT NULL,
    metodo_pago TEXT,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 7. Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 8. Compras a Proveedores
CREATE TABLE IF NOT EXISTS compras (
    id TEXT PRIMARY KEY,
    proveedor_id TEXT,
    total DOUBLE PRECISION NOT NULL,
    metodo_pago TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY(proveedor_id) REFERENCES proveedores(id)
);

-- 9. Detalle de Compras
CREATE TABLE IF NOT EXISTS compra_detalles (
    id SERIAL PRIMARY KEY,
    compra_id TEXT,
    producto_id TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario DOUBLE PRECISION NOT NULL,
    precio_sugerido DOUBLE PRECISION NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
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
    total_compras DOUBLE PRECISION DEFAULT 0,
    ultima_visita TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
