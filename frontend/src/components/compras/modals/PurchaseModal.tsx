"use client";

import React, { useState } from 'react';
import { X, Save, Plus, Trash2, ShoppingBag } from 'lucide-react';
import type { Compra, Proveedor, Producto, DetalleCompra } from '@/types';
import { Autocomplete } from '@/components/shared/Autocomplete';
import { ProductFormModal } from '@/components/productos/modals/ProductFormModal';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface PurchaseModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (compra: Omit<Compra, 'id' | 'fecha'>) => void;
  proveedores: Proveedor[];
  productos: Producto[];
  onRefreshProducts: () => void;
}

export function PurchaseModal({ 
  show, 
  onClose, 
  onSubmit, 
  proveedores, 
  productos,
  onRefreshProducts 
}: PurchaseModalProps) {
  const [proveedorId, setProveedorId] = useState('');
  const [metodoPago, setMetodoPago] = useState<Compra['metodoPago']>('Transferencia');
  const [detalles, setDetalles] = useState<Omit<DetalleCompra, 'subtotal' | 'productoNombre'>[]>([]);
  
  // Estado para crear producto on-the-fly
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  if (!show) return null;

  const handleAddProduct = () => {
    setDetalles([...detalles, { productoId: '', cantidad: 1, costoUnitario: 0 }]);
  };

  const handleRemoveProduct = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index: number, field: string, value: any) => {
    const newDetalles = [...detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    setDetalles(newDetalles);
  };

  const calculateTotal = () => {
    return detalles.reduce((acc, d) => acc + (d.cantidad * d.costoUnitario), 0);
  };

  const handleCreateProduct = async (data: Omit<Producto, 'id'>) => {
    try {
      const nuevo = await apiService.productos.create(data);
      toast.success('Producto creado y añadido al catálogo');
      onRefreshProducts(); // Recargar la lista de productos del padre
      setShowNewProductModal(false);
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proveedorId || detalles.length === 0) return;

    const proveedor = proveedores.find(p => p.id === proveedorId);
    const total = calculateTotal();

    const compraDetalles: DetalleCompra[] = detalles.map(d => {
      const prod = productos.find(p => p.id === d.productoId);
      return {
        ...d,
        productoNombre: prod?.nombre || 'Producto Desconocido',
        subtotal: d.cantidad * d.costoUnitario
      };
    });

    onSubmit({
      proveedorId,
      proveedorNombre: proveedor?.nombre || '',
      detalles: compraDetalles,
      total,
      estado: 'Pendiente',
      metodoPago
    });

    setProveedorId('');
    setDetalles([]);
  };

  const productOptions = productos.map(p => ({
    id: p.id,
    label: p.nombre,
    subLabel: `${p.categoria} - Stock: ${p.stock}`
  }));

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box bg-white max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Nueva Orden de Compra</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Abastecimiento de Inventario</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20}/></button>
            </div>

            <div className="p-8 space-y-8 bg-white h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seleccionar Proveedor</label>
                  <select 
                    required
                    className="select select-bordered w-full bg-slate-50 font-bold text-slate-700"
                    value={proveedorId}
                    onChange={e => setProveedorId(e.target.value)}
                  >
                    <option value="">Seleccione un proveedor...</option>
                    {proveedores.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.categoria})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método de Pago</label>
                  <select 
                    className="select select-bordered w-full bg-slate-50 font-bold text-slate-700"
                    value={metodoPago}
                    onChange={e => setMetodoPago(e.target.value as any)}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">Detalle de Productos</h4>
                  <button 
                    type="button" 
                    onClick={handleAddProduct}
                    className="btn btn-primary btn-sm rounded-lg text-white font-bold gap-2"
                  >
                    <Plus size={14} /> Añadir Fila
                  </button>
                </div>

                <div className="space-y-3">
                  {detalles.map((detalle, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="col-span-5 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Producto</label>
                        <Autocomplete 
                          options={productOptions}
                          value={detalle.productoId}
                          onChange={(id) => handleUpdateProduct(index, 'productoId', id)}
                          placeholder="Buscar producto..."
                          onAction={() => setShowNewProductModal(true)}
                          actionLabel="Crear nuevo producto"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Cantidad</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          className="input input-bordered input-sm w-full bg-white font-bold text-slate-700 text-center"
                          value={detalle.cantidad}
                          onChange={e => handleUpdateProduct(index, 'cantidad', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Costo Unitario ($)</label>
                        <input 
                          type="number" 
                          required
                          step="0.01"
                          className="input input-bordered input-sm w-full bg-white font-bold text-slate-700 text-center"
                          value={detalle.costoUnitario}
                          onChange={e => handleUpdateProduct(index, 'costoUnitario', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveProduct(index)}
                          className="btn btn-ghost btn-sm btn-square text-red-400 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {detalles.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase">No hay productos añadidos a la orden</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left w-full sm:w-auto">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inversión</p>
                <p className="text-2xl font-black text-primary">${calculateTotal().toFixed(2)}</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button type="button" onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={detalles.length === 0 || !proveedorId}
                  className="btn btn-primary px-10 rounded-xl font-bold text-white gap-2 shadow-lg shadow-primary/20 flex-1 sm:flex-none"
                >
                  <Save size={18} /> Generar Orden
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
      </div>

      <ProductFormModal 
        show={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onSubmit={handleCreateProduct}
        title="Añadir Producto al Catálogo"
      />
    </>
  );
}
