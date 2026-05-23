package models

import "time"

type MovimientoFinanciero struct {
	ID          string     `json:"id" validate:"required"`
	Tipo        string     `json:"tipo" validate:"required"`
	Categoria   string     `json:"categoria" validate:"required"`
	Monto       float64    `json:"monto" validate:"required,gt=0"`
	MetodoPago  string     `json:"metodo_pago" validate:"required"`
	Descripcion *string    `json:"descripcion"`
	Referencia  *string    `json:"referencia"`
	VentaID     *string    `json:"venta_id"`
	Fecha       time.Time  `json:"fecha"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}

type ResumenFinanciero struct {
	Balance  float64 `json:"balance"`
	Ingresos float64 `json:"ingresos"`
	Egresos  float64 `json:"egresos"`
	Mes      string  `json:"mes"`
}
