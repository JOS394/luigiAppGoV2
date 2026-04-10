"use client";

import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function QuickActions({ onAddIncome, onAddExpense }: QuickActionsProps) {
  return (
    <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group border-b-4 border-primary">
      <h3 className="text-xl font-bold mb-6 tracking-tight uppercase">Operaciones de Caja</h3>
      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={onAddIncome}
          className="btn btn-primary btn-md rounded-xl font-bold w-full gap-2 text-white border-none"
        >
          <PlusCircle size={18} /> Registrar Ingreso
        </button>
        <button 
          onClick={onAddExpense}
          className="btn bg-white/10 hover:bg-white/20 border-none btn-md rounded-xl font-bold w-full gap-2 text-white"
        >
          <MinusCircle size={18} /> Registrar Gasto
        </button>
      </div>
      <p className="text-[10px] text-white/40 mt-6 uppercase font-bold tracking-widest text-center italic">
        Sincronizado con base de datos local
      </p>
    </div>
  );
}
