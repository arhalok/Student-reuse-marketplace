'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { Listing, ItemCondition, TransactionMode } from '@/lib/types';
import {
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
  Check,
  Compass,
  ArrowRight,
  Heart,
  Layers,
  Sparkles,
} from 'lucide-react';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const {
    currentCampus,
    listings,
    searchQuery,
    setSearchQuery,
    saveSearch,
    toggleSaveListing,
    savedListingIds,
  } = useMarketplace();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => {
        setQuery(initialQuery);
        setSearchQuery(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, setSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    router.replace(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSaveThisSearch = () => {
    if (!query.trim()) return;
    saveSearch(query);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filter listings
  const filtered = listings.filter((l) => {
    if (l.campusId !== currentCampus.id) return false;
    if (l.status !== 'ACTIVE') return false;

    // text search
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.description?.toLowerCase().includes(q);
      const matchCourse = l.targetCourse?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCourse) return false;
    }

    // condition
    if (selectedCondition !== 'ALL' && l.condition !== selectedCondition) return false;

    // mode
    if (selectedMode !== 'ALL' && l.mode !== selectedMode) return false;

    // max price
    if (maxPrice && l.price > Number(maxPrice)) return false;

    return true;
  });

  return (
    <div className="flex-1 w-full bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-2xs focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20">
              <Search className="h-4 w-4 text-emerald-600 mr-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword, tool, or course..."
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSearchQuery('');
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 hover:bg-zinc-50 shadow-2xs shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            <span>Filters</span>
            {(selectedCondition !== 'ALL' || selectedMode !== 'ALL' || maxPrice) && (
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            )}
          </button>
        </div>

        {/* Filter Drawer / Sheet (Mobile + Desktop) */}
        {showFilterDrawer && (
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-4 animate-modal-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="font-extrabold text-xs text-zinc-900 uppercase tracking-wider">Refine Search</span>
              <button
                onClick={() => {
                  setSelectedCondition('ALL');
                  setSelectedMode('ALL');
                  setMaxPrice('');
                }}
                className="text-[11px] text-zinc-400 hover:text-zinc-700 font-semibold underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || '')}
                  placeholder="e.g. 1000"
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs"
                >
                  <option value="ALL">All Conditions</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Mode</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs"
                >
                  <option value="ALL">All Modes</option>
                  <option value="BUY">Buy</option>
                  <option value="EXCHANGE">Exchange</option>
                  <option value="RENT">Rent</option>
                  <option value="GIVE_AWAY">Free Giveaway</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
          <div>
            Results for {query ? <strong>&ldquo;{query}&rdquo;</strong> : <strong>all items</strong>} on {currentCampus.shortCode}:{' '}
            <strong className="text-zinc-900">{filtered.length} found</strong>
          </div>

          {query && (
            <button
              onClick={handleSaveThisSearch}
              className="flex items-center gap-1 font-bold text-emerald-700 hover:underline"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Save this search</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* SECTION 13: ZERO-RESULT SCREEN RECOVERY */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-amber-200/90 bg-linear-to-b from-amber-50/50 via-white to-amber-50/20 p-10 sm:p-14 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-xs">
              <Compass className="h-7 w-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              We couldn&apos;t find that yet.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Campus supplies move fast. Tell graduating seniors what you&apos;re looking for and CampuShare will notify you the moment someone lists it on {currentCampus.shortCode}.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href={`/needs/create?title=${encodeURIComponent(query)}`}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 shadow-md shadow-amber-600/20 active:scale-95 transition-all"
              >
                Post on Need Board ({query || 'Request Item'})
              </Link>

              {query && (
                <button
                  onClick={handleSaveThisSearch}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-bold text-xs hover:bg-zinc-50 shadow-2xs"
                >
                  Save Search &amp; Alert Me
                </button>
              )}

              <Link
                href="/browse"
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-xs hover:bg-zinc-50"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        ) : (
          /* Results Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white transition-all hover:border-zinc-300 hover:shadow-lg card-hover"
              >
                <Link href={`/listing/${listing.id}`} className="block relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-full w-full object-cover group-hover:scale-104 transition-transform"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="rounded-lg bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      {listing.mode}
                    </span>
                    <span className="rounded-lg bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-zinc-800 border border-zinc-200">
                      {listing.condition.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Save listing"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSaveListing(listing.id);
                    }}
                    className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-zinc-600 hover:text-rose-600 shadow-sm"
                  >
                    <Heart
                      className={`h-4 w-4 ${savedListingIds.includes(listing.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link href={`/listing/${listing.id}`}>
                      <h3 className="font-bold text-zinc-900 text-sm line-clamp-2 hover:text-emerald-700 transition-colors">
                        {listing.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-black text-zinc-950">₹{listing.price}</span>
                      {listing.originalNewPrice && (
                        <span className="text-xs text-zinc-400 line-through">₹{listing.originalNewPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span className="truncate max-w-[130px]">{listing.preferredSpot?.name || 'Library'}</span>
                    <Link
                      href={`/listing/${listing.id}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading campus search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
