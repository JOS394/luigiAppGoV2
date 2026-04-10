"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Venta, Producto, ReporteResumen } from '@/types';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ArrowUpRight, 
  PlusCircle, 
  History,
  AlertTriangle,
  ShoppingCart,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function InicioPage() {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resumen, setResumen] = useState<ReporteResumen | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [vData, rData, pData] = await Promise.all([
          apiService.ventas.getAll(),
          apiService.reportes.getResumen(),
          apiService.productos.getAll()
        ]);
        setVentas(vData);
        setResumen(rData);
        setProductos(pData);
      } catch (error) {
        toast.error('Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse text-center">Iniciando Luigi-Cloud...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Las estadísticas ahora son lo primero tras el Header global */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all hover:border-primary/30">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ventas Hoy</p>
          <p className="text-3xl font-black text-slate-800">${resumen?.ventasHoy}</p>
          <div className="flex items-center gap-1 mt-4 text-[10px] font-bold text-primary bg-primary/5 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} />
            <span>+{resumen?.crecimiento}% vs ayer</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all hover:border-primary/30">
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transacciones</p>
          <p className="text-3xl font-black text-slate-800">{resumen?.transaccionesTotales}</p>
          <p className="text-[10px] font-bold mt-4 text-slate-400 italic">Promedio: ${resumen?.ticketsPromedio}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all hover:border-primary/30">
          <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Almacén</p>
          <p className="text-3xl font-black text-slate-800">{productos.length}</p>
          <button onClick={() => router.push('/inventario')} className="text-[10px] font-bold text-primary mt-4 hover:underline uppercase">GESTIONAR</button>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all hover:border-red-200">
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500 opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alertas</p>
          <p className="text-3xl font-black text-red-500">12</p>
          <p className="text-[10px] font-bold mt-4 text-red-400 animate-pulse uppercase">Revisión Crítica</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card bg-white shadow-sm border border-slate-200 rounded-2xl">
            <div className="card-body p-8">
              <h2 className="card-title text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                <PlusCircle className="text-primary" size={20} /> Accesos Rápidos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Vender', icon: ShoppingCart, path: '/ventas', color: 'hover:bg-primary/5 hover:text-primary' },
                  { label: 'Stock', icon: Package, path: '/inventario', color: 'hover:bg-primary/5 hover:text-primary' },
                  { label: 'Caja', icon: Wallet, path: '/finanzas', color: 'hover:bg-primary/5 hover:text-primary' },
                  { label: 'Clientes', icon: Users, path: '/clientes', color: 'hover:bg-primary/5 hover:text-primary' },
                ].map((action) => (
                  <button 
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    className={`flex flex-col items-center justify-center p-6 gap-3 rounded-xl border border-slate-100 bg-slate-50 transition-all ${action.color} group shadow-sm`}
                  >
                    <action.icon size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm border border-slate-200 rounded-2xl">
            <div className="card-body p-8">
              <h2 className="card-title text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                <History className="text-primary" size={20} /> Recientes
              </h2>
              <div className="space-y-3">
                {ventas.slice(0, 3).map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-primary border border-slate-200 uppercase">
                        {v.cliente.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-700 uppercase">{v.cliente}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">{new Date(v.fecha).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary text-sm">${v.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/30 transition-all"></div>
              <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">Luigi Tip</h3>
              <p className="text-sm opacity-70 font-medium leading-relaxed mb-6">
                Optimiza tus ventas usando la vista de Listado en dispositivos con pantallas pequeñas.
              </p>
              <button className="btn btn-primary btn-sm rounded-lg font-bold px-6 border-none shadow-lg shadow-primary/20">ENTENDIDO</button>
           </div>
        </div>
      </div>
    </div>
  );
}
