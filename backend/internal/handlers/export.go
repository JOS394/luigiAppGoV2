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
	rows, err := h.DB.Query(`SELECT id, nombre, precio, costo, stock, categoria, tipo, codigo_barras FROM productos WHERE deleted_at IS NULL`)
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
	writer.Write([]string{"ID", "Nombre", "Precio", "Costo", "Stock", "Categoria", "Tipo", "Codigo Barras"})

	for rows.Next() {
		var id, nombre, categoria, tipo, codigo string
		var precio, costo float64
		var stock int
		rows.Scan(&id, &nombre, &precio, &costo, &stock, &categoria, &tipo, &codigo)
		writer.Write([]string{
			id, nombre, fmt.Sprintf("%.2f", precio), fmt.Sprintf("%.2f", costo),
			fmt.Sprintf("%d", stock), categoria, tipo, codigo,
		})
	}
}

func (h *ExportHandler) ExportVentas(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, cliente, total, estado, fecha FROM ventas WHERE deleted_at IS NULL ORDER BY fecha DESC`)
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
		var id, cliente, estado, fecha string
		var total float64
		rows.Scan(&id, &cliente, &total, &estado, &fecha)
		writer.Write([]string{id, cliente, fmt.Sprintf("%.2f", total), estado, fecha})
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
		var id, nombre, email, telefono string
		var total float64
		rows.Scan(&id, &nombre, &email, &telefono, &total)
		writer.Write([]string{id, nombre, email, telefono, fmt.Sprintf("%.2f", total)})
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
		var id, fecha, tipo, categoria, metodo, desc string
		var monto float64
		rows.Scan(&id, &fecha, &tipo, &categoria, &monto, &metodo, &desc)
		writer.Write([]string{id, fecha, tipo, categoria, fmt.Sprintf("%.2f", monto), metodo, desc})
	}
}
