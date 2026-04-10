"use client";

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning';
}

interface TableActionsProps {
  actions: ActionItem[];
  // index y total ya no son necesarios para la lógica de apertura,
  // pero los mantengo por compatibilidad si no quieres cambiar las firmas.
  index?: number;
  total?: number;
}

export function TableActions({ actions }: TableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8), // Espacio entre el botón y el menú
      flip({ fallbackAxisSideDirection: 'end' }), // Cambia de lado si se va a cortar
      shift({ padding: 10 }), // Evita que se salga de la pantalla
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`btn btn-ghost btn-sm btn-square transition-colors ${isOpen ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[9999] outline-none"
            >
              <ul className="menu p-2 shadow-2xl bg-white border border-slate-100 rounded-xl w-52 animate-in fade-in zoom-in duration-150">
                {actions.map((action, i) => (
                  <React.Fragment key={i}>
                    {action.label === 'SEPARATOR' ? (
                      <div className="border-t border-slate-50 my-1" />
                    ) : (
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            action.onClick();
                            setIsOpen(false);
                          }}
                          className={`flex items-center gap-3 py-3 text-xs font-bold ${
                            action.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 
                            action.variant === 'warning' ? 'text-amber-500 hover:bg-amber-50' :
                            'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {action.icon && React.cloneElement(action.icon as React.ReactElement, { size: 16 })}
                          {action.label}
                        </button>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
