"use client";

import React from 'react';
import type { ReporteItem } from '@/types';

interface TopPerformingListProps {
  title: string;
  subtitle: string;
  items: ReporteItem[];
  icon: React.ReactNode;
}

export function TopPerformingList({ title, subtitle, items, icon }: TopPerformingListProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="group">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {index + 1}. {item.nombre}
                </span>
                {item.cantidad > 0 && (
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{item.cantidad} unidades vendidas</span>
                )}
              </div>
              <span className="text-sm font-black text-slate-800">${item.valor.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 group-hover:brightness-110"
                style={{ width: `${item.porcentaje}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
