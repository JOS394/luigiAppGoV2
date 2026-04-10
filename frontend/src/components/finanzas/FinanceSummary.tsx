"use client";

import React from 'react';
import { PiggyBank, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { ResumenFinanciero } from '@/types';

interface FinanceSummaryProps {
  resumen: ResumenFinanciero | null;
  onRealizarCorte: () => void;
}

export function FinanceSummary({ resumen, onRealizarCorte }: FinanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Balance Total */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl shadow-sm relative overflow-hidden group min-h-[140px] flex flex-col justify-between">
        <div className="absolute -right-4 -bottom-4 opacity-5 text-primary group-hover:scale-110 transition-transform pointer-events-none">
          <PiggyBank size={100} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Total</p>
          <p className="text-2xl xl:text-3xl font-black text-slate-800 tabular-nums break-words leading-tight">
            ${resumen?.balanceTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg w-fit uppercase">
          <ArrowUpCircle size={12} /> Balance General
        </div>
      </div>

      {/* Ingresos */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl shadow-sm relative overflow-hidden min-h-[140px] flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingresos del Mes</p>
          <p className="text-2xl xl:text-3xl font-black text-green-600 tabular-nums break-words leading-tight">
            +${resumen?.ingresosMes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit uppercase">
          <ArrowUpCircle size={12} /> Flujo Positivo
        </div>
      </div>

      {/* Egresos */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl shadow-sm relative overflow-hidden min-h-[140px] flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Egresos del Mes</p>
          <p className="text-2xl xl:text-3xl font-black text-red-500 tabular-nums break-words leading-tight">
            -${resumen?.egresosMes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg w-fit uppercase">
          <ArrowDownCircle size={12} /> Gastos Operativos
        </div>
      </div>

      {/* Caja */}
      <div className="bg-primary text-white p-5 md:p-6 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group min-h-[140px] flex flex-col justify-between">
        <div className="absolute -right-4 -bottom-4 opacity-20 text-white group-hover:scale-110 transition-transform pointer-events-none">
          <Wallet size={100} />
        </div>
        <div>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Efectivo en Caja</p>
          <p className="text-2xl xl:text-3xl font-black tabular-nums break-words leading-tight">
            ${resumen?.efectivoEnCaja.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="mt-4">
          <button 
            onClick={onRealizarCorte}
            className="bg-white/20 hover:bg-white/30 text-[9px] font-black uppercase py-1.5 px-4 rounded-full transition-colors backdrop-blur-sm border border-white/10"
          >
            Realizar Corte
          </button>
        </div>
      </div>
    </div>
  );
}
