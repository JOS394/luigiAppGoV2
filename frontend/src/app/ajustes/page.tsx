"use client";

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Receipt,
  ShieldCheck,
  Database,
  Globe,
  Bell,
  Save,
  Image as ImageIcon,
  Printer,
  Users,
  UserPlus,
  Shield,
  Key,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AjustesPage() {
  const [activeTab, setActiveTab] = useState('negocio');

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  const sections = [
    { id: 'negocio', label: 'Mi Negocio', icon: Store },
    { id: 'usuarios', label: 'Usuarios y Roles', icon: Users },
    { id: 'ticket', label: 'Formato de Ticket', icon: Receipt },
    { id: 'sistema', label: 'Sistema POS', icon: Settings },
    { id: 'seguridad', label: 'Seguridad', icon: ShieldCheck },
    { id: 'respaldo', label: 'Base de Datos', icon: Database },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Sidebar de Ajustes */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === section.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                }`}
            >
              <section.icon size={18} strokeWidth={activeTab === section.id ? 2.5 : 2} />
              {section.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Contenido Principal de Ajustes */}
      <div className="flex-1 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header de Sección */}
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                {sections.find(s => s.id === activeTab)?.label}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">Administra los parámetros generales de tu papelería</p>
            </div>
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm px-6 rounded-lg gap-2 border-none"
            >
              <Save size={16} /> Guardar Cambios
            </button>
          </div>

          {/* Formulario Dinámico */}
          <div className="p-8">
            {activeTab === 'usuarios' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                {/* Cabecera de Usuarios */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 gap-4">
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <Shield size={18} className="text-primary" /> Control de Accesos
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Gestiona quién puede operar el sistema</p>
                  </div>
                  <button className="btn btn-primary btn-sm rounded-xl gap-2 shadow-lg shadow-primary/20 border-none px-6">
                    <UserPlus size={16} /> Nuevo Usuario
                  </button>
                </div>

                {/* Lista de Usuarios */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {[
                    { id: 1, nombre: 'Luigi Admin', email: 'admin@luigiapp.com', rol: 'administrador', estado: 'Activo' },
                    { id: 2, nombre: 'Carlos Vendedor', email: 'carlos@luigiapp.com', rol: 'vendedor', estado: 'Activo' },
                  ].map((user) => (
                    <div key={user.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-xl text-primary border border-primary/5">
                          {user.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{user.nombre}</p>
                          <p className="text-[10px] font-bold text-slate-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`badge border-none font-black text-[8px] uppercase px-2 py-2 rounded-md ${user.rol === 'administrador' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                              {user.rol}
                            </span>
                            <span className="badge badge-success border-none font-black text-[8px] uppercase px-2 py-2 rounded-md text-white">
                              {user.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm btn-square text-slate-300 group-hover:text-primary">
                        <Settings size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Matriz de Permisos */}
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <Key size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-700 uppercase tracking-tight">Matriz de Permisos</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Configuración por nivel de rol</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                    <table className="table table-lg w-full">
                      <thead className="bg-white/50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5">Módulo de Sistema</th>
                          <th className="text-center">Admin</th>
                          <th className="text-center">Vendedor</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-bold text-slate-600 divide-y divide-white/50">
                        {[
                          { mod: 'Terminal de Ventas (POS)', a: true, v: true },
                          { mod: 'Historial de Operaciones', a: true, v: true },
                          { mod: 'Abasto y Compras', a: true, v: false },
                          { mod: 'Control de Inventario', a: true, v: false },
                          { mod: 'Gestión Financiera', a: true, v: false },
                          { mod: 'Business Intelligence', a: true, v: false },
                          { mod: 'Directorio de Clientes', a: true, v: true },
                          { mod: 'Ajustes Globales', a: true, v: false },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/40 transition-colors">
                            <td className="px-8 py-4 uppercase tracking-tighter text-slate-500">{row.mod}</td>
                            <td className="text-center">
                              <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center ${row.a ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                                {row.a ? <CheckCircle2 size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center ${row.v ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                                {row.v ? <CheckCircle2 size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'negocio' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all cursor-pointer group shrink-0">
                    <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-2 uppercase">Subir Logo</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">Nombre Comercial</span></label>
                      <input type="text" placeholder="Ej. Papelería Luigi" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12 rounded-2xl" />
                    </div>
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">RFC / ID Fiscal</span></label>
                      <input type="text" placeholder="XAXX010101000" className="input input-bordered w-full bg-slate-50 focus:border-primary break-all font-bold text-slate-700 h-12 rounded-2xl" />
                    </div>
                    <div className="form-control w-full md:col-span-2">
                      <label className="label"><span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">Dirección Física</span></label>
                      <input type="text" placeholder="Calle, Número, Colonia, Ciudad" className="input input-bordered w-full bg-slate-50 focus:border-primary font-bold text-slate-700 h-12 rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ticket' && (
              <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight flex items-center gap-2 mb-6">
                    <Printer size={18} className="text-primary" /> Personalización de Comprobante
                  </h3>
                  <div className="space-y-6">
                    <div className="form-control">
                      <label className="label p-0 mb-2"><span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">Mensaje de Cabecera</span></label>
                      <textarea className="textarea textarea-bordered bg-white h-24 font-bold text-slate-700 rounded-2xl" placeholder="¡Gracias por su compra!"></textarea>
                    </div>
                    <div className="form-control">
                      <label className="label p-0 mb-2"><span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">Nota al Pie (Políticas)</span></label>
                      <input type="text" className="input input-bordered bg-white font-bold text-slate-700 h-12 rounded-2xl" placeholder="No se aceptan devoluciones después de 24h" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <Printer size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Impresión Automática</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Imprimir ticket al confirmar pago</p>
                    </div>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary h-7 w-12" defaultChecked />
                </div>
              </div>
            )}

            {activeTab === 'sistema' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Configuración Regional</label>
                  <div className="form-control">
                    <select className="select select-bordered bg-slate-50 font-bold text-slate-700 h-12 rounded-2xl">
                      <option>Moneda: Peso Mexicano (MXN)</option>
                      <option>Moneda: Dólar (USD)</option>
                      <option>Moneda: Euro (EUR)</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <select className="select select-bordered bg-slate-50 font-bold text-slate-700 h-12 rounded-2xl">
                      <option>Idioma: Español (Latinoamérica)</option>
                      <option>Idioma: English (US)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alertas Inteligentes</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Avisar Stock Bajo</span>
                      <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Reporte Diario por Email</span>
                      <input type="checkbox" className="toggle toggle-sm toggle-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in slide-in-from-bottom-2 duration-500">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={64} className="text-primary/20" />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Protección de Datos</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-3 font-medium">Configura contraseñas de supervisor para autorizar cancelaciones, devoluciones y descuentos especiales.</p>
                <button className="btn btn-primary mt-8 rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 border-none">Configurar PIN Maestro</button>
              </div>
            )}

            {activeTab === 'respaldo' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4 p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-800 uppercase tracking-tight">Última Sincronización</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Hoy a las 08:00 AM - Todo al día</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-32 flex flex-col gap-3 rounded-[2rem] shadow-sm group">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Save size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Exportar Backup Local</span>
                  </button>
                  <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-32 flex flex-col gap-3 rounded-[2rem] shadow-sm group">
                    <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Globe size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sincronizar Nube</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
