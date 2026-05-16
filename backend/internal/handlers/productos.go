package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type ProductHandler struct {
	DB *sql.DB
}

func (h *ProductHandler) GetProductos(w http.ResponseWriter, r *http.Request) {
	// 1. Ejecutar la consulta SQL (Solo los no eliminados)
	query := `SELECT id, nombre, precio, costo, costo_unitario, stock, categoria, tipo, codigo_barras, ubicacion, ubicacion_especifica, imagen_url, created_at, updated_at, deleted_at FROM productos WHERE deleted_at IS NULL`
	rows, err := h.DB.Query(query)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar productos: "+err.Error())
		return
	}
	defer rows.Close()

	// 2. Crear un slice para guardar los productos
	productos := []models.Producto{}

	// 3. Iterar sobre las filas
	for rows.Next() {
		var p models.Producto
		var id, nombre, categoria, tipo, codigoBarras, ubicacion, ubiEspe, img, created, updated sql.NullString
		var precio, costo, costoU sql.NullFloat64
		var stock sql.NullInt64
		var deleted sql.NullString

		err := rows.Scan(&id, &nombre, &precio, &costo, &costoU, &stock, &categoria, &tipo, &codigoBarras, &ubicacion, &ubiEspe, &img, &created, &updated, &deleted)
		if err != nil {
			log.Printf("❌ Error scanneando fila: %v", err)
			continue
		}

		p.ID = id.String
		p.Nombre = nombre.String
		p.Precio = precio.Float64
		p.Costo = costo.Float64
		p.CostoUnitario = costoU.Float64
		p.Stock = int(stock.Int64)
		p.Categoria = categoria.String
		p.Tipo = tipo.String
		if codigoBarras.Valid {
			p.CodigoBarras = &codigoBarras.String
		}
		p.Ubicacion = ubicacion.String
		p.UbicacionEspecifica = ubiEspe.String
		p.ImagenURL = img.String
		p.CreatedAt = created.String
		p.UpdatedAt = updated.String
		if deleted.Valid {
			p.DeletedAt = &deleted.String
		}

		productos = append(productos, p)
	}

	// 4. Responder con el JSON
	log.Printf("📦 Enviando %d productos al frontend", len(productos))
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

	// 2. Insertar (SQL)
	query := `INSERT INTO productos (id, nombre, precio, costo, costo_unitario, stock, categoria, tipo, codigo_barras, ubicacion, ubicacion_especifica, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := h.DB.Exec(query, p.ID, p.Nombre, p.Precio, p.Costo, p.CostoUnitario, p.Stock, p.Categoria, p.Tipo, p.CodigoBarras, p.Ubicacion, p.UbicacionEspecifica, p.ImagenURL)

	if err != nil {
		// Si el error es porque el ID ya existe
		errorResponse(w, http.StatusInternalServerError, "No se pudo guardar: "+err.Error())
		return
	}

	// 3. Responder con éxito
	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Producto creado con éxito"})
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

	// 2. Crear el nombre del archivo (id_producto + extensión original)
	ext := filepath.Ext(header.Filename)
	filename := id + ext
	uploadPath := filepath.Join("uploads", "productos")

	// Asegurar que la carpeta existe
	os.MkdirAll(uploadPath, os.ModePerm)

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
	_, err = h.DB.Exec("UPDATE productos SET imagen_url = ? WHERE id = ?", url, id)
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

	query := `UPDATE productos SET nombre = ?, precio = ?, costo = ?, costo_unitario = ?, stock = ?, categoria = ?, tipo = ?, codigo_barras = ?, ubicacion = ?, ubicacion_especifica = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`
	_, err := h.DB.Exec(query, p.Nombre, p.Precio, p.Costo, p.CostoUnitario, p.Stock, p.Categoria, p.Tipo, p.CodigoBarras, p.Ubicacion, p.UbicacionEspecifica, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar producto: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Producto actualizado con éxito"})
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
	_, err := h.DB.Exec(`UPDATE productos SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar producto: "+err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

