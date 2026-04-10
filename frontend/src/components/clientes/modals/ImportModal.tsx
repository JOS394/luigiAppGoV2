"use client";

import React from 'react';
import { FileUp, X, Upload, CheckCircle2 } from 'lucide-react';

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
  onImport: (msg: string) => void;
  title?: string;
  description?: string;
}

export function ImportModal({ 
  show, 
  onClose, 
  onImport, 
  title = "Importar Datos", 
  description = "Carga tu base de datos desde un archivo externo" 
}: ImportModalProps) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-lg p-0 overflow-hidden rounded-2xl">
        <div className="bg-primary px-6 py-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={20}/>
          </button>
          <FileUp size={40} className="mb-4 opacity-40" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
          <p className="text-white/70 text-sm font-medium mt-1">{description}</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl p-10 flex flex-col items-center text-center group hover:border-primary/40 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <p className="font-bold text-slate-700">Haz clic o arrastra un archivo</p>
            <p className="text-xs text-slate-400 mt-2">Soportado: CSV, XLSX (Máx. 10MB)</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estructura Requerida</h4>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 font-medium">Asegúrate de que las columnas coincidan con el formato del sistema.</p>
            </div>
          </div>
        </div>
        <div className="px-8 pb-8">
          <button 
            onClick={() => onImport('Importación exitosa')} 
            className="btn btn-primary btn-block rounded-2xl text-white font-black uppercase tracking-widest"
          >
            Procesar Archivo
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
