package models

type Venta struct {
	ID        string         `json:"id"`
	Fecha     string         `json:"fecha"`
	Cliente   string         `json:"cliente"`
	Total     float64        `json:"total"`
	Estado    string         `json:"estado"`
	CreatedAt string         `json:"created_at"`
	UpdatedAt string         `json:"updated_at"`
	DeletedAt *string        `json:"deleted_at"`
	Detalle   []VentaDetalle `json:"detalle"`
}

type VentaDetalle struct {
	ID             int     `json:"id"`
	VentaID        string  `json:"venta_id"`
	ProductoID     string  `json:"producto_id"`
	Cantidad       int     `json:"cantidad"`
	PrecioUnitario float64 `json:"precio_unitario"`
	Subtotal       float64 `json:"subtotal"`
}
