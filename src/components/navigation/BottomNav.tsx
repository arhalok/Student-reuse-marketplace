'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  Home,
  Compass,
  PlusCircle,
  Layers,
  User,
  MessageSquare,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { offers, currentProfile } = useMarketplace();

  const pendingOffersCount = offers.filter(
    (o) =>
      (o.sellerId === currentProfile.id || o.buyerId === currentProfile.id) &&
      o.status !== 'COMPLETED' &&
      o.status !== 'REJECTED'
  ).length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around"
    >
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-bold transition-colors ${
          pathname === '/' ? 'text-emerald-700' : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <Home className="h-4 w-4 stroke-[2.2]" />
        <span>Home</span>
      </Link>

      {/* 2. Browse */}
      <Link
        href="/browse"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold transition-colors ${
          pathname.startsWith('/browse') || pathname.startsWith('/search')
            ? 'text-emerald-700 font-bold'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <Compass className="h-4 w-4 stroke-[2.2]" />
        <span>Browse</span>
      </Link>

      {/* 3. Floating Distinctive SELL Action */}
      <Link
        href="/sell"
        aria-label="Sell an item"
        className="-mt-5 flex flex-col items-center justify-center h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
      >
        <PlusCircle className="h-6 w-6 stroke-[2.5]" />
      </Link>

      {/* 4. Need Board */}
      <Link
        href="/needs"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold transition-colors ${
          pathname.startsWith('/needs') ? 'text-amber-700 font-bold' : 'text-zinc-500 hover:text-amber-800'
        }`}
      >
        <Layers className="h-4 w-4 stroke-[2.2] text-amber-600" />
        <span>Needs</span>
      </Link>

      {/* 5. Profile Hub / Offers */}
      <Link
        href="/profile"
        className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold transition-colors ${
          pathname.startsWith('/profile') || pathname.startsWith('/offers')
            ? 'text-emerald-700 font-bold'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <User className="h-4 w-4 stroke-[2.2]" />
        <span>My Hub</span>
        {pendingOffersCount > 0 && (
          <span className="absolute top-0 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
            {pendingOffersCount}
          </span>
        )}
      </Link>
    </nav>
  );
};
