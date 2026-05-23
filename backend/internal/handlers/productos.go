package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"

	"github.com/JOS394/luigiAppGoV2/internal/models"
	"github.com/google/uuid"
)

type ProductHandler struct {
	DB *sql.DB
}

func (h *ProductHandler) GetProductos(w http.ResponseWriter, r *http.Request) {
	// 1. Ejecutar la consulta SQL (Solo los no eliminados)
	query := `SELECT id, nombre, precio, costo, costo_unitario, stock, sku, descripcion, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica, imagen_url, created_at, updated_at, deleted_at FROM productos WHERE deleted_at IS NULL`
	rows, err := h.DB.Query(query)
	if err != nil {
		slog.Error("Error al consultar productos", "error", err)
		errorResponse(w, http.StatusInternalServerError, "Error al consultar productos: "+err.Error())
		return
	}
	defer rows.Close()

	// 2. Crear un slice para guardar los productos
	productos := []models.Producto{}

	// 3. Iterar sobre las filas
	for rows.Next() {
		var p models.Producto
		var id, nombre, sku, descripcion, categoria, tipo, codigoBarras, codigoBarrasSecundario, ubicacion, ubiEspe, img sql.NullString
		var precio, costo, costoU sql.NullFloat64
		var stock sql.NullInt64
		var created, updated, deleted sql.NullTime

		err := rows.Scan(&id, &nombre, &precio, &costo, &costoU, &stock, &sku, &descripcion, &categoria, &tipo, &codigoBarras, &codigoBarrasSecundario, &ubicacion, &ubiEspe, &img, &created, &updated, &deleted)
		if err != nil {
			slog.Error("Error scanneando fila de producto", "error", err)
			continue
		}

		p.ID = id.String
		p.Nombre = nombre.String
		p.Precio = precio.Float64
		p.Costo = costo.Float64
		p.CostoUnitario = costoU.Float64
		p.Stock = int(stock.Int64)
		p.SKU = sku.String
		if descripcion.Valid {
			p.Descripcion = &descripcion.String
		}
		if categoria.Valid {
			p.Categoria = &categoria.String
		}
		if tipo.Valid {
			p.Tipo = &tipo.String
		}
		if codigoBarras.Valid {
			p.CodigoBarras = &codigoBarras.String
		}
		if codigoBarrasSecundario.Valid {
			p.CodigoBarrasSecundario = &codigoBarrasSecundario.String
		}
		if ubicacion.Valid {
			p.Ubicacion = &ubicacion.String
		}
		if ubiEspe.Valid {
			p.UbicacionEspecifica = &ubiEspe.String
		}
		if img.Valid {
			p.ImagenURL = &img.String
		}
		if created.Valid {
			p.CreatedAt = created.Time
		}
		if updated.Valid {
			p.UpdatedAt = updated.Time
		}
		if deleted.Valid {
			p.DeletedAt = &deleted.Time
		}

		productos = append(productos, p)
	}

	// 4. Responder con el JSON
	slog.Info("Enviando productos al frontend", "cantidad", len(productos))
	jsonResponse(w, http.StatusOK, productos)
}

