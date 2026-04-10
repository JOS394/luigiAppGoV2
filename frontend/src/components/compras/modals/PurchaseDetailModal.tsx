"use client";

import React from 'react';
import { X, Truck, Calendar, CreditCard, Package, CheckCircle2, XCircle } from 'lucide-react';
import type { Compra } from '@/types';

interface PurchaseDetailModalProps {
  show: boolean;
  onClose: () => void;
  compra: Compra | null;
  onUpdateStatus: (id: string, status: Compra['estado']) => void;
}

export function PurchaseDetailModal({ show, onClose, compra, onUpdateStatus }: PurchaseDetailModalProps) {
  if (!show || !compra) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <div className="bg-slate-800 px-8 py-10 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={20}/></button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary border border-white/10">
              <Truck size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">{compra.proveedorNombre}</h3>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Orden: {compra.id}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">{compra.estado}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                <Calendar size={18} className="text-primary"/> 
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Fecha de Emisión</p>
                  {new Date(compra.fecha).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                <CreditCard size={18} className="text-primary"/> 
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Método de Pago</p>
                  {compra.metodoPago}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de la Orden</p>
              <p className="text-3xl font-black text-primary">${compra.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center gap-2">
              <Package size={14} className="text-primary"/> Productos Incluidos
            </h4>
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <table className="table table-sm">
                <thead className="bg-slate-50 text-[9px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-3">Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">Costo U.</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {compra.detalles.map((d, i) => (
                    <tr key={i} className="text-xs font-bold text-slate-600">
                      <td className="py-3">{d.productoNombre}</td>
                      <td className="text-center">{d.cantidad}</td>
                      <td className="text-right">${d.costoUnitario.toFixed(2)}</td>
                      <td className="text-right text-primary">${d.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 flex flex-wrap gap-3">
          {compra.estado === 'Pendiente' && (
            <>
              <button 
                onClick={() => { onUpdateStatus(compra.id, 'Completada'); onClose(); }}
                className="btn btn-outline btn-success flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2"
              >
                <CheckCircle2 size={16}/> Marcar Recibida
              </button>
              <button 
                onClick={() => { onUpdateStatus(compra.id, 'Cancelada'); onClose(); }}
                className="btn btn-outline btn-error flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs gap-2"
              >
                <XCircle size={16}/> Cancelar Orden
              </button>
            </>
          )}
          <button 
            onClick={onClose} 
            className="btn btn-ghost flex-1 min-w-[140px] rounded-xl uppercase font-bold text-xs text-slate-400"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
