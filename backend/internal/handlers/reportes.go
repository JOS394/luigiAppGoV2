package handlers

import (
	"database/sql"
	"net/http"
)

type ReportHandler struct {
	DB *sql.DB
}

func (h *ReportHandler) GetResumen(w http.ResponseWriter, r *http.Request) {
	// Ventas de hoy
	var ventasHoy float64
	queryHoy := `SELECT COALESCE(SUM(total_total), 0) FROM ventas WHERE created_at::date = CURRENT_DATE AND deleted_at IS NULL`
	h.DB.QueryRow(queryHoy).Scan(&ventasHoy)

	// Ventas de ayer (para calcular crecimiento)
	var ventasAyer float64
	queryAyer := `SELECT COALESCE(SUM(total_total), 0) FROM ventas WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day' AND deleted_at IS NULL`
	h.DB.QueryRow(queryAyer).Scan(&ventasAyer)

	// Crecimiento
	crecimiento := 0.0
	if ventasAyer > 0 {
		crecimiento = ((ventasHoy - ventasAyer) / ventasAyer) * 100
	}

	// Transacciones totales y ticket promedio
	var totalTransacciones int
	var ticketPromedio float64
	queryStats := `SELECT COUNT(*), COALESCE(AVG(total_total), 0) FROM ventas WHERE deleted_at IS NULL`
	h.DB.QueryRow(queryStats).Scan(&totalTransacciones, &ticketPromedio)

	// Balance mensual (Ingresos - Egresos)
	var ingresos, egresos float64
	queryFinanzas := `
		SELECT 
			COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END), 0)
		FROM movimientos_financieros
		WHERE deleted_at IS NULL AND to_char(fecha, 'MM-YYYY') = to_char(CURRENT_TIMESTAMP, 'MM-YYYY')
	`
	h.DB.QueryRow(queryFinanzas).Scan(&ingresos, &egresos)

	resumen := map[string]interface{}{
		"ventas_hoy":            ventasHoy,
		"crecimiento":           crecimiento,
		"transacciones_totales": totalTransacciones,
		"tickets_promedio":      ticketPromedio,
		"utilidad_bruta":        ingresos - egresos,
		"proyeccion_mes":        ventasHoy * 30, // Estimación simple
	}

	jsonResponse(w, http.StatusOK, resumen)
}

func (h *ReportHandler) GetDetallado(w http.ResponseWriter, r *http.Request) {
	// 1. Top Productos más vendidos
	queryTopProd := `
		SELECT p.id, p.nombre, SUM(vd.subtotal) as valor, SUM(vd.cantidad) as cantidad
		FROM venta_detalles vd
		JOIN productos p ON vd.producto_id = p.id
		GROUP BY p.id
		ORDER BY valor DESC
		LIMIT 5
	`
	rowsProd, _ := h.DB.Query(queryTopProd)
	defer rowsProd.Close()
	
	topProductos := []map[string]interface{}{}
	for rowsProd.Next() {
		var id, nombre string
		var valor, cantidad float64
		rowsProd.Scan(&id, &nombre, &valor, &cantidad)
		topProductos = append(topProductos, map[string]interface{}{
			"id": id, "nombre": nombre, "valor": valor, "cantidad": cantidad,
		})
	}

	// 2. Ventas por día de la última semana
	querySemana := `
		SELECT EXTRACT(DOW FROM created_at) as dia_sem, SUM(total_total) as monto
		FROM ventas
		WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL
		GROUP BY dia_sem
		ORDER BY dia_sem ASC
	`
	rowsSemana, _ := h.DB.Query(querySemana)
	defer rowsSemana.Close()

	dias := []string{"Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"}
	ventasSemanales := []map[string]interface{}{}
	for rowsSemana.Next() {
		var diaIdx int
		var monto float64
		rowsSemana.Scan(&diaIdx, &monto)
		ventasSemanales = append(ventasSemanales, map[string]interface{}{
			"dia": dias[diaIdx], "monto": monto,
		})
	}

	// 3. Top Categorías
	queryCat := `
		SELECT COALESCE(p.categoria, 'General') as cat, SUM(vd.subtotal) as valor
		FROM venta_detalles vd
		JOIN productos p ON vd.producto_id = p.id
		GROUP BY cat
		ORDER BY valor DESC
	`
	rowsCat, _ := h.DB.Query(queryCat)
	defer rowsCat.Close()

	topCategorias := []map[string]interface{}{}
	for rowsCat.Next() {
		var nombre string
		var valor float64
		rowsCat.Scan(&nombre, &valor)
		topCategorias = append(topCategorias, map[string]interface{}{
			"nombre": nombre, "valor": valor,
		})
	}

	res := map[string]interface{}{
		"top_productos":    topProductos,
		"top_categorias":   topCategorias,
		"ventas_semanales": ventasSemanales,
	}

	jsonResponse(w, http.StatusOK, res)
}
