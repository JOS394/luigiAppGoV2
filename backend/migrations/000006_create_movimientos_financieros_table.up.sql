-- migrations/000006_create_movimientos_financieros_table.up.sql
CREATE TABLE IF NOT EXISTS movimientos_financieros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK(tipo IN ('Ingreso', 'Egreso')),
    categoria TEXT NOT NULL, -- Ej: 'Venta', 'Pago a Proveedor', 'Renta', 'Servicios'
    monto DOUBLE PRECISION NOT NULL CHECK (monto > 0), -- Siempre guardamos positivo y el tipo define si suma o resta
    metodo_pago TEXT NOT NULL CHECK(metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta', 'Otro')),
    descripcion TEXT,
    referencia TEXT, -- Ideal para guardar IDs de ventas o números de factura
    venta_id UUID,   -- Relación opcional con una venta
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY(venta_id) REFERENCES ventas(id) ON DELETE SET NULL
);