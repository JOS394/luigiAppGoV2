"use client";

import React from 'react';
import { Filter, X, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';

interface SalesFilterModalProps {
  show: boolean;
  onClose: () => void;
  filters: {
    startDate: string;
    endDate: string;
    estado: string;
    minAmount: string;
    maxPrice: string;
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
}

export function SalesFilterModal({ 
  show, 
  onClose, 
  filters, 
  setFilters, 
  onClear 
}: SalesFilterModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-3xl border border-slate-100 shadow-2xl">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Filter size={18} />
            </div>
            <h3 className="font-black text-slate-700 uppercase tracking-tight text-sm">Filtros de Historial</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Periodo de Tiempo */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Calendar size={14} className="text-primary"/> Rango de Fecha
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Desde</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary h-11" 
                  value={filters.startDate} 
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} 
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary h-11" 
                  value={filters.endDate} 
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {/* Estado de la Venta */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Estado de Orden</label>
            <div className="grid grid-cols-3 gap-2">
              {['Todos', 'Completada', 'Pendiente'].map((e) => (
                <button
                  key={e}
                  onClick={() => setFilters({ ...filters, estado: e })}
                  className={`btn btn-sm h-10 rounded-xl border-none capitalize text-[10px] font-bold ${
                    filters.estado === e 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Montos */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <DollarSign size={14} className="text-primary"/> Monto de Venta
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="input input-bordered w-full pl-7 bg-slate-50 text-xs font-bold text-slate-600 h-11" 
                  value={filters.minAmount} 
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })} 
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="input input-bordered w-full pl-7 bg-slate-50 text-xs font-bold text-slate-600 h-11" 
                  value={filters.maxPrice} 
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} 
                />
              </div>
            </div>
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
