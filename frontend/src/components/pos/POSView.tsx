"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Producto, Venta } from '../../types';
import { usePosStore } from '../../store/posStore';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProductGrid } from './ProductGrid';
import { CartItem } from './CartItem';
import { ReceiptModal } from './modals/ReceiptModal';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Pin,
  PinOff,
  ChevronDown,
  CirclePercent,
  Store,
  DollarSign,
  Percent,
  X,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface POSViewProps {
  products: Producto[];
  onSuccess?: () => void;
}

export const POSView: React.FC<POSViewProps> = ({ products, onSuccess }) => {
  const { 
    cart, 
    discount,
    discountType,
    setDiscount,
    setDiscountType,
    clearCart,
    getSubtotal,
    getTotal,
    getDiscountAmount
  } = usePosStore();

  const [isPinned, setIsPinned] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('Cliente General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastVenta, setLastVenta] = useState<Venta | null>(null);
  
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const prevCountRef = useRef(cartCount);

  const subtotal = getSubtotal();
  const total = getTotal();
  const discountAmount = getDiscountAmount();

  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const ventaData = {
        cliente: clienteNombre || 'Cliente General',
        total: total,
        estado: 'Completada' as const,
        detalles: cart.map(item => ({
          productoId: item.id,
          cantidad: item.qty,
          precioUnitario: item.precio,
          subtotal: item.precio * item.qty
        }))
      };

      const nuevaVenta = await apiService.ventas.create(ventaData);
      
      toast.success('Venta registrada con éxito');
      setLastVenta(nuevaVenta);
      setShowReceipt(true);
      
      clearCart();
      setClienteNombre('Cliente General');
      setIsExpanded(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error al registrar venta:', error);
      toast.error(error.message || 'Error al registrar la venta en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Cambiamos h-[calc] por h-full para que dependa del padre que ya tiene flex-1 */
    <div className="flex flex-col lg:flex-row gap-6 h-full relative animate-in fade-in duration-700 min-h-0">
      {/* Catalogo de Productos */}
      <div className="flex-1 overflow-hidden min-w-0 h-full">
        <ProductGrid products={products} />
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-neutral/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Cart Sidebar / Panel */}
      <div 
        className={`
          fixed z-50 bg-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          
          /* MÓVIL: Bottom Sheet */
          left-0 right-0 bottom-0 h-[85vh] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]
          
          /* DESKTOP (lg) */
          lg:left-auto lg:right-0 lg:h-full lg:shadow-none lg:rounded-none
          
          /* Lógica de ocultamiento/fijado en Desktop */
          ${isPinned 
            ? 'lg:static lg:w-[400px] lg:border-l lg:border-slate-200 lg:translate-x-0' 
            : `lg:fixed lg:top-4 lg:bottom-4 lg:right-4 lg:w-[400px] lg:rounded-3xl lg:border lg:border-slate-200 lg:shadow-2xl 
               ${isExpanded ? 'lg:translate-x-0 lg:opacity-100' : 'lg:translate-x-[120%] lg:opacity-0 pointer-events-none'}`
          }
          
          /* Animación móvil */
          ${isExpanded ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        `}
      >
        {/* Handle visual móvil */}
        <div className="lg:hidden flex justify-center py-3 shrink-0" onClick={() => setIsExpanded(false)}>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Header Carrito */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                <ShoppingCart size={18} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Venta Actual</h3>
               <p className="text-[10px] font-medium text-slate-400 uppercase">Resumen</p>
             </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              className="hidden lg:flex btn btn-ghost btn-xs btn-square text-slate-300 hover:text-primary transition-colors"
              onClick={() => {
                setIsPinned(!isPinned);
                setIsExpanded(false);
              }}
            >
              {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
            </button>
            <button className="btn btn-ghost btn-sm btn-square text-slate-400" onClick={() => setIsExpanded(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cliente Input */}
        <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            <Users size={12} className="text-primary" />
            <span>Cliente</span>
          </div>
          <input 
            type="text" 
            placeholder="Nombre del cliente..." 
            className="input input-bordered input-sm w-full bg-white border-slate-200 focus:border-primary font-bold text-slate-700 rounded-xl h-10 px-4"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
        </div>

        {/* Lista de Items - FLEX-1 con MIN-H-0 para forzar scrollbar y no empujar el footer */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar min-h-0 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-3">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p className="font-bold text-[10px] uppercase tracking-[0.2em]">Caja vacía</p>
            </div>
          ) : (
            <div className="space-y-1">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout - SHRINK-0 para que nunca se oculte */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4 shrink-0 pb-8 lg:pb-6">
          <div className="flex items-center justify-between gap-2 text-slate-500">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
              <CirclePercent size={14} />
              <span>Descuento</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button onClick={() => setDiscountType('percentage')} className={`btn btn-xs btn-square ${discountType === 'percentage' ? 'btn-primary text-white border-none' : 'btn-ghost text-slate-400'}`}><Percent size={12} /></button>
              <button onClick={() => setDiscountType('fixed')} className={`btn btn-xs btn-square ${discountType === 'fixed' ? 'btn-primary text-white border-none' : 'btn-ghost text-slate-400'}`}><DollarSign size={12} /></button>
              <input type="number" className="w-14 bg-transparent font-bold text-slate-700 text-right focus:outline-none text-xs px-1" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))} placeholder="0" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[10px] font-bold text-red-500 uppercase italic">
                <span>Ahorro {discountType === 'percentage' ? `(${discount}%)` : ''}</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={clearCart} disabled={cart.length === 0 || isSubmitting} className="btn btn-square btn-outline border-slate-200 bg-white text-slate-300 hover:text-red-500 rounded-xl h-12 shadow-sm"><Trash2 size={18} /></button>
            <button 
              onClick={handleCheckout} 
              disabled={cart.length === 0 || isSubmitting} 
              className="btn btn-primary flex-1 rounded-xl shadow-lg shadow-primary/20 font-bold h-12 text-white uppercase tracking-widest text-xs"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <CreditCard size={18} className="mr-2" /> REGISTRAR COBRO
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Speed Dial */}
      {(!isPinned || (typeof window !== 'undefined' && window.innerWidth < 1024)) && !isExpanded && (
        <div className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${animateCart ? 'scale-110' : 'scale-100'}`}>
           <button 
             onClick={() => setIsExpanded(true)}
             className={`btn btn-circle btn-primary btn-lg h-16 w-16 shadow-[0_15px_40px_rgba(70,177,40,0.4)] border-4 border-white group relative ${animateCart ? 'animate-bounce' : ''}`}
           >
             {animateCart && <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></span>}
             <div className="indicator">
               {cart.length > 0 && (
                 <span className={`indicator-item badge badge-sm bg-red-500 text-white border-white font-bold shadow-md transition-all ${animateCart ? 'scale-150' : 'scale-100'}`}>
                   {cartCount}
                 </span>
               )}
               <ShoppingCart size={28} className={`text-white transition-transform ${animateCart ? 'rotate-12' : ''}`} />
             </div>
           </button>
        </div>
      )}

      <ReceiptModal 
        show={showReceipt}
        onClose={() => setShowReceipt(false)}
        venta={lastVenta}
        productos={products}
      />
    </div>
  );
};
