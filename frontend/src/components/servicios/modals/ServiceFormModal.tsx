"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Wrench, DollarSign, Tag, Info, AlignLeft } from 'lucide-react';
import type { Producto } from '@/types';

interface ServiceFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Producto | null;
}

export function ServiceFormModal({ show, onClose, onSubmit, initialData }: ServiceFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'Servicios',
    tipo: 'servicio' as const,
    imagen: '',
    descripcion: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        precio: initialData.precio.toString(),
        categoria: initialData.categoria,
        tipo: 'servicio',
        imagen: initialData.imagen || '',
        descripcion: initialData.descripcion || ''
      });
    } else {
      setFormData({ nombre: '', precio: '', categoria: 'Servicios', tipo: 'servicio', imagen: '', descripcion: '' });
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      id: initialData?.id || '',
      sku: initialData?.sku || '',
      precio: parseFloat(formData.precio),
      costo: 0,
      costoUnitario: 0,
      stock: 999999, // Stock infinito para servicios
      codigoBarras: null,
      codigoBarrasSecundario: null,
    };
    onSubmit(serviceData);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shadow-inner">
                <Wrench size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  {initialData ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catálogo de Mano de Obra</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20}/></button>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Servicio</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Reparación de PC, Diseño de Logo..." 
                className="input input-bordered w-full bg-slate-50 focus:border-secondary font-bold text-slate-700 h-12" 
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción del Servicio</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-slate-300" size={16} />
                <textarea 
                  placeholder="Detalla en qué consiste el servicio, tiempo estimado, alcance..." 
                  className="textarea textarea-bordered w-full pl-10 bg-slate-50 focus:border-secondary font-bold text-slate-700 min-h-[100px]" 
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio / Tarifa ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  placeholder="0.00" 
                  className="input input-bordered w-full pl-10 bg-slate-50 focus:border-secondary font-bold text-slate-700 h-12" 
                  value={formData.precio}
                  onChange={e => setFormData({ ...formData, precio: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Ej. Mantenimiento, Digital..." 
                  className="input input-bordered w-full pl-10 bg-slate-50 focus:border-secondary font-bold text-slate-700 h-12" 
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
            <button type="button" onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400">Cancelar</button>
            <button type="submit" className="btn btn-secondary px-10 rounded-xl font-bold text-white gap-2 shadow-lg shadow-secondary/20">
              <Save size={18} /> {initialData ? 'Actualizar' : 'Guardar'} Servicio
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
