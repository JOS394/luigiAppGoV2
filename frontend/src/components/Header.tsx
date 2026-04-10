"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Search,
  Calendar,
  Settings,
  HelpCircle,
  Package,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean)[0];
    if (!path) return 'Inicio / Dashboard';

    const titles: Record<string, string> = {
      ventas: 'Terminal de Ventas',
      inventario: 'Gestión de Inventario',
      clientes: 'Directorio de Clientes',
      finanzas: 'Control Financiero',
      compras: 'Registro de Compras',
      productos: 'Catálogo de Productos',
      servicios: 'Catálogo de Servicios',
      proveedores: 'Directorio de Proveedores',
      reportes: 'Centro de Reportes',
      ajustes: 'Configuración del Sistema',
    };

    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between lg:px-8 pl-20 pr-8 sticky top-0 z-20 shrink-0">
      {/* Sección Izquierda: Título Dinámico */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none uppercase">
          {getPageTitle()}
        </h1>
        <div className="flex items-center gap-2 mt-1 text-slate-400">
          <Calendar size={12} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
            {today}
          </span>
        </div>
      </div>

      {/* Sección Derecha: Acciones Rápidas */}
      <div className="flex items-center gap-2">
        
        {/* DROPDOWN AYUDA */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-primary tooltip tooltip-bottom" data-tip="Centro de Ayuda">
            <HelpCircle size={20} />
          </div>
          <div tabIndex={0} className="dropdown-content z-[100] card card-compact w-64 p-2 shadow-2xl bg-white border border-slate-100 mt-4 rounded-2xl">
            <div className="card-body">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-2">Asistencia LuigiApp</h3>
              <ul className="menu menu-sm p-0 gap-1">
                <li>
                  <button className="flex items-center gap-3 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold">
                    <Info size={16} className="text-primary" /> Guía de Usuario
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-3 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold">
                    <MessageSquare size={16} className="text-primary" /> Soporte Técnico
                  </button>
                </li>
                <div className="border-t border-slate-50 my-1"></div>
                <li>
                  <button className="flex items-center justify-between py-3 rounded-xl hover:bg-slate-50 text-slate-400 font-bold italic">
                    <span className="text-[10px]">Versión 3.2.0</span>
                    <ExternalLink size={12} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DROPDOWN NOTIFICACIONES */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-primary relative tooltip tooltip-bottom" data-tip="Notificaciones">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div tabIndex={0} className="dropdown-content z-[100] card card-compact w-80 p-0 shadow-2xl bg-white border border-slate-100 mt-4 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Notificaciones</span>
              <span className="badge badge-primary badge-sm text-[9px] font-black text-white px-2">3 NUEVAS</span>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-slate-50">
                {/* Notificación 1 */}
                <button className="w-full p-4 flex gap-4 hover:bg-slate-50 transition-colors text-left group">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">Stock Crítico: Cuaderno Profesional</p>
                    <p className="text-[10px] text-slate-400 mt-1">Quedan menos de 5 unidades en bodega central.</p>
                    <p className="text-[9px] font-black text-primary uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Inventario</p>
                  </div>
                </button>
                {/* Notificación 2 */}
                <button className="w-full p-4 flex gap-4 hover:bg-slate-50 transition-colors text-left group">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">Compra Recibida: Orden B-402</p>
                    <p className="text-[10px] text-slate-400 mt-1">Se ha actualizado el stock de 12 productos.</p>
                    <p className="text-[9px] font-black text-primary uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</p>
                  </div>
                </button>
                {/* Notificación 3 */}
                <button className="w-full p-4 flex gap-4 hover:bg-slate-50 transition-colors text-left group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">Nuevo Registro de Cliente</p>
                    <p className="text-[10px] text-slate-400 mt-1">María López ha sido añadida exitosamente.</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Marcar todas como leídas</button>
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        
        <Link 
          href="/ajustes" 
          className={`btn btn-sm btn-square border-none transition-all tooltip tooltip-bottom ${
            pathname === '/ajustes' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'btn-ghost text-slate-400 hover:text-primary'
          }`} 
          data-tip="Ajustes"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
};
