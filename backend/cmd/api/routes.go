package main

import (
	"net/http"

	"github.com/JOS394/luigiAppGoV2/internal/handlers"
	"github.com/JOS394/luigiAppGoV2/internal/middleware"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	r := chi.NewRouter()

	// Middlewares de base
	r.Use(chiMiddleware.Recoverer) // Tu escudo anti-pánicos
	r.Use(chiMiddleware.Logger)    // Log profesional de peticiones
	r.Use(middleware.Cors)         // Control de acceso para el frontend

	// Inicialización de Handlers
	productH := &handlers.ProductHandler{DB: app.db}
	ventaH := &handlers.VentaHandler{DB: app.db}
	financeH := &handlers.FinanceHandler{DB: app.db}
	inventoryH := &handlers.InventoryHandler{DB: app.db}
	providerH := &handlers.ProviderHandler{DB: app.db}
	purchaseH := &handlers.PurchaseHandler{DB: app.db}
	clientH := &handlers.ClientHandler{DB: app.db}
	authH := &handlers.AuthHandler{DB: app.db}
	reportH := &handlers.ReportHandler{DB: app.db}
	exportH := &handlers.ExportHandler{DB: app.db}

	// Rutas Públicas
	r.Post("/api/auth/login", authH.Login)
	r.Get("/ping", app.pingHandler)

	// Servidor de Archivos Estáticos
	fileServer := http.FileServer(http.Dir("./uploads"))
	r.Handle("/uploads/*", http.StripPrefix("/uploads", fileServer))

	// Grupo de Rutas Protegidas (Requieren Login)
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth)

		// PRODUCTOS
		r.Route("/api/productos", func(r chi.Router) {
			r.Get("/", productH.GetProductos)
			r.Get("/alertas", productH.GetAlertas)
			r.Get("/{id}/movimientos", inventoryH.GetMovimientosByProducto)
			r.Post("/{id}/stock", inventoryH.UpdateStock)
			
			// Solo Admin para estas acciones de productos
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireRole("administrador"))
				r.Post("/", productH.CreateProducto)
				r.Put("/{id}", productH.UpdateProducto)
				r.Delete("/{id}", productH.DeleteProducto)
				r.Get("/valor-inventario", inventoryH.GetValorInventario)
				r.Post("/{id}/upload", productH.UploadImagen)
			})
		})

		// VENTAS
		r.Route("/api/ventas", func(r chi.Router) {
			r.Get("/", ventaH.GetVentas)
			r.Post("/", ventaH.CreateVenta)
			r.With(middleware.RequireRole("administrador")).Delete("/{id}", ventaH.DeleteVenta)
		})

		// FINANZAS Y REPORTES
		r.Route("/api/finanzas", func(r chi.Router) {
			r.Use(middleware.RequireRole("administrador"))
			r.Get("/movimientos", financeH.GetMovimientos)
			r.Post("/movimientos", financeH.CreateMovimiento)
			r.Put("/movimientos/{id}", financeH.UpdateMovimiento)
			r.Delete("/movimientos/{id}", financeH.DeleteMovimiento)
		})
		r.With(middleware.RequireRole("administrador")).Get("/api/reportes/resumen", reportH.GetResumen)
		r.With(middleware.RequireRole("administrador")).Get("/api/reportes/detallado", reportH.GetDetallado)

		// EXPORTACIÓN (Solo Admin)
		r.Route("/api/export", func(r chi.Router) {
			r.Use(middleware.RequireRole("administrador"))
			r.Get("/productos", exportH.ExportProductos)
			r.Get("/ventas", exportH.ExportVentas)
			r.Get("/clientes", exportH.ExportClientes)
			r.Get("/finanzas", exportH.ExportMovimientos)
		})

		// PROVEEDORES
		r.Route("/api/proveedores", func(r chi.Router) {
			r.Get("/", providerH.GetProveedores)
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireRole("administrador"))
				r.Post("/", providerH.CreateProveedor)
				r.Put("/{id}", providerH.UpdateProveedor)
				r.Delete("/{id}", providerH.DeleteProveedor)
			})
		})

		// CLIENTES
		r.Route("/api/clientes", func(r chi.Router) {
			r.Get("/", clientH.GetClientes)
			r.Post("/", clientH.CreateCliente)
			r.Put("/{id}", clientH.UpdateCliente)
			r.With(middleware.RequireRole("administrador")).Delete("/{id}", clientH.DeleteCliente)
		})

		// COMPRAS (Solo Admin)
		r.Route("/api/compras", func(r chi.Router) {
			r.Use(middleware.RequireRole("administrador"))
			r.Get("/", purchaseH.GetCompras)
			r.Post("/", purchaseH.CreateCompra)
		})

		// USUARIOS (Solo Admin)
		r.Post("/api/auth/register", authH.Register)
	})

	return r
}
