package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
	"github.com/google/uuid"
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
		var email, telefono, direccion sql.NullString
		err := rows.Scan(&p.ID, &p.Nombre, &email, &telefono, &direccion, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al leer fila: "+err.Error())
			return
		}
		if email.Valid {
			p.Email = &email.String
		}
		if telefono.Valid {
			p.Telefono = &telefono.String
		}
		if direccion.Valid {
			p.Direccion = &direccion.String
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

	if p.ID == "" {
		p.ID = uuid.New().String()
	}

	_, err := h.DB.Exec(`INSERT INTO proveedores (id, nombre, email, telefono, direccion) VALUES ($1, $2, $3, $4, $5)`,
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

	_, err := h.DB.Exec(`UPDATE proveedores SET nombre = $1, email = $2, telefono = $3, direccion = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND deleted_at IS NULL`,
		p.Nombre, p.Email, p.Telefono, p.Direccion, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar proveedor: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Proveedor actualizado con éxito"})
}

func (h *ProviderHandler) DeleteProveedor(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	_, err := h.DB.Exec(`UPDATE proveedores SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar proveedor: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Proveedor eliminado con éxito"})
}

