package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
	"github.com/google/uuid"
)

type PurchaseHandler struct {
	DB *sql.DB
}

func (h *PurchaseHandler) CreateCompra(w http.ResponseWriter, r *http.Request) {
	var c models.Compra
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	if c.ID == "" {
		c.ID = uuid.New().String()
	}

	tx, err := h.DB.Begin()
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo iniciar la transacción")
		return
	}

	// 1. Insertar cabecera de compra
	_, err = tx.Exec(`INSERT INTO compras (id, proveedor_id, total_neto, impuesto, total_total, metodo_pago) VALUES ($1, $2, $3, $4, $5, $6)`,
		c.ID, c.ProveedorID, c.TotalNeto, c.Impuesto, c.TotalTotal, c.MetodoPago)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al insertar compra: "+err.Error())
		return
	}

	// 2. Insertar detalles y aumentar stock
	for _, d := range c.Detalles {
		_, err = tx.Exec(`INSERT INTO compra_detalles (compra_id, producto_id, cantidad, precio_unitario, precio_sugerido, subtotal) VALUES ($1, $2, $3, $4, $5, $6)`,
			c.ID, d.ProductoID, d.Cantidad, d.PrecioUnitario, d.PrecioSugerido, d.Subtotal)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al insertar detalle de compra: "+err.Error())
			return
		}

		// Aumentar stock y actualizar costos del producto
		// Actualizamos costo_unitario con el precio de la última compra
		_, err = tx.Exec(`UPDATE productos SET stock = stock + $1, costo_unitario = $2, precio = $3 WHERE id = $4`, 
			d.Cantidad, d.PrecioUnitario, d.PrecioSugerido, d.ProductoID)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al actualizar producto: "+err.Error())
			return
		}

		// Opcional: Registrar en inventario_movimientos
		_, err = tx.Exec(`INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo) VALUES ($1, $2, $3, $4)`,
			d.ProductoID, "Entrada", d.Cantidad, "Compra ID: "+c.ID)
		if err != nil {
			tx.Rollback()
			errorResponse(w, http.StatusInternalServerError, "Error al registrar movimiento de inventario: "+err.Error())
			return
		}
	}

	// 3. Registrar el egreso financiero
	_, err = tx.Exec(`INSERT INTO movimientos_financieros (tipo, categoria, monto, metodo_pago, descripcion, referencia) VALUES ($1, $2, $3, $4, $5, $6)`,
		"Egreso", "Proveedor", c.TotalTotal, c.MetodoPago, "Compra ID: "+c.ID, c.ID)
	if err != nil {
		tx.Rollback()
		errorResponse(w, http.StatusInternalServerError, "Error al registrar egreso financiero: "+err.Error())
		return
	}

	if err := tx.Commit(); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al confirmar transacción")
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Compra registrada con éxito", "id": c.ID})
}

func (h *PurchaseHandler) GetCompras(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, proveedor_id, total_neto, impuesto, total_total, metodo_pago, fecha_compra, created_at, updated_at, deleted_at FROM compras WHERE deleted_at IS NULL ORDER BY fecha_compra DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener compras: "+err.Error())
		return
	}
	defer rows.Close()

	compras := []models.Compra{}
	for rows.Next() {
		var c models.Compra
		c.Detalles = []models.CompraDetalle{} // Inicializar detalles también
		if err := rows.Scan(&c.ID, &c.ProveedorID, &c.TotalNeto, &c.Impuesto, &c.TotalTotal, &c.MetodoPago, &c.FechaCompra, &c.CreatedAt, &c.UpdatedAt, &c.DeletedAt); err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al escanear compras: "+err.Error())
			return
		}

		// Obtener detalles de la compra
		detailRows, err := h.DB.Query(`SELECT id, producto_id, cantidad, precio_unitario, precio_sugerido, subtotal FROM compra_detalles WHERE compra_id = $1`, c.ID)
		if err == nil {
			for detailRows.Next() {
				var d models.CompraDetalle
				if err := detailRows.Scan(&d.ID, &d.ProductoID, &d.Cantidad, &d.PrecioUnitario, &d.PrecioSugerido, &d.Subtotal); err == nil {
					c.Detalles = append(c.Detalles, d)
				}
			}
			detailRows.Close() // Cerrar manualmente dentro del bucle
		}

		compras = append(compras, c)
	}

	jsonResponse(w, http.StatusOK, compras)
}
