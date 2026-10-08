'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowRightLeft,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function OffersHubPage() {
  const { offers, listings, currentProfile, currentCampus } = useMarketplace();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const userOffers = offers.filter(
    (o) => o.buyerId === currentProfile.id || o.sellerId === currentProfile.id
  );

  const filteredOffers = userOffers.filter((o) => {
    if (filterTab === 'ACTIVE') return o.status === 'PENDING' || o.status === 'COUNTERED';
    if (filterTab === 'SCHEDULED') return o.status === 'ACCEPTED' && o.meetingSpotId;
    if (filterTab === 'COMPLETED') return o.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Negotiations & Meetups
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Offers & Transactions Hub
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600">
                Track active price negotiations, campus reservations, and scheduled CCTV handoffs on {currentCampus.shortCode}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/safety"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Safe Meetup Guide</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-100 text-center">
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-zinc-950 block">
                {userOffers.filter((o) => o.status === 'PENDING' || o.status === 'COUNTERED').length}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Negotiating</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-emerald-700 block">
                {userOffers.filter((o) => o.status === 'ACCEPTED').length}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Meetup Ready</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-zinc-900 block">
                {userOffers.filter((o) => o.status === 'COMPLETED').length}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Completed Reuses</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filterTab === 'ALL'
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            All Negotiations ({userOffers.length})
          </button>
          <button
            onClick={() => setFilterTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filterTab === 'ACTIVE'
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            In Negotiation
          </button>
          <button
            onClick={() => setFilterTab('SCHEDULED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filterTab === 'SCHEDULED'
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Scheduled Meetup
          </button>
          <button
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filterTab === 'COMPLETED'
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900">No active offers found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Explore campus listings and click &ldquo;Make an Offer&rdquo; to start negotiating with seniors.
              </p>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
            >
              <span>Browse Marketplace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOffers.map((offer) => {
              const listing = listings.find((l) => l.id === offer.listingId);
              if (!listing) return null;

              const isSeller = offer.sellerId === currentProfile.id;
              const otherUserId = isSeller ? offer.buyerId : offer.sellerId;
              const otherUser = INITIAL_PROFILES[otherUserId] || currentProfile;

              return (
                <Link
                  key={offer.id}
                  href={`/offers/${offer.id}`}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={listing.title}
                      className="h-16 w-16 rounded-2xl object-cover shrink-0 ring-1 ring-zinc-200"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-zinc-950 truncate max-w-xs">
                          {listing.title}
                        </span>

                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                            offer.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.status === 'COUNTERED'
                              ? 'bg-purple-100 text-purple-800'
                              : offer.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {offer.status}
                        </span>

                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                          {isSeller ? 'You are Seller' : 'You are Buyer'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>
                          Offered: <strong className="text-zinc-900">₹{offer.offeredAmount}</strong>
                        </span>
                        {offer.counterAmount && (
                          <span>
                            &bull; Counter: <strong className="text-purple-700">₹{offer.counterAmount}</strong>
                          </span>
                        )}
                        <span>
                          &bull; With: <span className="font-semibold text-zinc-700">{otherUser.fullName}</span>
                        </span>
                      </div>

                      {offer.meetingSpotId && offer.meetingTime && (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                          <MapPin className="h-3 w-3" />
                          <span>Meetup at {offer.meetingTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                    <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                      <span>{offer.status === 'ACCEPTED' ? 'Open Meetup Mode' : 'View Negotiation'}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
