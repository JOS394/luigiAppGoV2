"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Producto, ResumenInventario, MovimientoInventario } from '@/types';
import { Search, Boxes, Filter, MapPin, History, ArrowUpDown, Package, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { StockAdjustmentModal } from '@/components/inventario/modals/StockAdjustmentModal';
import { InventoryHistoryModal } from '@/components/inventario/modals/InventoryHistoryModal';
import { ProductFilterModal } from '@/components/productos/modals/ProductFilterModal';
import { TableActions } from '@/components/shared/TableActions';

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resumen, setResumen] = useState<ResumenInventario | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modales
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [productoMovimientos, setProductoMovimientos] = useState<MovimientoInventario[]>([]);

  // Filtros
  const [filters, setFilters] = useState({
    categoria: 'Todas',
    stockStatus: 'all',
    ubicacion: 'Todas',
    minPrice: '',
    maxPrice: ''
  });

  const fetchData = async () => {
    try {
      const [pData, rData] = await Promise.all([
        apiService.productos.getAll(),
        apiService.inventario.getResumen()
      ]);
      setProductos(pData.filter(p => p.tipo === 'producto'));
      setResumen(rData);
    } catch (error) {
      toast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (data: { cantidad: number, tipo: 'Entrada' | 'Salida', motivo: string }) => {
    if (!selectedProducto) return;
    try {
      await apiService.inventario.ajustarStock({
        productoId: selectedProducto.id,
        ...data
      });
      toast.success('Ajuste de inventario aplicado');
      setShowAdjustmentModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Error al ajustar stock');
    }
  };

  const openHistory = async (p: Producto) => {
    setSelectedProducto(p);
    try {
      const history = await apiService.inventario.getMovimientosByProducto(p.id);
      setProductoMovimientos(history);
      setShowHistoryModal(true);
    } catch (error) {
      toast.error('Error al cargar historial');
    }
  };

  const clearFilters = () => {
    setFilters({
      categoria: 'Todas',
      stockStatus: 'all',
      ubicacion: 'Todas',
      minPrice: '',
      maxPrice: ''
    });
    toast.info('Filtros limpiados');
  };

  const filtered = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = filters.categoria === 'Todas' || p.categoria === filters.categoria;
    const matchesUbi = filters.ubicacion === 'Todas' || p.ubicacion === filters.ubicacion;
    
    let matchesStock = true;
    if (filters.stockStatus === 'low') matchesStock = p.stock > 0 && p.stock < 10;
    if (filters.stockStatus === 'out') matchesStock = p.stock === 0;
    if (filters.stockStatus === 'ok') matchesStock = p.stock >= 10;

    return matchesSearch && matchesCat && matchesUbi && matchesStock;
  });

  const categorias = Array.from(new Set(productos.map(p => p.categoria)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Analizando Stock...</p>
      </div>
    );
  }

  const isFiltered = filters.categoria !== 'Todas' || filters.stockStatus !== 'all' || filters.ubicacion !== 'Todas';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Mini Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor de Inventario</p>
          <p className="text-2xl font-black text-slate-800">${resumen?.valorTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Únicos</p>
          <p className="text-2xl font-black text-slate-800">{resumen?.itemsTotales}</p>
        </div>
        <div className={`p-6 rounded-2xl border shadow-sm ${resumen?.sinStock && resumen.sinStock > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Agotados</p>
          <p className={`text-2xl font-black ${resumen?.sinStock && resumen.sinStock > 0 ? 'text-red-600' : 'text-slate-800'}`}>{resumen?.sinStock}</p>
        </div>
      </div>

      {/* Toolbar - Optimizado para móvil */}
      <div className="flex flex-col lg:flex-row gap-4 sticky top-0 z-20 bg-slate-50 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ubicación..." 
            className="input input-bordered w-full pl-12 bg-white border-slate-200 rounded-xl focus:border-primary h-14 font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-2xl shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm h-12 px-4 rounded-xl border-none gap-2 ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-500'}`}
            >
              <LayoutGrid size={18} /> <span className="hidden sm:inline font-bold">Grid</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`btn btn-sm h-12 px-4 rounded-xl border-none gap-2 ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-500'}`}
            >
              <List size={18} /> <span className="hidden sm:inline font-bold">Lista</span>
            </button>
          </div>

          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl h-14 px-6 text-slate-600 border-none shadow-sm gap-2 ${isFiltered ? 'ring-2 ring-primary bg-primary/5' : ''}`}
          >
            <Filter size={18} className="text-primary" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Filtrar</span>
          </button>
        </div>
      </div>

      {/* Vista de Inventario */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                    {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <Package size={24} />}
                  </div>
                  <div className="max-w-[150px]">
                    <h4 className="font-black text-slate-800 text-sm uppercase leading-tight truncate">{p.nombre}</h4>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-1">
                      <MapPin size={10}/>
                      <span className="truncate">{p.ubicacion || 'Sin ubicación'}</span>
                    </div>
                  </div>
                </div>
                <TableActions 
                  actions={[
                    { label: 'Ajustar Stock', icon: <ArrowUpDown />, onClick: () => { setSelectedProducto(p); setShowAdjustmentModal(true); } },
                    { label: 'Ver Historial', icon: <History />, onClick: () => openHistory(p) },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock Actual</span>
                  <span className={`text-xl font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                    {p.stock} <span className="text-[10px] font-bold opacity-50">unid.</span>
                  </span>
                </div>
                {p.stock < 10 && (
                  <div className="badge badge-error gap-1.5 text-white font-black text-[9px] uppercase py-3 border-none shadow-md shadow-red-100">
                    <AlertCircle size={12}/> Stock Bajo
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <p className="text-[10px] font-medium text-slate-400 italic truncate">
                  {p.ubicacionEspecifica || 'Sin detalles de ubicación'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VISTA DE LISTA (TABLA) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Producto / SKU</th>
                  <th>Ubicación</th>
                  <th>Existencias</th>
                  <th className="text-right px-8">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200">
                          {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <Package size={18} />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 uppercase block leading-tight text-xs">{p.nombre}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-600 text-[11px] flex items-center gap-1">
                          <MapPin size={12} className="text-primary"/> {p.ubicacion || 'N/A'}
                        </span>
                        <span className="text-[9px] text-slate-400 italic">{p.ubicacionEspecifica}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-xs tabular-nums ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                          {p.stock} unid.
                        </span>
                        {p.stock < 10 && <AlertCircle size={14} className="text-red-400" />}
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <TableActions 
                        actions={[
                          { label: 'Ajustar Stock', icon: <ArrowUpDown />, onClick: () => { setSelectedProducto(p); setShowAdjustmentModal(true); } },
                          { label: 'Ver Historial', icon: <History />, onClick: () => openHistory(p) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <StockAdjustmentModal 
        show={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        producto={selectedProducto}
        onSubmit={handleAdjustStock}
      />

      <InventoryHistoryModal 
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        producto={selectedProducto}
        movimientos={productoMovimientos}
      />

      <ProductFilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
        categorias={categorias}
      />
    </div>
  );
}
