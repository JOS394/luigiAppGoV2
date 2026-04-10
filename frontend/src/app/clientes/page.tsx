"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Cliente } from '@/types';
import { 
  Search, UserPlus, FileUp, FileDown, 
  Filter, MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

// Componentes extraídos
import { ClientStats } from '@/components/clientes/ClientStats';
import { ClientTable } from '@/components/clientes/ClientTable';
import { FilterModal } from '@/components/clientes/modals/FilterModal';
import { ImportModal } from '@/components/clientes/modals/ImportModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { ClientDetailModal } from '@/components/clientes/modals/ClientDetailModal';
import { ClientFormModal } from '@/components/clientes/modals/ClientFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para Modales Globales
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  // Estados para Acciones de Cliente Específico
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para Filtros de Fecha
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estado para formularios (Nuevo/Editar)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '+503',
    direccion: '',
    notas: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await apiService.clientes.getAll();
      setClientes(data);
    } catch (error) {
      toast.error('Error al cargar directorio de clientes');
    } finally {
      setLoading(false);
    }
  };

  const filtered = clientes.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (startDate || endDate) {
      const visitDate = new Date(c.ultimaVisita).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const adjustedEnd = end !== Infinity ? end + 86400000 : Infinity;
      if (visitDate < start || visitDate > adjustedEnd) return false;
    }
    return matchesSearch;
  });

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return toast.error('El nombre es obligatorio');
    try {
      const nuevo = await apiService.clientes.create(formData);
      setClientes([nuevo, ...clientes]);
      setFormData({ nombre: '', email: '', telefono: '+503', direccion: '', notas: '' });
      setShowNewClientModal(false);
      toast.success('Cliente registrado correctamente');
    } catch (error) {
      toast.error('Error al guardar el cliente');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) return;
    try {
      const actualizado = await apiService.clientes.update(selectedCliente.id, formData);
      setClientes(clientes.map(c => c.id === actualizado.id ? actualizado : c));
      setShowEditModal(false);
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar cliente');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedCliente) return;
    try {
      await apiService.clientes.delete(selectedCliente.id);
      setClientes(clientes.filter(c => c.id !== selectedCliente.id));
      setShowDeleteModal(false);
      toast.success('Registro eliminado');
    } catch (error) {
      toast.error('Error al eliminar registro');
    }
  };

  const openEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      notas: cliente.notas || ''
    });
    setShowEditModal(true);
  };

  const openDetail = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  const openDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteModal(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    toast.info('Filtros limpiados');
  };

  const handleAction = (msg: string) => {
    toast.success(msg);
    setShowFilterModal(false);
    setShowImportModal(false);
    setShowExportModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Abriendo Directorio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ClientStats clientes={clientes} />

      {/* Barra de Acciones - FLOW RESPONSIVE */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscador - Crece para llenar espacio pero tiene un mínimo */}
        <div className="relative group flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o ID..." 
            className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-12 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grupo de Herramientas y Filtros */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl h-12 gap-2 px-6 shadow-sm border-none transition-all flex-1 sm:flex-none ${
              (startDate || endDate) ? 'ring-2 ring-primary bg-primary/5 text-primary' : ''
            }`}
          >
            <Filter size={18} className={(startDate || endDate) ? 'text-primary' : 'text-slate-400'} />
            <span className="text-xs font-black uppercase tracking-wider">Filtros</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shadow-inner flex-1 sm:flex-none justify-center">
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
              <FileDown size={16} />
              <span className="text-[10px] font-black uppercase tracking-tight">Exportar</span>
            </button>
          </div>

          <button 
            onClick={() => {
              setFormData({ nombre: '', email: '', telefono: '+503', direccion: '', notas: '' });
              setShowNewClientModal(true);
            }} 
            className="btn btn-primary shadow-xl shadow-primary/20 rounded-2xl px-8 h-12 gap-2 text-white font-black uppercase tracking-widest border-none w-full sm:w-auto"
          >
            <UserPlus size={18} />
            <span className="text-xs">Nuevo Cliente</span>
          </button>
        </div>
      </div>
      
      <ClientTable 
        clientes={filtered}
        onOpenDetail={openDetail}
        onOpenEdit={openEdit}
        onOpenDelete={openDelete}
      />

      {/* Modales */}
      <ClientDetailModal 
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        cliente={selectedCliente}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ClientFormModal 
        show={showNewClientModal || showEditModal}
        onClose={() => { setShowNewClientModal(false); setShowEditModal(false); }}
        onSubmit={showEditModal ? handleUpdateClient : handleSaveClient}
        isEdit={showEditModal}
        selectedCliente={selectedCliente}
        formData={formData}
        setFormData={setFormData}
      />

      <ConfirmDialog 
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteClient}
        title="¿Eliminar Cliente?"
        message={
          <>
            Esta acción no se puede deshacer. Se borrará permanentemente a <span className="text-slate-700 font-bold">{selectedCliente?.nombre}</span>.
          </>
        }
        confirmLabel="Confirmar Eliminación"
        cancelLabel="Mantener Registro"
        variant="danger"
      />

      <FilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClear={clearFilters}
      />

      <ImportModal 
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleAction}
        title="Importar Clientes"
      />

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleAction}
      />
    </div>
  );
}
