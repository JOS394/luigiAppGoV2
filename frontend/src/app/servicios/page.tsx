"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Producto } from '@/types';
import { Search, Plus, Wrench, Tag, Edit, Trash2, Eye, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { ServiceFormModal } from '@/components/servicios/modals/ServiceFormModal';
import { TableActions } from '@/components/shared/TableActions';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<Producto | null>(null);

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
        toast.success('Servicio actualizado');
      } else {
        await apiService.productos.create(data);
        toast.success('Servicio registrado');
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
      toast.success('Servicio eliminado');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar servicio');
    }
  };

  const filtered = servicios.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-secondary scale-150"></span>
        <p className="mt-6 font-black text-secondary uppercase tracking-[0.3em] animate-pulse">Abriendo Catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <Wrench size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Servicios y Labor</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{servicios.length} servicios activos en catálogo</p>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedService(null); setShowFormModal(true); }}
          className="btn btn-secondary shadow-lg shadow-secondary/20 rounded-xl px-8 h-14 gap-3 text-white font-black uppercase tracking-wider w-full md:w-auto"
        >
          <Plus size={20} /> Nuevo Servicio
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="relative w-full lg:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría de servicio..." 
            className="input input-bordered w-full pl-12 bg-white border-slate-200 rounded-xl focus:border-secondary h-12 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex-1 lg:flex-none btn btn-sm h-10 px-4 rounded-lg border-none gap-2 ${viewMode === 'grid' ? 'bg-white text-secondary shadow-sm' : 'bg-transparent text-slate-400'}`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`flex-1 lg:flex-none btn btn-sm h-10 px-4 rounded-lg border-none gap-2 ${viewMode === 'table' ? 'bg-white text-secondary shadow-sm' : 'bg-transparent text-slate-400'}`}
          >
            <List size={16} /> Lista
          </button>
        </div>
      </div>

      {/* View Mode: Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                    <Wrench size={24} />
                  </div>
                  <TableActions 
                    actions={[
                      { label: 'Editar', icon: <Edit />, onClick: () => { setSelectedService(s); setShowFormModal(true); } },
                      { label: 'Eliminar', icon: <Trash2 />, onClick: () => { setSelectedService(s); setShowDeleteConfirm(true); }, variant: 'danger' },
                    ]}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-2 py-1 rounded-md">{s.categoria}</span>
                  <h3 className="text-lg font-bold text-slate-800 uppercase mt-2 group-hover:text-secondary transition-colors line-clamp-1">{s.nombre}</h3>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa Base</span>
                  <span className="text-xl font-black text-slate-800">${s.precio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5 text-slate-500">Servicio</th>
                  <th>Categoría</th>
                  <th>Precio Venta</th>
                  <th className="px-8 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary/5 text-secondary rounded-lg flex items-center justify-center">
                          <Wrench size={16} />
                        </div>
                        <span className="font-bold text-slate-700 uppercase">{s.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost border-none font-bold text-[9px] uppercase">{s.categoria}</span>
                    </td>
                    <td>
                      <span className="font-black text-slate-800">${s.precio.toFixed(2)}</span>
                    </td>
                    <td className="px-8 text-right">
                      <TableActions 
                        actions={[
                          { label: 'Editar', icon: <Edit />, onClick: () => { setSelectedService(s); setShowFormModal(true); } },
                          { label: 'Eliminar', icon: <Trash2 />, onClick: () => { setSelectedService(s); setShowDeleteConfirm(true); }, variant: 'danger' },
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
      <ServiceFormModal 
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSaveService}
        initialData={selectedService}
      />

      <ConfirmDialog 
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteService}
        title="¿Eliminar Servicio?"
        message={`Esta acción quitará "${selectedService?.nombre}" del catálogo de servicios permanentemente.`}
        variant="danger"
      />
    </div>
  );
}
