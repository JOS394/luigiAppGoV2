"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ShieldCheck,
  Store
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de autenticación profesional
    setTimeout(() => {
      if (formData.email === 'admin@luigiapp.com' && formData.password === 'admin123') {
        localStorage.setItem('auth_token', 'session_active_v3');
        toast.success('¡Bienvenido de nuevo, Luigi!');
        router.push('/');
      } else {
        toast.error('Credenciales incorrectas. Intenta con admin@luigiapp.com / admin123');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
        {/* Logo & Brand */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Store size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">
            Luigi<span className="text-primary">App</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Professional Management System</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Acceso al Sistema</h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest ml-1">Correo Electrónico</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="nombre@empresa.com" 
                  className="input input-bordered w-full h-14 pl-12 bg-slate-50 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-700 rounded-2xl"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Campo Password */}
            <div className="form-control w-full">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="label p-0">
                  <span className="label-text font-black text-slate-400 uppercase text-[10px] tracking-widest">Contraseña</span>
                </label>
                <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">¿Olvidaste tu clave?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input input-bordered w-full h-14 pl-12 pr-12 bg-slate-50 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-700 rounded-2xl"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Recordarme */}
            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-lg" id="remember" />
              <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer select-none">Mantener sesión iniciada</label>
            </div>

            {/* Botón Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full h-14 rounded-2xl border-none shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest gap-3"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  Entrar al Panel <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer del Login */}
        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={16} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Conexión Segura Encriptada</p>
        </div>
      </div>
    </div>
  );
}
