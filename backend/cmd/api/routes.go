package main

import (
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/handlers"
	"github.com/JOS394/luigiAppGoV2/internal/middleware"
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
	clientH := &handlers.ClientHandler{DB: app.db}
	authH := &handlers.AuthHandler{DB: app.db}

	// Rutas Públicas
	mux.HandleFunc("POST /api/auth/login", authH.Login)
	mux.HandleFunc("GET /ping", app.pingHandler)

	// Servidor de Archivos Estáticos (Público por ahora para evitar problemas con img tags)
	fileServer := http.FileServer(http.Dir("./uploads"))
	mux.Handle("GET /uploads/", http.StripPrefix("/uploads", fileServer))

	// Helper para rutas protegidas
	protected := func(h http.HandlerFunc) http.Handler {
		return middleware.AuthMiddleware(h)
	}

	// Helper para rutas de administrador
	adminOnly := func(h http.HandlerFunc) http.Handler {
		return middleware.AuthMiddleware(middleware.RoleMiddleware("administrador", h))
	}

	// Rutas de Productos
	mux.Handle("GET /api/productos", protected(productH.GetProductos))
	mux.Handle("POST /api/productos", adminOnly(productH.CreateProducto))
	mux.Handle("PUT /api/productos/{id}", adminOnly(productH.UpdateProducto))
	mux.Handle("DELETE /api/productos/{id}", adminOnly(productH.DeleteProducto))
	mux.Handle("POST /api/productos/{id}/stock", protected(inventoryH.UpdateStock))
	mux.Handle("GET /api/productos/valor-inventario", adminOnly(inventoryH.GetValorInventario))
	mux.Handle("POST /api/productos/{id}/upload", adminOnly(productH.UploadImagen))

	// Rutas de Ventas
	mux.Handle("GET /api/ventas", protected(ventaH.GetVentas))
	mux.Handle("POST /api/ventas", protected(ventaH.CreateVenta))
	mux.Handle("DELETE /api/ventas/{id}", adminOnly(ventaH.DeleteVenta))

	// Rutas de Finanzas
	mux.Handle("GET /api/finanzas/movimientos", adminOnly(financeH.GetMovimientos))
	mux.Handle("POST /api/finanzas/movimientos", adminOnly(financeH.CreateMovimiento))
	mux.Handle("PUT /api/finanzas/movimientos/{id}", adminOnly(financeH.UpdateMovimiento))
	mux.Handle("DELETE /api/finanzas/movimientos/{id}", adminOnly(financeH.DeleteMovimiento))
	mux.Handle("GET /api/reportes/resumen", adminOnly(financeH.GetResumen))

	// Rutas de Proveedores
	mux.Handle("GET /api/proveedores", protected(providerH.GetProveedores))
	mux.Handle("POST /api/proveedores", adminOnly(providerH.CreateProveedor))
	mux.Handle("PUT /api/proveedores/{id}", adminOnly(providerH.UpdateProveedor))
	mux.Handle("DELETE /api/proveedores/{id}", adminOnly(providerH.DeleteProveedor) )

	// Rutas de Clientes
	mux.Handle("GET /api/clientes", protected(clientH.GetClientes))
	mux.Handle("POST /api/clientes", protected(clientH.CreateCliente))
	mux.Handle("PUT /api/clientes/{id}", protected(clientH.UpdateCliente))
	mux.Handle("DELETE /api/clientes/{id}", adminOnly(clientH.DeleteCliente))

	// Rutas de Compras
	mux.Handle("GET /api/compras", adminOnly(purchaseH.GetCompras))
	mux.Handle("POST /api/compras", adminOnly(purchaseH.CreateCompra))

	// Rutas de Usuarios (Auth)
	mux.Handle("POST /api/auth/register", adminOnly(authH.Register))

	return mux
}
