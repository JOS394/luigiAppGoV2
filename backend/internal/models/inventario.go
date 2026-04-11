package models

type InventarioMovimiento struct {
	ID         int    `json:"id"`
	ProductoID string `json:"producto_id"`
	Tipo       string `json:"tipo"` // 'Entrada', 'Salida', 'Ajuste'
	Cantidad   int    `json:"cantidad"`
	Motivo     string `json:"motivo"`
	Fecha      string `json:"fecha"`
}

type InventarioValor struct {
	ValorTotal float64 `json:"valor_total"`
}
