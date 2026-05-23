"use client";

import React from 'react';
import { Wrench, Tag, Edit, Trash2, AlignLeft } from 'lucide-react';
import type { Producto } from '@/types';
import { TableActions } from '../shared/TableActions';

interface ServiceTableProps {
  servicios: Producto[];
  onOpenEdit: (s: Producto) => void;
  onOpenDelete: (s: Producto) => void;
  viewMode?: 'grid' | 'table';
}

export function ServiceTable({ 
  servicios, 
  onOpenEdit, 
  onOpenDelete,
  viewMode = 'table'
}: ServiceTableProps) {
  return (
    <div className="space-y-4">
      {/* VISTA GRID (CARDS) */}
      {(viewMode === 'grid') && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {servicios.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-secondary/30 transition-colors group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                      {s.imagen ? <img src={s.imagen} alt={s.nombre} className="w-full h-full object-cover" /> : <Wrench size={24} className="text-secondary" />}
                    </div>
                    <div className="max-w-[150px]">
                      <h4 className="font-black text-slate-800 text-sm uppercase leading-tight truncate group-hover:text-secondary transition-colors">{s.nombre}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-secondary mt-1">
                        <Tag size={10}/>
                        <span className="truncate">{s.categoria}</span>
                      </div>
                    </div>
                  </div>
                  <TableActions 
                    actions={[
                      { label: 'Editar Servicio', icon: <Edit />, onClick: () => onOpenEdit(s) },
                      { label: 'Eliminar', icon: <Trash2 />, onClick: () => onOpenDelete(s), variant: 'danger' },
                    ]}
                  />
                </div>

                <div className="text-xs font-medium text-slate-500 line-clamp-3 min-h-[48px] bg-slate-50 p-3 rounded-xl border border-slate-100/50 flex gap-2">
                  <AlignLeft size={14} className="text-slate-300 shrink-0 mt-0.5" />
                  <p>{s.descripcion || 'Sin descripción'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tarifa Base</span>
                <span className="text-xl font-black text-secondary">${s.precio.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA TABLA (LISTA) */}
      {(viewMode === 'table') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Servicio / SKU</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Tarifa</th>
                  <th className="px-8 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {servicios.map((s, index) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group text-sm font-medium">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                          {s.imagen ? <img src={s.imagen} alt={s.nombre} className="w-full h-full object-cover" /> : <Wrench size={20} className="text-secondary" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 uppercase tracking-tight">{s.nombre}</div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{`SKU: ${s.sku || 'N/A'}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs truncate text-xs text-slate-500 font-normal">
                      {s.descripcion || <span className="text-slate-300 italic">Sin descripción</span>}
                    </td>
                    <td>
                      <span className="badge badge-ghost border-none font-bold text-[9px] uppercase py-2 px-3 rounded text-slate-500">
                        {s.categoria}
                      </span>
                    </td>
                    <td>
                      <span className="font-black text-secondary tabular-nums">${s.precio.toFixed(2)}</span>
                    </td>
                    <td className="px-8 text-right">
                      <TableActions 
                        index={index}
                        total={servicios.length}
                        actions={[
                          { label: 'Editar Servicio', icon: <Edit />, onClick: () => onOpenEdit(s) },
                          { label: 'SEPARATOR', icon: null, onClick: () => {} },
                          { label: 'Eliminar', icon: <Trash2 />, onClick: () => onOpenDelete(s), variant: 'danger' },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
