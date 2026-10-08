'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  ArrowLeft,
  Heart,
  Trash2,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

export default function SavedItemsPage() {
  const router = useRouter();
  const { listings, savedListingIds, toggleSaveListing, currentCampus, currentProfile } = useMarketplace();

  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </button>
          <span className="text-xs text-zinc-400 font-medium">
            {savedListings.length} Saved Items
          </span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-bold">
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
              Saved Wishlist
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Saved Academic Essentials
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Items saved on {currentCampus.name}. We notify you when sellers drop their price or counter an offer.
            </p>
          </div>
        </div>

        {/* Saved Listings Grid */}
        {savedListings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900">Your wishlist is empty</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Save calculators, drawing kits, textbooks, and lab gear you want to track or negotiate later.
              </p>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
            >
              <span>Browse Campus Essentials</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedListings.map((item) => {
              const savingsPercent =
                item.originalNewPrice && item.originalNewPrice > item.price
                  ? Math.round(((item.originalNewPrice - item.price) / item.originalNewPrice) * 100)
                  : null;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleSaveListing(item.id)}
                      title="Remove from saved"
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-xs transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {savingsPercent && (
                      <span className="absolute bottom-2.5 left-2.5 bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-xs">
                        Save {savingsPercent}%
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Sem {item.relevantSemesters?.join(', ') || '1'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {item.condition.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-zinc-950">₹{item.price}</span>
                        {item.originalNewPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            ₹{item.originalNewPrice}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/listing/${item.id}`}
                        className="w-full py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>View & Negotiate</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
