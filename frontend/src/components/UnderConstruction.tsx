"use client";

import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const UnderConstruction: React.FC<{ title: string }> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="bg-primary/10 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-8 border-4 border-dashed border-primary/20">
        <Construction size={64} className="text-primary animate-bounce" />
      </div>
      <h2 className="text-4xl font-black text-neutral uppercase tracking-tighter italic">
        Módulo: <span className="text-secondary">{title}</span>
      </h2>
      <p className="text-neutral/40 font-bold mt-4 italic max-w-md">
        ¡Oki Doki! Estamos trabajando duro para que esta sección sea perfecta. ¡Vuelve pronto!
      </p>
      <button 
        onClick={() => router.push('/')} 
        className="btn btn-primary btn-lg mt-10 rounded-2xl px-12 shadow-xl shadow-primary/20 flex items-center gap-2"
      >
        <ArrowLeft size={20} /> REGRESAR AL INICIO
      </button>
    </div>
  );
};
