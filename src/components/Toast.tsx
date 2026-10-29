import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-[calc(100vw-3rem)] pointer-events-none"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#1F2B25] text-[#FFFFFF] rounded-2xl shadow-xl border border-[#3F6B52]/40 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#CFE0D3] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#93C5FD] shrink-0" />}
            <span className="text-sm font-medium leading-snug truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white p-1 rounded-full transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
