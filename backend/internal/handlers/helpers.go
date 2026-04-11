package handlers

import (
	"encoding/json"
	"net/http"
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
	jsonResponse(w, http.StatusBadRequest, map[string]string{"error": message})
}
