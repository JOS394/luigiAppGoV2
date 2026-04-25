"use client";

import React from 'react';
import { FileDown, X, FileText, ChevronRight } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface ExportModalProps {
  show: boolean;
  onClose: () => void;
  onExport: (msg: string) => void;
  context?: 'productos' | 'ventas' | 'clientes' | 'finanzas';
}

export function ExportModal({ show, onClose, onExport, context }: ExportModalProps) {
  if (!show) return null;

  const handleDownload = async (formatId: string, label: string) => {
    if (formatId !== 'csv') {
      toast.error('Formato no disponible en esta versión');
      return;
    }

    if (!context || !apiService.export[context as keyof typeof apiService.export]) {
      // Fallback a comportamiento mock
      onExport(`Exportando a ${label}`);
      return;
    }

    try {
      toast.loading('Generando archivo...');
      await apiService.export[context as keyof typeof apiService.export]();
      toast.dismiss();
      toast.success('Descarga iniciada');
      onClose();
    } catch (err) {
      toast.dismiss();
      toast.error('Fallo al exportar datos');
    }
  };

  const formats = [
    { id: 'excel', label: 'Microsoft Excel', ext: '.xlsx', color: 'text-green-600', bg: 'hover:bg-green-50' },
    { id: 'pdf', label: 'Documento PDF', ext: '.pdf', color: 'text-red-600', bg: 'hover:bg-red-50' },
    { id: 'csv', label: 'Valores por Comas', ext: '.csv', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-sm p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-2xl">
        <div className="p-8 text-center border-b border-slate-50">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
            <FileDown size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Exportar Lista</h3>
          <p className="text-sm text-slate-400 mt-2 font-medium">Selecciona el formato de descarga</p>
        </div>
        <div className="p-4 space-y-2">
          {formats.map((format) => (
            <button 
              key={format.id} 
              onClick={() => handleDownload(format.id, format.label)} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${format.bg}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 ${format.color}`}>
                  <FileText size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">{format.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{format.ext}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
        <div className="p-4 bg-slate-50">
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-block rounded-xl uppercase text-xs font-bold text-slate-400"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
