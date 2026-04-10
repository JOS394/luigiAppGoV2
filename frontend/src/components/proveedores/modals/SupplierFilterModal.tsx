"use client";

import React from 'react';
import { Filter, X, Tag } from 'lucide-react';

interface SupplierFilterModalProps {
  show: boolean;
  onClose: () => void;
  filters: {
    categoria: string;
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
  categorias: string[];
}

export function SupplierFilterModal({ 
  show, 
  onClose, 
  filters, 
  setFilters, 
  onClear,
  categorias 
}: SupplierFilterModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-3xl border border-slate-100 shadow-2xl">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Filter size={18} />
            </div>
            <h3 className="font-black text-slate-700 uppercase tracking-tight text-sm">Filtros de Proveedores</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Tag size={14} className="text-primary"/> Especialidad / Categoría
            </label>
            <select 
              className="select select-bordered w-full bg-slate-50 text-sm font-bold text-slate-600 h-12"
              value={filters.categoria}
              onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            >
              <option value="Todas">Todas las especialidades</option>
              {categorias.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-5 flex gap-3 border-t border-slate-100">
          <button 
            onClick={onClear} 
            className="btn btn-ghost flex-1 rounded-2xl uppercase text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors h-12"
          >
            Limpiar
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-primary flex-1 rounded-2xl uppercase text-[10px] font-black text-white shadow-xl shadow-primary/20 h-12 border-none"
          >
            Ver Resultados
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
