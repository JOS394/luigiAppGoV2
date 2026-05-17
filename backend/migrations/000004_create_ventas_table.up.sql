-- migrations/000004_create_ventas_table.up.sql
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente TEXT,
    total DOUBLE PRECISION NOT NULL,
    estado TEXT CHECK(estado IN ('Completada', 'Pendiente', 'Cancelada')) DEFAULT 'Completada',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
