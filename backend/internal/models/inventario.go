package models

import "time"

type InventarioMovimiento struct {
	ID         string    `json:"id" validate:"required"`
	ProductoID string    `json:"producto_id" validate:"required"`
	Tipo       *string   `json:"tipo"` // 'Entrada', 'Salida', 'Ajuste'
	Cantidad   int       `json:"cantidad" validate:"required,gt=0"`
	Motivo     *string   `json:"motivo"`
	CreatedAt  time.Time `json:"created_at"`
}

type InventarioValor struct {
	ValorTotal float64 `json:"valor_total"`
}
