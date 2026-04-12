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
	// Fallback manual por si el router no está capturando bien el path value
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) > 0 {
		last := parts[len(parts)-1]
		if last != "productos" && last != "ventas" && last != "proveedores" && last != "stock" && last != "upload" {
			return last
		}
		// Si el último es 'stock' o 'upload', el ID es el penúltimo
		if (last == "stock" || last == "upload") && len(parts) >= 3 {
			return parts[len(parts)-2]
		}
	}
	return ""
}
