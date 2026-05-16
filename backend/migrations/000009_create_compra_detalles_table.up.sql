-- migrations/000009_create_compra_detalles_table.up.sql
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
