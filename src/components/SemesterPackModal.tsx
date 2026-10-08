'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { SEMESTER_STARTER_PACKS_CATALOG } from '@/lib/mock-data';
import {
  Sparkles,
  X,
  BookOpen,
  Calculator,
  DraftingCompass,
  FlaskConical,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
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
  const [targetBranch, setTargetBranch] = useState('Computer / Mechanical / Electrical');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-linear-to-r from-indigo-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-zinc-900 text-lg">What Do I Need For My Semester?</h2>
                <span className="rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5">
                  Procurement Engine
                </span>
              </div>
              <p className="text-xs text-zinc-600">
                Course requirements mapped by seniors on {currentCampus.shortCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Branch / Semester Selector */}
        <div className="border-b border-zinc-100 p-4 px-6 bg-zinc-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-700">Course / Branch:</span>
            <span className="font-semibold text-zinc-900 bg-white border border-zinc-200 px-2.5 py-1 rounded-md">
              {targetBranch}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-700">Semester:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSem(s)}
                  className={`rounded-md px-2.5 py-0.5 font-bold transition-all ${
                    selectedSem === s
                      ? 'bg-zinc-900 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Savings Callout (Section 38) */}
        <div className="p-6 bg-linear-to-b from-emerald-50/50 to-white border-b border-zinc-100">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Semester {selectedSem} Procurement Cost Comparison
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <div>
                    <span className="text-xs text-zinc-500">Buy New:</span>
                    <span className="ml-1 text-sm font-semibold text-zinc-400 line-through">
                      ₹{totalNewPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-600 font-medium">Buy Used:</span>
                    <span className="ml-1 text-xl font-black text-emerald-700">
                      ₹{totalUsedPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-100/80 px-4 py-2 text-center border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900">Total Student Savings</div>
                <div className="text-lg font-black text-emerald-700">₹{totalSavings} ({savingsPercent}% OFF)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Items Breakdown */}
        <div className="p-6 space-y-3 max-h-[45vh] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Curated Academic Supply Checklist
          </div>
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 shrink-0">
                  {getIcon(item.icon)}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-xs sm:text-sm">{item.name}</div>
                  <div className="text-[11px] text-zinc-500">{item.category} • Sem {item.semester} requirement</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs sm:text-sm font-extrabold text-zinc-900">
                  {item.resalePrice === 0 ? (
                    <span className="text-emerald-600">Free Giveaway</span>
                  ) : (
                    <span>₹{item.resalePrice}</span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 line-through">₹{item.originalPrice} new</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="border-t border-zinc-100 bg-zinc-50/70 p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            Available right now from passing seniors on campus
          </span>
          <button
            onClick={() => {
              onFilterSemesterListings(selectedSem);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors"
          >
            <span>Show Semester {selectedSem} Listings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
