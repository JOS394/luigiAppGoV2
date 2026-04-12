package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("tu_clave_secreta_super_segura")

type contextKey string

const (
	UserIDKey contextKey = "user_id"
	UserRolKey  contextKey = "rol"
)

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error": "Authorization header requerido"}`, http.StatusUnauthorized)
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			http.Error(w, `{"error": "Formato de token inválido"}`, http.StatusUnauthorized)
			return
		}

		tokenString := bearerToken[1]
		claims := jwt.MapClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			log.Printf("❌ Auth Error: %v", err)
			http.Error(w, `{"error": "Token inválido o expirado"}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, claims["user_id"])
		ctx = context.WithValue(ctx, UserRolKey, claims["rol"])

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RequireRole(requiredRole string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userRol, ok := r.Context().Value(UserRolKey).(string)
			if !ok {
				http.Error(w, `{"error": "No se pudo identificar el rol"}`, http.StatusInternalServerError)
				return
			}

			if userRol != requiredRole && userRol != "administrador" {
				http.Error(w, `{"error": "Acceso denegado: permisos insuficientes"}`, http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
