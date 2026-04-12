"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { MovimientoFinanciero, ResumenFinanciero } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Componentes extraídos
import { FinanceSummary } from '@/components/finanzas/FinanceSummary';
import { MovementsTable } from '@/components/finanzas/MovementsTable';
import { QuickActions } from '@/components/finanzas/QuickActions';
import { SalesGoal } from '@/components/finanzas/SalesGoal';
import { MovementModal } from '@/components/finanzas/modals/MovementModal';
import { FinanceFilterModal } from '@/components/finanzas/modals/FinanceFilterModal';
import { ExportModal } from '@/components/clientes/modals/ExportModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function FinanzasPage() {
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoFinanciero[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modales
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCorteConfirm, setShowCorteConfirm] = useState(false);
  const [movementType, setMovementType] = useState<'Ingreso' | 'Egreso'>('Ingreso');

  // Filtros
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    tipo: 'Todos',
    categoria: 'Todas'
  });

  const fetchData = async () => {
    try {
      const [rData, mData] = await Promise.all([
        apiService.finanzas.getResumen(),
        apiService.finanzas.getMovimientos()
      ]);
      setResumen(rData);
      setMovimientos(mData);
    } catch (error) {
      toast.error('Error al cargar datos financieros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMovimientos = movimientos.filter(m => {
    const matchesTipo = filters.tipo === 'Todos' || m.tipo === filters.tipo;
    const matchesCat = filters.categoria === 'Todas' || m.categoria === filters.categoria;
    
    let matchesDate = true;
    if (filters.startDate || filters.endDate) {
      const mDate = new Date(m.fecha).getTime();
      const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
      const end = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
      const adjustedEnd = end !== Infinity ? end + 86400000 : Infinity;
      if (mDate < start || mDate > adjustedEnd) matchesDate = false;
    }

    return matchesTipo && matchesCat && matchesDate;
  });

  const handleCreateMovement = async (data: Omit<MovimientoFinanciero, 'id' | 'fecha'>) => {
    try {
      await apiService.finanzas.createMovimiento(data);
      toast.success(`${data.tipo} registrado correctamente`);
      setShowMovementModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error al registrar movimiento');
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      tipo: 'Todos',
      categoria: 'Todas'
    });
    toast.info('Filtros limpiados');
  };

  const handleExport = (msg: string) => {
    toast.success(msg);
    setShowExportModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse text-center">Calculando Balances...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['administrador']}>
      <div className="space-y-8 animate-in fade-in duration-700">
        <FinanceSummary 
          resumen={resumen} 
          onRealizarCorte={() => setShowCorteConfirm(true)} 
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <MovementsTable 
              movimientos={filteredMovimientos} 
              onFilter={() => setShowFilterModal(true)}
              onExport={() => setShowExportModal(true)}
            />
          </div>

          <div className="space-y-6">
            <QuickActions 
              onAddIncome={() => { setMovementType('Ingreso'); setShowMovementModal(true); }}
              onAddExpense={() => { setMovementType('Egreso'); setShowMovementModal(true); }}
            />
            <SalesGoal current={resumen?.ingresosMes || 0} goal={40000} />
          </div>
        </div>

        <MovementModal 
          show={showMovementModal}
          type={movementType}
          onClose={() => setShowMovementModal(false)}
          onSubmit={handleCreateMovement}
        />

        <FinanceFilterModal 
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

        <ConfirmDialog 
          show={showCorteConfirm}
          onClose={() => setShowCorteConfirm(false)}
          onConfirm={() => {
            toast.success('Corte de caja realizado con éxito');
            setShowCorteConfirm(false);
          }}
          title="¿Realizar Corte de Caja?"
          message="Esta acción cerrará el turno actual y generará un resumen de los movimientos en efectivo hasta el momento."
          confirmLabel="Confirmar Corte"
          variant="info"
        />
      </div>
    </ProtectedRoute>
  );
}
