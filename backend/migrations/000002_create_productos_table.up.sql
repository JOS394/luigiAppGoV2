-- migrations/000002_create_productos_table.up.sql
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
