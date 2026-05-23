package models

import "time"

type Proveedor struct {
	ID        string     `json:"id" validate:"required"`
	Nombre    string     `json:"nombre" validate:"required"`
	Email     *string    `json:"email" validate:"omitempty,email"`
	Telefono  *string    `json:"telefono"`
	Direccion *string    `json:"direccion"`
	Estado    string     `json:"estado" validate:"required"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
