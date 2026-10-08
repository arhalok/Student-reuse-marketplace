'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  ArrowRightLeft,
  School,
  Search,
  PlusCircle,
  MessageSquare,
  Bell,
  Heart,
  User,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentCampus,
    setCampus,
    campuses,
    currentProfile,
    offers,
    notifications,
    savedListingIds,
    searchQuery,
    setSearchQuery,
  } = useMarketplace();

  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(searchQuery);

  const pendingOffersCount = offers.filter(
    (o) =>
      (o.sellerId === currentProfile.id || o.buyerId === currentProfile.id) &&
      o.status !== 'COMPLETED' &&
      o.status !== 'REJECTED'
  ).length;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      setSearchQuery(headerSearch.trim());
      router.push(`/search?q=${encodeURIComponent(headerSearch.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: 'Needs', href: '/needs' },
    { label: 'Semester Packs', href: '/semester' },
    { label: 'Safety', href: '/safety' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* LEFT: Logo & Campus Selector */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black tracking-tight text-zinc-950 text-lg">
                  CampuShare
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80">
                  Reuse
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-tight mt-0.5">
                Buy less &bull; Reuse more &bull; Spend less
              </p>
            </div>
          </Link>

          {/* Campus Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 transition-all active:scale-98"
            >
              <School className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">{currentCampus.shortCode}</span>
              <span className="text-zinc-400 text-[10px]">▼</span>
            </button>

            {showCampusDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl z-50 animate-modal-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Switch Active Campus
                </div>
                {campuses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCampus(c);
                      setShowCampusDropdown(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition-colors ${
                      currentCampus.id === c.id
                        ? 'bg-emerald-50 text-emerald-950 font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <School className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-zinc-900">{c.name}</div>
                      <div className="text-[11px] text-zinc-500">{c.city}, {c.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
        >
          <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Search calculators, books, drawing kits..."
            className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
          />
        </form>

        {/* CENTER-RIGHT: Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-zinc-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 transition-colors ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-50/70 font-bold'
                    : 'hover:text-zinc-900 hover:bg-zinc-100/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions, Profile & Primary Sell CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Wishlist */}
          <Link
            href="/profile/saved"
            aria-label="Saved items"
            className="relative hidden sm:flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 bg-white text-zinc-600 hover:text-rose-600 hover:border-zinc-300 transition-colors shadow-2xs"
          >
            <Heart className={`h-4 w-4 ${savedListingIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {savedListingIds.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-2xs">
                {savedListingIds.length}
              </span>
            )}
          </Link>

          {/* Offers */}
          <Link
            href="/offers"
            aria-label="Active Offers"
            className="relative flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden md:inline">Offers</span>
            {pendingOffersCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {pendingOffersCount}
              </span>
            )}
          </Link>

          {/* Primary Sell CTA */}
          <Link
            href="/sell"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Sell an Item</span>
            <span className="sm:hidden">Sell</span>
          </Link>

          {/* Profile Hub */}
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white p-0.5 pr-2 sm:pr-2.5 hover:border-zinc-300 transition-colors shadow-2xs active:scale-95 ml-1"
          >
            <img
              src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={currentProfile.fullName}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500"
            />
            <span className="hidden sm:block text-[11px] font-bold text-zinc-900 truncate max-w-[70px]">
              {currentProfile.fullName.split(' ')[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
