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
	if r.Method != http.MethodPost && r.Method != http.MethodPatch {
		w.Header().Set("Allow", "POST, PATCH")
		errorResponse(w, http.StatusMethodNotAllowed, "Método no permitido")
		return
	}

	id := getID(r)
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
		query = `UPDATE productos SET stock = stock + $1 WHERE id = $2`
	} else if input.Tipo == "Salida" {
		query = `UPDATE productos SET stock = stock - $1 WHERE id = $2`
	} else { // Ajuste
		query = `UPDATE productos SET stock = $1 WHERE id = $2`
	}

	_, err = tx.Exec(query, input.Cantidad, id)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar stock: "+err.Error())
		return
	}

	// 2. Registrar en inventario_movimientos
	_, err = tx.Exec(`INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo) VALUES ($1, $2, $3, $4)`,
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

func (h *InventoryHandler) GetMovimientosByProducto(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	if id == "" {
		errorResponse(w, http.StatusBadRequest, "ID del producto es requerido")
		return
	}

	rows, err := h.DB.Query(`SELECT id, producto_id, tipo, cantidad, motivo, created_at FROM inventario_movimientos WHERE producto_id = $1 ORDER BY created_at DESC`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar historial: "+err.Error())
		return
	}
	defer rows.Close()

	movimientos := []models.InventarioMovimiento{}
	for rows.Next() {
		var m models.InventarioMovimiento
		var tipo, motivo sql.NullString
		if err := rows.Scan(&m.ID, &m.ProductoID, &tipo, &m.Cantidad, &motivo, &m.CreatedAt); err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al escanear fila: "+err.Error())
			return
		}
		if tipo.Valid {
			m.Tipo = &tipo.String
		}
		if motivo.Valid {
			m.Motivo = &motivo.String
		}
		movimientos = append(movimientos, m)
	}

	jsonResponse(w, http.StatusOK, movimientos)
}
