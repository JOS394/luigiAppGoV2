package main

import (
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/handlers"
)

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	// Inicialización de Handlers
	productH := &handlers.ProductHandler{DB: app.db}
	ventaH := &handlers.VentaHandler{DB: app.db}
	financeH := &handlers.FinanceHandler{DB: app.db}
	inventoryH := &handlers.InventoryHandler{DB: app.db}
	providerH := &handlers.ProviderHandler{DB: app.db}
	purchaseH := &handlers.PurchaseHandler{DB: app.db}

	// Rutas de Productos
	mux.HandleFunc("GET /api/productos", productH.GetProductos)
	mux.HandleFunc("POST /api/productos", productH.CreateProducto)
	mux.HandleFunc("PATCH /api/productos/{id}/stock", inventoryH.UpdateStock)
	mux.HandleFunc("GET /api/productos/valor-inventario", inventoryH.GetValorInventario)
	mux.HandleFunc("POST /api/productos/{id}/upload", productH.UploadImagen)

	// Servidor de Archivos Estáticos
	// Esto permite acceder a las imágenes mediante http://localhost:8080/uploads/productos/id.jpg
	fileServer := http.FileServer(http.Dir("./uploads"))
	mux.Handle("GET /uploads/", http.StripPrefix("/uploads", fileServer))

	// Rutas de Ventas
	mux.HandleFunc("POST /api/ventas", ventaH.CreateVenta)

	// Rutas de Finanzas
	mux.HandleFunc("GET /api/finanzas/movimientos", financeH.GetMovimientos)
	mux.HandleFunc("POST /api/finanzas/movimientos", financeH.CreateMovimiento)
	mux.HandleFunc("PUT /api/finanzas/movimientos/{id}", financeH.UpdateMovimiento)
	mux.HandleFunc("DELETE /api/finanzas/movimientos/{id}", financeH.DeleteMovimiento)
	mux.HandleFunc("GET /api/reportes/resumen", financeH.GetResumen)

	// Rutas de Proveedores
	mux.HandleFunc("GET /api/proveedores", providerH.GetProveedores)
	mux.HandleFunc("POST /api/proveedores", providerH.CreateProveedor)
	mux.HandleFunc("PUT /api/proveedores/{id}", providerH.UpdateProveedor)
	mux.HandleFunc("DELETE /api/proveedores/{id}", providerH.DeleteProveedor)


	// Rutas de Compras
	mux.HandleFunc("POST /api/compras", purchaseH.CreateCompra)

	// Otros
	mux.HandleFunc("GET /ping", app.pingHandler)

	return mux
}
