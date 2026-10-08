'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { Listing, TransactionMode } from '@/lib/types';
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Tag,
  MapPin,
  Heart,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Package,
} from 'lucide-react';

export default function BrowsePage() {
  const router = useRouter();
  const {
    currentCampus,
    categories,
    listings,
    selectedCategory,
    setSelectedCategory,
    selectedSemester,
    setSelectedSemester,
    selectedMode,
    setSelectedMode,
    sortOption,
    setSortOption,
    savedListingIds,
    toggleSaveListing,
  } = useMarketplace();

  const [localSearch, setLocalSearch] = useState('');

  const semesters = [
    { label: 'All Semesters', value: 'ALL' as const },
    { label: 'Sem 1', value: 1 },
    { label: 'Sem 2 (Active)', value: 2 },
    { label: 'Sem 3', value: 3 },
    { label: 'Sem 4', value: 4 },
  ];

  const modes: { label: string; value: TransactionMode | 'ALL' }[] = [
    { label: 'All Modes', value: 'ALL' },
    { label: 'Buy', value: 'BUY' },
    { label: 'Exchange ⇄', value: 'EXCHANGE' },
    { label: 'Rent', value: 'RENT' },
    { label: 'Giveaway 🎁', value: 'GIVE_AWAY' },
  ];

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (l.campusId !== currentCampus.id) return false;
    if (selectedCategory !== 'ALL' && l.categoryId !== selectedCategory) return false;
    if (selectedMode !== 'ALL' && l.mode !== selectedMode) return false;
    if (selectedSemester !== 'ALL' && l.relevantSemesters && !l.relevantSemesters.includes(selectedSemester)) {
      return false;
    }
    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case 'NEWEST':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'PRICE_LOW':
        return a.price - b.price;
      case 'PRICE_HIGH':
        return b.price - a.price;
      case 'BEST_SAVINGS': {
        const savA = a.originalNewPrice ? (a.originalNewPrice - a.price) / a.originalNewPrice : 0;
        const savB = b.originalNewPrice ? (b.originalNewPrice - b.price) / b.originalNewPrice : 0;
        return savB - savA;
      }
      case 'RECOMMENDED':
      default:
        return 0;
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  return (
    <div className="flex-1 w-full bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Browse Campus Catalog
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500">
                Reusable academic essentials on {currentCampus.name}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
              <div className="relative flex items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-2xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
                <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
                />
              </div>
            </form>
          </div>

          {/* Categories Grid (Section 9: Guided discovery) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedCategory === 'ALL'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
              }`}
            >
              <div className="text-base mb-1">🏛️</div>
              <strong className="text-xs block truncate">All Items</strong>
              <span className="text-[10px] text-zinc-400 block">{listings.filter((l) => l.campusId === currentCampus.id).length} listed</span>
            </button>

            {categories.map((c) => {
              const count = listings.filter((l) => l.campusId === currentCampus.id && l.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedCategory === c.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                  }`}
                >
                  <div className="text-base mb-1">
                    {c.slug === 'calculators' ? '⚡' : c.slug === 'drawing-kits' ? '📐' : c.slug === 'textbooks' ? '📚' : c.slug === 'lab-coats' ? '🥼' : '💻'}
                  </div>
                  <strong className="text-xs block truncate">{c.name}</strong>
                  <span className="text-[10px] text-zinc-400 block">{count} available</span>
                </button>
              );
            })}
          </div>

          {/* Filter Pills Strip: Semesters & Modes */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Semester:
              </span>
              {semesters.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSemester(s.value)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedSemester === s.value
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'RECOMMENDED' | 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'BEST_SAVINGS')}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-800 shadow-2xs focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="RECOMMENDED">Recommended</option>
                <option value="NEWEST">Newest</option>
                <option value="PRICE_LOW">Price: Low → High</option>
                <option value="PRICE_HIGH">Price: High → Low</option>
                <option value="BEST_SAVINGS">Highest Savings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Showing <strong>{sortedListings.length}</strong> verified campus items</span>
            <Link href="/needs/create" className="text-amber-800 font-bold hover:underline">
              Can&apos;t find what you need? Post a request →
            </Link>
          </div>

          {sortedListings.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-zinc-900 text-base">No items found for this selection</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try selecting &ldquo;All Items&rdquo; or post what you need on the Need Board so passing seniors can sell yours!
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Link
                  href="/needs/create"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 shadow-2xs"
                >
                  Post on Need Board
                </Link>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedSemester('ALL');
                    setSelectedMode('ALL');
                  }}
                  className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-xs hover:bg-zinc-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedListings.map((listing) => (
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
                        {listing.originalNewPrice && listing.originalNewPrice > listing.price && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            Save {Math.round(((listing.originalNewPrice - listing.price) / listing.originalNewPrice) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                      <span className="truncate max-w-[140px]">{listing.preferredSpot?.name || 'Library Foyer'}</span>
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
        </section>
      </div>
    </div>
  );
}
