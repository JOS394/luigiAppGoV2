"use client";

import React, { useState, useMemo } from 'react';
import { Search, Check, ChevronDown, Plus } from 'lucide-react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useId,
} from '@floating-ui/react';

interface Option {
  id: string;
  label: string;
  subLabel?: string;
}

interface AutocompleteProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function Autocomplete({ 
  options, 
  value, 
  onChange, 
  placeholder = "Buscar...", 
  className = "",
  onAction,
  actionLabel
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedOption = useMemo(() => 
    options.find(opt => opt.id === value), 
  [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.subLabel?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: '250px',
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="relative group"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
          <Search size={14} />
        </div>
        <input
          type="text"
          className="input input-bordered input-sm w-full pl-9 pr-8 bg-white font-bold text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/5"
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
          <ChevronDown size={14} />
        </div>
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              visibility: isPositioned ? 'visible' : 'hidden',
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
            className="z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden transition-opacity duration-150"
          >
            <ul className="overflow-y-auto custom-scrollbar p-1">
              {onAction && (
                <li className="mb-1 border-b border-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      onAction();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                      <Plus size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tighter">{actionLabel || 'Añadir nuevo'}</span>
                      <span className="text-[9px] font-medium opacity-70">Registrar ítem no encontrado</span>
                    </div>
                  </button>
                </li>
              )}

              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                        value === opt.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-tight">{opt.label}</span>
                        {opt.subLabel && (
                          <span className="text-[10px] font-medium text-slate-400">{opt.subLabel}</span>
                        )}
                      </div>
                      {value === opt.id && <Check size={14} className="text-primary" />}
                    </button>
                  </li>
                ))
              ) : searchTerm && (
                <li className="px-4 py-8 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin otros resultados</p>
                </li>
              )}
            </ul>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
