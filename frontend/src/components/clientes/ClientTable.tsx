"use client";

import React from 'react';
import { Mail, Phone, Calendar, Eye, Edit, Trash2, History } from 'lucide-react';
import type { Cliente } from '@/types';
import { TableActions } from '../shared/TableActions';

interface ClientTableProps {
  clientes: Cliente[];
  onOpenDetail: (cliente: Cliente) => void;
  onOpenEdit: (cliente: Cliente) => void;
  onOpenDelete: (cliente: Cliente) => void;
}

export function ClientTable({ 
  clientes, 
  onOpenDetail, 
  onOpenEdit, 
  onOpenDelete 
}: ClientTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="overflow-x-auto rounded-xl">
        <table className="table table-lg">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Información del Cliente</th>
              <th>Datos de Contacto</th>
              <th>Total Compras</th>
              <th>Última Actividad</th>
              <th className="px-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clientes.map((c, index) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary border border-primary/5 text-sm uppercase">
                      {c.nombre.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 text-sm uppercase tracking-tight">{c.nombre}</div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {c.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="space-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-300" /> {c.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-300" /> {c.telefono || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="font-black text-slate-700 text-sm tabular-nums">
                    ${c.totalCompras.toFixed(2)}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar size={12} className="text-slate-300" /> 
                    {new Date(c.ultimaVisita).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 text-right">
                  <TableActions 
                    index={index}
                    total={clientes.length}
                    actions={[
                      { label: 'Ver Perfil', icon: <Eye />, onClick: () => onOpenDetail(c) },
                      { label: 'Editar Datos', icon: <Edit />, onClick: () => onOpenEdit(c) },
                      { label: 'Historial Compras', icon: <History />, onClick: () => {} },
                      { label: 'SEPARATOR', icon: null, onClick: () => {} },
                      { label: 'Eliminar Registro', icon: <Trash2 />, onClick: () => onOpenDelete(c), variant: 'danger' },
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
