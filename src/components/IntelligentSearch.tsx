'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '@/lib/store';
import { TransactionMode } from '@/lib/types';
import {
  Search,
  X,
  Sparkles,
  Clock,
  TrendingUp,
  Tag,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

const POPULAR_CAMPUS_SEARCHES = [
  'Casio FX-991CW',
  'Erwin Kreyszig Math',
  'Mini Drafter',
  'Lab Coat Size M',
  'Arduino Uno Starter',
  'Data Structures Cormen',
];

export const IntelligentSearch: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMode,
    setSelectedMode,
    savedSearches,
    saveSearch,
    removeSearch,
    currentCampus,
  } = useMarketplace();

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectQuery = (q: string) => {
    setSearchQuery(q);
    saveSearch(q);
    setIsFocused(false);
  };

  const modes: { label: string; value: TransactionMode | 'ALL' }[] = [
    { label: 'All Modes', value: 'ALL' },
    { label: 'Buy', value: 'BUY' },
    { label: 'Exchange ⇄', value: 'EXCHANGE' },
    { label: 'Rent', value: 'RENT' },
    { label: 'Free Giveaway 🎁', value: 'GIVE_AWAY' },
  ];

  return (
    <div ref={containerRef} className="relative z-30 space-y-3">
      {/* Primary Search Input Container */}
      <div
        className={`relative flex items-center rounded-2xl sm:rounded-3xl border bg-white shadow-sm transition-all ${
          isFocused
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
            : 'border-zinc-200/90 hover:border-zinc-300'
        }`}
      >
        <div className="pl-4 sm:pl-5 pr-2 text-zinc-400">
          <Search className="h-5 w-5 text-emerald-600" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveSearch(searchQuery);
              setIsFocused(false);
            }
          }}
          placeholder="What do you need? (e.g. Casio FX-991, Drawing Kit, Kreyszig Math, Lab coat...)"
          className="w-full bg-transparent py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-2 text-zinc-400 hover:text-zinc-600 mr-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => {
            saveSearch(searchQuery);
            setIsFocused(false);
            const el = document.getElementById('marketplace-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors mr-2 shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Auto-suggest dropdown when focused */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl z-50 animate-modal-in space-y-4">
          {/* Recent Searches if any */}
          {savedSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Recent Searches
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {savedSearches.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <button
                      onClick={() => handleSelectQuery(s.query)}
                      className="hover:text-zinc-900 truncate"
                    >
                      {s.query}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(s.id);
                      }}
                      className="text-zinc-400 hover:text-zinc-600 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular On Campus Searches */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>Popular on {currentCampus.shortCode} right now</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CAMPUS_SEARCHES.map((query) => (
                <button
                  key={query}
                  onClick={() => handleSelectQuery(query)}
                  className="rounded-xl border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900 transition-all"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Mode Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1 hidden sm:inline">
            Mode:
          </span>
          {modes.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMode(m.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedMode === m.value
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'bg-white border border-zinc-200/90 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="text-xs text-zinc-500 font-medium">
            Active search: <strong className="text-zinc-900">&ldquo;{searchQuery}&rdquo;</strong>
          </div>
        )}
      </div>
    </div>
  );
};
