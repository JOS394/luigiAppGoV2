"use client";

import React from 'react';
import { X, CheckCircle2, Mail, Phone, MapPin, Edit, History, Trash2 } from 'lucide-react';
import type { Cliente } from '@/types';

interface ClientDetailModalProps {
  show: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

export function ClientDetailModal({ show, onClose, cliente, onEdit, onDelete }: ClientDetailModalProps) {
  if (!show || !cliente) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <div className="bg-primary px-8 py-10 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={20}/>
          </button>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl font-black border border-white/20">
              {cliente.nombre.charAt(0)}
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">{cliente.nombre}</h3>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                  ID: {cliente.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 size={10}/> Activo
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Contacto
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Mail size={16} className="text-primary"/> {cliente.email || 'Sin correo'}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Phone size={16} className="text-primary"/> {cliente.telefono || 'Sin teléfono'}
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Ubicación
              </label>
              <div className="flex items-start gap-3 text-slate-600 font-bold text-sm leading-relaxed">
                <MapPin size={16} className="text-secondary shrink-0 mt-1"/> {cliente.direccion || 'No especificada'}
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">
              Resumen de Cuenta
            </label>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Compras Totales</span>
                <span className="text-lg font-black text-primary">${cliente.totalCompras.toFixed(2)}</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Última Visita</span>
                <span className="text-xs font-black text-slate-700">
                  {new Date(cliente.ultimaVisita).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-wrap gap-3">
          <button 
            onClick={() => { onClose(); onEdit(cliente); }} 
            className="btn btn-outline btn-primary flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2"
          >
            <Edit size={16}/> Editar Datos
          </button>
          <button 
            className="btn btn-outline btn-ghost flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2 text-slate-500"
          >
            <History size={16}/> Historial
          </button>
          <button 
            onClick={() => { onClose(); onDelete(cliente); }}
            className="btn btn-outline btn-error flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2"
          >
            <Trash2 size={16}/> Eliminar
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-ghost w-full sm:w-auto rounded-xl uppercase font-bold text-xs text-slate-400 mt-2 sm:mt-0"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
