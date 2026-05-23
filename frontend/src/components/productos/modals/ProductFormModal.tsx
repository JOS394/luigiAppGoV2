"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Package, DollarSign, Boxes, Tag, MapPin, MapPinned, Camera } from 'lucide-react';
import type { Producto } from '@/types';

interface ProductFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title?: string;
  initialData?: Producto | null;
}

export function ProductFormModal({ 
  show, 
  onClose, 
  onSubmit, 
  title, 
  initialData 
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<{
    nombre: string;
    sku: string;
    precio: string;
    costo: string;
    costoUnitario: string;
    stock: string;
    categoria: string;
    tipo: 'producto' | 'servicio';
    codigoBarras: string;
    codigoBarrasSecundario: string;
    ubicacion: string;
    ubicacionEspecifica: string;
    imagen: string;
    descripcion: string;
  }>({
    nombre: '',
    sku: '',
    precio: '',
    costo: '',
    costoUnitario: '',
    stock: '',
    categoria: 'General',
    tipo: 'producto',
    codigoBarras: '',
    codigoBarrasSecundario: '',
    ubicacion: '',
    ubicacionEspecifica: '',
    imagen: '',
    descripcion: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        sku: initialData.sku || '',
        precio: initialData.precio.toString(),
        costo: (initialData.costo ?? 0).toString(),
        costoUnitario: (initialData.costoUnitario ?? 0).toString(),
        stock: initialData.stock.toString(),
        categoria: initialData.categoria,
        tipo: initialData.tipo,
        codigoBarras: initialData.codigoBarras || '',
        codigoBarrasSecundario: initialData.codigoBarrasSecundario || '',
        ubicacion: initialData.ubicacion || '',
        ubicacionEspecifica: initialData.ubicacionEspecifica || '',
        imagen: initialData.imagen || '',
        descripcion: initialData.descripcion || ''
      });
    } else {
      setFormData({
        nombre: '', sku: '', precio: '', costo: '', costoUnitario: '', stock: '', categoria: 'General', 
        tipo: 'producto', codigoBarras: '', codigoBarrasSecundario: '', ubicacion: '', ubicacionEspecifica: '', imagen: '',
        descripcion: ''
      });
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      precio: parseFloat(formData.precio) || 0,
      costo: parseFloat(formData.costo) || 0,
      costoUnitario: parseFloat(formData.costoUnitario) || 0,
      stock: parseInt(formData.stock) || 0,
    });
  };

  const displayTitle = title || (initialData ? "Editar Producto" : "Nuevo Producto");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] md:max-h-[85vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <Package size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{displayTitle}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Gestión de Catálogo Maestro</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20}/></button>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            <div 
              className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors relative group"
              onClick={() => document.getElementById('product-image-input')?.click()}
            >
              <input id="product-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {formData.imagen ? (
                <div className="relative">
                  <img src={formData.imagen} alt="Preview" className="w-32 h-32 object-cover rounded-2xl shadow-md border-4 border-white" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({...formData, imagen: ''}); }} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white shadow-lg"><X size={12}/></button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Camera size={32} className="text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toca para tomar o subir foto</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Producto *</label>
                <input type="text" required placeholder="Ej. Cuaderno Profesional" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU *</label>
                <input type="text" required placeholder="Ej. PROD-10293" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción Detallada</label>
                <textarea placeholder="Especificaciones, marca, color, material..." className="textarea textarea-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 min-h-[80px]" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Costo ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" step="0.01" required placeholder="0.00" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.costo} onChange={e => setFormData({ ...formData, costo: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Costo Unitario ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" step="0.01" required placeholder="0.00" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.costoUnitario} onChange={e => setFormData({ ...formData, costoUnitario: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio Venta ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" step="0.01" required placeholder="0.00" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {initialData ? 'Stock Actual' : 'Stock Inicial *'}
                </label>
                <div className="relative">
                  <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="number" 
                    required 
                    placeholder="0" 
                    className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 cursor-not-allowed" 
                    disabled={!!initialData}
                    value={formData.stock} 
                    onChange={e => setFormData({ ...formData, stock: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" placeholder="Papelería, Oficina..." className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo *</label>
                <select className="select select-bordered w-full bg-slate-50 font-bold text-slate-700 h-12" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value as 'producto' | 'servicio'})}>
                  <option value="producto">Producto</option>
                  <option value="servicio">Servicio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código de Barras</label>
                <input type="text" placeholder="Ej. 7501234567890" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.codigoBarras} onChange={e => setFormData({ ...formData, codigoBarras: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código de Barras Secundario</label>
                <input type="text" placeholder="Código alternativo" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.codigoBarrasSecundario} onChange={e => setFormData({ ...formData, codigoBarrasSecundario: e.target.value })} />
              </div>

              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MapPin size={14} className="text-primary"/> Ubicación Física
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ubicación General</label>
                    <select className="select select-bordered w-full bg-slate-50 font-bold text-slate-700 h-12" value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})}>
                      <option value="">No asignada</option>
                      <option value="Bodega">Bodega Central</option>
                      <option value="Tienda">Tienda / Exhibición</option>
                      <option value="Vitrina">Vitrina Principal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ubicación Específica</label>
                    <div className="relative">
                      <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Ej. Pasillo 2, Estante B" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.ubicacionEspecifica} onChange={e => setFormData({ ...formData, ubicacionEspecifica: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end sticky bottom-0 z-10">
            <button type="button" onClick={onClose} className="btn btn-ghost px-6 rounded-xl font-bold text-slate-400">Cancelar</button>
            <button type="submit" className="btn btn-primary px-8 rounded-xl font-bold text-white gap-2 shadow-lg shadow-primary/20">
              <Save size={18} /> {initialData ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
