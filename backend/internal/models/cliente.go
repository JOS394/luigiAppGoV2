package models

import "time"

type Cliente struct {
	ID           string     `json:"id" validate:"required"`
	Nombre       string     `json:"nombre" validate:"required"`
	Email        *string    `json:"email" validate:"omitempty,email"`
	Telefono     *string    `json:"telefono"`
	Direccion    *string    `json:"direccion"`
	Notas        *string    `json:"notas"`
	TotalCompras float64    `json:"total_compras" validate:"required"`
	UltimaVisita *time.Time `json:"ultima_visita"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at"`
}
