package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type VentaHandler struct {
	DB *sql.DB
}

func (h *VentaHandler) CreateVenta(w http.ResponseWriter, r *http.Request) {
	var v models.Venta
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo iniciar la transacción")
		return
	}

	// 1. Insertar cabecera de venta
	_, err = tx.Exec(`INSERT INTO ventas (id, cliente, total, estado) VALUES (?, ?, ?, ?)`,
		v.ID, v.Cliente, v.Total, v.Estado)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al insertar venta: "+err.Error())
		return
	}

	// 2. Insertar detalles y actualizar stock
	for _, d := range v.Detalle {
		_, err = tx.Exec(`INSERT INTO venta_detalles (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
			v.ID, d.ProductoID, d.Cantidad, d.PrecioUnitario, d.Subtotal)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al insertar detalle: "+err.Error())
			return
		}

		// Restar stock solo si es tipo 'producto'
		var tipo string
		err = tx.QueryRow(`SELECT tipo FROM productos WHERE id = ?`, d.ProductoID).Scan(&tipo)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al verificar tipo de producto: "+err.Error())
			return
		}

		if tipo == "producto" {
			_, err = tx.Exec(`UPDATE productos SET stock = stock - ? WHERE id = ?`, d.Cantidad, d.ProductoID)
			if err != nil {
				tx.Rollback()
				errorResponse(w, http.StatusInternalServerError, "Error al actualizar stock: "+err.Error())
				return
			}
		}
	}

	// 3. Registrar el ingreso financiero
	_, err = tx.Exec(`INSERT INTO movimientos_financieros (tipo, categoria, monto, metodo_pago, descripcion) VALUES (?, ?, ?, ?, ?)`,
		"Ingreso", "Venta", v.Total, "Efectivo", "Venta ID: "+v.ID) // Asumimos efectivo por ahora o sacamos de v
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al registrar ingreso financiero: "+err.Error())
		return
	}

	if err := tx.Commit(); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al confirmar transacción")
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Venta registrada con éxito", "id": v.ID})
}
