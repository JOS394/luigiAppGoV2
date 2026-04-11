package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type ProductHandler struct {
	DB *sql.DB
}

// GetProductos maneja el GET /api/productos
func (h *ProductHandler) GetProductos(w http.ResponseWriter, r *http.Request) {
	// Aquí irá la lógica para hacer el SELECT * FROM productos
	w.Write([]byte("Lista de productos"))
}

// CreateProducto maneja el POST /api/productos
func (h *ProductHandler) CreateProducto(w http.ResponseWriter, r *http.Request) {
	var p models.Producto

	// 1. Decodificar el JSON que viene del frontend
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// 2. Insertar en la base de datos usando SQL puro
	query := `INSERT INTO productos (id, nombre, precio, stock, tipo, codigo_barras, ubicacion) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err = h.DB.Exec(query, p.ID, p.Nombre, p.Precio, p.Stock, p.Tipo, p.CodigoBarras, p.Ubicacion)
	if err != nil {
		http.Error(w, "Error al guardar en la DB: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Responder al frontend que todo salió bien
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Producto creado con éxito"})
}
