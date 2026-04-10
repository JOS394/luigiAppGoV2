"use client";

import React from 'react';
import { TrendingUp, DollarSign, Receipt, BarChart3, Target, Briefcase } from 'lucide-react';
import type { ReporteResumen } from '@/types';

interface SummaryCardsProps {
  data: ReporteResumen | null;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Ventas Hoy */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-5 text-primary group-hover:scale-110 transition-transform">
          <DollarSign size={120} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Ventas de Hoy</p>
        <p className="text-3xl font-black text-slate-800">${data?.ventasHoy.toLocaleString()}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="badge badge-success border-none font-black text-[9px] text-white py-3">+{data?.crecimiento}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">vs Ayer</span>
        </div>
      </div>

      {/* Utilidad Bruta */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Utilidad Bruta (Est.)</p>
        <p className="text-3xl font-black text-green-600">${data?.utilidadBruta.toLocaleString()}</p>
        <div className="mt-4 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
          <Briefcase size={14} className="text-green-500" /> Margen del 38%
        </div>
      </div>

      {/* Ticket Promedio */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Ticket Promedio</p>
        <p className="text-3xl font-black text-slate-800">${data?.ticketsPromedio.toFixed(2)}</p>
        <div className="mt-4 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
          <Receipt size={14} className="text-primary" /> {data?.transaccionesTotales} Transacciones
        </div>
      </div>

      {/* Meta Mensual */}
      <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-20 text-white group-hover:scale-110 transition-transform">
          <Target size={120} />
        </div>
        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Proyección Mes</p>
        <p className="text-3xl font-black text-white">${data?.proyeccionMes.toLocaleString()}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-[10px] font-black text-white italic">65%</span>
        </div>
      </div>
    </div>
  );
}
