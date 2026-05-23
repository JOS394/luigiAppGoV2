package models

import "time"

type Usuario struct {
	ID           string     `json:"id" validate:"required"`
	Nombre       string     `json:"nombre" validate:"required"`
	Email        string     `json:"email" validate:"required,email"`
	PasswordHash string     `json:"-" validate:"required"`
	Rol          string     `json:"rol" validate:"required"`
	Estado       string     `json:"estado" validate:"required"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	Token   string  `json:"token"`
	Usuario Usuario `json:"usuario"`
}

type RegisterRequest struct {
	Nombre   string `json:"nombre" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	Rol      string `json:"rol" validate:"required"`
}
