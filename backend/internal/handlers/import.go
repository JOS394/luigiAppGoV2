package handlers

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
)

type ImportHandler struct {
	DB *sql.DB
}

func (h *ImportHandler) GetTemplate(w http.ResponseWriter, r *http.Request) {
	context := r.URL.Query().Get("context")

	var headers []string
	var exampleRow []string
	fileName := "plantilla_importacion.xlsx"

	switch context {
	case "productos":
		headers = []string{"SKU", "Nombre", "Descripcion", "Precio", "Costo", "Costo_Unitario", "Stock", "Categoria", "Tipo", "Codigo_Barras", "Ubicacion", "Ubicacion_Especifica"}
		exampleRow = []string{"PROD-001", "Coca Cola 2L", "Refresco embotellado de 2 litros", "2.50", "1.80", "1.80", "50", "Bebidas", "producto", "7501055300074", "Pasillo A", "Estante 3 Nivel 2"}
		fileName = "plantilla_productos.xlsx"
	case "servicios":
		headers = []string{"Nombre", "Descripcion", "Precio", "Categoria"}
		exampleRow = []string{"Alineación y Balanceo", "Alineación de dirección y balanceo de 4 ruedas", "45.00", "Servicios"}
		fileName = "plantilla_servicios.xlsx"
	case "clientes":
		headers = []string{"Nombre", "Email", "Telefono", "Direccion", "Notas"}
		exampleRow = []string{"Juan Perez", "juan@example.com", "+50370001122", "Calle Principal #123", "Cliente VIP"}
		fileName = "plantilla_clientes.xlsx"
	case "proveedores":
		headers = []string{"Nombre", "Email", "Telefono", "Direccion"}
		exampleRow = []string{"Distribuidora Alfa", "contacto@alfa.com", "+50322223333", "Zona Industrial Edificio B"}
		fileName = "plantilla_proveedores.xlsx"
	default:
		headers = []string{"Nombre", "SKU"}
		exampleRow = []string{"Ejemplo", "SKU-123"}
	}

	f := excelize.NewFile()
	defer f.Close()

	sheet := "Sheet1"
	// Write headers
	for colIdx, header := range headers {
		colName, _ := excelize.ColumnNumberToName(colIdx + 1)
		f.SetCellValue(sheet, colName+"1", header)
	}

	// Write example row
	for colIdx, val := range exampleRow {
		colName, _ := excelize.ColumnNumberToName(colIdx + 1)
		f.SetCellValue(sheet, colName+"2", val)
	}

	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))

	if err := f.Write(w); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al generar plantilla: "+err.Error())
	}
}

