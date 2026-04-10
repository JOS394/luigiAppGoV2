"use client";

import React from 'react';
import { Package, AlertTriangle, Layers, Tag } from 'lucide-react';
import type { Producto } from '@/types';

interface ProductStatsProps {
  productos: Producto[];
}

export function ProductStats({ productos }: ProductStatsProps) {
  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.stock < 10 && p.tipo === 'producto').length;
  const categorias = new Set(productos.map(p => p.categoria)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catálogo Total</p>
          <p className="text-2xl font-black text-slate-800">{totalProductos}</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Crítico</p>
          <p className="text-2xl font-black text-slate-800">{stockBajo}</p>
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
    </div>
  );
}