// CreateProducto maneja el POST /api/productos
func (h *ProductHandler) CreateProducto(w http.ResponseWriter, r *http.Request) {
	var p models.Producto

	// 1. Leer JSON (Manual)
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		errorResponse(w, http.StatusBadRequest, "El cuerpo de la petición no es un JSON válido")
		return
	}
	if p.ID == "" {
		p.ID = uuid.New().String()
	}

	// Convertir campos vacíos a nil para evitar conflictos de clave única (UNIQUE)
	if p.CodigoBarras != nil && *p.CodigoBarras == "" {
		p.CodigoBarras = nil
	}
	if p.CodigoBarrasSecundario != nil && *p.CodigoBarrasSecundario == "" {
		p.CodigoBarrasSecundario = nil
	}
	if p.Ubicacion != nil && *p.Ubicacion == "" {
		p.Ubicacion = nil
	}
	if p.UbicacionEspecifica != nil && *p.UbicacionEspecifica == "" {
		p.UbicacionEspecifica = nil
	}
	if p.Descripcion != nil && *p.Descripcion == "" {
		p.Descripcion = nil
	}
	if p.ImagenURL != nil && *p.ImagenURL == "" {
		p.ImagenURL = nil
	}

	// Auto-generar SKU si es un servicio y no viene SKU
	if p.SKU == "" && p.Tipo != nil && *p.Tipo == "servicio" {
		p.SKU = "SRV-" + uuid.New().String()[:8]
	}

	// Validación previa: verificar SKU
	var exists bool
	err := h.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM productos WHERE sku = $1 AND deleted_at IS NULL)`, p.SKU).Scan(&exists)
	if err != nil {
		slog.Error("Error al verificar SKU existente", "error", err)
		errorResponse(w, http.StatusInternalServerError, "Error al verificar SKU en la base de datos")
		return
	}
	if exists {
		errorResponse(w, http.StatusBadRequest, "El SKU ya existe")
		return
	}

	// 2. Insertar (SQL)
	query := `INSERT INTO productos (id, nombre, precio, costo, costo_unitario, stock, sku, descripcion, categoria, tipo, codigo_barras, codigo_barras_secundario, ubicacion, ubicacion_especifica, imagen_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`
	_, err = h.DB.Exec(query, p.ID, p.Nombre, p.Precio, p.Costo, p.CostoUnitario, p.Stock, p.SKU, p.Descripcion, p.Categoria, p.Tipo, p.CodigoBarras, p.CodigoBarrasSecundario, p.Ubicacion, p.UbicacionEspecifica, p.ImagenURL)

	if err != nil {
		slog.Error("Error al guardar producto", "error", err)
		errorResponse(w, http.StatusInternalServerError, "No se pudo guardar: "+err.Error())
		return
	}

	// 3. Responder con éxito
	jsonResponse(w, http.StatusCreated, p)
}

func (h *ProductHandler) UploadImagen(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	if id == "" {
		errorResponse(w, http.StatusBadRequest, "ID del producto es requerido")
		return
	}

	// 1. Parsear el archivo multipart
	// Límite de 5MB
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("imagen")
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Error al obtener la imagen: "+err.Error())
		return
	}
	defer file.Close()

	// Validar el tipo de archivo (Seguridad)
	buff := make([]byte, 512)
	if _, err := file.Read(buff); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al leer el archivo para validación: "+err.Error())
		return
	}
	if _, err := file.Seek(0, 0); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al reposicionar el lector del archivo: "+err.Error())
		return
	}

	contentType := http.DetectContentType(buff)
	if contentType != "image/jpeg" && contentType != "image/png" {
		errorResponse(w, http.StatusBadRequest, "Solo se permiten imágenes JPEG o PNG")
		return
	}

	// 2. Crear el nombre del archivo (id_producto + extensión original)
	ext := filepath.Ext(header.Filename)
	filename := id + ext
	uploadPath := filepath.Join("uploads", "productos")

	// Asegurar que la carpeta existe
	os.MkdirAll(uploadPath, os.ModePerm)

	// Eliminar imagen anterior si existe para evitar archivos huérfanos
	var oldImagenURL sql.NullString
	err = h.DB.QueryRow("SELECT imagen_url FROM productos WHERE id = $1", id).Scan(&oldImagenURL)
	if err == nil && oldImagenURL.Valid && oldImagenURL.String != "" {
		oldPath := filepath.Join(uploadPath, filepath.Base(oldImagenURL.String))
		if _, err := os.Stat(oldPath); err == nil {
			if err := os.Remove(oldPath); err != nil {
				log.Printf("⚠️ No se pudo eliminar la imagen anterior (%s): %v", oldPath, err)
			}
		}
	}

	fullPath := filepath.Join(uploadPath, filename)

	// 3. Guardar el archivo en el disco
	dst, err := os.Create(fullPath)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo crear el archivo: "+err.Error())
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo guardar el archivo: "+err.Error())
		return
	}

	// 4. Guardar la URL en la DB (URL relativa)
	url := "/uploads/productos/" + filename
	_, err = h.DB.Exec("UPDATE productos SET imagen_url = $1 WHERE id = $2", url, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo actualizar la URL en la DB: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Imagen subida con éxito", "url": url})
}

func (h *ProductHandler) UpdateProducto(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	var p models.Producto
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	// Convertir campos vacíos a nil para evitar conflictos de clave única (UNIQUE)
	if p.CodigoBarras != nil && *p.CodigoBarras == "" {
		p.CodigoBarras = nil
	}
	if p.CodigoBarrasSecundario != nil && *p.CodigoBarrasSecundario == "" {
		p.CodigoBarrasSecundario = nil
	}
	if p.Ubicacion != nil && *p.Ubicacion == "" {
		p.Ubicacion = nil
	}
	if p.UbicacionEspecifica != nil && *p.UbicacionEspecifica == "" {
		p.UbicacionEspecifica = nil
	}
	if p.Descripcion != nil && *p.Descripcion == "" {
		p.Descripcion = nil
	}
	if p.ImagenURL != nil && *p.ImagenURL == "" {
		p.ImagenURL = nil
	}

	// Auto-generar SKU si es un servicio y no viene SKU
	if p.SKU == "" && p.Tipo != nil && *p.Tipo == "servicio" {
		p.SKU = "SRV-" + uuid.New().String()[:8]
	}

	// Verificar SKU único en actualización
	var exists bool
	err := h.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM productos WHERE sku = $1 AND id != $2 AND deleted_at IS NULL)`, p.SKU, id).Scan(&exists)
	if err != nil {
		slog.Error("Error al verificar SKU existente en actualización", "error", err)
		errorResponse(w, http.StatusInternalServerError, "Error al verificar SKU")
		return
	}
	if exists {
		errorResponse(w, http.StatusBadRequest, "El SKU ya existe")
		return
	}

	query := `UPDATE productos SET nombre = $1, precio = $2, costo = $3, costo_unitario = $4, stock = $5, sku = $6, descripcion = $7, categoria = $8, tipo = $9, codigo_barras = $10, codigo_barras_secundario = $11, ubicacion = $12, ubicacion_especifica = $13, imagen_url = $14, updated_at = CURRENT_TIMESTAMP WHERE id = $15 AND deleted_at IS NULL`
	_, err = h.DB.Exec(query, p.Nombre, p.Precio, p.Costo, p.CostoUnitario, p.Stock, p.SKU, p.Descripcion, p.Categoria, p.Tipo, p.CodigoBarras, p.CodigoBarrasSecundario, p.Ubicacion, p.UbicacionEspecifica, p.ImagenURL, id)
	if err != nil {
		slog.Error("Error al actualizar producto", "error", err)
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar producto: "+err.Error())
		return
	}

	p.ID = id
	jsonResponse(w, http.StatusOK, p)
}

func (h *ProductHandler) GetAlertas(w http.ResponseWriter, r *http.Request) {
	// Buscamos productos con stock < 5 que no estén eliminados
	query := `SELECT id, nombre, stock FROM productos WHERE stock < 5 AND deleted_at IS NULL AND tipo = 'producto'`
	rows, err := h.DB.Query(query)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar alertas: "+err.Error())
		return
	}
	defer rows.Close()

	alertas := []map[string]interface{}{}
	for rows.Next() {
		var id, nombre string
		var stock int
		if err := rows.Scan(&id, &nombre, &stock); err == nil {
			alertas = append(alertas, map[string]interface{}{
				"id":      id,
				"nombre":  nombre,
				"stock":   stock,
				"mensaje": "Stock Crítico",
				"tipo":    "peligro",
			})
		}
	}

	jsonResponse(w, http.StatusOK, alertas)
}

func (h *ProductHandler) DeleteProducto(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	// Soft delete
	_, err := h.DB.Exec(`UPDATE productos SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar producto: "+err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
