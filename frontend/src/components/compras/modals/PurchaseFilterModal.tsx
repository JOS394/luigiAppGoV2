"use client";

import React from 'react';
import { Filter, X, Calendar, Truck } from 'lucide-react';

interface PurchaseFilterModalProps {
  show: boolean;
  onClose: () => void;
  filters: {
    startDate: string;
    endDate: string;
    estado: string;
    metodoPago: string;
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
}

export function PurchaseFilterModal({ 
  show, 
  onClose, 
  filters, 
  setFilters, 
  onClear 
}: PurchaseFilterModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
            <Filter size={18} className="text-primary" /> Filtros de Abasto
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Estado de la Orden */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado del Pedido</label>
            <div className="grid grid-cols-2 gap-2">
              {['Todos', 'Pendiente', 'Completada', 'Cancelada'].map((e) => (
                <button
                  key={e}
                  onClick={() => setFilters({ ...filters, estado: e })}
                  className={`btn btn-sm rounded-lg border-none capitalize ${
                    filters.estado === e 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Fechas */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-primary"/> Rango de Fecha
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Desde</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary" 
                  value={filters.startDate} 
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta</span>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-slate-50 text-xs font-bold text-slate-600 focus:border-primary" 
                  value={filters.endDate} 
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método de Pago</label>
            <select 
              className="select select-bordered w-full bg-slate-50 text-sm font-bold text-slate-600"
              value={filters.metodoPago}
              onChange={(e) => setFilters({ ...filters, metodoPago: e.target.value })}
            >
              <option value="Todos">Todos los métodos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
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
