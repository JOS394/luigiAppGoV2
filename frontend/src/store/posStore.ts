import { create } from 'zustand';
import type { Producto } from '../types';

interface CartItem extends Producto {
  qty: number;
}

export type DiscountType = 'percentage' | 'fixed';

interface PosState {
  cart: CartItem[];
  discount: number;
  discountType: DiscountType;
  
  // Acciones
  addToCart: (producto: Producto) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setDiscount: (val: number) => void;
  setDiscountType: (type: DiscountType) => void;
  
  // Cálculos
  getSubtotal: () => number;
  getTotal: () => number;
  getDiscountAmount: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  discount: 0,
  discountType: 'percentage',

  addToCart: (producto) => set((state) => {
    const existing = state.cart.find(i => i.id === producto.id);
    if (existing) {
      return {
        cart: state.cart.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i)
      };
    }
    return { cart: [...state.cart, { ...producto, qty: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.id !== id)
  })),

  updateQty: (id, qty) => set((state) => ({
    cart: state.cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
  })),

  clearCart: () => set({ cart: [], discount: 0, discountType: 'percentage' }),
  
  setDiscount: (discount) => set({ discount }),
  setDiscountType: (discountType) => set({ discountType, discount: 0 }), // Reseteamos valor al cambiar tipo

  getSubtotal: () => {
    return get().cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const { discount, discountType } = get();
    if (discountType === 'percentage') {
      return subtotal * (discount / 100);
    }
    return discount;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    return Math.max(0, subtotal - discountAmount);
  }
}));
