package models

type MovimientoFinanciero struct {
	ID          int     `json:"id"`
	Fecha       string  `json:"fecha"`
	Tipo        string  `json:"tipo"` // 'Ingreso', 'Egreso'
	Categoria   string  `json:"categoria"`
	Monto       float64 `json:"monto"`
	MetodoPago  string  `json:"metodo_pago"`
	Descripcion string  `json:"descripcion"`
	Referencia  string  `json:"referencia"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
	DeletedAt   *string `json:"deleted_at"`
}

type ResumenFinanciero struct {
	Balance  float64 `json:"balance"`
	Ingresos float64 `json:"ingresos"`
	Egresos  float64 `json:"egresos"`
	Mes      string  `json:"mes"`
}
