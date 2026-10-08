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
} from 'lucide-react';

interface CampusBannerProps {
  onOpenSemesterPack: () => void;
}

export const CampusBanner: React.FC<CampusBannerProps> = ({ onOpenSemesterPack }) => {
  const {
    currentCampus,
    currentProfile,
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
    <div className="relative overflow-hidden border-b border-zinc-200 bg-linear-to-b from-zinc-50 to-white pt-6 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Campus Pitch */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Campus Verified • {currentCampus.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Academic items move from students who completed them to students who need them next.
            </h1>
            <p className="mt-2 text-sm text-zinc-600 max-w-xl">
              Buy directly from passing seniors. Avoid retail markups on calculators, drawing kits, lab coats, and engineering textbooks.
            </p>

            {/* Semester Tabs */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500 mr-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Filter by Semester:
              </span>
              {semesters.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSemester(s.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedSemester === s.value
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Impact Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/50 via-white to-zinc-50/50 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Campus Circular Impact
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-xl bg-white border border-emerald-50 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-zinc-900">{impactStats.itemsReused}</div>
                  <div className="text-[11px] text-zinc-500 font-medium">Items Reused</div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-emerald-50 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-emerald-600">₹{(impactStats.moneySaved / 1000).toFixed(1)}k</div>
                  <div className="text-[11px] text-zinc-500 font-medium">Money Saved</div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-emerald-50 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-zinc-800">{impactStats.co2SavedKg} kg</div>
                  <div className="text-[11px] text-zinc-500 font-medium">CO₂ Diverted</div>
                </div>
              </div>

              {/* Fast Campus Meetup Spots info */}
              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Exchange at Library Foyer & SAC Cafe</span>
                </div>
                <button
                  onClick={onOpenSemesterPack}
                  className="shrink-0 text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Sem Starter Packs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
