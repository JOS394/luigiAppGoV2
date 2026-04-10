"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { ReporteResumen, ReporteDetallado } from '@/types';
import { 
  Calendar, Download, Filter, BarChart3, 
  Package, Layers, RefreshCw, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

// Componentes
import { SummaryCards } from '@/components/reportes/SummaryCards';
import { WeeklySalesChart } from '@/components/reportes/WeeklySalesChart';
import { TopPerformingList } from '@/components/reportes/TopPerformingList';
import { ExportModal } from '@/components/clientes/modals/ExportModal';

export default function ReportesPage() {
  const [resumen, setResumen] = useState<ReporteResumen | null>(null);
  const [detalles, setDetallado] = useState<ReporteDetallado | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('7d');
  const [showExportModal, setShowExportModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rData, dData] = await Promise.all([
        apiService.reportes.getResumen(),
        apiService.reportes.getDetallado(periodo)
      ]);
      setResumen(rData);
      setDetallado(dData);
    } catch (error) {
      toast.error('Error al generar inteligencia de negocios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodo]);

  if (loading && !resumen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Procesando Big Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Barra de Inteligencia */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Business Intelligence</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Análisis de rendimiento y rentabilidad</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shadow-inner">
            {[
              { id: '24h', label: 'Hoy' },
              { id: '7d', label: '7 Días' },
              { id: '30d', label: '30 Días' }
            ].map((p) => (
              <button 
                key={p.id}
                onClick={() => setPeriodo(p.id)}
                className={`btn btn-sm h-10 px-4 rounded-xl border-none text-[10px] font-black uppercase ${periodo === p.id ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-400'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowExportModal(true)}
            className="btn btn-primary h-12 rounded-xl px-6 gap-2 text-white font-black uppercase tracking-wider shadow-lg shadow-primary/20 border-none"
          >
            <Download size={18} /> <span className="hidden sm:inline">Reporte</span>
          </button>
        </div>
      </div>

      <SummaryCards data={resumen} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Gráfico Principal */}
        <div className="xl:col-span-2">
          {detalles && <WeeklySalesChart data={detalles.ventasSemanales} />}
        </div>

        {/* Top Categorías */}
        <div>
          {detalles && (
            <TopPerformingList 
              title="Categorías" 
              subtitle="Distribución de ventas" 
              items={detalles.topCategorias}
              icon={<Layers size={20} />}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Productos */}
        <div className="xl:col-span-2">
          {detalles && (
            <TopPerformingList 
              title="Productos Estrella" 
              subtitle="Los más vendidos del periodo" 
              items={detalles.topProductos}
              icon={<Package size={20} />}
            />
          )}
        </div>

        {/* Acciones de Auditoría */}
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border-b-4 border-primary">
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white uppercase italic mb-2">Auditoría Fiscal</h3>
            <p className="text-xs text-white/50 font-medium mb-8">Descarga los registros detallados para contabilidad externa.</p>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10 group">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Libro de Ventas</span>
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10 group">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Kardex Consolidado</span>
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3 text-white/30 text-[9px] font-bold uppercase tracking-widest relative z-10">
            <RefreshCw size={12} className="animate-spin" /> Actualizado hace 2 minutos
          </div>
        </div>
      </div>

      <ExportModal 
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(msg) => { toast.success(msg); setShowExportModal(false); }}
      />
    </div>
  );
}
