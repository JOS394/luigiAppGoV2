package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type InventoryHandler struct {
	DB *sql.DB
}

func (h *InventoryHandler) UpdateStock(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		errorResponse(w, http.StatusBadRequest, "ID del producto es requerido")
		return
	}

	var input struct {
		Cantidad int    `json:"cantidad"`
		Tipo     string `json:"tipo"` // 'Entrada', 'Salida', 'Ajuste'
		Motivo   string `json:"motivo"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo iniciar la transacción")
		return
	}

	// 1. Actualizar el stock en la tabla productos
	var query string
	if input.Tipo == "Entrada" {
		query = `UPDATE productos SET stock = stock + ? WHERE id = ?`
	} else if input.Tipo == "Salida" {
		query = `UPDATE productos SET stock = stock - ? WHERE id = ?`
	} else { // Ajuste
		query = `UPDATE productos SET stock = ? WHERE id = ?`
	}

	_, err = tx.Exec(query, input.Cantidad, id)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar stock: "+err.Error())
		return
	}

	// 2. Registrar en inventario_movimientos
	_, err = tx.Exec(`INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)`,
		id, input.Tipo, input.Cantidad, input.Motivo)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al registrar movimiento de inventario: "+err.Error())
		return
	}

	if err := tx.Commit(); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al confirmar transacción")
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Stock actualizado correctamente"})
}

func (h *InventoryHandler) GetValorInventario(w http.ResponseWriter, r *http.Request) {
	query := `SELECT COALESCE(SUM(precio * stock), 0) as total FROM productos WHERE tipo = 'producto'`
	var total float64
	err := h.DB.QueryRow(query).Scan(&total)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al calcular valor del inventario: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, models.InventarioValor{ValorTotal: total})
}
