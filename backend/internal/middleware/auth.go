package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("tu_clave_secreta_super_segura") // Debe coincidir con el del handler

type contextKey string

const (
	UserIDKey contextKey = "user_id"
	UserRolKey  contextKey = "rol"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			fmt.Printf("⚠️ Auth Error: No Authorization header for %s %s\n", r.Method, r.URL.Path)
			http.Error(w, `{"error": "Authorization header requerido"}`, http.StatusUnauthorized)
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			fmt.Printf("⚠️ Auth Error: Invalid token format for %s %s\n", r.Method, r.URL.Path)
			http.Error(w, `{"error": "Formato de token inválido"}`, http.StatusUnauthorized)
			return
		}

		tokenString := bearerToken[1]
		claims := jwt.MapClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			fmt.Printf("❌ Auth Error: Invalid token for %s %s: %v\n", r.Method, r.URL.Path, err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "Token inválido o expirado"}`))
			return
		}

		// Log de éxito
		fmt.Printf("✅ Auth Success: %s %s (User: %v)\n", r.Method, r.URL.Path, claims["user_id"])

		// Adjuntar información al contexto
		ctx := context.WithValue(r.Context(), UserIDKey, claims["user_id"])
		ctx = context.WithValue(ctx, UserRolKey, claims["rol"])

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RoleMiddleware(requiredRole string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userRol := r.Context().Value(UserRolKey).(string)

		if userRol != requiredRole && userRol != "administrador" {
			http.Error(w, `{"error": "Acceso denegado: permisos insuficientes"}`, http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
