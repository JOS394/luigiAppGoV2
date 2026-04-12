package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type FinanceHandler struct {
	DB *sql.DB
}

func (h *FinanceHandler) GetMovimientos(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, fecha, tipo, categoria, monto, metodo_pago, descripcion FROM movimientos_financieros ORDER BY fecha DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar movimientos: "+err.Error())
		return
	}
	defer rows.Close()

	movimientos := []models.MovimientoFinanciero{}
	for rows.Next() {
		var m models.MovimientoFinanciero
		err := rows.Scan(&m.ID, &m.Fecha, &m.Tipo, &m.Categoria, &m.Monto, &m.MetodoPago, &m.Descripcion)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al leer fila: "+err.Error())
			return
		}
		movimientos = append(movimientos, m)
	}
	jsonResponse(w, http.StatusOK, movimientos)
}

func (h *FinanceHandler) CreateMovimiento(w http.ResponseWriter, r *http.Request) {
	var m models.MovimientoFinanciero
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	_, err := h.DB.Exec(`INSERT INTO movimientos_financieros (tipo, categoria, monto, metodo_pago, descripcion) VALUES (?, ?, ?, ?, ?)`,
		m.Tipo, m.Categoria, m.Monto, m.MetodoPago, m.Descripcion)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al insertar movimiento: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Movimiento registrado con éxito"})
}

func (h *FinanceHandler) UpdateMovimiento(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	var m models.MovimientoFinanciero
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	_, err := h.DB.Exec(`UPDATE movimientos_financieros SET tipo = ?, categoria = ?, monto = ?, metodo_pago = ?, descripcion = ? WHERE id = ?`,
		m.Tipo, m.Categoria, m.Monto, m.MetodoPago, m.Descripcion, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar movimiento: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Movimiento actualizado con éxito"})
}

func (h *FinanceHandler) DeleteMovimiento(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	_, err := h.DB.Exec(`DELETE FROM movimientos_financieros WHERE id = ?`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar movimiento: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Movimiento eliminado con éxito"})
}


func (h *FinanceHandler) GetResumen(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT 
			COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0) as ingresos,
			COALESCE(SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END), 0) as egresos
		FROM movimientos_financieros
		WHERE deleted_at IS NULL
	`
	var ingresos, egresos float64
	err := h.DB.QueryRow(query).Scan(&ingresos, &egresos)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al calcular balances: "+err.Error())
		return
	}

	resumen := models.ResumenFinanciero{
		Ingresos: ingresos,
		Egresos:  egresos,
		Balance:  ingresos - egresos,
		Mes:      time.Now().Format("January 2006"),
	}

	jsonResponse(w, http.StatusOK, resumen)
}
