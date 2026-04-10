"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, MinusCircle } from 'lucide-react';
import type { MovimientoFinanciero } from '@/types';

interface MovementModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MovimientoFinanciero, 'id' | 'fecha'>) => void;
  type: 'Ingreso' | 'Egreso';
}

export function MovementModal({ show, onClose, onSubmit, type }: MovementModalProps) {
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    categoria: '' as any,
    metodoPago: 'Efectivo' as any,
    tipo: type
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, tipo: type, categoria: type === 'Ingreso' ? 'Venta' : 'Otros' }));
  }, [type, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monto: parseFloat(formData.monto),
      tipo: type
    });
    setFormData({ descripcion: '', monto: '', categoria: type === 'Ingreso' ? 'Venta' : 'Otros', metodoPago: 'Efectivo', tipo: type });
  };

  const categorias = type === 'Ingreso' 
    ? ['Venta', 'Otros'] 
    : ['Proveedor', 'Servicios', 'Renta', 'Sueldos', 'Otros'];

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit}>
          <div className={`px-8 py-6 border-b border-slate-100 flex justify-between items-center ${type === 'Ingreso' ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${type === 'Ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {type === 'Ingreso' ? <PlusCircle size={22} /> : <MinusCircle size={22} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Registrar {type}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Operación de flujo de caja
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400">
              <X size={20}/>
            </button>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Concepto / Descripción</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Venta de productos, Pago de luz..." 
                className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700" 
                value={formData.descripcion}
                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  placeholder="0.00" 
                  className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700" 
                  value={formData.monto}
                  onChange={e => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método</label>
                <select 
                  className="select select-bordered w-full bg-slate-50 font-bold text-slate-700"
                  value={formData.metodoPago}
                  onChange={e => setFormData({ ...formData, metodoPago: e.target.value as any })}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
              <select 
                className="select select-bordered w-full bg-slate-50 font-bold text-slate-700"
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value as any })}
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
            <button type="button" onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400">
              Cancelar
            </button>
            <button type="submit" className={`btn px-10 rounded-xl font-bold text-white gap-2 shadow-lg ${type === 'Ingreso' ? 'btn-success shadow-green-200' : 'btn-error shadow-red-200'}`}>
              <Save size={18} /> Guardar {type}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
