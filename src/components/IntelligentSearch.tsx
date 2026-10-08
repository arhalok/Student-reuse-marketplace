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
  Users,
  MapPin,
  Check,
} from 'lucide-react';

const SMART_SUGGESTION_MAP: Record<string, { label: string; sub: string; icon: string; query: string }[]> = {
  calc: [
    { label: 'Scientific Calculators', sub: 'Category • 8 available', icon: '⚡', query: 'calculator' },
    { label: 'Casio FX-991CW ClassWiz', sub: 'Model • Highly popular in Sem 1 & 2', icon: '🔢', query: 'Casio FX-991CW' },
    { label: 'Calculators under ₹1,000', sub: 'Filter • Budget friendly', icon: '💰', query: 'calculator' },
    { label: 'Calculators near you (Library / SAC)', sub: 'Location • 0.3 km away', icon: '📍', query: 'Casio' },
    { label: '4 students looking for calculators', sub: 'Need Board • High demand', icon: '🙋', query: 'calculator' },
  ],
  book: [
    { label: 'Course Textbooks', sub: 'Category • 14 available', icon: '📚', query: 'textbook' },
    { label: 'Erwin Kreyszig Advanced Math (10th Ed)', sub: 'Book • Complete pages, pencil marks', icon: '📖', query: 'Kreyszig' },
    { label: 'Data Structures Cormen (CLRS)', sub: 'Book • Computer Science core', icon: '💻', query: 'Cormen' },
    { label: 'Books under ₹500', sub: 'Filter • Budget friendly', icon: '💰', query: 'math' },
  ],
  draw: [
    { label: 'Engineering Drawing Kits', sub: 'Category • 6 available', icon: '📐', query: 'drafter' },
    { label: 'Omega Mini Drafter + Sheet Container', sub: 'Kit • With canvas carry bag', icon: '✏️', query: 'mini drafter' },
    { label: 'Drawing kits under ₹500', sub: 'Filter • 60% savings vs retail', icon: '💰', query: 'drafter' },
  ],
  coat: [
    { label: 'Pure Cotton Lab Coats (Size M/L)', sub: 'Category • Chemistry practicals', icon: '🥼', query: 'lab coat' },
    { label: 'Lab Coat + Safety Goggles bundle', sub: 'Bundle • Under ₹200', icon: '🧪', query: 'lab coat' },
  ],
};

const DEFAULT_POPULAR_SUGGESTIONS = [
  { label: 'Casio FX-991CW ClassWiz', sub: 'Trending in Sem 1 & 2', icon: '⚡', query: 'Casio FX-991CW' },
  { label: 'Erwin Kreyszig Advanced Math', sub: 'Required textbook', icon: '📚', query: 'Kreyszig' },
  { label: 'Omega Mini Drafter Kit', sub: 'Engineering graphics', icon: '📐', query: 'drafter' },
  { label: 'Pure Cotton Lab Coat', sub: 'Chemistry workshop', icon: '🥼', query: 'lab coat' },
  { label: 'Arduino Starter Kit', sub: 'Robotics & electronics', icon: '💻', query: 'arduino' },
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
  const [saveSuccess, setSaveSuccess] = useState(false);
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
    const el = document.getElementById('marketplace-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveSearchClick = () => {
    if (!searchQuery.trim()) return;
    saveSearch(searchQuery);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Determine contextual suggestions
  const qLower = searchQuery.toLowerCase().trim();
  let suggestions = DEFAULT_POPULAR_SUGGESTIONS;

  if (qLower.includes('calc')) {
    suggestions = SMART_SUGGESTION_MAP.calc;
  } else if (qLower.includes('book') || qLower.includes('math') || qLower.includes('text')) {
    suggestions = SMART_SUGGESTION_MAP.book;
  } else if (qLower.includes('draw') || qLower.includes('draft')) {
    suggestions = SMART_SUGGESTION_MAP.draw;
  } else if (qLower.includes('coat') || qLower.includes('lab')) {
    suggestions = SMART_SUGGESTION_MAP.coat;
  }

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
              if (searchQuery.trim()) saveSearch(searchQuery);
              setIsFocused(false);
              const el = document.getElementById('marketplace-catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          placeholder="What do you need? (e.g. Casio FX-991CW, Drawing Kit, Kreyszig Math, Lab coat...)"
          className="w-full bg-transparent py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-2 text-zinc-400 hover:text-zinc-600 mr-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => {
            if (searchQuery.trim()) saveSearch(searchQuery);
            setIsFocused(false);
            const el = document.getElementById('marketplace-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors mr-2 shrink-0 shadow-2xs"
        >
          <span>Search</span>
          <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Auto-suggest dropdown when focused */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl z-50 animate-modal-in space-y-4">
          {/* Smart Suggestions List (Section 6 of spec) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Instant Suggestions on {currentCampus.shortCode}</span>
              </span>
              {searchQuery && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSaveSearchClick();
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Search Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3 w-3" />
                      <span>Save This Search</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-1">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectQuery(s.query);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-left transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">{s.icon}</span>
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 block truncate">{s.label}</span>
                      <span className="text-[11px] text-zinc-500 block truncate">{s.sub}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches if any */}
          {savedSearches.length > 0 && (
            <div className="pt-2 border-t border-zinc-100">
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
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectQuery(s.query);
                      }}
                      className="hover:text-zinc-900 truncate"
                    >
                      {s.query}
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
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
        </div>
      )}

      {/* Mode Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-bold text-zinc-400 mr-1 hidden sm:inline">Mode:</span>
        {modes.map((m) => (
          <button
            key={m.label}
            onClick={() => setSelectedMode(m.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedMode === m.value
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};
