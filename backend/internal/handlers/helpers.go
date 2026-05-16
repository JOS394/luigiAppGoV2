package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

// jsonResponse es un helper para enviar respuestas JSON exitosas
func jsonResponse(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		// Si falla el encode, enviamos un error de servidor
		http.Error(w, "Error al codificar JSON", http.StatusInternalServerError)
	}
}

// errorResponse es un helper para enviar errores en formato JSON
func errorResponse(w http.ResponseWriter, status int, message string) {
	jsonResponse(w, status, map[string]string{"error": message})
}

// getID intenta obtener el ID usando chi.URLParam, con fallback manual
func getID(r *http.Request) string {
	id := chi.URLParam(r, "id")
	if id != "" {
		return id
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	// Buscar el índice de "productos", "ventas", etc.
	for i, part := range parts {
		if (part == "productos" || part == "clientes" || part == "proveedores") && i+1 < len(parts) {
			// El siguiente segmento debería ser el ID
			nextPart := parts[i+1]
			// Si el siguiente no es una sub-ruta conocida, es el ID
			if nextPart != "alertas" && nextPart != "valor-inventario" {
				return nextPart
			}
		}
	}

	return ""
}
