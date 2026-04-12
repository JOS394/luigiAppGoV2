package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/JOS394/luigiAppGoV2/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("tu_clave_secreta_super_segura") // En producción usar variable de entorno

type AuthHandler struct {
	DB *sql.DB
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	log.Println("🔑 Intento de login recibido...")
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	var u models.Usuario
	query := `SELECT id, nombre, email, password_hash, rol, estado FROM usuarios WHERE email = ? AND deleted_at IS NULL`
	err := h.DB.QueryRow(query, req.Email).Scan(&u.ID, &u.Nombre, &u.Email, &u.PasswordHash, &u.Rol, &u.Estado)
	if err != nil {
		if err == sql.ErrNoRows {
			errorResponse(w, http.StatusUnauthorized, "Credenciales incorrectas")
		} else {
			errorResponse(w, http.StatusInternalServerError, "Error en el servidor: "+err.Error())
		}
		return
	}

	// Verificar password
	err = bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password))
	if err != nil {
		errorResponse(w, http.StatusUnauthorized, "Credenciales incorrectas")
		return
	}

	// Generar Token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.MapClaims{
		"user_id": u.ID,
		"rol":     u.Rol,
		"exp":     expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "No se pudo generar el token")
		return
	}

	jsonResponse(w, http.StatusOK, models.LoginResponse{
		Token:   tokenString,
		Usuario: u,
	})
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorResponse(w, http.StatusBadRequest, "JSON inválido")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al procesar contraseña")
		return
	}

	id := "U-" + time.Now().Format("050415") // ID simple basado en tiempo para el ejemplo

	_, err = h.DB.Exec(`INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)`,
		id, req.Nombre, req.Email, string(hashedPassword), req.Rol)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Error al crear usuario: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{"message": "Usuario registrado con éxito", "id": id})
}
