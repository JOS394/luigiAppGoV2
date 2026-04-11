package models

type Proveedor struct {
	ID        string `json:"id"`
	Nombre    string `json:"nombre"`
	Email     string `json:"email"`
	Telefono  string `json:"telefono"`
	Direccion string `json:"direccion"`
	CreatedAt string `json:"created_at"`
}
