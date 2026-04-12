package models

type Producto struct {
	ID            string  `json:"id"`
	Nombre        string  `json:"nombre"`
	Precio        float64 `json:"precio"`
	Costo         float64 `json:"costo"`
	CostoUnitario float64 `json:"costo_unitario"`
	Stock              int     `json:"stock"`
	Categoria          string  `json:"categoria"`
	Tipo               string  `json:"tipo"` // 'producto' o 'servicio'
	CodigoBarras       string  `json:"codigo_barras"`
	Ubicacion          string  `json:"ubicacion"`
	UbicacionEspecifica string  `json:"ubicacion_especifica"`
	ImagenURL          string  `json:"imagen_url"`
	CreatedAt          string  `json:"created_at"`
	UpdatedAt          string  `json:"updated_at"`
	DeletedAt          *string `json:"deleted_at"`
}
