"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Compra, ResumenCompras, Proveedor, Producto } from '@/types';
import { 
  Search, ShoppingCart, Filter, Download
} from 'lucide-react';
import { toast } from 'sonner';

// Componentes extraídos
import { PurchaseStats } from '@/components/compras/PurchaseStats';
import { PurchaseTable } from '@/components/compras/PurchaseTable';
import { PurchaseModal } from '@/components/compras/modals/PurchaseModal';
import { PurchaseDetailModal } from '@/components/compras/modals/PurchaseDetailModal';
import { PurchaseFilterModal } from '@/components/compras/modals/PurchaseFilterModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [resumen, setResumen] = useState<ResumenCompras | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estado: 'Todos',
    metodoPago: 'Todos'
  });

  const fetchData = async () => {
    try {
      const [cData, rData, pData, prData] = await Promise.all([
        apiService.compras.getAll(),
        apiService.compras.getResumen(),
        apiService.proveedores.getAll(),
        apiService.productos.getAll()
      ]);
      setCompras(cData);
      setResumen(rData);
      setProveedores(pData);
      setProductos(prData.filter(p => p.tipo === 'producto'));
    } catch (error) {
      toast.error('Error al cargar datos de compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePurchase = async (compra: Omit<Compra, 'id' | 'fecha'>) => {
    try {
      await apiService.compras.create(compra);
      toast.success('Orden de compra generada correctamente');
      setShowPurchaseModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error al generar la orden');
    }
  };

  const handleUpdateStatus = async (id: string, status: Compra['estado']) => {
    try {
      const compra = compras.find(c => c.id === id);
      if (!compra) return;

      await apiService.compras.updateStatus(id, status);

      if (status === 'Completada') {
        const stockPromises = compra.detalles.map(detalle => {
          const producto = productos.find(p => p.id === detalle.productoId);
          const nuevoStock = (producto?.stock || 0) + detalle.cantidad;
          return apiService.productos.updateStock(detalle.productoId, nuevoStock);
        });

        const financePromise = apiService.finanzas.createMovimiento({
          tipo: 'Egreso',
          categoria: 'Proveedor',
          monto: compra.total,
          metodoPago: compra.metodoPago,
          descripcion: `Pago Compra ${compra.id} - ${compra.proveedorNombre}`
        });

        await Promise.all([...stockPromises, financePromise]);
        toast.success(`Orden recibida: Inventario y Finanzas actualizados`);
      } else {
        toast.success(`Orden ${status.toLowerCase()} correctamente`);
      }
      
      fetchData();
    } catch (error) {
      toast.error('Error al procesar el cambio de estado');
    }
  };

  const openDetail = (compra: Compra) => {
    setSelectedCompra(compra);
    setShowDetailModal(true);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      estado: 'Todos',
      metodoPago: 'Todos'
    });
    toast.info('Filtros limpiados');
  };

  const handleExport = (msg: string) => {
    toast.success(msg);
    setShowExportModal(false);
  };

  const filtered = compras.filter(c => {
    const matchesSearch = c.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filters.estado === 'Todos' || c.estado === filters.estado;
    const matchesMetodo = filters.metodoPago === 'Todos' || c.metodoPago === filters.metodoPago;

    let matchesDate = true;
    if (filters.startDate || filters.endDate) {
      const cDate = new Date(c.fecha).getTime();
      const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
      const end = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
      const adjustedEnd = end !== Infinity ? end + 86400000 : Infinity;
      if (cDate < start || cDate > adjustedEnd) matchesDate = false;
    }

    return matchesSearch && matchesEstado && matchesMetodo && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Abriendo Módulo de Abasto...</p>
      </div>
    );
  }

  const isFiltered = filters.startDate || filters.endDate || filters.estado !== 'Todos' || filters.metodoPago !== 'Todos';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PurchaseStats resumen={resumen} />

      {/* Barra de Acciones */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:max-w-3xl">
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por proveedor u orden..." 
              className="input input-bordered w-full pl-11 bg-white border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`btn bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl h-12 gap-2 px-6 shadow-sm border-none ${isFiltered ? 'ring-2 ring-primary bg-primary/5' : ''}`}
          >
            <Filter size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <button 
            onClick={() => setShowExportModal(true)}
            className="btn btn-ghost btn-sm h-12 px-6 text-slate-500 hover:text-primary gap-2 bg-white border border-slate-100 rounded-xl shadow-sm"
          >
            <Download size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Reporte</span>
          </button>
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="btn btn-primary shadow-lg shadow-primary/20 rounded-xl px-8 h-12 gap-2 shrink-0 text-white font-bold"
          >
            <ShoppingCart size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Nueva Compra</span>
          </button>
        </div>
      </div>

      <PurchaseTable 
        compras={filtered}
        onOpenDetail={openDetail}
        onUpdateStatus={handleUpdateStatus}
      />

      <PurchaseModal 
        show={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSubmit={handleCreatePurchase}
        proveedores={proveedores}
        productos={productos}
        onRefreshProducts={fetchData}
      />

      <PurchaseDetailModal 
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        compra={selectedCompra}
        onUpdateStatus={handleUpdateStatus}
      />

      <PurchaseFilterModal 
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
      />

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
}
