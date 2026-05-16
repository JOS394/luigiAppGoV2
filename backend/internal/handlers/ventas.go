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

	if v.ID == "" {
		v.ID = "V-" + string(rune(1000+len(v.Cliente))) // Generador muy simple de respaldo
	}
	if v.Estado == "" {
		v.Estado = "Completada"
	}

	tx, err := h.DB.Begin()
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo iniciar la transacción")
		return
	}

	// 1. Insertar cabecera de venta
	_, err = tx.Exec(`INSERT INTO ventas (id, cliente, total, estado) VALUES ($1, $2, $3, $4)`,
		v.ID, v.Cliente, v.Total, v.Estado)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al insertar venta: "+err.Error())
		return
	}

	// 2. Insertar detalles y actualizar stock
	for _, d := range v.Detalle {
		_, err = tx.Exec(`INSERT INTO venta_detalles (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)`,
			v.ID, d.ProductoID, d.Cantidad, d.PrecioUnitario, d.Subtotal)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al insertar detalle: "+err.Error())
			return
		}

		// Restar stock solo si es tipo 'producto'
		var tipo string
		err = tx.QueryRow(`SELECT tipo FROM productos WHERE id = $1`, d.ProductoID).Scan(&tipo)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al verificar tipo de producto: "+err.Error())
			return
		}

		if tipo == "producto" {
			_, err = tx.Exec(`UPDATE productos SET stock = stock - $1 WHERE id = $2`, d.Cantidad, d.ProductoID)
			if err != nil {
				tx.Rollback()
				errorResponse(w, http.StatusInternalServerError, "Error al actualizar stock: "+err.Error())
				return
			}

			// REGISTRO EN KARDEX
			_, err = tx.Exec(`INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo) VALUES ($1, $2, $3, $4)`,
				d.ProductoID, "Salida", d.Cantidad, "Venta Folio: "+v.ID)
			if err != nil {
				tx.Rollback()
				errorResponse(w, http.StatusInternalServerError, "Error al registrar Kardex: "+err.Error())
				return
			}
		}
	}

	// 3. Registrar el ingreso financiero
	_, err = tx.Exec(`INSERT INTO movimientos_financieros (tipo, categoria, monto, metodo_pago, descripcion) VALUES ($1, $2, $3, $4, $5)`,
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

func (h *VentaHandler) GetVentas(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, cliente, total, estado, fecha, created_at, updated_at, deleted_at FROM ventas WHERE deleted_at IS NULL ORDER BY fecha DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener ventas: "+err.Error())
		return
	}
	defer rows.Close()

	ventas := []models.Venta{}
	for rows.Next() {
		var v models.Venta
		v.Detalle = []models.VentaDetalle{} // Inicializar como slice vacío en lugar de nil
		if err := rows.Scan(&v.ID, &v.Cliente, &v.Total, &v.Estado, &v.Fecha, &v.CreatedAt, &v.UpdatedAt, &v.DeletedAt); err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al escanear ventas: "+err.Error())
			return
		}

		// Obtener detalles de la venta
		detailRows, err := h.DB.Query(`SELECT id, producto_id, cantidad, precio_unitario, subtotal FROM venta_detalles WHERE venta_id = $1`, v.ID)
		if err == nil {
			for detailRows.Next() {
				var d models.VentaDetalle
				if err := detailRows.Scan(&d.ID, &d.ProductoID, &d.Cantidad, &d.PrecioUnitario, &d.Subtotal); err == nil {
					v.Detalle = append(v.Detalle, d)
				}
			}
			detailRows.Close() // Cerrar manualmente dentro del bucle
		}

		ventas = append(ventas, v)
	}

	jsonResponse(w, http.StatusOK, ventas)
}

func (h *VentaHandler) DeleteVenta(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	_, err := h.DB.Exec(`UPDATE ventas SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar venta: "+err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
