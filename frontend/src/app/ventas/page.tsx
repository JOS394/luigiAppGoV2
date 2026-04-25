"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Producto, Venta } from '@/types';
import { POSView } from '@/components/pos/POSView';
import { SalesFilterModal } from '@/components/ventas/modals/SalesFilterModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { toast } from 'sonner';
import { ShoppingCart, History, Calendar, Filter, Search, Download } from 'lucide-react';

type TabView = 'terminal' | 'historial';

export default function VentasPage() {
  const [activeTab, setActiveTab] = useState<TabView>('terminal');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estado: 'Todos',
    minAmount: '',
    maxPrice: ''
  });

  const fetchData = async () => {
    try {
      const [pData, vData] = await Promise.all([
        apiService.productos.getAll(),
        apiService.ventas.getAll()
      ]);
      setProductos(pData);
      setVentas(vData);
    } catch (error) {
      toast.error('Error al cargar datos del módulo de ventas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Pequeño delay para asegurar que el backend haya completado la escritura en SQLite
    setTimeout(fetchData, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVentas = ventas.filter(v => {
    const matchesSearch = v.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filters.estado === 'Todos' || v.estado === filters.estado;
    
    let matchesAmount = true;
    if (filters.minAmount && v.total < parseFloat(filters.minAmount)) matchesAmount = false;
    if (filters.maxPrice && v.total > parseFloat(filters.maxPrice)) matchesAmount = false;

    let matchesDate = true;
    if (filters.startDate || filters.endDate) {
      const vDate = new Date(v.fecha).getTime();
      const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
      const end = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
      const adjustedEnd = end !== Infinity ? end + 86400000 : Infinity;
      if (vDate < start || vDate > adjustedEnd) matchesDate = false;
    }

    return matchesSearch && matchesEstado && matchesAmount && matchesDate;
  });

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      estado: 'Todos',
      minAmount: '',
      maxPrice: ''
    });
    setSearchTerm('');
    toast.info('Filtros limpiados');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Abriendo Sistema de Ventas...</p>
      </div>
    );
  }

  const isFiltered = filters.startDate || filters.endDate || filters.estado !== 'Todos' || filters.minAmount || filters.maxPrice;

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500">
      {/* Selector de Pestañas (Tabs) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 shrink-0 gap-4">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`pb-4 px-2 flex items-center gap-2 transition-all relative whitespace-nowrap ${
              activeTab === 'terminal' 
                ? 'text-primary font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <ShoppingCart size={18} />
            <span className="text-xs sm:text-sm uppercase tracking-wider">Terminal</span>
            {activeTab === 'terminal' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('historial')}
            className={`pb-4 px-2 flex items-center gap-2 transition-all relative whitespace-nowrap ${
              activeTab === 'historial' 
                ? 'text-primary font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <History size={18} />
            <span className="text-xs sm:text-sm uppercase tracking-wider">Historial</span>
            {activeTab === 'historial' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Buscador y Acciones de Historial */}
        {activeTab === 'historial' && (
          <div className="flex items-center gap-2 pb-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
            <div className="relative flex-1 lg:w-64 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar cliente o folio..." 
                className="input input-bordered input-sm w-full pl-9 bg-white focus:border-primary text-xs rounded-xl h-10 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setShowFilterModal(true)}
                className={`btn btn-sm h-10 rounded-xl px-4 border-none transition-all gap-2 ${
                  isFiltered 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Filter size={14} />
                <span className="hidden sm:inline text-[10px] font-black uppercase">Filtrar</span>
              </button>
              <button 
                onClick={() => setShowExportModal(true)}
                className="btn btn-sm h-10 rounded-xl px-4 bg-white text-slate-500 border-none hover:bg-slate-50 gap-2 shadow-sm"
              >
                <Download size={14} />
                <span className="hidden sm:inline text-[10px] font-black uppercase">Exportar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la Pestaña */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' ? (
          <POSView products={productos} onSuccess={handleRefresh} />
        ) : (
          <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
            {/* VISTA MÓVIL (CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {filteredVentas.length > 0 ? filteredVentas.map((v) => (
                <div key={v.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 active:scale-[0.98] transition-transform cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orden #{v.id}</p>
                      <h4 className="font-bold text-slate-800 text-sm uppercase mt-1 group-hover:text-primary transition-colors">{v.cliente}</h4>
                    </div>
                    <span className={`badge border-none font-bold text-[9px] uppercase py-2 px-3 rounded ${
                      v.estado === 'Completada' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {v.estado}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Fecha y Hora</span>
                      <span className="text-xs font-bold text-slate-600">
                        {new Date(v.fecha).toLocaleDateString()} - {new Date(v.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Total</p>
                      <p className="text-xl font-black text-slate-800 tabular-nums">${v.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-slate-300 bg-white rounded-3xl border border-dashed border-slate-200">
                  <Search size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-[0.2em] text-xs">Sin resultados</p>
                </div>
              )}
            </div>

            {/* VISTA ESCRITORIO (TABLA) */}
            <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="table table-lg">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="font-bold text-slate-500 text-[10px] uppercase tracking-widest px-8 py-5">Orden ID</th>
                    <th className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Fecha y Hora</th>
                    <th className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Cliente</th>
                    <th className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Estado</th>
                    <th className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right px-8">Monto Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVentas.length > 0 ? filteredVentas.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer group">
                      <td className="px-8 font-bold text-slate-400 text-xs">
                        {v.id}
                      </td>
                      <td className="text-slate-600 font-medium">
                        <div className="flex flex-col">
                          <span className="text-sm">{new Date(v.fecha).toLocaleDateString()}</span>
                          <span className="text-[10px] opacity-50 uppercase font-bold">{new Date(v.fecha).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="font-bold text-slate-700 text-sm uppercase tracking-tight">
                        {v.cliente}
                      </td>
                      <td>
                        <span className={`badge border-none font-bold text-[9px] uppercase py-2 px-3 rounded ${
                          v.estado === 'Completada' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {v.estado}
                        </span>
                      </td>
                      <td className="text-right px-8">
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-black text-slate-800 tabular-nums">${v.total.toFixed(2)}</span>
                          <button className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 uppercase tracking-tighter transition-all">Ver Detalle</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-300">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-[0.2em] text-xs">No se encontraron ventas con ese criterio</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <SalesFilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
      />

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(msg) => { toast.success(msg); setShowExportModal(false); }}
        context="ventas"
      />
    </div>
  );
}
