-- migrations/000004_create_ventas_table.up.sql
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL, -- ¿Quién hizo la venta?
    cliente_nombre TEXT,      -- O un cliente_id si tienes tabla de clientes
    total_neto DOUBLE PRECISION NOT NULL,
    impuesto DOUBLE PRECISION NOT NULL DEFAULT 0, -- Por si manejas IVA
    total_total DOUBLE PRECISION NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('Completada', 'Pendiente', 'Cancelada')) DEFAULT 'Completada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);