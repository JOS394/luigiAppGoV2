package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/database"
	"golang.org/x/crypto/bcrypt"
)

type application struct {
	db *sql.DB
}

func main() {
	createAdmin := flag.Bool("create-admin", false, "Crea un usuario administrador inicial")
	flag.Parse()

	// 1. Conexión a Base de Datos (PostgreSQL)
	db, err := database.Connect("postgres://postgres:admin@localhost:5432/luigiapp?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 2. Ejecutar Migraciones
	err = database.RunMigrations(db)
	if err != nil {
		log.Fatalf("Error al ejecutar migraciones: %v", err)
	}

	// 3. Script de Admin Inicial
	if *createAdmin {
		createInitialAdmin(db)
		return
	}

	app := &application{db: db}

	// 4. Iniciar Servidor
	log.Println("🚀 Servidor LuigiApp V3 (PostgreSQL) en http://localhost:8080")
	err = http.ListenAndServe(":8080", app.routes())
	if err != nil {
		log.Fatal(err)
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

	_, err := db.Exec(`INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4, $5)`,
		"U-ADMIN", nombre, email, string(hashedPassword), rol)

	if err != nil {
		log.Fatalf("Error al crear admin: %v", err)
	}

	log.Printf("✅ Usuario administrador creado: %s / %s", email, password)
}
