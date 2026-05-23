-- migrations/000005_create_venta_detalles_table.up.sql
CREATE TABLE IF NOT EXISTS venta_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venta_id UUID NOT NULL,
    producto_id UUID NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0), -- Evita cantidades negativas o cero
    precio_unitario DOUBLE PRECISION NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    -- Si borras una venta, sus detalles se borran automáticamente (Limpio y eficiente)
    FOREIGN KEY(venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    -- Si borras un producto, esto evitará que borres el producto si ya tuvo ventas, 
    -- o puedes poner RESTRICT para proteger la integridad histórica.
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);