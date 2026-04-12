package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
)

type ProviderHandler struct {
	DB *sql.DB
}

func (h *ProviderHandler) GetProveedores(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, nombre, email, telefono, direccion, created_at, updated_at FROM proveedores WHERE deleted_at IS NULL`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar proveedores: "+err.Error())
		return
	}
	defer rows.Close()

	proveedores := []models.Proveedor{}
	for rows.Next() {
		var p models.Proveedor
		err := rows.Scan(&p.ID, &p.Nombre, &p.Email, &p.Telefono, &p.Direccion, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al leer fila: "+err.Error())
			return
		}
		proveedores = append(proveedores, p)
	}
	jsonResponse(w, http.StatusOK, proveedores)
}

func (h *ProviderHandler) CreateProveedor(w http.ResponseWriter, r *http.Request) {
	var p models.Proveedor
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	_, err := h.DB.Exec(`INSERT INTO proveedores (id, nombre, email, telefono, direccion) VALUES (?, ?, ?, ?, ?)`,
		p.ID, p.Nombre, p.Email, p.Telefono, p.Direccion)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al insertar proveedor: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Proveedor creado con éxito"})
}

func (h *ProviderHandler) UpdateProveedor(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	var p models.Proveedor
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	_, err := h.DB.Exec(`UPDATE proveedores SET nombre = ?, email = ?, telefono = ?, direccion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
		p.Nombre, p.Email, p.Telefono, p.Direccion, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar proveedor: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Proveedor actualizado con éxito"})
}

func (h *ProviderHandler) DeleteProveedor(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	_, err := h.DB.Exec(`UPDATE proveedores SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar proveedor: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Proveedor eliminado con éxito"})
}

