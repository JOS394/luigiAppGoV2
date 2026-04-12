"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'vendedor'
  });

  // Solo administradores pueden registrar usuarios
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Acceso Denegado</h1>
          <p className="text-slate-500 mt-2">Solo los administradores pueden registrar nuevos usuarios.</p>
          <button onClick={() => router.push('/')} className="btn btn-primary mt-6">Volver al Inicio</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiService.auth.register(formData);
      toast.success('Usuario registrado con éxito');
      router.push('/ajustes'); // O a una lista de usuarios
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar usuario');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 font-bold uppercase text-[10px] tracking-widest">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Registrar Nuevo Usuario</h1>
          <p className="text-slate-400 mt-2 font-medium">Crea una nueva cuenta para tu equipo de trabajo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest">Nombre Completo</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  className="input input-bordered w-full h-14 pl-12 bg-slate-50 border-slate-100 focus:border-primary rounded-2xl font-bold"
                  required
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest">Correo Electrónico</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  className="input input-bordered w-full h-14 pl-12 bg-slate-50 border-slate-100 focus:border-primary rounded-2xl font-bold"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest">Contraseña Inicial</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  className="input input-bordered w-full h-14 pl-12 bg-slate-50 border-slate-100 focus:border-primary rounded-2xl font-bold"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest">Rol de Usuario</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  className="select select-bordered w-full h-14 pl-12 bg-slate-50 border-slate-100 focus:border-primary rounded-2xl font-bold"
                  value={formData.rol}
                  onChange={e => setFormData({...formData, rol: e.target.value})}
                >
                  <option value="vendedor">Vendedor (Acceso limitado)</option>
                  <option value="administrador">Administrador (Acceso total)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full h-14 rounded-2xl border-none shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest gap-3"
            >
              {isLoading ? <span className="loading loading-spinner"></span> : <>Crear Cuenta de Usuario <ChevronRight size={20} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
