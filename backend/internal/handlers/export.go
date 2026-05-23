package handlers

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"net/http"
	"time"

	"github.com/jung-kurt/gofpdf"
	"github.com/xuri/excelize/v2"
)

type ExportHandler struct {
	DB *sql.DB
}

func writeCSV(w http.ResponseWriter, filename string, headers []string, data [][]string) error {
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))

	writer := csv.NewWriter(w)
	defer writer.Flush()

	if err := writer.Write(headers); err != nil {
		return err
	}

	for _, row := range data {
		if err := writer.Write(row); err != nil {
			return err
		}
	}
	return nil
}

func writeExcel(w http.ResponseWriter, filename string, headers []string, data [][]string) error {
	f := excelize.NewFile()
	defer f.Close()

	sheet := "Sheet1"
	// Set headers
	for colIdx, header := range headers {
		colName, _ := excelize.ColumnNumberToName(colIdx + 1)
		f.SetCellValue(sheet, colName+"1", header)
	}

	// Set rows
	for rowIdx, row := range data {
		for colIdx, val := range row {
			colName, _ := excelize.ColumnNumberToName(colIdx + 1)
			f.SetCellValue(sheet, colName+fmt.Sprintf("%d", rowIdx+2), val)
		}
	}

	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	
	if err := f.Write(w); err != nil {
		return err
	}
	return nil
}

func writePDF(w http.ResponseWriter, filename string, title string, headers []string, data [][]string) error {
	pdf := gofpdf.New("L", "mm", "A4", "") // Horizontal/Landscape layout
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()
	pdf.SetMargins(10, 10, 10)
	
	// Title
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr(title), "", 1, "C", false, 0, "")
	pdf.Ln(5)

	// Column Widths
	colWidth := 277.0 / float64(len(headers))

	// Headers
	pdf.SetFont("Arial", "B", 10)
	pdf.SetFillColor(240, 240, 240)
	for _, header := range headers {
		pdf.CellFormat(colWidth, 10, tr(header), "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	// Data
	pdf.SetFont("Arial", "", 9)
	for _, row := range data {
		for _, val := range row {
			displayVal := val
			if len(displayVal) > 30 {
				displayVal = displayVal[:27] + "..."
			}
			pdf.CellFormat(colWidth, 8, tr(displayVal), "1", 0, "L", false, 0, "")
		}
		pdf.Ln(-1)
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))

	return pdf.Output(w)
}

func (h *ExportHandler) ExportProductos(w http.ResponseWriter, r *http.Request) {
	format := r.URL.Query().Get("format")
	if format == "" {
		format = "csv"
	}
	tipoParam := r.URL.Query().Get("tipo")

	var rows *sql.Rows
	var err error
	if tipoParam != "" {
		rows, err = h.DB.Query(`SELECT id, nombre, sku, descripcion, precio, costo, costo_unitario, stock, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica, imagen_url, created_at FROM productos WHERE deleted_at IS NULL AND tipo = $1`, tipoParam)
	} else {
		rows, err = h.DB.Query(`SELECT id, nombre, sku, descripcion, precio, costo, costo_unitario, stock, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica, imagen_url, created_at FROM productos WHERE deleted_at IS NULL`)
	}
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	var headers []string
	if tipoParam == "servicio" {
		headers = []string{"ID", "Nombre", "Descripción", "Precio", "Categoria", "Tipo", "Fecha Registro"}
	} else {
		headers = []string{"ID", "Nombre", "SKU", "Descripción", "Precio", "Costo", "Costo Unitario", "Stock", "Categoria", "Tipo", "Codigo Barras", "Codigo Barras Secundario", "Ubicacion", "Ubicacion Especifica", "Imagen URL", "Fecha Registro"}
	}
	var data [][]string

	var pdfHeaders []string
	if tipoParam == "servicio" {
		pdfHeaders = []string{"Nombre", "Categoría", "Precio", "Descripción"}
	} else {
		pdfHeaders = []string{"SKU", "Nombre", "Precio", "Stock", "Categoría", "Ubicación"}
	}
	var pdfData [][]string

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

		var row []string
		if tipoParam == "servicio" {
			row = []string{
				id, nombre, descripcion.String, fmt.Sprintf("%.2f", precio), categoria, tipo,
				createdAt.Format("2006-01-02 15:04:05"),
			}
		} else {
			row = []string{
				id, nombre, sku, descripcion.String, fmt.Sprintf("%.2f", precio), fmt.Sprintf("%.2f", costo),
				fmt.Sprintf("%.2f", costoUnitario), fmt.Sprintf("%d", stock), categoria, tipo,
				codBarras.String, codBarrasSec.String, ubicacion.String, ubiEspecifica.String, imagenUrl.String,
				createdAt.Format("2006-01-02 15:04:05"),
			}
		}
		data = append(data, row)

		var pdfRow []string
		if tipoParam == "servicio" {
			pdfRow = []string{
				nombre, categoria, fmt.Sprintf("$%.2f", precio), descripcion.String,
			}
		} else {
			pdfRow = []string{
				sku, nombre, fmt.Sprintf("$%.2f", precio), fmt.Sprintf("%d", stock), categoria, ubicacion.String,
			}
		}
		pdfData = append(pdfData, pdfRow)
	}

	dateStr := time.Now().Format("2006-01-02")
	var fileName string
	var pdfTitle string
	if tipoParam == "servicio" {
		fileName = "servicios_" + dateStr
		pdfTitle = "Reporte de Servicios"
	} else {
		fileName = "productos_" + dateStr
		pdfTitle = "Reporte de Productos"
	}

	switch format {
	case "excel":
		err = writeExcel(w, fileName+".xlsx", headers, data)
	case "pdf":
		err = writePDF(w, fileName+".pdf", pdfTitle, pdfHeaders, pdfData)
	default: // csv
		err = writeCSV(w, fileName+".csv", headers, data)
	}

	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al generar archivo: "+err.Error())
	}
}

