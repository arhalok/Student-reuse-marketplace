'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  headerBg?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  headerBg = 'bg-zinc-50/70',
  maxWidth = '2xl',
  children,
  footer,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-sheet-up sm:animate-modal-in`}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-white cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1.5 rounded-full bg-zinc-300" />
        </div>

        {/* Modal Header */}
        {(title || icon) && (
          <div className={`flex items-center justify-between border-b border-zinc-100 px-5 sm:px-6 py-4 ${headerBg}`}>
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {icon && <div className="shrink-0">{icon}</div>}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {typeof title === 'string' ? (
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight truncate">
                      {title}
                    </h2>
                  ) : (
                    title
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-xs text-zinc-500 font-normal line-clamp-1 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="border-t border-zinc-100 px-5 sm:px-6 py-3.5 bg-zinc-50/80 flex items-center justify-between gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
