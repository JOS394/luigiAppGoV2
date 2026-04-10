"use client";

import React from 'react';
import { Package, Tag, Eye, Edit, Trash2, History, AlertCircle, MapPin } from 'lucide-react';
import type { Producto } from '@/types';
import { TableActions } from '../shared/TableActions';

interface ProductTableProps {
  productos: Producto[];
  onOpenDetail: (p: Producto) => void;
  onOpenEdit: (p: Producto) => void;
  onOpenDelete: (p: Producto) => void;
  viewMode?: 'grid' | 'table';
}

export function ProductTable({ 
  productos, 
  onOpenDetail, 
  onOpenEdit, 
  onOpenDelete,
  viewMode = 'table'
}: ProductTableProps) {
  return (
    <div className="space-y-4">
      {/* VISTA GRID (CARDS) */}
      {(viewMode === 'grid') && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-primary/30 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                    {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <Package size={24} />}
                  </div>
                  <div className="max-w-[150px]">
                    <h4 className="font-black text-slate-800 text-sm uppercase leading-tight truncate group-hover:text-primary transition-colors">{p.nombre}</h4>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-1">
                      <Tag size={10}/>
                      <span className="truncate">{p.categoria}</span>
                    </div>
                  </div>
                </div>
                <TableActions 
                  actions={[
                    { label: 'Ver Detalles', icon: <Eye />, onClick: () => onOpenDetail(p) },
                    { label: 'Editar Producto', icon: <Edit />, onClick: () => onOpenEdit(p) },
                    { label: 'Eliminar', icon: <Trash2 />, onClick: () => onOpenDelete(p), variant: 'danger' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Existencias</span>
                  <span className={`text-xl font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                    {p.stock} <span className="text-[10px] font-bold opacity-50">unid.</span>
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio</span>
                  <span className="text-xl font-black text-primary">${p.precio.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <MapPin size={12} className="text-slate-300"/>
                <p className="text-[10px] font-medium text-slate-400 italic truncate">
                  {p.ubicacion || 'Sin ubicación'} {p.ubicacionEspecifica ? `• ${p.ubicacionEspecifica}` : ''}
                </p>
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
                  <th className="px-8 py-5">Producto / SKU</th>
                  <th>Categoría</th>
                  <th>Ubicación</th>
                  <th>Precio</th>
                  <th>Existencias</th>
                  <th className="px-8 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productos.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group text-sm font-medium">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                          {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <Package size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 uppercase tracking-tight">{p.nombre}</div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.codigoBarras || `SKU: ${p.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost border-none font-bold text-[9px] uppercase py-2 px-3 rounded text-slate-500">
                        {p.categoria}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <MapPin size={12} className="text-primary"/> {p.ubicacion || 'N/A'}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-4 font-medium italic">{p.ubicacionEspecifica}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-black text-slate-700 tabular-nums">${p.precio.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-black tabular-nums ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                          {p.stock}
                        </span>
                        {p.stock < 10 && <AlertCircle size={14} className="text-red-400" />}
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <TableActions 
                        index={index}
                        total={productos.length}
                        actions={[
                          { label: 'Ver Detalles', icon: <Eye />, onClick: () => onOpenDetail(p) },
                          { label: 'Editar Producto', icon: <Edit />, onClick: () => onOpenEdit(p) },
                          { label: 'SEPARATOR', icon: null, onClick: () => {} },
                          { label: 'Eliminar', icon: <Trash2 />, onClick: () => onOpenDelete(p), variant: 'danger' },
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
