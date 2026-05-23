package models

import "time"

type Venta struct {
	ID            string         `json:"id" validate:"required"`
	UsuarioID     string         `json:"usuario_id" validate:"required"`
	ClienteNombre *string        `json:"cliente_nombre"`
	TotalNeto     float64        `json:"total_neto" validate:"required"`
	Impuesto      float64        `json:"impuesto" validate:"required"`
	TotalTotal    float64        `json:"total_total" validate:"required"`
	Estado        string         `json:"estado" validate:"required"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     *time.Time     `json:"deleted_at"`
	Detalle       []VentaDetalle `json:"detalle"`
}

type VentaDetalle struct {
	ID             string     `json:"id" validate:"required"`
	VentaID        string     `json:"venta_id" validate:"required"`
	ProductoID     string     `json:"producto_id" validate:"required"`
	Cantidad       int        `json:"cantidad" validate:"required,gt=0"`
	PrecioUnitario float64    `json:"precio_unitario" validate:"required"`
	Subtotal       float64    `json:"subtotal" validate:"required"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
