'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import {
  CheckCircle2,
  Recycle,
  ShieldCheck,
  Heart,
  Package,
  ArrowRight,
} from 'lucide-react';

export default function ProfileHubPage() {
  const {
    currentProfile,
    currentCampus,
    availableProfiles,
    setProfile,
    impactStats,
    listings,
    offers,
    savedListingIds,
    needRequests,
  } = useMarketplace();

  const myListings = listings.filter((l) => l.sellerId === currentProfile.id);
  const myOffers = offers.filter(
    (o) => o.buyerId === currentProfile.id || o.sellerId === currentProfile.id
  );
  const myNeeds = needRequests.filter((n) => n.buyerId === currentProfile.id);

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card Header */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentProfile.fullName}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              {currentProfile.isStudentVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 text-white p-1.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {currentProfile.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                  <ShieldCheck className="h-3 w-3" />
                  Verified .ac.in Student
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                {currentProfile.degreeProgram} &bull; Year {currentProfile.currentYear} (Sem {currentProfile.currentSemester})
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 pt-1">
                <span>{currentProfile.collegeEmail}</span>
                <span>&bull;</span>
                <span>{currentCampus.name}</span>
              </div>
            </div>

            {/* Switch Demo Student Avatar */}
            <div className="sm:self-start p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center sm:text-left space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Demo Account Switch
              </span>
              <div className="flex items-center gap-1.5">
                {availableProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p)}
                    title={`Switch to ${p.fullName}`}
                    className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-all ${
                      currentProfile.id === p.id
                        ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-105'
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.avatarUrl} alt={p.fullName} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-center">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-zinc-900 block">
                {currentProfile.successfulTransactions}
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Completed Reuses</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-emerald-700 block">
                {currentProfile.responseRatePercent}%
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Response Rate</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-zinc-900 block">
                {currentProfile.avgResponseMinutes} min
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Avg Reply Speed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-amber-600 block">
                {currentProfile.trustRating}★
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Campus Rating</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            My Activity & Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* My Active Listings */}
            <Link
              href="/sell"
              className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <strong className="text-sm font-black text-zinc-900 block group-hover:text-emerald-700 transition-colors">
                  My Campus Listings
                </strong>
                <p className="text-xs text-zinc-500">
                  {myListings.length} items listed for sale or giveaway
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-1">
                <span>Manage listings</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Saved Wishlist */}
            <Link
              href="/profile/saved"
              className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </div>
                <strong className="text-sm font-black text-zinc-900 block group-hover:text-rose-700 transition-colors">
                  Saved Wishlist
                </strong>
                <p className="text-xs text-zinc-500">
                  {savedListingIds.length} items with price drop tracking
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-rose-700 gap-1 pt-1">
                <span>View saved items</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Circular Campus Impact */}
            <Link
              href="/profile/impact"
              className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Recycle className="h-5 w-5" />
                </div>
                <strong className="text-sm font-black text-zinc-900 block group-hover:text-emerald-700 transition-colors">
                  Circular Impact
                </strong>
                <p className="text-xs text-zinc-500">
                  ₹{impactStats.moneySaved.toLocaleString()} saved &bull; {impactStats.co2SavedKg} kg CO₂ diverted
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-1">
                <span>Telemetry dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Demand & Offers Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                My Demand Requests ({myNeeds.length})
              </h3>
              <Link href="/needs/create" className="text-xs font-bold text-amber-600 hover:underline">
                + Post New
              </Link>
            </div>
            {myNeeds.length === 0 ? (
              <p className="text-xs text-zinc-400 py-3">No active need requests posted yet.</p>
            ) : (
              myNeeds.map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-zinc-900 block">{n.itemTitle}</strong>
                    <span className="text-[11px] text-zinc-500">Max Budget: ₹{n.maxBudget}</span>
                  </div>
                  <Link href={`/needs/${n.id}`} className="font-bold text-emerald-700">
                    View
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Active Negotiations ({myOffers.length})
              </h3>
              <Link href="/offers" className="text-xs font-bold text-emerald-700 hover:underline">
                View All &rarr;
              </Link>
            </div>
            {myOffers.length === 0 ? (
              <p className="text-xs text-zinc-400 py-3">No active negotiations in progress.</p>
            ) : (
              myOffers.map((o) => (
                <div key={o.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-zinc-900 block">Offer ₹{o.offeredAmount}</strong>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">{o.status}</span>
                  </div>
                  <Link href={`/offers/${o.id}`} className="font-bold text-emerald-700">
                    Open Mode
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
