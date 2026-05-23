package main

import (
	"database/sql"
	"flag"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/JOS394/luigiAppGoV2/internal/database"
	"github.com/JOS394/luigiAppGoV2/internal/middleware"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type application struct {
	db *sql.DB
}

func main() {
	// 0. Configurar Logger estructurado
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	createAdmin := flag.Bool("create-admin", false, "Crea un usuario administrador inicial")
	flag.Parse()

	db, err := database.Connect("postgres://postgres:admin@localhost:5432/luigiapp?sslmode=disable")
	if err != nil {
		slog.Error("Error conectando a DB", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := database.RunMigrations(db); err != nil {
		slog.Error("Error en migraciones", "error", err)
		os.Exit(1)
	}

	if *createAdmin {
		createInitialAdmin(db)
		return
	}

	app := &application{db: db}

	// 4. Iniciar Servidor con Middlewares aplicados
	slog.Info("🚀 Servidor LuigiApp V3 iniciado", "port", "8080")

	// Aplicamos los middlewares aquí o dentro de app.routes()
	srv := &http.Server{
		Addr:    ":8080",
		Handler: middleware.Logger(middleware.Cors(app.routes())),
	}

	if err := srv.ListenAndServe(); err != nil {
		slog.Error("Servidor falló", "error", err)
	}
}

func (app *application) pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

func createInitialAdmin(db *sql.DB) {
	nombre := "Administrador"
	email := "admin@luigiapp.com"
	password := "admin123"
	rol := "administrador"

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	id := uuid.New().String()
	_, err := db.Exec(`INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4, $5)`,
		id, nombre, email, string(hashedPassword), rol)

	if err != nil {
		log.Fatalf("Error al crear admin: %v", err)
	}

	log.Printf("✅ Usuario administrador creado: %s / %s", email, password)
}
