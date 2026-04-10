"use client";

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { usePosStore } from '../../store/posStore';

interface CartItemProps {
  item: {
    id: string;
    nombre: string;
    precio: number;
    qty: number;
  };
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQty, removeFromCart } = usePosStore();

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 group transition-colors hover:bg-slate-50/50 px-2 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-700 text-xs truncate uppercase tracking-tight leading-none">{item.nombre}</p>
        <p className="text-[10px] font-bold text-primary mt-1">${item.precio.toFixed(2)}</p>
      </div>

      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
        <button 
          onClick={() => updateQty(item.id, item.qty - 1)}
          className="btn btn-ghost btn-xs btn-square hover:bg-slate-50 text-slate-400 h-6 w-6"
        >
          <Minus size={10} />
        </button>
        <span className="w-7 text-center text-xs font-bold text-slate-600">{item.qty}</span>
        <button 
          onClick={() => updateQty(item.id, item.qty + 1)}
          className="btn btn-ghost btn-xs btn-square hover:bg-slate-50 text-slate-400 h-6 w-6"
        >
          <Plus size={10} />
        </button>
      </div>

      <div className="w-16 text-right">
        <p className="text-xs font-black text-slate-800">${(item.precio * item.qty).toFixed(2)}</p>
      </div>

      <button 
        onClick={() => removeFromCart(item.id)}
        className="btn btn-ghost btn-xs btn-square text-slate-200 hover:text-red-500 transition-colors"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};
