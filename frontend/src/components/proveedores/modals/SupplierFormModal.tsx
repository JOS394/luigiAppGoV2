"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Truck, Phone, User, MapPin, Tag } from 'lucide-react';
import type { Proveedor } from '@/types';

interface SupplierFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Proveedor | null;
}

export function SupplierFormModal({ show, onClose, onSubmit, initialData }: SupplierFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    direccion: '',
    categoria: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        contacto: initialData.contacto,
        telefono: initialData.telefono,
        direccion: initialData.direccion || '',
        categoria: initialData.categoria
      });
    } else {
      setFormData({ nombre: '', contacto: '', telefono: '', direccion: '', categoria: '' });
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-3xl shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <Truck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  {initialData ? 'Editar Proveedor' : 'Nuevo Aliado Comercial'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión de Abastecimiento</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20}/></button>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razón Social / Nombre Comercial *</label>
                <input type="text" required placeholder="Ej. Distribuidora del Norte S.A." className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Persona de Contacto</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" required placeholder="Ej. Juan Pérez" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.contacto} onChange={e => setFormData({ ...formData, contacto: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono Directo</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="tel" required placeholder="555-0000" className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría / Especialidad</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" required placeholder="Ej. Papelería, Limpieza..." className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700 h-12" value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin size={14} className="text-primary"/> Dirección de Entrega
                </label>
                <textarea placeholder="Calle, número, colonia, ciudad..." className="textarea textarea-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 min-h-[80px]" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400">Cancelar</button>
            <button type="submit" className="btn btn-primary px-10 rounded-xl font-bold text-white gap-2 shadow-lg shadow-primary/20">
              <Save size={18} /> {initialData ? 'Actualizar Aliado' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
