"use client";

import React, { useState } from 'react';
import type { Producto } from '../../types';
import { usePosStore } from '../../store/posStore';
import { Search, Image as ImageIcon, Plus, LayoutGrid, List, Zap } from 'lucide-react';

interface ProductGridProps {
  products: Producto[];
}

type ViewMode = 'grid' | 'list';

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const addToCart = usePosStore((s) => s.addToCart);
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const categories = ['Todos', ...new Set(products.map(p => p.categoria))];

  const filteredProducts = products.filter(p => {
    const matchesFilter = p.nombre.toLowerCase().includes(filter.toLowerCase()) || 
                          p.id.includes(filter);
    const matchesCategory = activeCategory === 'Todos' || p.categoria === activeCategory;
    return matchesFilter && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Search Area */}
      <div className="flex flex-col xl:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar productos o servicios..." 
            className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-12 shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex shrink-0">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={16} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <List size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border shrink-0 ${
              activeCategory === cat 
                ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Area */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 pb-8">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary transition-all text-left overflow-hidden relative"
              >
                <div className="relative h-44 w-full bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={40} /></div>
                  )}
                  
                  {/* Badge de Tipo/Categoría */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {p.tipo === 'servicio' && (
                      <span className="bg-amber-500 text-white p-1 rounded-md shadow-sm">
                        <Zap size={10} fill="currentColor" />
                      </span>
                    )}
                    <span className="text-[8px] font-bold text-slate-500 uppercase bg-white/90 px-2 py-1 rounded shadow-sm border border-slate-100">
                      {p.categoria}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="bg-primary text-white p-2 rounded-full shadow-lg scale-75 group-hover:scale-100 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                     </div>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1 w-full gap-1">
                  <p className="font-bold text-slate-800 text-sm line-clamp-2 h-10 w-full uppercase tracking-tighter leading-tight">
                    {p.nombre}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                    <p className="text-lg font-black text-primary">
                      <span className="text-[10px] font-bold mr-0.5">$</span>{p.precio.toFixed(2)}
                    </p>
                    
                    {p.tipo === 'producto' ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${p.stock < 10 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                        {p.stock} U.
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 uppercase">
                        Servicio
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-8">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="group flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary transition-all text-left active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                  {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="m-auto mt-4 text-slate-200" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm uppercase truncate">{p.nombre}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.categoria}</span>
                    {p.tipo === 'servicio' && <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1 rounded uppercase">Servicio</span>}
                  </div>
                </div>
                <div className="text-center px-4">
                  {p.tipo === 'producto' ? (
                    <span className={`font-bold text-xs ${p.stock < 10 ? 'text-red-500' : 'text-slate-500'}`}>{p.stock} unid.</span>
                  ) : (
                    <span className="text-amber-600 text-[10px] font-bold uppercase">Entrega inmediata</span>
                  )}
                </div>
                <div className="text-right pr-2">
                  <p className="text-lg font-black text-primary">${p.precio.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
