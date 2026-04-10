"use client";

import React from 'react';
import { Receipt, Filter, Download } from 'lucide-react';
import type { MovimientoFinanciero } from '@/types';

interface MovementsTableProps {
  movimientos: MovimientoFinanciero[];
  onFilter: () => void;
  onExport: () => void;
}

export function MovementsTable({ movimientos, onFilter, onExport }: MovementsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <Receipt className="text-primary" size={20} /> Últimos Movimientos
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={onFilter}
            className="btn btn-ghost btn-sm text-slate-400 border border-slate-200 rounded-lg gap-2"
          >
            <Filter size={14} /> Filtrar
          </button>
          <button 
            onClick={onExport}
            className="btn btn-ghost btn-sm text-slate-400 border border-slate-200 rounded-lg gap-2"
          >
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Concepto / Fecha</th>
                <th>Categoría</th>
                <th>Método</th>
                <th className="text-right px-8">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {movimientos.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{m.descripcion}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {new Date(m.fecha).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge border-none font-bold text-[9px] uppercase py-2 px-3 rounded ${
                      m.tipo === 'Ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {m.categoria}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-slate-500">{m.metodoPago}</span>
                  </td>
                  <td className={`text-right px-8 font-black text-sm tabular-nums ${
                    m.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {m.tipo === 'Ingreso' ? '+' : '-'}${m.monto.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
