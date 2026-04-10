"use client";

import React from 'react';
import { Filter, X, Calendar } from 'lucide-react';

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onClear: () => void;
}

export function FilterModal({ 
  show, 
  onClose, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onClear 
}: FilterModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
            <Filter size={18} className="text-primary" /> Filtros del Directorio
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400">
            <X size={20}/>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-primary"/> Rango de Última Visita
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Desde</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto de Compra</label>
            <select className="select select-bordered w-full bg-slate-50 text-sm font-bold text-slate-600">
              <option>Cualquier volumen</option>
              <option>Más de $1,000</option>
              <option>Más de $5,000</option>
            </select>
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
            className="btn btn-primary flex-1 rounded-xl uppercase text-[10px] font-black text-white shadow-lg shadow-primary/20"
          >
            Ver Resultados
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