func (h *ExportHandler) ExportVentas(w http.ResponseWriter, r *http.Request) {
	format := r.URL.Query().Get("format")
	if format == "" {
		format = "csv"
	}

	rows, err := h.DB.Query(`SELECT id, cliente_nombre, total_total, estado, created_at FROM ventas WHERE deleted_at IS NULL ORDER BY created_at DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	headers := []string{"Folio", "Cliente", "Total", "Estado", "Fecha"}
	var data [][]string

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
		row := []string{id, clienteStr, fmt.Sprintf("%.2f", total), estado, createdAt.Format("2006-01-02 15:04:05")}
		data = append(data, row)
	}

	dateStr := time.Now().Format("2006-01-02")
	switch format {
	case "excel":
		err = writeExcel(w, fmt.Sprintf("ventas_%s.xlsx", dateStr), headers, data)
	case "pdf":
		err = writePDF(w, fmt.Sprintf("ventas_%s.pdf", dateStr), "Reporte de Ventas", headers, data)
	default: // csv
		err = writeCSV(w, fmt.Sprintf("ventas_%s.csv", dateStr), headers, data)
	}

	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al generar archivo: "+err.Error())
	}
}

func (h *ExportHandler) ExportClientes(w http.ResponseWriter, r *http.Request) {
	format := r.URL.Query().Get("format")
	if format == "" {
		format = "csv"
	}

	rows, err := h.DB.Query(`SELECT id, nombre, email, telefono, total_compras FROM clientes WHERE deleted_at IS NULL`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	headers := []string{"ID", "Nombre", "Email", "Teléfono", "Total Compras"}
	var data [][]string

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
		row := []string{id, nombre, emailStr, telefonoStr, fmt.Sprintf("%.2f", total)}
		data = append(data, row)
	}

	dateStr := time.Now().Format("2006-01-02")
	switch format {
	case "excel":
		err = writeExcel(w, fmt.Sprintf("clientes_%s.xlsx", dateStr), headers, data)
	case "pdf":
		err = writePDF(w, fmt.Sprintf("clientes_%s.pdf", dateStr), "Reporte de Clientes", headers, data)
	default: // csv
		err = writeCSV(w, fmt.Sprintf("clientes_%s.csv", dateStr), headers, data)
	}

	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al generar archivo: "+err.Error())
	}
}

func (h *ExportHandler) ExportMovimientos(w http.ResponseWriter, r *http.Request) {
	format := r.URL.Query().Get("format")
	if format == "" {
		format = "csv"
	}

	rows, err := h.DB.Query(`SELECT id, fecha, tipo, categoria, monto, metodo_pago, descripcion FROM movimientos_financieros WHERE deleted_at IS NULL ORDER BY fecha DESC`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al obtener datos: "+err.Error())
		return
	}
	defer rows.Close()

	headers := []string{"ID", "Fecha", "Tipo", "Categoría", "Monto", "Método Pago", "Descripción"}
	var data [][]string

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
		row := []string{id, fecha.Format("2006-01-02 15:04:05"), tipo, categoria, fmt.Sprintf("%.2f", monto), metodo, descStr}
		data = append(data, row)
	}

	dateStr := time.Now().Format("2006-01-02")
	switch format {
	case "excel":
		err = writeExcel(w, fmt.Sprintf("finanzas_%s.xlsx", dateStr), headers, data)
	case "pdf":
		err = writePDF(w, fmt.Sprintf("finanzas_%s.pdf", dateStr), "Reporte de Finanzas", headers, data)
	default: // csv
		err = writeCSV(w, fmt.Sprintf("finanzas_%s.csv", dateStr), headers, data)
	}

	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al generar archivo: "+err.Error())
	}
}
