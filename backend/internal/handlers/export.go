package handlers

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"net/http"
	"time"
)

type ExportHandler struct {
	DB *sql.DB
}

func (h *ExportHandler) ExportProductos(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, nombre, sku, descripcion, precio, costo, costo_unitario, stock, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica, imagen_url, created_at FROM productos WHERE deleted_at IS NULL`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	// Configurar headers para descarga de archivo
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment;filename=productos_%s.csv", time.Now().Format("2006-01-02")))

	writer := csv.NewWriter(w)
	defer writer.Flush()

	// Escribir cabecera
	writer.Write([]string{"ID", "Nombre", "SKU", "Descripción", "Precio", "Costo", "Costo Unitario", "Stock", "Categoria", "Tipo", "Codigo Barras", "Codigo Barras Secundario", "Ubicacion", "Ubicacion Especifica", "Imagen URL", "Fecha Registro"})

	for rows.Next() {
		var id, nombre, sku, categoria, tipo string
		var descripcion, codBarras, codBarrasSec, ubicacion, ubiEspecifica, imagenUrl sql.NullString
		var precio, costo, costoUnitario float64
		var stock int
		var createdAt time.Time
		err := rows.Scan(&id, &nombre, &sku, &descripcion, &precio, &costo, &costoUnitario, &stock, &categoria, &tipo, &codBarras, &codBarrasSec, &ubicacion, &ubiEspecifica, &imagenUrl, &createdAt)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al leer fila de producto: "+err.Error())
			return
		}
		writer.Write([]string{
			id, nombre, sku, descripcion.String, fmt.Sprintf("%.2f", precio), fmt.Sprintf("%.2f", costo),
			fmt.Sprintf("%.2f", costoUnitario), fmt.Sprintf("%d", stock), categoria, tipo,
			codBarras.String, codBarrasSec.String, ubicacion.String, ubiEspecifica.String, imagenUrl.String,
			createdAt.Format("2006-01-02 15:04:05"),
		})
	}
}

func (h *ExportHandler) ExportVentas(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, cliente_nombre, total_total, estado, created_at FROM ventas WHERE deleted_at IS NULL ORDER BY created_at DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment;filename=ventas_%s.csv", time.Now().Format("2006-01-02")))

	writer := csv.NewWriter(w)
	defer writer.Flush()

	writer.Write([]string{"Folio", "Cliente", "Total", "Estado", "Fecha"})

	for rows.Next() {
		var id, estado string
		var clienteNombre sql.NullString
		var total float64
		var createdAt time.Time
		rows.Scan(&id, &clienteNombre, &total, &estado, &createdAt)
		clienteStr := ""
		if clienteNombre.Valid {
			clienteStr = clienteNombre.String
		}
		writer.Write([]string{id, clienteStr, fmt.Sprintf("%.2f", total), estado, createdAt.Format("2006-01-02 15:04:05")})
	}
}

func (h *ExportHandler) ExportClientes(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, nombre, email, telefono, total_compras FROM clientes WHERE deleted_at IS NULL`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment;filename=clientes_%s.csv", time.Now().Format("2006-01-02")))

	writer := csv.NewWriter(w)
	defer writer.Flush()

	writer.Write([]string{"ID", "Nombre", "Email", "Telefono", "Total Compras"})

	for rows.Next() {
		var id, nombre string
		var email, telefono sql.NullString
		var total float64
		rows.Scan(&id, &nombre, &email, &telefono, &total)
		emailStr := ""
		if email.Valid {
			emailStr = email.String
		}
		telefonoStr := ""
		if telefono.Valid {
			telefonoStr = telefono.String
		}
		writer.Write([]string{id, nombre, emailStr, telefonoStr, fmt.Sprintf("%.2f", total)})
	}
}

func (h *ExportHandler) ExportMovimientos(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, fecha, tipo, categoria, monto, metodo_pago, descripcion FROM movimientos_financieros WHERE deleted_at IS NULL ORDER BY fecha DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment;filename=finanzas_%s.csv", time.Now().Format("2006-01-02")))

	writer := csv.NewWriter(w)
	defer writer.Flush()

	writer.Write([]string{"ID", "Fecha", "Tipo", "Categoria", "Monto", "Metodo Pago", "Descripcion"})

	for rows.Next() {
		var id, tipo, categoria, metodo string
		var desc sql.NullString
		var fecha time.Time
		var monto float64
		rows.Scan(&id, &fecha, &tipo, &categoria, &monto, &metodo, &desc)
		descStr := ""
		if desc.Valid {
			descStr = desc.String
		}
		writer.Write([]string{id, fecha.Format("2006-01-02 15:04:05"), tipo, categoria, fmt.Sprintf("%.2f", monto), metodo, descStr})
	}
}
