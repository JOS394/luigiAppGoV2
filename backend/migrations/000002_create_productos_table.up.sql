-- migrations/000002_create_productos_table.up.sql
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    precio DOUBLE PRECISION NOT NULL DEFAULT 0,
    costo DOUBLE PRECISION NOT NULL DEFAULT 0,
    costo_unitario DOUBLE PRECISION NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0, -- Ajuste: valor por defecto
    sku TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    categoria TEXT,
    tipo TEXT CHECK(tipo IN ('producto', 'servicio')),
    codigo_barras TEXT UNIQUE,
    codigo_barras_secundario TEXT,
    ubicacion TEXT,
    ubicacion_especifica TEXT,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Ajuste: mejor usar WITH TIME ZONE
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);