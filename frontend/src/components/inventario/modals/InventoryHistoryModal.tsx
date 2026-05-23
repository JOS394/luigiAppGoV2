"use client";

import React from 'react';
import { X, History, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';
import type { MovimientoInventario, Producto } from '@/types';

interface InventoryHistoryModalProps {
  show: boolean;
  onClose: () => void;
  producto: Producto | null;
  movimientos: MovimientoInventario[];
}

export function InventoryHistoryModal({ show, onClose, producto, movimientos }: InventoryHistoryModalProps) {
  if (!show || !producto) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100 h-full max-h-[80vh] md:h-auto">
        <div className="bg-slate-800 px-8 py-6 text-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <History className="text-primary" size={24} />
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Kardex de Producto</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{producto.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-white/60 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
          {movimientos.length > 0 ? (
            <table className="table table-lg w-full">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0">
                <tr>
                  <th className="px-8 py-4">Fecha / Motivo</th>
                  <th>Operación</th>
                  <th className="text-right px-8">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {movimientos.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'}
                        </span>
                        <span className="font-bold text-slate-700 text-xs">{m.motivo || 'Sin motivo especificado'}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`flex items-center gap-2 font-bold text-[10px] uppercase ${
                        m.tipo === 'Entrada' ? 'text-green-600' :
                        m.tipo === 'Salida' ? 'text-red-500' : 'text-blue-600'
                      }`}>
                        {m.tipo === 'Entrada' ? <ArrowUpCircle size={14}/> :
                         m.tipo === 'Salida' ? <ArrowDownCircle size={14}/> :
                         <Info size={14}/>}
                        {m.tipo}
                      </div>
                    </td>
                    <td className="text-right px-8 font-mono text-xs font-bold">
                      <span className={
                        m.tipo === 'Entrada' ? 'text-green-600' :
                        m.tipo === 'Salida' ? 'text-red-500' : 'text-blue-600'
                      }>
                        {m.tipo === 'Entrada' ? '+' : m.tipo === 'Salida' ? '-' : ''}{m.cantidad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                <Info size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin movimientos registrados</p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="btn btn-ghost px-8 rounded-xl font-bold text-slate-400 uppercase text-xs">Cerrar Historial</button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
