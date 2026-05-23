"use client";

import React, { useState } from 'react';
import { X, Save, PlusCircle, MinusCircle, Info } from 'lucide-react';
import type { Producto } from '@/types';

interface StockAdjustmentModalProps {
  show: boolean;
  onClose: () => void;
  producto: Producto | null;
  onSubmit: (data: { productoId: string, cantidad: number, tipo: 'Entrada' | 'Salida', motivo: string }) => void;
}

export function StockAdjustmentModal({ show, onClose, producto, onSubmit }: StockAdjustmentModalProps) {
  const [tipo, setTipo] = useState<'Entrada' | 'Salida'>('Entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');

  if (!show || !producto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantidad || !motivo || !producto) return;
    onSubmit({
      productoId: producto.id,
      cantidad: parseInt(cantidad),
      tipo,
      motivo
    });
    setCantidad('');
    setMotivo('');
  };

  const stockNuevo = tipo === 'Entrada' 
    ? producto.stock + (parseInt(cantidad) || 0)
    : producto.stock - (parseInt(cantidad) || 0);

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                {tipo === 'Entrada' ? <PlusCircle size={22} /> : <MinusCircle size={22} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Ajustar Inventario</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {producto.nombre} <span className="text-primary/50 ml-2">ID: {producto.id}</span>
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20}/></button>
          </div>

          <div className="p-8 space-y-6 bg-white">
            {/* Selector de Tipo */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setTipo('Entrada')}
                className={`btn btn-md rounded-xl gap-2 border-none ${tipo === 'Entrada' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <PlusCircle size={18} /> Entrada
              </button>
              <button 
                type="button"
                onClick={() => setTipo('Salida')}
                className={`btn btn-md rounded-xl gap-2 border-none ${tipo === 'Salida' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <MinusCircle size={18} /> Salida
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col justify-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Actual</label>
                <div className="text-2xl font-black text-slate-800 ml-1 h-12 flex items-center">{producto.stock} <span className="text-xs font-bold text-slate-400 ml-1">unid.</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-primary">Cantidad a Ajustar</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  placeholder="0" 
                  className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700" 
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo del Ajuste</label>
              <select 
                required
                className="select select-bordered w-full bg-slate-50 font-bold text-slate-700"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
              >
                <option value="">Seleccione un motivo...</option>
                <option value="Conteo Físico">Conteo Físico / Auditoría</option>
                <option value="Merma / Daño">Merma / Producto Dañado</option>
                <option value="Pérdida">Pérdida / Extravío</option>
                <option value="Corrección">Corrección de Error</option>
                <option value="Otro">Otro (Especificar en notas)</option>
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Stock Resultante</span>
              <span className={`text-lg font-black ${stockNuevo < 0 ? 'text-red-500' : 'text-primary'}`}>
                {isNaN(stockNuevo) ? producto.stock : stockNuevo} unidades
              </span>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
            <button type="button" onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400">Cancelar</button>
            <button 
              type="submit" 
              disabled={stockNuevo < 0 || !cantidad || !motivo}
              className="btn btn-primary px-10 rounded-xl font-bold text-white gap-2 shadow-lg shadow-primary/20"
            >
              <Save size={18} /> Confirmar Ajuste
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
