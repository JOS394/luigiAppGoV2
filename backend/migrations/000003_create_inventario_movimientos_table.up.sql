-- migrations/000003_create_inventario_movimientos_table.up.sql
CREATE TABLE IF NOT EXISTS inventario_movimientos (
    id SERIAL PRIMARY KEY,
    producto_id TEXT,
    tipo TEXT CHECK(tipo IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);
