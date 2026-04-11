package models

type Producto struct {
	ID           string  `json:"id"`
	Nombre       string  `json:"nombre"`
	Precio       float64 `json:"precio"`
	Stock        int     `json:"stock"`
	Tipo         string  `json:"tipo"` // 'producto' o 'servicio'
	CodigoBarras string  `json:"codigo_barras"`
	Ubicacion    string  `json:"ubicacion"`
	CreatedAt    string  `json:"created_at"`
}
