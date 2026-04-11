package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type ProductHandler struct {
	DB *sql.DB
}

// GetProductos maneja el GET /api/productos
func (h *ProductHandler) GetProductos(w http.ResponseWriter, r *http.Request) {
	// 1. Ejecutar la consulta SQL
	query := `SELECT id, nombre, precio, costo, costo_unitario, stock, tipo, codigo_barras, ubicacion, imagen_url FROM productos`
	rows, err := h.DB.Query(query)
	if err != nil {
		http.Error(w, "Error al consultar productos: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close() // ¡Muy importante! Evita fugas de memoria

	// 2. Crear un slice para guardar los productos
	productos := []models.Producto{}

	// 3. Iterar sobre las filas
	for rows.Next() {
		var p models.Producto
		err := rows.Scan(&p.ID, &p.Nombre, &p.Precio, &p.Costo, &p.CostoUnitario, &p.Stock, &p.Tipo, &p.CodigoBarras, &p.Ubicacion, &p.ImagenURL)
		if err != nil {
			http.Error(w, "Error al leer fila: "+err.Error(), http.StatusInternalServerError)
			return
		}
		productos = append(productos, p)
	}

	// 4. Responder con el JSON
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
	query := `INSERT INTO productos (id, nombre, precio, costo, costo_unitario, stock, tipo, codigo_barras, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := h.DB.Exec(query, p.ID, p.Nombre, p.Precio, p.Costo, p.CostoUnitario, p.Stock, p.Tipo, p.CodigoBarras, p.ImagenURL)

	if err != nil {
		// Si el error es porque el ID ya existe
		errorResponse(w, http.StatusInternalServerError, "No se pudo guardar: "+err.Error())
		return
	}

	// 3. Responder con éxito
	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Producto creado con éxito"})
}

func (h *ProductHandler) UploadImagen(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
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

