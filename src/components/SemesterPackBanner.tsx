'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import {
  Sparkles,
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingDown,
  GraduationCap,
} from 'lucide-react';

interface SemesterPackBannerProps {
  onOpenSemesterPack: () => void;
  onOpenSellSemester: () => void;
}

export const SemesterPackBanner: React.FC<SemesterPackBannerProps> = ({
  onOpenSemesterPack,
  onOpenSellSemester,
}) => {
  const { currentCampus } = useMarketplace();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-linear-to-r from-indigo-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 text-white shadow-md">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Pitch & Bundle Overview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Curated Semester Procurement</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Everything your upcoming semester requires. In one reusable pack.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-normal leading-relaxed">
            Incoming students save over 60% by acquiring passing seniors&apos; course kits (Calculator + Drawing Drafter + Lab Coat + Textbooks) directly on {currentCampus.shortCode}.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenSemesterPack}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2.5 text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Package className="h-4 w-4" />
              <span>Explore Semester Packs</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenSellSemester}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition-all active:scale-95"
            >
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>Passed Semester? Sell Bundle</span>
            </button>
          </div>
        </div>

        {/* Right Column: Pricing Comparison Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Semester 2 Starter Pack
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black px-2.5 py-0.5 border border-emerald-500/30">
                62% Total Savings
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Retail (Buy New)</span>
                <span className="text-sm font-bold text-zinc-500 line-through">₹4,274</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 block font-medium">Campus Reuse Bundle</span>
                <span className="text-2xl font-black text-white">₹1,610</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Casio FX-991CW Scientific Calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Omega Engineering Mini Drafter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Erwin Kreyszig Advanced Math (10th Ed)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Pure Cotton Lab Coat (Size M) + Goggles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
