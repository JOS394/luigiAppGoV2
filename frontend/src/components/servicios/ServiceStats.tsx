"use client";

import React from 'react';
import { Wrench, Layers, DollarSign, Award } from 'lucide-react';
import type { Producto } from '@/types';

interface ServiceStatsProps {
  servicios: Producto[];
}

export function ServiceStats({ servicios }: ServiceStatsProps) {
  const totalServicios = servicios.length;
  const categorias = new Set(servicios.map(s => s.categoria)).size;
  
  const precios = servicios.map(s => s.precio);
  const avgPrice = totalServicios > 0 ? precios.reduce((sum, p) => sum + p, 0) / totalServicios : 0;
  const maxPrice = totalServicios > 0 ? Math.max(...precios) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
          <Wrench size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicios Totales</p>
          <p className="text-2xl font-black text-slate-800">{totalServicios}</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Layers size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categorías</p>
          <p className="text-2xl font-black text-slate-800">{categorias}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa Promedio</p>
          <p className="text-2xl font-black text-slate-800">${avgPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
          <Award size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa Premium</p>
          <p className="text-2xl font-black text-slate-800">${maxPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