func (h *ImportHandler) ImportProductos(w http.ResponseWriter, r *http.Request) {
	tipoDefault := r.URL.Query().Get("tipo")
	if tipoDefault == "" {
		tipoDefault = "producto"
	}

	// 1. Obtener el archivo del request
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "No se pudo leer el archivo: "+err.Error())
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	var rows [][]string

	if ext == ".csv" {
		reader := csv.NewReader(file)
		// Permitir número variable de campos
		reader.FieldsPerRecord = -1
		rows, err = reader.ReadAll()
		if err != nil {
			errorResponse(w, http.StatusBadRequest, "Error leyendo CSV: "+err.Error())
			return
		}
	} else if ext == ".xlsx" {
		f, err := excelize.OpenReader(file)
		if err != nil {
			errorResponse(w, http.StatusBadRequest, "Error leyendo Excel: "+err.Error())
			return
		}
		defer f.Close()

		// Obtener primera hoja
		sheets := f.GetSheetList()
		if len(sheets) == 0 {
			errorResponse(w, http.StatusBadRequest, "El archivo Excel no tiene hojas de trabajo")
			return
		}
		
		excelRows, err := f.GetRows(sheets[0])
		if err != nil {
			errorResponse(w, http.StatusBadRequest, "Error al procesar hoja Excel: "+err.Error())
			return
		}
		rows = excelRows
	} else {
		errorResponse(w, http.StatusBadRequest, "Formato no soportado. Debe ser .csv o .xlsx")
		return
	}

	if len(rows) < 2 {
		errorResponse(w, http.StatusBadRequest, "El archivo está vacío o no contiene filas de datos")
		return
	}

	// 2. Mapear cabeceras
	headerMap := make(map[string]int)
	for i, h := range rows[0] {
		normalized := strings.ToLower(strings.TrimSpace(h))
		// Normalizaciones comunes
		normalized = strings.ReplaceAll(normalized, "á", "a")
		normalized = strings.ReplaceAll(normalized, "é", "e")
		normalized = strings.ReplaceAll(normalized, "í", "i")
		normalized = strings.ReplaceAll(normalized, "ó", "o")
		normalized = strings.ReplaceAll(normalized, "ú", "u")
		normalized = strings.ReplaceAll(normalized, " ", "_")
		headerMap[normalized] = i
	}

	valOf := func(row []string, names ...string) string {
		for _, name := range names {
			if idx, ok := headerMap[name]; ok && idx < len(row) {
				return strings.TrimSpace(row[idx])
			}
		}
		return ""
	}

	// 3. Comenzar transacción
	tx, err := h.DB.Begin()
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al iniciar transacción: "+err.Error())
		return
	}
	defer tx.Rollback()

	insertedCount := 0
	updatedCount := 0

	for i := 1; i < len(rows); i++ {
		row := rows[i]
		if len(row) == 0 || (len(row) == 1 && row[0] == "") {
			continue
		}

		nombre := valOf(row, "nombre", "name", "producto")
		sku := valOf(row, "sku", "codigo", "referencia")
		precioStr := valOf(row, "precio", "price", "venta")
		costoStr := valOf(row, "costo", "cost", "compra")
		costoUnitarioStr := valOf(row, "costo_unitario", "costo unitario", "unit_cost")
		stockStr := valOf(row, "stock", "existencias", "cantidad")
		categoria := valOf(row, "categoria", "category")
		tipo := valOf(row, "tipo", "type")
		codigoBarras := valOf(row, "codigo_barras", "codigo barras", "barcode", "codigo de barras")
		codigoBarrasSec := valOf(row, "codigo_barras_secundario", "codigo barras secundario", "secondary_barcode")
		ubicacion := valOf(row, "ubicacion", "location")
		ubicacionEspe := valOf(row, "ubicacion_especifica", "especifica", "specific_location")
		descripcion := valOf(row, "descripcion", "description", "detalle")

		if tipo == "" {
			tipo = tipoDefault
		}
		if categoria == "" {
			categoria = "General"
		}

		if nombre == "" {
			continue
		}
		if sku == "" {
			if tipo == "servicio" {
				sku = "SRV-" + uuid.New().String()[:8]
			} else {
				continue
			}
		}

		precio, _ := strconv.ParseFloat(precioStr, 64)
		costo, _ := strconv.ParseFloat(costoStr, 64)
		costoUnitario, _ := strconv.ParseFloat(costoUnitarioStr, 64)
		stock, _ := strconv.Atoi(stockStr)

		var existingID string
		err := tx.QueryRow(`SELECT id FROM productos WHERE sku = $1 AND deleted_at IS NULL`, sku).Scan(&existingID)
		
		if err == sql.ErrNoRows {
			newID := uuid.New().String()
			insertQuery := `INSERT INTO productos (id, nombre, precio, costo, costo_unitario, stock, sku, descripcion, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica) 
							VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`
			
			var descPtr, cbPtr, cbsPtr, ubiPtr, ubiEspePtr *string
			if descripcion != "" { descPtr = &descripcion }
			if codigoBarras != "" { cbPtr = &codigoBarras }
			if codigoBarrasSec != "" { cbsPtr = &codigoBarrasSec }
			if ubicacion != "" { ubiPtr = &ubicacion }
			if ubicacionEspe != "" { ubiEspePtr = &ubicacionEspe }

			_, err = tx.Exec(insertQuery, newID, nombre, precio, costo, costoUnitario, stock, sku, descPtr, categoria, tipo, cbPtr, cbsPtr, ubiPtr, ubiEspePtr)
			if err != nil {
				errorResponse(w, http.StatusInternalServerError, fmt.Sprintf("Error al insertar fila %d: %v", i+1, err))
				return
			}
			insertedCount++
		} else if err == nil {
			updateQuery := `UPDATE productos SET nombre = $1, precio = $2, costo = $3, costo_unitario = $4, descripcion = $5, categoria = $6, tipo = $7, codigo_barras = $8, codigo_barras_secundario = $9, ubicacion = $10, ubicacion_especifica = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12`
			
			var descPtr, cbPtr, cbsPtr, ubiPtr, ubiEspePtr *string
			if descripcion != "" { descPtr = &descripcion }
			if codigoBarras != "" { cbPtr = &codigoBarras }
			if codigoBarrasSec != "" { cbsPtr = &codigoBarrasSec }
			if ubicacion != "" { ubiPtr = &ubicacion }
			if ubicacionEspe != "" { ubiEspePtr = &ubicacionEspe }

			_, err = tx.Exec(updateQuery, nombre, precio, costo, costoUnitario, descPtr, categoria, tipo, cbPtr, cbsPtr, ubiPtr, ubiEspePtr, existingID)
			if err != nil {
				errorResponse(w, http.StatusInternalServerError, fmt.Sprintf("Error al actualizar fila %d: %v", i+1, err))
				return
			}
			updatedCount++
		} else {
			errorResponse(w, http.StatusInternalServerError, "Error en verificación de base de datos: "+err.Error())
			return
		}
	}

	if err := tx.Commit(); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al confirmar importación: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"success":  true,
		"inserted": insertedCount,
		"updated":  updatedCount,
		"message":  fmt.Sprintf("Importación completada: %d creados, %d actualizados", insertedCount, updatedCount),
	})
}
