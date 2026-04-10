"use client";

import React from 'react';

interface WeeklySalesChartProps {
  data: { dia: string, monto: number }[];
}

export function WeeklySalesChart({ data }: WeeklySalesChartProps) {
  const maxMonto = Math.max(...data.map(d => d.monto));

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Ventas de la Semana</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rendimiento por día actual</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase">Ingresos</span>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 min-h-[200px] px-2">
        {data.map((item, index) => {
          const heightPercentage = (item.monto / maxMonto) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center group gap-3">
              <div className="relative w-full flex justify-center items-end h-48 sm:h-64">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-black py-1 px-2 rounded-lg pointer-events-none z-10 shadow-xl">
                  ${item.monto.toLocaleString()}
                </div>
                {/* Barra */}
                <div 
                  className="w-full max-w-[40px] bg-slate-50 group-hover:bg-primary/10 rounded-t-xl transition-all duration-500 relative overflow-hidden"
                  style={{ height: '100%' }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl transition-all duration-700 shadow-lg shadow-primary/20 group-hover:brightness-110"
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-primary transition-colors">{item.dia}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
