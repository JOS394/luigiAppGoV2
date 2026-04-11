package main

import (
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/handlers"
)

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	// Inicializamos el handler de productos pasándole la DB
	productH := &handlers.ProductHandler{DB: app.db}

	// Definimos las rutas
	mux.HandleFunc("GET /ping", app.pingHandler)
	mux.HandleFunc("POST /api/productos", productH.CreateProducto)
	mux.HandleFunc("GET /api/productos", productH.GetProductos)

	return mux
}
