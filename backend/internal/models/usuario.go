package models

type Usuario struct {
	ID           string  `json:"id"`
	Nombre       string  `json:"nombre"`
	Email        string  `json:"email"`
	PasswordHash string  `json:"-"` // No exponer en JSON
	Rol          string  `json:"rol"` // 'administrador', 'vendedor'
	Estado       string  `json:"estado"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
	DeletedAt    *string `json:"deleted_at"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token   string  `json:"token"`
	Usuario Usuario `json:"usuario"`
}

type RegisterRequest struct {
	Nombre   string `json:"nombre"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Rol      string `json:"rol"`
}
