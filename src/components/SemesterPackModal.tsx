'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { SEMESTER_STARTER_PACKS_CATALOG } from '@/lib/mock-data';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  Sparkles,
  BookOpen,
  Calculator,
  DraftingCompass,
  FlaskConical,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
  Package,
} from 'lucide-react';

interface SemesterPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterSemesterListings: (sem: number) => void;
}

export const SemesterPackModal: React.FC<SemesterPackModalProps> = ({
  isOpen,
  onClose,
  onFilterSemesterListings,
}) => {
  const { currentCampus } = useMarketplace();
  const [selectedSem, setSelectedSem] = useState<number>(2);
  const [targetBranch, setTargetBranch] = useState('Computer Science / Mechanical / Electrical');

  if (!isOpen) return null;

  const items = SEMESTER_STARTER_PACKS_CATALOG;

  const totalNewPrice = items.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalUsedPrice = items.reduce((sum, item) => sum + item.resalePrice, 0);
  const totalSavings = totalNewPrice - totalUsedPrice;
  const savingsPercent = Math.round((totalSavings / totalNewPrice) * 100);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Calculator':
        return <Calculator className="h-4 w-4 text-emerald-600" />;
      case 'DraftingCompass':
        return <DraftingCompass className="h-4 w-4 text-purple-600" />;
      case 'FlaskConical':
        return <FlaskConical className="h-4 w-4 text-blue-600" />;
      case 'FileText':
        return <FileText className="h-4 w-4 text-amber-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Semester Procurement Calculator"
      subtitle={`Coursework essentials mapped by seniors on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="h-5 w-5" />
        </div>
      }
      badge={
        <span className="rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5">
          {savingsPercent}% Savings
        </span>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Semester & Branch Controls */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-600">Branch:</span>
            <span className="font-bold text-zinc-900 bg-white border border-zinc-200 px-2.5 py-1 rounded-xl">
              {targetBranch}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-600">Semester:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSem(s)}
                  className={`rounded-xl px-2.5 py-1 font-bold transition-all ${
                    selectedSem === s
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Savings Callout */}
        <div className="p-5 rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50/70 via-white to-emerald-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Procurement Cost Comparison (Semester {selectedSem})
            </span>
            <span className="rounded-full bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 shadow-2xs">
              {savingsPercent}% Saved
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white border border-zinc-200/80">
              <span className="text-[11px] text-zinc-400 block font-medium">Buy New (Retail)</span>
              <span className="text-base sm:text-lg font-bold text-zinc-400 line-through">₹{totalNewPrice}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-emerald-200 ring-2 ring-emerald-500/20">
              <span className="text-[11px] text-emerald-800 block font-bold">Campus Reuse</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700">₹{totalUsedPrice}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-zinc-200/80">
              <span className="text-[11px] text-zinc-500 block font-medium">Your Savings</span>
              <span className="text-base sm:text-lg font-black text-zinc-950">₹{totalSavings}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Catalog Items */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Included Academic Supplies
          </h4>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block">{item.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{item.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-zinc-900 block">₹{item.resalePrice}</span>
                  <span className="text-[10px] text-zinc-400 line-through">₹{item.originalPrice} new</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onFilterSemesterListings(selectedSem);
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>Filter Marketplace for Semester {selectedSem} Items</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </ModalWrapper>
  );
};
