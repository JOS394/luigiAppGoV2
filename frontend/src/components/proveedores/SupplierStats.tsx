"use client";

import React from 'react';
import { Truck, Users, Tag } from 'lucide-react';
import type { Proveedor } from '@/types';

interface SupplierStatsProps {
  proveedores: Proveedor[];
}

export function SupplierStats({ proveedores }: SupplierStatsProps) {
  const total = proveedores.length;
  const categorias = new Set(proveedores.map(p => p.categoria)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Truck size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proveedores Totales</p>
          <p className="text-2xl font-black text-slate-800">{total}</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Tag size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Especialidades</p>
          <p className="text-2xl font-black text-slate-800">{categorias}</p>
        </div>
      </div>
    </div>
  );
}
