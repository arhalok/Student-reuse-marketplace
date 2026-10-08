'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  Search,
  ArrowRight,
  PlusCircle,
  Layers,
  Compass,
  Sparkles,
  Flame,
  MapPin,
  TrendingUp,
  Recycle,
  CheckCircle2,
  BookOpen,
  Tag,
  ShieldCheck,
  ChevronRight,
  Package,
} from 'lucide-react';

const TRENDING_CATEGORIES = [
  { label: 'Scientific Calculators', icon: '⚡', query: 'calculator' },
  { label: 'Engineering Drawing Kits', icon: '📐', query: 'drafter' },
  { label: 'Course Textbooks', icon: '📚', query: 'book' },
  { label: 'Lab Coats & Goggles', icon: '🥼', query: 'coat' },
  { label: 'Electronics & Arduino', icon: '💻', query: 'arduino' },
  { label: 'Semester Starter Packs', icon: '🎒', isPack: true },
];

export default function HomePage() {
  const router = useRouter();
  const {
    currentCampus,
    currentProfile,
    listings,
    needRequests,
    impactStats,
    marketplaceHealth,
    searchQuery,
    setSearchQuery,
    toggleSaveListing,
    savedListingIds,
  } = useMarketplace();

  // Curated best deals (items with > 35% savings)
  const bestDeals = listings
    .filter((l) => l.campusId === currentCampus.id && l.status === 'ACTIVE' && l.originalNewPrice && l.originalNewPrice > l.price)
    .slice(0, 4);

  // Top 3 urgent needs on campus
  const urgentNeeds = needRequests
    .filter((n) => n.campusId === currentCampus.id && n.status === 'OPEN')
    .slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-zinc-50/50">
      {/* 1. HERO & INTENT SECTION (Section 5: Help the user decide what to do) */}
      <section className="relative overflow-hidden bg-white border-b border-zinc-200/80 pt-8 pb-10">
        <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7">
          {/* Greeting & Campus Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200/90">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Verified &bull; {currentCampus.name}</span>
            </div>

            <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
              Welcome, <strong className="text-zinc-900">{currentProfile.fullName.split(' ')[0]}</strong> ({currentProfile.degreeProgram})
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 leading-[1.12]">
              What do you need <br className="hidden sm:inline" />
              <span className="text-emerald-700">this semester?</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
              Buy from students who finished their courses. Sell what you no longer need. Or broadcast what you&apos;re looking for and let seniors connect directly with you on campus.
            </p>
          </div>

          {/* Search Trigger Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-zinc-50/80 shadow-xs focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all">
              <div className="pl-4 pr-2 text-zinc-400">
                <Search className="h-5 w-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for? (e.g. Casio FX-991, Drawing Kit, Kreyszig Math, Lab coat...)"
                className="w-full bg-transparent py-3.5 text-xs sm:text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="mr-2 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors shadow-2xs shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* The 3 Dominant Action Cards (Section 3 & 5: Buy, Sell, Post a Need) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {/* 1. Buy Something */}
            <Link
              href="/browse"
              className="group flex flex-col justify-between p-5 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 transition-all shadow-md shadow-zinc-950/10 active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black tracking-wide uppercase text-emerald-400">1. Buy</span>
                  <Compass className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-base font-black text-white">Browse Marketplace</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Find scientific calculators, textbooks &amp; kits from students on your campus at 60%+ savings.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:underline">
                <span>Explore Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Sell Something */}
            <Link
              href="/sell"
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all shadow-2xs active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black tracking-wide uppercase text-emerald-700">2. Sell</span>
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-zinc-900">Sell an Item (&lt; 60s)</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Turn unused semester gear into money. 1-click popular presets &amp; fair price guidance.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:underline">
                <span>Start Listing Flow</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Post a Need */}
            <Link
              href="/needs/create"
              className="group flex flex-col justify-between p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 hover:border-amber-300 hover:bg-amber-100/60 transition-all shadow-2xs active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black tracking-wide uppercase text-amber-800">3. Need</span>
                  <Layers className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-base font-black text-amber-950">Post What You Need</h3>
                <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                  Can&apos;t find it? Post your budget on the Need Board. Graduating seniors get notified to sell theirs.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:underline">
                <span>Broadcast Demand</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Trending Category Chips Strip */}
          <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-2.5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>Trending on Campus:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_CATEGORIES.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.isPack) router.push('/semester');
                    else router.push(`/search?q=${encodeURIComponent(item.query || '')}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-xs font-medium text-zinc-700 hover:text-emerald-900 transition-all shadow-2xs"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CONTENT (Section 5: Curated sections leading into other screens) */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full">
        {/* Curated Section 1: Fresh Campus Deals */}
        {bestDeals.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-950 tracking-tight">Best Deals on {currentCampus.shortCode}</h2>
                  <p className="text-xs text-zinc-500">Over 40% discount vs. buying retail new</p>
                </div>
              </div>

              <Link
                href="/browse"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View All ({marketplaceHealth.activeListings})</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestDeals.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover group-hover:scale-103 transition-transform"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-lg bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        {listing.mode}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {listing.condition.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate mt-1 group-hover:text-emerald-700 transition-colors">
                        {listing.title}
                      </h4>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-base font-black text-zinc-950">₹{listing.price}</span>
                        {listing.originalNewPrice && (
                          <span className="text-xs text-zinc-400 line-through">₹{listing.originalNewPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="truncate">{listing.targetCourse}</span>
                    <span className="font-bold text-emerald-700 group-hover:underline">Inspect →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Curated Section 2: Students Looking For (Teaser to /needs) */}
        {urgentNeeds.length > 0 && (
          <section className="rounded-3xl border border-amber-200/90 bg-linear-to-r from-amber-50/70 via-orange-50/40 to-yellow-50/40 p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-2xs">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-amber-950 tracking-tight">Students Are Looking For (Need Board)</h2>
                  <p className="text-xs text-amber-800/80">Reverse Demand: Finished your semester? Pass items directly to juniors</p>
                </div>
              </div>

              <Link
                href="/needs"
                className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Requests ({marketplaceHealth.activeRequests})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {urgentNeeds.map((need) => (
                <div
                  key={need.id}
                  className="flex flex-col justify-between p-4 rounded-2xl border border-amber-200/90 bg-white shadow-2xs hover:border-amber-300 transition-all card-hover"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-sm text-zinc-900 line-clamp-1">{need.itemTitle}</span>
                      <span className="rounded-lg bg-amber-100 text-amber-950 text-xs font-black px-2 py-0.5 shrink-0">
                        Max ₹{need.maxBudget}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {need.notes || 'Looking for passing senior who no longer needs this.'}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Cond: {need.preferredCondition.replace('_', ' ')}</span>
                    <Link
                      href={`/sell/create?title=${encodeURIComponent(need.itemTitle)}&price=${need.maxBudget}`}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <span>I have this &bull; Sell</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curated Section 3: Semester Procurement Banner (Teaser to /semester) */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-linear-to-r from-indigo-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 text-white shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-500/30">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Curated Semester Kits</span>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                Get your complete semester starter pack for 62% less
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Incoming engineering students bundle scientific calculators, mini drafters, lab coats, and textbooks directly from passing seniors.
              </p>
            </div>

            <Link
              href="/semester"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-3 text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
            >
              <Package className="h-4 w-4" />
              <span>Explore Semester Packs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Curated Section 4: Campus Safety & CCTV Guarantee (Teaser to /safety) */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200/70">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Safe Meetup Guarantee</span>
            </div>
            <h3 className="text-lg font-black text-zinc-950">Campus-Only Exchanges at Designated CCTV Spots</h3>
            <p className="text-xs text-zinc-600 max-w-xl">
              No shipping delays, no strangers, no upfront wire transfers. Inspect the item in person at the Central Library Ground Foyer or SAC before scanning peer UPI.
            </p>
          </div>

          <Link
            href="/safety"
            className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-colors shrink-0"
          >
            Read Safety Rules →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/90 bg-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
              CS
            </div>
            <span className="font-extrabold text-zinc-900 text-sm">CampuShare</span>
            <span>&bull; Student Reuse Marketplace for {currentCampus.name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/browse" className="hover:text-zinc-900">Browse</Link>
            <Link href="/needs" className="hover:text-zinc-900">Needs</Link>
            <Link href="/sell" className="hover:text-zinc-900">Sell</Link>
            <Link href="/semester" className="hover:text-zinc-900">Semester Kits</Link>
            <Link href="/safety" className="hover:text-zinc-900">Safety Guide</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
