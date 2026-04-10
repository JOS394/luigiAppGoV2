"use client";

import React from 'react';
import { ShoppingCart, Clock, Truck } from 'lucide-react';
import type { ResumenCompras } from '@/types';

interface PurchaseStatsProps {
  resumen: ResumenCompras | null;
}

export function PurchaseStats({ resumen }: PurchaseStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <ShoppingCart size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inversión del Mes</p>
          <p className="text-2xl font-black text-slate-800">${resumen?.totalMes.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Órdenes Pendientes</p>
          <p className="text-2xl font-black text-slate-800">{resumen?.comprasPendientes}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Truck size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proveedores Activos</p>
          <p className="text-2xl font-black text-slate-800">{resumen?.proveedoresActivos}</p>
        </div>
      </div>
    </div>
  );
}
