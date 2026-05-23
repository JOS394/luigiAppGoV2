"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Producto } from '@/types';
import { Search, Plus, Filter, Download, FileUp, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { ProductStats } from '@/components/productos/ProductStats';
import { ProductTable } from '@/components/productos/ProductTable';
import { ProductDetailModal } from '@/components/productos/modals/ProductDetailModal';
import { ProductFormModal } from '@/components/productos/modals/ProductFormModal';
import { ProductFilterModal } from '@/components/productos/modals/ProductFilterModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { ImportModal } from '@/components/clientes/modals/ImportModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StockAdjustmentModal } from '@/components/inventario/modals/StockAdjustmentModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

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
      const data = await apiService.productos.getAll();
      setProductos(data);
    } catch (error) {
      toast.error('Error al cargar catálogo de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (data: Omit<Producto, 'id'> & { imagen?: string }) => {
    try {
      if (selectedProducto) {
        await apiService.productos.update(selectedProducto.id, data);
        if (data.imagen && data.imagen.startsWith('data:image/')) {
          await apiService.productos.uploadImagen(selectedProducto.id, data.imagen);
        }
        toast.success('Producto actualizado correctamente');
      } else {
        const nuevo = await apiService.productos.create(data);
        if (data.imagen && data.imagen.startsWith('data:image/')) {
          await apiService.productos.uploadImagen(nuevo.id, data.imagen);
        }
        toast.success('Producto registrado exitosamente');
      }
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProducto) return;
    try {
      await apiService.productos.delete(selectedProducto.id);
      toast.success('Producto eliminado del catálogo');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleAdjustStock = async (data: { productoId: string, cantidad: number, tipo: 'Entrada' | 'Salida', motivo: string }) => {
    const finalId = data.productoId || selectedProducto?.id;
    if (!finalId) {
      toast.error('Error: No hay un producto seleccionado para ajustar');
      return;
    }
    try {
      await apiService.inventario.ajustarStock({
        ...data,
        productoId: finalId
      });
      toast.success('Ajuste de inventario aplicado');
      setShowAdjustmentModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Error al ajustar stock');
    }
  };

  const handleImportProducts = async (file: File) => {
    try {
      const res = await apiService.import.productos(file);
      toast.success(res.message || 'Importación completada');
      setShowImportModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error al importar archivo');
      throw err;
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
                         p.codigoBarras?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = filters.categoria === 'Todas' || p.categoria === filters.categoria;
    const matchesUbi = filters.ubicacion === 'Todas' || p.ubicacion === filters.ubicacion;
    
    let matchesStock = true;
    if (filters.stockStatus === 'low') matchesStock = p.stock > 0 && p.stock < 10;
    if (filters.stockStatus === 'out') matchesStock = p.stock === 0;
    if (filters.stockStatus === 'ok') matchesStock = p.stock >= 10;

    let matchesPrice = true;
    if (filters.minPrice && p.precio < parseFloat(filters.minPrice)) matchesPrice = false;
    if (filters.maxPrice && p.precio > parseFloat(filters.maxPrice)) matchesPrice = false;

    // Solo mostramos productos físicos (los servicios van en su módulo)
    return p.tipo === 'producto' && matchesSearch && matchesCat && matchesUbi && matchesStock && matchesPrice;
  });

  const categorias = Array.from(new Set(productos.map(p => p.categoria)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Abriendo Catálogo...</p>
      </div>
    );
  }

  const isFiltered = filters.categoria !== 'Todas' || filters.stockStatus !== 'all' || filters.ubicacion !== 'Todas' || filters.minPrice !== '' || filters.maxPrice !== '';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ProductStats productos={productos.filter(p => p.tipo === 'producto')} />

      {/* Barra de Acciones - FLOW RESPONSIVE */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscador - Crece para llenar espacio */}
        <div className="relative group flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, SKU o código de barras..." 
            className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-12 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grupo de Filtros y Vista */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl h-12 gap-2 px-6 shadow-sm border-none transition-all flex-1 sm:flex-none ${isFiltered ? 'ring-2 ring-primary bg-primary/5 text-primary' : ''}`}
          >
            <Filter size={18} className={isFiltered ? 'text-primary' : 'text-slate-400'} />
            <span className="text-xs font-black uppercase tracking-wider">Filtros</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shadow-inner h-12 flex-1 sm:flex-none justify-center">
            <button 
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm h-10 px-4 rounded-xl border-none gap-2 ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-400'}`}
            >
              <LayoutGrid size={16} /> <span className="hidden xs:inline font-bold">Grid</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`btn btn-sm h-10 px-4 rounded-xl border-none gap-2 ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-400'}`}
            >
              <List size={16} /> <span className="hidden xs:inline font-bold">Lista</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shadow-inner h-12 flex-1 sm:flex-none justify-center">
            <button onClick={() => setShowImportModal(true)} className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-primary gap-2 shadow-sm transition-all flex-1 sm:flex-none">
              <FileUp size={16} />
              <span className="text-[10px] font-black uppercase hidden xs:inline">Importar</span>
            </button>
            <button onClick={() => setShowExportModal(true)} className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-primary gap-2 shadow-sm transition-all flex-1 sm:flex-none">
              <Download size={16} />
              <span className="text-[10px] font-black uppercase hidden xs:inline">Exportar</span>
            </button>
          </div>

          <button 
            onClick={() => { setSelectedProducto(null); setShowFormModal(true); }}
            className="btn btn-primary shadow-xl shadow-primary/20 rounded-2xl px-8 h-12 gap-2 text-white font-black uppercase tracking-widest border-none w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="text-xs">Nuevo Producto</span>
          </button>
        </div>
      </div>

      <ProductTable 
        productos={filtered}
        onOpenDetail={(p) => { setSelectedProducto(p); setShowDetailModal(true); }}
        onOpenEdit={(p) => { setSelectedProducto(p); setShowFormModal(true); }}
        onOpenDelete={(p) => { setSelectedProducto(p); setShowDeleteConfirm(true); }}
        onOpenAdjustStock={(p) => { setSelectedProducto(p); setShowAdjustmentModal(true); }}
        viewMode={viewMode}
      />

      {/* Modales */}
      <ProductDetailModal 
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        producto={selectedProducto}
        onEdit={(p) => { setShowDetailModal(false); setShowFormModal(true); }}
        onDelete={(p) => { setShowDetailModal(false); setShowDeleteConfirm(true); }}
      />

      <ProductFormModal 
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSaveProduct}
        initialData={selectedProducto}
      />

      <ProductFilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
        categorias={categorias}
      />

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(msg) => { toast.success(msg); setShowExportModal(false); }}
        context="productos"
      />

      <ImportModal 
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportProducts}
        title="Importar Productos"
        context="productos"
      />

      <StockAdjustmentModal 
        show={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        producto={selectedProducto}
        onSubmit={handleAdjustStock}
      />

      <ConfirmDialog 
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProduct}
        title="¿Eliminar del Catálogo?"
        message={
          <>
            Esta acción borrará permanentemente <span className="text-slate-700 font-bold">{selectedProducto?.nombre}</span> y todo su historial de movimientos.
          </>
        }
        variant="danger"
        confirmLabel="Confirmar Eliminación"
      />
    </div>
  );
}
