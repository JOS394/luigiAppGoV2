package middleware

import (
	"bytes"
	"io"
	"log/slog"
	"net/http"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// 1. Logueamos el inicio
		slog.Info("Recibiendo petición", "method", r.Method, "path", r.URL.Path)

		// 2. SI ES POST o PUT, leemos el cuerpo
		if r.Method == http.MethodPost || r.Method == http.MethodPut {
			bodyBytes, err := io.ReadAll(r.Body)
			if err == nil {
				// AQUÍ VERÁS EL BODY EN TUS LOGS
				slog.Info("Request Body", "payload", string(bodyBytes))

				// REINICIAMOS EL BODY para que el Handler lo pueda leer
				r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
			}
		}

		next.ServeHTTP(w, r)

		slog.Info("Petición completada", "duracion", time.Since(start).String())
	})
}
