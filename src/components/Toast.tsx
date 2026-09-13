import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let icon = <CheckCircle className="w-4 h-4 text-emerald-600" />;
        let borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-950';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-600" />;
          borderClass = 'border-rose-200 bg-rose-50 text-rose-950';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
          borderClass = 'border-amber-200 bg-amber-50 text-amber-950';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-blue-600" />;
          borderClass = 'border-blue-200 bg-blue-50 text-blue-950';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="shrink-0">{icon}</span>
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
