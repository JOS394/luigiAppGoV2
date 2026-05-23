package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/models"
	"github.com/google/uuid"
)

type ClientHandler struct {
	DB *sql.DB
}

func (h *ClientHandler) GetClientes(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, nombre, email, telefono, direccion, notas, total_compras, ultima_visita, created_at, updated_at FROM clientes WHERE deleted_at IS NULL`)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al consultar clientes: "+err.Error())
		return
	}
	defer rows.Close()

	clientes := []models.Cliente{}
	for rows.Next() {
		var c models.Cliente
		var email, telefono, direccion, notas sql.NullString
		var ultimaVisita sql.NullTime
		err := rows.Scan(&c.ID, &c.Nombre, &email, &telefono, &direccion, &notas, &c.TotalCompras, &ultimaVisita, &c.CreatedAt, &c.UpdatedAt)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Error al leer fila: "+err.Error())
			return
		}
		if email.Valid {
			c.Email = &email.String
		}
		if telefono.Valid {
			c.Telefono = &telefono.String
		}
		if direccion.Valid {
			c.Direccion = &direccion.String
		}
		if notas.Valid {
			c.Notas = &notas.String
		}
		if ultimaVisita.Valid {
			c.UltimaVisita = &ultimaVisita.Time
		}
		clientes = append(clientes, c)
	}
	jsonResponse(w, http.StatusOK, clientes)
}

func (h *ClientHandler) CreateCliente(w http.ResponseWriter, r *http.Request) {
	var c models.Cliente
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	if c.ID == "" {
		c.ID = uuid.New().String()
	}

	_, err := h.DB.Exec(`INSERT INTO clientes (id, nombre, email, telefono, direccion, notas) VALUES ($1, $2, $3, $4, $5, $6)`,
		c.ID, c.Nombre, c.Email, c.Telefono, c.Direccion, c.Notas)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al insertar cliente: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, c)
}

func (h *ClientHandler) UpdateCliente(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	var c models.Cliente
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	_, err := h.DB.Exec(`UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4, notas = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND deleted_at IS NULL`,
		c.Nombre, c.Email, c.Telefono, c.Direccion, c.Notas, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al actualizar cliente: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Cliente actualizado con éxito"})
}

func (h *ClientHandler) DeleteCliente(w http.ResponseWriter, r *http.Request) {
	id := getID(r)
	_, err := h.DB.Exec(`UPDATE clientes SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al eliminar cliente: "+err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
