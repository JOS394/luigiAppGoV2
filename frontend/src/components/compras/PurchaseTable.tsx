"use client";

import React from 'react';
import { 
  Calendar, Eye, CheckCircle2, XCircle, Clock, Truck 
} from 'lucide-react';
import type { Compra } from '@/types';
import { TableActions } from '../shared/TableActions';

interface PurchaseTableProps {
  compras: Compra[];
  onOpenDetail: (compra: Compra) => void;
  onUpdateStatus: (id: string, status: Compra['estado']) => void;
}

export function PurchaseTable({ 
  compras, 
  onOpenDetail, 
  onUpdateStatus 
}: PurchaseTableProps) {
  const getStatusBadge = (estado: Compra['estado']) => {
    switch (estado) {
      case 'Completada':
        return <span className="badge badge-success border-none font-bold text-[9px] uppercase py-2 px-3 text-white gap-1"><CheckCircle2 size={10}/> Completada</span>;
      case 'Pendiente':
        return <span className="badge badge-warning border-none font-bold text-[9px] uppercase py-2 px-3 text-white gap-1"><Clock size={10}/> Pendiente</span>;
      case 'Cancelada':
        return <span className="badge badge-error border-none font-bold text-[9px] uppercase py-2 px-3 text-white gap-1"><XCircle size={10}/> Cancelada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="overflow-x-auto rounded-xl">
        <table className="table table-lg">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Orden / Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th className="px-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {compras.map((c, index) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary border border-primary/5 text-sm uppercase">
                      <Truck size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 text-sm uppercase tracking-tight">{c.proveedorNombre}</div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Orden: {c.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar size={12} className="text-slate-300" /> 
                    {new Date(c.fecha).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span className="font-black text-slate-700 text-sm tabular-nums">
                    ${c.total.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className="text-xs font-medium text-slate-500">{c.metodoPago}</span>
                </td>
                <td>
                  {getStatusBadge(c.estado)}
                </td>
                <td className="px-8 text-right">
                  <TableActions 
                    index={index}
                    total={compras.length}
                    actions={[
                      { label: 'Ver Detalles', icon: <Eye />, onClick: () => onOpenDetail(c) },
                      { label: 'SEPARATOR', icon: null, onClick: () => {} },
                      { 
                        label: 'Marcar Recibida', 
                        icon: <CheckCircle2 />, 
                        onClick: () => onUpdateStatus(c.id, 'Completada'),
                        variant: c.estado === 'Pendiente' ? 'default' : 'default' 
                      },
                      { 
                        label: 'Cancelar Orden', 
                        icon: <XCircle />, 
                        onClick: () => onUpdateStatus(c.id, 'Cancelada'),
                        variant: 'danger'
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
