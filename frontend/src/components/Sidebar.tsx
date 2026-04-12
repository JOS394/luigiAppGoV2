"use client";

import React from 'react';
import { 
  Home,
  ShoppingCart, 
  ShoppingBag, 
  Users, 
  Truck, 
  BarChart2, 
  Wallet, 
  Package, 
  Boxes,
  Wrench,
  PanelLeftClose, 
  PanelLeftOpen, 
  LogOut,
  Menu,
  Settings
} from 'lucide-react';
import { useViewStore } from '@/store/viewStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface MenuOption {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface MenuSection {
  title: string;
  options: MenuOption[];
}

const menuStructure: MenuSection[] = [
  {
    title: 'Principal',
    options: [
      { name: 'Inicio', icon: Home, path: '/' },
    ]
  },
  {
    title: 'Comercial',
    options: [
      { name: 'Ventas', icon: ShoppingCart, path: '/ventas' },
      { name: 'Clientes', icon: Users, path: '/clientes' },
      { name: 'Finanzas', icon: Wallet, path: '/finanzas' },
    ]
  },
  {
    title: 'Logística',
    options: [
      { name: 'Compras', icon: ShoppingBag, path: '/compras' },
      { name: 'Productos', icon: Package, path: '/productos' },
      { name: 'Servicios', icon: Wrench, path: '/servicios' },
      { name: 'Inventario', icon: Boxes, path: '/inventario' },
      { name: 'Proveedores', icon: Truck, path: '/proveedores' },
    ]
  },
  {
    title: 'Análisis',
    options: [
      { name: 'Reportes', icon: BarChart2, path: '/reportes' },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useViewStore();
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const filteredMenu = menuStructure.map(section => ({
    ...section,
    options: section.options.filter(option => {
      // Ocultar secciones sensibles a vendedores
      if (!isAdmin && ['/finanzas', '/compras', '/reportes', '/ajustes'].includes(option.path)) {
        return false;
      }
      return true;
    })
  })).filter(section => section.options.length > 0);

  return (
    <>
      {/* Botón flotante para Móvil */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className={`btn btn-circle btn-primary shadow-lg transition-transform ${isSidebarOpen ? 'scale-0' : 'scale-100'}`}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Contenedor del Sidebar */}
      <div 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-white text-slate-600 h-screen
          border-r border-slate-200 shrink-0
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          flex flex-col
          ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className={`p-6 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-4 shrink-0`}>
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl italic">L</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold tracking-tight text-slate-800 leading-none">
                    Luigi<span className="text-primary">App</span>
                  </h2>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Management</span>
                </div>
              </div>
              <button onClick={toggleSidebar} className="btn btn-ghost btn-xs btn-square text-slate-400">
                <PanelLeftClose size={18} />
              </button>
            </>
          ) : (
            <button onClick={toggleSidebar} className="hidden lg:flex btn btn-ghost btn-lg btn-square text-primary">
              <PanelLeftOpen size={24} />
            </button>
          )}
        </div>
        
        {/* Menu Area */}
        <nav className={`flex-1 ${isSidebarOpen ? 'overflow-y-auto' : 'overflow-hidden lg:overflow-visible'} px-3 space-y-6 custom-scrollbar pb-6`}>
          {filteredMenu.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.options.map((option) => {
                  const isActive = pathname === option.path;
                  return (
                    <Link 
                      key={option.name}
                      href={option.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={`${(!isSidebarOpen && window.innerWidth >= 1024) ? 'tooltip tooltip-right tooltip-primary' : ''} w-full block`}
                      data-tip={option.name}
                    >
                      <div
                        className={`
                          w-full flex items-center rounded-xl transition-all duration-200 group
                          ${isActive 
                            ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                          ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}
                        `}
                      >
                        <option.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        {isSidebarOpen && (
                          <span className="text-sm tracking-tight">{option.name}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-4 mt-auto border-t border-slate-100 bg-white">
          <div className={`
            flex items-center transition-all duration-200
            ${isSidebarOpen ? 'p-2 gap-3' : 'justify-center'}
          `}>
            <div className="relative shrink-0">
              <div className={`flex items-center justify-center bg-primary/10 text-primary font-black rounded-full border border-primary/10 ${isSidebarOpen ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}>
                {user?.nombre.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{user?.rol || 'Rol'}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={logout}
                className="btn btn-ghost btn-xs btn-square text-slate-300 hover:text-red-500 transition-colors tooltip tooltip-top" 
                data-tip="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
