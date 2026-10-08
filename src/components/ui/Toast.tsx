'use client';

import React from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  title?: string;
  type?: 'success' | 'info' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  title = 'CampuShare Notification',
  type = 'success',
}) => {
  if (!message) return null;

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 rounded-2xl bg-zinc-950 text-white p-4 shadow-2xl border border-zinc-800 max-w-sm sm:max-w-md animate-modal-in flex items-start gap-3.5"
    >
      <div className="shrink-0 mt-0.5">
        {type === 'success' && <Sparkles className="h-5 w-5 text-emerald-400" />}
        {type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
        {type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-400" />}
      </div>

      <div className="flex-1 min-w-0 text-xs">
        <div className="font-bold text-sm text-white mb-0.5">{title}</div>
        <p className="text-zinc-300 leading-relaxed">{message}</p>
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
};
