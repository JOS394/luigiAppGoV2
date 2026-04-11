package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/database"
)

type application struct {
	db *sql.DB
}

func main() {
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

	app := &application{db: db}

	log.Println("🚀 Servidor en http://localhost:8080")
	// Llamamos a las rutas desde el otro archivo
	err = http.ListenAndServe(":8080", app.routes())
	if err != nil {
		log.Fatal(err)
	}
}

func (app *application) pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}
