"use client";

import React from 'react';
import { X, Package, Tag, DollarSign, Boxes, Edit, Trash2, MapPin } from 'lucide-react';
import type { Producto } from '@/types';

interface ProductDetailModalProps {
  show: boolean;
  onClose: () => void;
  producto: Producto | null;
  onEdit: (p: Producto) => void;
  onDelete: (p: Producto) => void;
}

export function ProductDetailModal({ show, onClose, producto, onEdit, onDelete }: ProductDetailModalProps) {
  if (!show || !producto) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <div className="bg-slate-800 px-8 py-10 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={20}/></button>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
              {producto.imagen ? (
                <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <Package size={40} className="text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">{producto.nombre}</h3>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">SKU: {producto.id}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 capitalize">
                  {producto.tipo}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Clasificación</label>
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                <Tag size={16} className="text-primary"/> {producto.categoria}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Código de Barras</label>
              <div className="text-slate-600 font-mono font-bold text-sm tracking-widest">
                {producto.codigoBarras || 'N/A'}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ubicación Física</label>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <MapPin size={16} className="text-primary"/> {producto.ubicacion || 'Sin asignar'}
                </div>
                {producto.ubicacionEspecifica && (
                  <span className="text-[10px] text-slate-400 ml-7 font-medium italic">
                    {producto.ubicacionEspecifica}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Precio Venta</span>
                <span className="text-2xl font-black text-primary">${producto.precio.toFixed(2)}</span>
              </div>
              <DollarSign size={24} className="text-primary opacity-20" />
            </div>
            <div className={`p-4 rounded-xl shadow-sm flex justify-between items-center ${producto.stock < 10 ? 'bg-red-50' : 'bg-white'}`}>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Stock Actual</span>
                <span className={`text-2xl font-black ${producto.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                  {producto.stock}
                </span>
              </div>
              <Boxes size={24} className={`${producto.stock < 10 ? 'text-red-500' : 'text-slate-300'} opacity-20`} />
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 flex flex-wrap gap-3">
          <button 
            onClick={() => { onClose(); onEdit(producto); }} 
            className="btn btn-outline btn-primary flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2"
          >
            <Edit size={16}/> Editar Producto
          </button>
          <button 
            onClick={() => { onClose(); onDelete(producto); }}
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
