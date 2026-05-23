"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Proveedor } from '@/types';
import { Search, Plus, Truck, Filter, Download, FileUp } from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { SupplierStats } from '@/components/proveedores/SupplierStats';
import { SupplierTable } from '@/components/proveedores/SupplierTable';
import { SupplierFormModal } from '@/components/proveedores/modals/SupplierFormModal';
import { SupplierFilterModal } from '@/components/proveedores/modals/SupplierFilterModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { ImportModal } from '@/components/clientes/modals/ImportModal';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    categoria: 'Todas'
  });

  const fetchData = async () => {
    try {
      const data = await apiService.proveedores.getAll();
      setProveedores(data);
    } catch (error) {
      toast.error('Error al cargar directorio de proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSupplier = async (data: any) => {
    try {
      if (selectedProveedor) {
        await apiService.proveedores.update(selectedProveedor.id, data);
        toast.success('Información de proveedor actualizada');
      } else {
        await apiService.proveedores.create(data);
        toast.success('Nuevo proveedor registrado');
      }
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar proveedor');
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedProveedor) return;
    try {
      await apiService.proveedores.delete(selectedProveedor.id);
      toast.success('Proveedor eliminado del sistema');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar proveedor');
    }
  };

  const clearFilters = () => {
    setFilters({ categoria: 'Todas' });
    setSearchTerm('');
    toast.info('Filtros limpiados');
  };

  const filtered = proveedores.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.contacto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = filters.categoria === 'Todas' || p.categoria === filters.categoria;

    return matchesSearch && matchesCat;
  });

  const categorias = Array.from(new Set(proveedores.map(p => p.categoria)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse text-center">Abriendo Directorio...</p>
      </div>
    );
  }

  const isFiltered = filters.categoria !== 'Todas';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <SupplierStats proveedores={proveedores} />

      {/* Barra de Acciones - FLOW RESPONSIVE */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscador - Crece para llenar espacio */}
        <div className="relative group flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o contacto..." 
            className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-12 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grupo de Herramientas y Filtros */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl h-12 gap-2 px-6 shadow-sm border-none transition-all flex-1 sm:flex-none ${isFiltered ? 'ring-2 ring-primary bg-primary/5 text-primary' : ''}`}
          >
            <Filter size={18} className={isFiltered ? 'text-primary' : 'text-slate-400'} />
            <span className="text-xs font-black uppercase tracking-wider">Filtros</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shadow-inner h-12 flex-1 sm:flex-none justify-center">
            <button 
              onClick={() => setShowImportModal(true)} 
              className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-primary gap-2 shadow-sm transition-all flex-1 sm:flex-none"
            >
              <FileUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-tight">Importar</span>
            </button>
            <button 
              onClick={() => setShowExportModal(true)} 
              className="btn btn-sm h-10 px-4 rounded-xl border-none bg-white text-slate-500 hover:text-primary gap-2 shadow-sm transition-all flex-1 sm:flex-none"
            >
              <Download size={16} />
              <span className="text-[10px] font-black uppercase tracking-tight">Exportar</span>
            </button>
          </div>

          <button 
            onClick={() => { setSelectedProveedor(null); setShowFormModal(true); }}
            className="btn btn-primary shadow-xl shadow-primary/20 rounded-2xl px-8 h-12 gap-2 text-white font-black uppercase tracking-widest border-none w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="text-xs">Nuevo Aliado</span>
          </button>
        </div>
      </div>

      <SupplierTable 
        proveedores={filtered}
        onOpenEdit={(p) => { setSelectedProveedor(p); setShowFormModal(true); }}
        onOpenDelete={(p) => { setSelectedProveedor(p); setShowDeleteConfirm(true); }}
      />

      {/* Modals */}
      <SupplierFormModal 
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSaveSupplier}
        initialData={selectedProveedor}
      />

      <SupplierFilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
        categorias={categorias}
      />

      <ConfirmDialog 
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSupplier}
        title="¿Eliminar Proveedor?"
        message={
          <>
            Esta acción borrará permanentemente a <span className="text-slate-700 font-bold">{selectedProveedor?.nombre}</span> del directorio de aliados comerciales.
          </>
        }
        variant="danger"
        confirmLabel="Confirmar Eliminación"
      />

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(msg) => { toast.success(msg); setShowExportModal(false); }}
      />

      <ImportModal 
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={async (file) => {
          toast.success(`Archivo "${file.name}" seleccionado para importar`);
          setShowImportModal(false);
        }}
        title="Importar Proveedores"
        context="proveedores"
      />
    </div>
  );
}
