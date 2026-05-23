-- migrations/000009_create_compra_detalles_table.up.sql
CREATE TABLE IF NOT EXISTS compra_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compra_id UUID NOT NULL, -- Obligatorio
    producto_id UUID NOT NULL, -- Obligatorio
    cantidad INTEGER NOT NULL CHECK (cantidad > 0), -- Evita errores
    precio_unitario DOUBLE PRECISION NOT NULL DEFAULT 0,
    precio_sugerido DOUBLE PRECISION NOT NULL DEFAULT 0, -- Muy útil para saber a cuánto venderlo
    subtotal DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Restricciones de integridad
    FOREIGN KEY(compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);