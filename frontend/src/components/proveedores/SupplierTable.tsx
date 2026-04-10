"use client";

import React from 'react';
import { Truck, Phone, User, Tag, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import type { Proveedor } from '@/types';
import { TableActions } from '../shared/TableActions';

interface SupplierTableProps {
  proveedores: Proveedor[];
  onOpenEdit: (p: Proveedor) => void;
  onOpenDelete: (p: Proveedor) => void;
}

export function SupplierTable({ 
  proveedores, 
  onOpenEdit, 
  onOpenDelete 
}: SupplierTableProps) {
  return (
    <div className="space-y-4">
      {/* VISTA MÓVIL (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {proveedores.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm uppercase leading-tight">{p.nombre}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.categoria}</span>
                </div>
              </div>
              <TableActions 
                actions={[
                  { label: 'Editar Datos', icon: <Edit />, onClick: () => onOpenEdit(p) },
                  { label: 'Eliminar Proveedor', icon: <Trash2 />, onClick: () => onOpenDelete(p), variant: 'danger' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase">Contacto</p>
                <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                  <User size={12} className="text-primary" />
                  <span className="truncate">{p.contacto}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase">Teléfono</p>
                <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                  <Phone size={12} className="text-primary" />
                  <span>{p.telefono}</span>
                </div>
              </div>
            </div>

            {p.direccion && (
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium leading-relaxed italic line-clamp-1">{p.direccion}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VISTA ESCRITORIO (TABLA) */}
      <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="table table-lg">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Proveedor / Categoría</th>
                <th>Contacto Principal</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th className="px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {proveedores.map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase">
                        {p.nombre.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 text-sm uppercase tracking-tight">{p.nombre}</div>
                        <span className="badge badge-ghost border-none font-bold text-[9px] uppercase mt-1">{p.categoria}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <User size={14} className="text-slate-300" />
                      {p.contacto}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <Phone size={14} className="text-slate-300" />
                      {p.telefono}
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-slate-400 max-w-[200px] truncate italic">{p.direccion || 'N/A'}</p>
                  </td>
                  <td className="px-8 text-right">
                    <TableActions 
                      index={index}
                      total={proveedores.length}
                      actions={[
                        { label: 'Editar Datos', icon: <Edit />, onClick: () => onOpenEdit(p) },
                        { label: 'SEPARATOR', icon: null, onClick: () => {} },
                        { label: 'Eliminar Registro', icon: <Trash2 />, onClick: () => onOpenDelete(p), variant: 'danger' },
                      ]}
                    />
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
