"use client";

import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import type { Venta, Producto } from '@/types';

interface ReceiptModalProps {
  show: boolean;
  onClose: () => void;
  venta: Venta | null;
  productos: Producto[]; // Para obtener nombres si no vienen en la venta
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ show, onClose, venta, productos }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!show || !venta) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white print:hidden">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter italic">Venta Completada</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
          <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-3xl mb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">¡Gracias por su compra!</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">La transacción ha sido exitosa</p>
          </div>

          {/* ÁREA DE IMPRESIÓN (CONTENIDO DEL TICKET) */}
          <div 
            id="print-area"
            ref={printRef}
            className="bg-white p-6 shadow-xl border border-slate-100 rounded-lg font-mono text-[12px] text-slate-800 mx-auto"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <div className="text-center space-y-1 mb-4 border-b border-dashed border-slate-200 pb-4">
              <h2 className="font-black text-lg uppercase tracking-tighter">LuigiApp V3</h2>
              <p className="text-[10px]">SISTEMA POS PROFESIONAL</p>
              <p className="text-[9px] opacity-60">Calle Falsa 123, Ciudad</p>
              <p className="text-[9px] opacity-60">RFC: LUIGI-900101-XXX</p>
            </div>

            <div className="space-y-1 mb-4 text-[10px]">
              <div className="flex justify-between">
                <span>FOLIO:</span>
                <span className="font-bold">{venta.id.includes('-') ? `V-${venta.id.split('-')[0].toUpperCase()}` : venta.id}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA:</span>
                <span>{new Date(venta.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>HORA:</span>
                <span>{new Date(venta.fecha).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENTE:</span>
                <span className="uppercase">{venta.cliente}</span>
              </div>
            </div>

            <div className="border-y border-dashed border-slate-200 py-3 mb-4">
              <div className="grid grid-cols-4 font-bold text-[9px] mb-2">
                <span className="col-span-2">PRODUCTO</span>
                <span className="text-center">CANT</span>
                <span className="text-right">TOTAL</span>
              </div>
              <div className="space-y-2">
                {venta.detalles.map((d, i) => {
                  const p = productos.find(prod => prod.id === d.productoId);
                  return (
                    <div key={i} className="grid grid-cols-4 text-[9px] leading-tight">
                      <span className="col-span-2 uppercase">{p?.nombre || 'Producto'}</span>
                      <span className="text-center">x{d.cantidad}</span>
                      <span className="text-right">${d.subtotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 text-right mb-6">
              <div className="flex justify-between">
                <span className="font-bold">TOTAL:</span>
                <span className="text-lg font-black">${venta.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center text-[9px] opacity-50 pt-4 border-t border-dashed border-slate-200">
              <p>GRACIAS POR SU PREFERENCIA</p>
              <p>Visite: www.luigiapp.com</p>
            </div>
          </div>
        </div>

        {/* Footer Modal Acciones */}
        <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 print:hidden">
          <button 
            onClick={onClose}
            className="btn btn-ghost h-12 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
          >
            Cerrar
          </button>
          <button 
            onClick={handlePrint}
            className="btn btn-primary h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2 text-white border-none"
          >
            <Printer size={16} /> Imprimir Ticket
          </button>
        </div>
      </div>

      {/* ESTILOS CSS PARA IMPRESIÓN SOLAMENTE DEL TICKET */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Ocultar todo por defecto */
          body * {
            visibility: hidden !important;
          }
          
          /* Mostrar el área de impresión y sus descendientes */
          #print-area, #print-area * {
            visibility: visible !important;
          }
          
          /* Posicionar el ticket en el origen de la página */
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 5mm !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Forzar que el body no tenga color de fondo y ocupe el ancho del ticket */
          body {
            background: white !important;
            width: 80mm !important;
          }

          /* Eliminar márgenes de página y headers/footers del navegador */
          @page {
            margin: 0;
            size: 80mm auto;
          }

          /* Ocultar elementos que podrían dejar espacios en blanco o interferir */
          .print\\:hidden, 
          button, 
          .modal-backdrop,
          header,
          nav {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};
