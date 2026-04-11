# Documentación de Endpoints - LuigiApp V3 Backend

Este documento detalla la API REST construida en Go para el sistema ERP/POS LuigiApp V3. 
**Host Base:** `http://localhost:8080`
**Formato de Respuesta:** JSON (Content-Type: `application/json`)

---

## 1. Módulo de Productos e Inventario

### Listar Productos
- **URL:** `GET /api/productos`
- **Respuesta (200 OK):**
```json
[
  {
    "id": "P-001",
    "nombre": "Producto Ejemplo",
    "precio": 100.00,
    "costo": 60.00,
    "costo_unitario": 60.00,
    "stock": 50,
    "tipo": "producto",
    "codigo_barras": "123456789",
    "ubicacion": "Pasillo A",
    "imagen_url": "/uploads/productos/P-001.png"
  }
]
```

### Crear Producto
- **URL:** `POST /api/productos`
- **Body:**
```json
{
  "id": "P-002",
  "nombre": "Nuevo Producto",
  "precio": 150.0,
  "costo": 90.0,
  "costo_unitario": 90.0,
  "stock": 20,
  "tipo": "producto",
  "codigo_barras": "987654321"
}
```

### Ajustar Stock (Kardex Manual)
- **URL:** `PATCH /api/productos/{id}/stock`
- **Body:**
```json
{
  "cantidad": 5,
  "tipo": "Entrada", 
  "motivo": "Ajuste por inventario físico"
}
```
*Tipos permitidos: `Entrada`, `Salida`, `Ajuste`.*

### Valor Total del Inventario
- **URL:** `GET /api/productos/valor-inventario`
- **Respuesta:** `{"valor_total": 15450.50}`

### Subir Imagen de Producto
- **URL:** `POST /api/productos/{id}/upload`
- **Content-Type:** `multipart/form-data`
- **Campo Form:** `imagen` (archivo binario)
- **Servidor de Estáticos:** Las imágenes se sirven en `http://localhost:8080/uploads/productos/{filename}`

---

## 2. Módulo de Ventas

### Registrar Venta (Transaccional)
- **URL:** `POST /api/ventas`
- **Body:**
```json
{
  "id": "V-001",
  "cliente": "Juan Perez",
  "total": 500.0,
  "estado": "Completada",
  "detalle": [
    {
      "producto_id": "P-001",
      "cantidad": 2,
      "precio_unitario": 250.0,
      "subtotal": 500.0
    }
  ]
}
```
*Nota: Este endpoint descuenta stock automáticamente y genera un ingreso financiero.*

---

## 3. Módulo de Proveedores y Compras

### CRUD Proveedores
- `GET /api/proveedores` - Listar todos.
- `POST /api/proveedores` - Crear. Body: `{"id": "PR-01", "nombre": "Distribuidora X", "email": "...", "telefono": "...", "direccion": "..."}`
- `PUT /api/proveedores/{id}` - Actualizar.
- `DELETE /api/proveedores/{id}` - Eliminar.

### Registrar Compra (Reabastecimiento)
- **URL:** `POST /api/compras`
- **Body:**
```json
{
  "id": "C-100",
  "proveedor_id": "PR-01",
  "total": 1200.0,
  "metodo_pago": "Efectivo",
  "detalles": [
    {
      "producto_id": "P-001",
      "cantidad": 100,
      "precio_unitario": 12.00,
      "precio_sugerido": 25.00,
      "subtotal": 1200.0
    }
  ]
}
```
*Efectos automáticos: Aumenta stock, actualiza `costo_unitario` y actualiza el `precio` de venta del producto al `precio_sugerido`.*

---

## 4. Módulo de Finanzas y Reportes

### CRUD Movimientos Financieros
- `GET /api/finanzas/movimientos` - Historial completo.
- `POST /api/finanzas/movimientos` - Registro manual (Ingreso/Egreso).
- `PUT /api/finanzas/movimientos/{id}` - Editar.
- `DELETE /api/finanzas/movimientos/{id}` - Eliminar.

### Reporte de Resumen Mensual
- **URL:** `GET /api/reportes/resumen`
- **Respuesta (200 OK):**
```json
{
  "balance": 4500.0,
  "ingresos": 6000.0,
  "egresos": 1500.0,
  "mes": "April 2026"
}
```

---

## 5. Otros
- `GET /ping` - Verificar salud del servidor (Responde "pong").
