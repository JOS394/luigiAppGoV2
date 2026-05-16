-- migrations/000008_create_compras_table.up.sql
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
