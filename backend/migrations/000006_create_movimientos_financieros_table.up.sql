-- migrations/000006_create_movimientos_financieros_table.up.sql
CREATE TABLE IF NOT EXISTS movimientos_financieros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT CHECK(tipo IN ('Ingreso', 'Egreso')),
    categoria TEXT,
    monto DOUBLE PRECISION NOT NULL,
    metodo_pago TEXT,
    descripcion TEXT,
    referencia TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
