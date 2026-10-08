'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import {
  ShieldCheck,
  TrendingDown,
  Recycle,
  Sparkles,
  MapPin,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface CampusBannerProps {
  onOpenSemesterPack: () => void;
  onOpenCreateListing?: () => void;
  onBrowseClick?: () => void;
}

export const CampusBanner: React.FC<CampusBannerProps> = ({
  onOpenSemesterPack,
  onOpenCreateListing,
  onBrowseClick,
}) => {
  const {
    currentCampus,
    impactStats,
    selectedSemester,
    setSelectedSemester,
  } = useMarketplace();

  const semesters = [
    { label: 'All Semesters', value: 'ALL' as const },
    { label: 'Sem 1', value: 1 },
    { label: 'Sem 2 (Active)', value: 2 },
    { label: 'Sem 3', value: 3 },
    { label: 'Sem 4', value: 4 },
  ];

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/90 bg-linear-to-b from-white via-zinc-50/40 to-white pt-8 pb-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Pitch */}
          <div className="lg:col-span-7 space-y-4">
            {/* Campus Context Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200/90">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Verified • {currentCampus.name}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-[1.12]">
              Buy smarter. Sell faster.{' '}
              <span className="text-emerald-700">Reuse on campus.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl font-normal leading-relaxed">
              A student-first marketplace for calculators, engineering drawing kits, textbooks, lab coats, and electronics. Move items directly from students who finished them to students who need them next.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onBrowseClick) onBrowseClick();
                  else {
                    const el = document.getElementById('marketplace-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-zinc-800 transition-all shadow-md shadow-zinc-950/10 active:scale-95"
              >
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>Browse Marketplace</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </button>

              {onOpenCreateListing && (
                <button
                  onClick={onOpenCreateListing}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs active:scale-95"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                  <span>Sell Something (&lt; 60s)</span>
                </button>
              )}
            </div>

            {/* Semester Filter Tabs */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Filter Semester:
              </span>
              {semesters.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSemester(s.value)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedSemester === s.value
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-zinc-200/90 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Impact & Safe Exchange Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50/60 via-white to-zinc-50/50 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Recycle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950 block">
                      Campus Circular Impact
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Real-time student community savings</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              {/* Impact Metric Counters */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-950">{impactStats.itemsReused}</div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Items Reused</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">₹{(impactStats.moneySaved / 1000).toFixed(1)}k</div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Money Saved</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-800">{impactStats.co2SavedKg} kg</div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">CO₂ Diverted</div>
                </div>
              </div>

              {/* Safe Meetup Spot Callout */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium truncate">Safe CCTV Spots: Library Foyer &amp; SAC</span>
                </div>
                <button
                  onClick={onOpenSemesterPack}
                  className="shrink-0 text-emerald-800 font-bold hover:underline flex items-center gap-1 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Sem Packs →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
