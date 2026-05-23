"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Producto } from '@/types';
import { Search, Plus, Filter, Download, FileUp, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { ServiceStats } from '@/components/servicios/ServiceStats';
import { ServiceTable } from '@/components/servicios/ServiceTable';
import { ServiceFormModal } from '@/components/servicios/modals/ServiceFormModal';
import { ServiceFilterModal } from '@/components/servicios/modals/ServiceFilterModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { ImportModal } from '@/components/clientes/modals/ImportModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<Producto | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    categoria: 'Todas',
    minPrice: '',
    maxPrice: ''
  });

  const fetchData = async () => {
    try {
      const data = await apiService.productos.getAll();
      // Filtramos solo los que son tipo servicio
      setServicios(data.filter(p => p.tipo === 'servicio'));
    } catch (error) {
      toast.error('Error al cargar catálogo de servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveService = async (data: any) => {
    try {
      if (selectedService) {
        await apiService.productos.update(selectedService.id, data);
        toast.success('Servicio actualizado correctamente');
      } else {
        await apiService.productos.create({
          ...data,
          tipo: 'servicio'
        });
        toast.success('Servicio registrado exitosamente');
      }
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar el servicio');
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;
    try {
      await apiService.productos.delete(selectedService.id);
      toast.success('Servicio eliminado del catálogo');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar servicio');
    }
  };

  const handleImportServices = async (file: File) => {
    try {
      const res = await apiService.import.productos(file, "servicio");
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
      minPrice: '',
      maxPrice: ''
    });
    toast.info('Filtros limpiados');
  };

  const filtered = servicios.filter(s => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.sku && s.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = filters.categoria === 'Todas' || s.categoria === filters.categoria;

    let matchesPrice = true;
    if (filters.minPrice && s.precio < parseFloat(filters.minPrice)) matchesPrice = false;
    if (filters.maxPrice && s.precio > parseFloat(filters.maxPrice)) matchesPrice = false;

    return matchesSearch && matchesCat && matchesPrice;
  });

  const categorias = Array.from(new Set(servicios.map(s => s.categoria).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-secondary scale-150"></span>
        <p className="mt-6 font-black text-secondary uppercase tracking-[0.3em] animate-pulse">Abriendo Catálogo...</p>
      </div>
    );
  }

  const isFiltered = filters.categoria !== 'Todas' || filters.minPrice !== '' || filters.maxPrice !== '';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ServiceStats servicios={servicios} />

      {/* Barra de Acciones - FLOW RESPONSIVE */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscador - Crece para llenar espacio */}
        <div className="relative group flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o SKU de servicio..." 
            className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-medium h-12 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grupo de Filtros y Vista */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl h-12 gap-2 px-6 shadow-sm border-none transition-all flex-1 sm:flex-none ${isFiltered ? 'ring-2 ring-secondary bg-secondary/5 text-secondary' : ''}`}
          >
            <Filter size={18} className={isFiltered ? 'text-secondary' : 'text-slate-400'} />
            <span className="text-xs font-black uppercase tracking-wider">Filtros</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shadow-inner h-12 flex-1 sm:flex-none justify-center">
            <button 
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm h-10 px-4 rounded-xl border-none gap-2 ${viewMode === 'grid' ? 'bg-white text-secondary shadow-sm' : 'bg-transparent text-slate-400'}`}
            >
              <LayoutGrid size={16} /> <span className="hidden xs:inline font-bold">Grid</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`btn btn-sm h-10 px-4 rounded-xl border-none gap-2 ${viewMode === 'table' ? 'bg-white text-secondary shadow-sm' : 'bg-transparent text-slate-400'}`}
            >
              <List size={16} /> <span className="hidden xs:inline font-bold">Lista</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shadow-inner h-12 flex-1 sm:flex-none justify-center">
            <button onClick={() => setShowImportModal(true)} className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-secondary gap-2 shadow-sm transition-all flex-1 sm:flex-none">
              <FileUp size={16} />
              <span className="text-[10px] font-black uppercase hidden xs:inline">Importar</span>
            </button>
            <button onClick={() => setShowExportModal(true)} className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-secondary gap-2 shadow-sm transition-all flex-1 sm:flex-none">
              <Download size={16} />
              <span className="text-[10px] font-black uppercase hidden xs:inline">Exportar</span>
            </button>
          </div>

          <button 
            onClick={() => { setSelectedService(null); setShowFormModal(true); }}
            className="btn btn-secondary shadow-xl shadow-secondary/20 rounded-2xl px-8 h-12 gap-2 text-white font-black uppercase tracking-widest border-none w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="text-xs">Nuevo Servicio</span>
          </button>
        </div>
      </div>

      <ServiceTable 
        servicios={filtered}
        onOpenEdit={(s) => { setSelectedService(s); setShowFormModal(true); }}
        onOpenDelete={(s) => { setSelectedService(s); setShowDeleteConfirm(true); }}
        viewMode={viewMode}
      />

      {/* Modales */}
      <ServiceFormModal 
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSaveService}
        initialData={selectedService}
      />

      <ServiceFilterModal 
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
        context="servicios"
      />

      <ImportModal 
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportServices}
        title="Importar Servicios"
        context="servicios"
      />

      <ConfirmDialog 
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteService}
        title="¿Eliminar del Catálogo?"
        message={
          <>
            Esta acción borrará permanentemente el servicio <span className="text-slate-700 font-bold">{selectedService?.nombre}</span> de manera irreversible.
          </>
        }
        variant="danger"
        confirmLabel="Confirmar Eliminación"
      />
    </div>
  );
}
