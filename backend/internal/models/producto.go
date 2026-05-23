package models

import (
	"time"
)

type Producto struct {
	ID                  string     `json:"id" validate:"required"`
	Nombre              string     `json:"nombre" validate:"required"`
	Precio              float64    `json:"precio" validate:"required"`
	Costo               float64    `json:"costo" validate:"required"`
	CostoUnitario       float64    `json:"costo_unitario" validate:"required"`
	Stock               int        `json:"stock" validate:"required"`
	SKU                 string     `json:"sku" validate:"required"`
	Categoria           *string    `json:"categoria"`
	Tipo                *string    `json:"tipo"`
	CodigoBarras        *string    `json:"codigo_barras"`
	CodigoBarrasSecundario *string `json:"codigo_barras_secundario"`
	Ubicacion           *string    `json:"ubicacion"`
	UbicacionEspecifica *string    `json:"ubicacion_especifica"`
	ImagenURL           *string    `json:"imagen_url"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
	DeletedAt           *time.Time `json:"deleted_at"`
}
