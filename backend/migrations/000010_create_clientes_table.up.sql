-- migrations/000010_create_clientes_table.up.sql
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE, -- El email suele ser único en sistemas de clientes
    telefono TEXT,
    direccion TEXT,
    notas TEXT,
    total_compras DOUBLE PRECISION NOT NULL DEFAULT 0,
    ultima_visita TIMESTAMP WITH TIME ZONE, -- Ajustado a TIMESTAMPTZ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índice para búsquedas rápidas por nombre o email
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);