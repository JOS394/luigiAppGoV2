"use client";

import React from 'react';
import { Filter, X, Tag, DollarSign } from 'lucide-react';

interface ServiceFilterModalProps {
  show: boolean;
  onClose: () => void;
  filters: {
    categoria: string;
    minPrice: string;
    maxPrice: string;
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
  categorias: string[];
}

export function ServiceFilterModal({ 
  show, 
  onClose, 
  filters, 
  setFilters, 
  onClear,
  categorias 
}: ServiceFilterModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
            <Filter size={18} className="text-secondary" /> Filtros de Servicios
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Categoría */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Tag size={14} className="text-secondary"/> Categoría
            </label>
            <select 
              className="select select-bordered w-full bg-slate-50 text-sm font-bold text-slate-600 h-12"
              value={filters.categoria}
              onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            >
              <option value="Todas">Todas las categorías</option>
              {categorias.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Rango de Precios */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <DollarSign size={14} className="text-secondary"/> Rango de Tarifa Base
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="input input-bordered w-full pl-7 bg-slate-50 text-xs font-bold text-slate-600 focus:border-secondary" 
                  value={filters.minPrice} 
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} 
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="input input-bordered w-full pl-7 bg-slate-50 text-xs font-bold text-slate-600 focus:border-secondary" 
                  value={filters.maxPrice} 
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex gap-3">
          <button 
            onClick={onClear} 
            className="btn btn-ghost flex-1 rounded-xl uppercase text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors"
          >
            Limpiar Filtros
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-secondary flex-1 rounded-xl uppercase text-[10px] font-black text-white shadow-lg shadow-secondary/20"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
