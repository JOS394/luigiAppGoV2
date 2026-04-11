package models

type Compra struct {
	ID          string          `json:"id"`
	Fecha       string          `json:"fecha"`
	ProveedorID string          `json:"proveedor_id"`
	Total       float64         `json:"total"`
	MetodoPago  string          `json:"metodo_pago"`
	Detalles    []CompraDetalle `json:"detalles"`
}

type CompraDetalle struct {
	ID             int     `json:"id"`
	CompraID       string  `json:"compra_id"`
	ProductoID     string  `json:"producto_id"`
	Cantidad       int     `json:"cantidad"`
	PrecioUnitario float64 `json:"precio_unitario"`
	PrecioSugerido float64 `json:"precio_sugerido"`
	Subtotal       float64 `json:"subtotal"`
}
