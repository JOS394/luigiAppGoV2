-- migrations/000008_create_compras_table.up.sql
CREATE TABLE IF NOT EXISTS compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL,
    total_neto DOUBLE PRECISION NOT NULL DEFAULT 0,
    impuesto DOUBLE PRECISION NOT NULL DEFAULT 0,
    total_total DOUBLE PRECISION NOT NULL DEFAULT 0,
    metodo_pago TEXT NOT NULL CHECK(metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta', 'Credito')),
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY(proveedor_id) REFERENCES proveedores(id)
);