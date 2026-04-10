"use client";

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: <AlertTriangle size={40} />,
    iconBg: 'bg-red-50 text-red-500',
    btnClass: 'bg-red-500 hover:bg-red-600 text-white shadow-red-200',
    titleClass: 'text-red-600',
  },
  warning: {
    icon: <AlertTriangle size={40} />,
    iconBg: 'bg-amber-50 text-amber-500',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200',
    titleClass: 'text-amber-600',
  },
  info: {
    icon: <Info size={40} />,
    iconBg: 'bg-blue-50 text-blue-500',
    btnClass: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200',
    titleClass: 'text-blue-600',
  },
  success: {
    icon: <CheckCircle2 size={40} />,
    iconBg: 'bg-green-50 text-green-500',
    btnClass: 'bg-green-500 hover:bg-green-600 text-white shadow-green-200',
    titleClass: 'text-green-600',
  },
};

export function ConfirmDialog({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  if (!show) return null;

  const config = variantConfig[variant];

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-sm p-8 text-center rounded-2xl border border-slate-100 shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className={`w-20 h-20 ${config.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
          {config.icon}
        </div>

        <h3 className={`text-xl font-black uppercase tracking-tight italic ${config.titleClass}`}>
          {title}
        </h3>
        
        <div className="text-sm text-slate-400 mt-3 font-medium">
          {message}
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <button 
            onClick={onConfirm} 
            disabled={isLoading}
            className={`btn border-none ${config.btnClass} font-black uppercase rounded-xl shadow-lg disabled:opacity-50 h-12`}
          >
            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : confirmLabel}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="btn btn-ghost text-slate-400 font-bold rounded-xl uppercase h-12"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/20 backdrop-blur-sm" onClick={isLoading ? undefined : onClose}></div>
    </div>
  );
}
