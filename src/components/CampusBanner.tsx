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
  Layers,
  ShoppingBag,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface CampusBannerProps {
  onOpenSemesterPack: () => void;
  onOpenCreateListing: () => void;
  onOpenNeedBoard: () => void;
  onBrowseClick?: () => void;
}

const TRENDING_CAMPUS_SEARCHES = [
  { label: 'Scientific Calculators', icon: '⚡', query: 'calculator' },
  { label: 'Engineering Drawing Kits', icon: '📐', query: 'drafter' },
  { label: 'Course Textbooks', icon: '📚', query: 'book' },
  { label: 'Lab Coats', icon: '🥼', query: 'coat' },
  { label: 'Electronics & Arduino', icon: '💻', query: 'arduino' },
  { label: 'Semester Starter Packs', icon: '🎒', isPack: true },
];

export const CampusBanner: React.FC<CampusBannerProps> = ({
  onOpenSemesterPack,
  onOpenCreateListing,
  onOpenNeedBoard,
  onBrowseClick,
}) => {
  const {
    currentCampus,
    impactStats,
    selectedSemester,
    setSelectedSemester,
    setSearchQuery,
    marketplaceHealth,
  } = useMarketplace();

  const semesters = [
    { label: 'All Semesters', value: 'ALL' as const },
    { label: 'Sem 1', value: 1 },
    { label: 'Sem 2 (Active)', value: 2 },
    { label: 'Sem 3', value: 3 },
    { label: 'Sem 4', value: 4 },
  ];

  const handleTrendingClick = (item: (typeof TRENDING_CAMPUS_SEARCHES)[0]) => {
    if (item.isPack) {
      onOpenSemesterPack();
    } else if (item.query) {
      setSearchQuery(item.query);
      const el = document.getElementById('marketplace-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/90 bg-linear-to-b from-white via-emerald-50/20 to-white pt-8 pb-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Pitch */}
          <div className="lg:col-span-7 space-y-5">
            {/* Campus Context Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200/90">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Verified &bull; {currentCampus.name}</span>
            </div>

            {/* Main Headline (Section 4 of spec) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-[1.12]">
              What do you need <br className="hidden sm:inline" />
              <span className="text-emerald-700">this semester?</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl font-normal leading-relaxed">
              Buy from fellow students. Sell what you no longer need. Or broadcast what you&apos;re looking for and let passing seniors connect with you safely on campus.
            </p>

            {/* 3 Core Pillar Action Buttons (Section 3 of spec: BUY, SELL, POST A NEED) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 max-w-2xl">
              {/* Pillar 1: Buy */}
              <button
                onClick={() => {
                  if (onBrowseClick) onBrowseClick();
                  else {
                    const el = document.getElementById('marketplace-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group flex flex-col items-start p-3.5 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-md shadow-zinc-950/10 active:scale-98 text-left"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black tracking-wide uppercase text-emerald-400">1. Buy</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <strong className="text-sm font-extrabold text-white">Browse Items</strong>
                <span className="text-[11px] text-zinc-400 mt-0.5">Find 60% cheaper gear</span>
              </button>

              {/* Pillar 2: Sell */}
              <button
                onClick={onOpenCreateListing}
                className="group flex flex-col items-start p-3.5 rounded-2xl bg-white border border-zinc-200/90 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all shadow-2xs active:scale-98 text-left"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black tracking-wide uppercase text-emerald-700">2. Sell</span>
                  <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <strong className="text-sm font-extrabold text-zinc-900">List an Item</strong>
                <span className="text-[11px] text-zinc-500 mt-0.5">Publish in &lt; 60 seconds</span>
              </button>

              {/* Pillar 3: Post a Need */}
              <button
                onClick={onOpenNeedBoard}
                className="group flex flex-col items-start p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-300 hover:bg-amber-100/60 transition-all shadow-2xs active:scale-98 text-left"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black tracking-wide uppercase text-amber-800">3. Need</span>
                  <Layers className="h-3.5 w-3.5 text-amber-700" />
                </div>
                <strong className="text-sm font-extrabold text-amber-950">Post a Need</strong>
                <span className="text-[11px] text-amber-800 mt-0.5">Reverse demand matching</span>
              </button>
            </div>

            {/* Semester Filter Tabs */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Semester Filter:
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

          {/* Right Column: Live Campus Impact & Safe Exchange Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50/60 via-white to-zinc-50/50 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Recycle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950 block">
                      Campus Circular Activity
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Real-time student metrics</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              {/* Impact Metric Counters (Section 4 of spec) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-zinc-950">
                    {marketplaceHealth.activeListings}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Active Listings</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-amber-700">
                    {marketplaceHealth.activeRequests}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Looking for Items</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">
                    ₹{(impactStats.moneySaved / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Money Saved</div>
                </div>
              </div>

              {/* Safe Meetup Spot Callout */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium truncate">Safe CCTV Spot: Central Library Foyer &amp; SAC</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                  Zero Cash Scams
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 of Spec: Trending on Campus Strip Immediately Below Hero */}
        <div className="pt-2 border-t border-zinc-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>Trending on {currentCampus.shortCode}:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {TRENDING_CAMPUS_SEARCHES.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleTrendingClick(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200/90 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-xs font-medium text-zinc-700 hover:text-emerald-900 transition-all shadow-2xs active:scale-95"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
