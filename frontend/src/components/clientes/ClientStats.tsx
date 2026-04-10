"use client";

import React from 'react';
import { Users, TrendingUp, ShoppingBag } from 'lucide-react';
import type { Cliente } from '@/types';

interface ClientStatsProps {
  clientes: Cliente[];
}

export function ClientStats({ clientes }: ClientStatsProps) {
  const totalCompras = clientes.reduce((acc, c) => acc + c.totalCompras, 0);
  const promedioVenta = clientes.length > 0 ? totalCompras / clientes.length : 0;
  const clientesFrecuentes = clientes.filter(c => c.totalCompras > 1500).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Users size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Directorio Total</p>
          <p className="text-2xl font-black text-slate-800">{clientes.length}</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clientes Frecuentes</p>
          <p className="text-2xl font-black text-slate-800">{clientesFrecuentes}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promedio de Venta</p>
          <p className="text-2xl font-black text-slate-800">${promedioVenta.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
