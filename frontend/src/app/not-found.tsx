"use client";

import React from 'react';
import { Ghost, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-700">
      <div className="relative mb-8">
        <Ghost size={120} className="text-neutral/10 animate-pulse" />
        <span className="absolute bottom-0 right-0 bg-red-500 text-white font-black px-4 py-2 rounded-xl text-4xl shadow-xl rotate-12 border-4 border-white">404</span>
      </div>
      <h1 className="text-5xl font-black text-neutral uppercase tracking-tighter italic">¡Mamma Mia!</h1>
      <p className="text-xl text-neutral/40 font-bold mt-4 italic">Parece que te has perdido en el Reino Champiñón de Luigi.</p>
      <button 
        onClick={() => router.push('/')} 
        className="btn btn-secondary btn-lg mt-12 rounded-2xl px-10 shadow-xl shadow-secondary/20 flex items-center gap-2"
      >
        <Home size={20} /> IR AL CASTILLO (INICIO)
      </button>
    </div>
  );
}
