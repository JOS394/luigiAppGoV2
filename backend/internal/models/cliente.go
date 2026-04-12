package models

type Cliente struct {
	ID           string  `json:"id"`
	Nombre       string  `json:"nombre"`
	Email        string  `json:"email"`
	Telefono     string  `json:"telefono"`
	Direccion    string  `json:"direccion"`
	Notas        string  `json:"notas"`
	TotalCompras float64 `json:"total_compras"`
	UltimaVisita string  `json:"ultima_visita"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
	DeletedAt    *string `json:"deleted_at"`
}
