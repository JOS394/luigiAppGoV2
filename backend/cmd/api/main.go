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

	db, err := database.Connect("./luigiapp.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Ejecutamos el setup para crear las tablas
	err = database.SetupDatabase(db)
	if err != nil {
		log.Fatalf("Error al configurar la base de datos: %v", err)
	}

	if *createAdmin {
		createInitialAdmin(db)
		return
	}

	app := &application{db: db}

	// Middleware de CORS y Logger
	corsHandler := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Log de cada petición que llega
			log.Printf("📥 [%s] %s %s", r.RemoteAddr, r.Method, r.URL.Path)

			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	}

	log.Println("🚀 Servidor en http://localhost:8080")
	// Aplicamos el middleware de CORS
	err = http.ListenAndServe(":8080", corsHandler(app.routes()))
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

	_, err := db.Exec(`INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)`,
		"U-ADMIN", nombre, email, string(hashedPassword), rol)

	if err != nil {
		log.Fatalf("Error al crear admin: %v", err)
	}

	log.Printf("✅ Usuario administrador creado: %s / %s", email, password)
}
