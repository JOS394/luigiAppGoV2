"use client";

import React from 'react';
import { X, Edit, UserPlus, Mail, Phone, MapPin, StickyNote, Save } from 'lucide-react';
import type { Cliente } from '@/types';

interface ClientFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
  selectedCliente: Cliente | null;
  formData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    notas: string;
  };
  setFormData: (data: any) => void;
}

export function ClientFormModal({ 
  show, 
  onClose, 
  onSubmit, 
  isEdit, 
  selectedCliente, 
  formData, 
  setFormData 
}: ClientFormModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <form onSubmit={onSubmit}>
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                {isEdit ? <Edit size={22} /> : <UserPlus size={22} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  {isEdit ? 'Editar Cliente' : 'Registro Maestro'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isEdit ? `Modificando ID: ${selectedCliente?.id}` : 'Añadir cliente al ecosistema'}
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400">
              <X size={20}/>
            </button>
          </div>

          <div className="p-8 space-y-8 h-[60vh] overflow-y-auto custom-scrollbar bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">Identidad y Contacto</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nombre Completo *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Juan Pérez García" 
                    className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="email" 
                      placeholder="ejemplo@correo.com" 
                      className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Teléfono Móvil
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="tel" 
                      placeholder="555-000-0000" 
                      className="input input-bordered w-full pl-10 bg-slate-50 focus:border-primary font-bold text-slate-700" 
                      value={formData.telefono} 
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-l-4 border-secondary pl-3">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">Información Extendida</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-secondary"/> Dirección de Entrega o Facturación
                  </label>
                  <textarea 
                    placeholder="Calle, número, colonia..." 
                    className="textarea textarea-bordered w-full h-32 bg-slate-50 focus:border-secondary font-bold text-slate-700 text-sm py-4 leading-relaxed shadow-inner" 
                    value={formData.direccion} 
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <StickyNote size={14} className="text-secondary"/> Notas de Interés / Observaciones
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full h-32 bg-slate-50 focus:border-secondary font-bold text-slate-700 text-sm py-4 leading-relaxed shadow-inner" 
                    placeholder="..." 
                    value={formData.notas} 
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary px-10 rounded-xl font-bold text-white gap-2 shadow-lg shadow-primary/20"
            >
              <Save size={18} /> {isEdit ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
