"use client";

import React, { useRef, useState } from 'react';
import { FileUp, X, Upload, CheckCircle2, FileText, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<any>;
  title?: string;
  description?: string;
  context: string;
}

export function ImportModal({ 
  show, 
  onClose, 
  onImport, 
  title = "Importar Datos", 
  description = "Carga tu base de datos desde un archivo externo",
  context
}: ImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleDownloadTemplate = async () => {
    try {
      toast.loading('Generando plantilla de ejemplo...');
      await apiService.import.downloadTemplate(context);
      toast.dismiss();
      toast.success('Descarga de plantilla iniciada');
    } catch (err) {
      toast.dismiss();
      toast.error('Fallo al descargar plantilla de ejemplo');
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'csv' && ext !== 'xlsx') {
        toast.error('Formato no soportado. Debe ser CSV o XLSX');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo primero');
      return;
    }

    setLoading(true);
    try {
      await onImport(selectedFile);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error al importar datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border border-slate-100">
        <div className="bg-primary px-6 py-8 text-white relative">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="absolute top-4 right-4 text-white/60 hover:text-white disabled:opacity-50"
          >
            <X size={20}/>
          </button>
          <FileUp size={40} className="mb-4 opacity-40" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
          <p className="text-white/70 text-sm font-medium mt-1">{description}</p>
        </div>

        <div className="p-8 space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv,.xlsx" 
            className="hidden" 
          />

          <div 
            onClick={handleContainerClick}
            className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl p-10 flex flex-col items-center text-center group hover:border-primary/40 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            
            {selectedFile ? (
              <div className="space-y-1">
                <p className="font-bold text-primary flex items-center gap-1.5 justify-center">
                  <FileText size={16} /> {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <>
                <p className="font-bold text-slate-700">Haz clic o arrastra un archivo</p>
                <p className="text-xs text-slate-400 mt-2">Soportado: CSV, XLSX (Máx. 10MB)</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estructura Requerida</h4>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <p className="text-xs text-slate-600 font-medium">
                  Asegúrate de incluir las columnas <span className="font-bold">Nombre</span> y <span className="font-bold">SKU</span> en tu archivo. Las demás columnas opcionales se mapearán automáticamente.
                </p>
                <button 
                  type="button"
                  onClick={handleDownloadTemplate} 
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1 transition-all"
                >
                  <Download size={12} />
                  <span>Descargar plantilla de ejemplo (Excel)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <button 
            onClick={handleSubmit} 
            disabled={loading || !selectedFile}
            className="btn btn-primary btn-block rounded-2xl text-white font-black uppercase tracking-widest border-none disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Procesar Archivo</span>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
