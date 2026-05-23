package models

import "time"

type Compra struct {
	ID          string          `json:"id" validate:"required"`
	ProveedorID string          `json:"proveedor_id" validate:"required"`
	TotalNeto   float64         `json:"total_neto" validate:"required"`
	Impuesto    float64         `json:"impuesto" validate:"required"`
	TotalTotal  float64         `json:"total_total" validate:"required"`
	MetodoPago  string          `json:"metodo_pago" validate:"required"`
	FechaCompra time.Time       `json:"fecha_compra"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   *time.Time      `json:"deleted_at"`
	Detalles    []CompraDetalle `json:"detalles"`
}

type CompraDetalle struct {
	ID             string     `json:"id" validate:"required"`
	CompraID       string     `json:"compra_id" validate:"required"`
	ProductoID     string     `json:"producto_id" validate:"required"`
	Cantidad       int        `json:"cantidad" validate:"required,gt=0"`
	PrecioUnitario float64    `json:"precio_unitario" validate:"required"`
	PrecioSugerido float64    `json:"precio_sugerido" validate:"required"`
	Subtotal       float64    `json:"subtotal" validate:"required"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
