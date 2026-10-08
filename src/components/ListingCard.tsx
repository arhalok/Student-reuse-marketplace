'use client';

import React from 'react';
import { Listing, ItemCondition, TransactionMode } from '@/lib/types';
import { useMarketplace } from '@/lib/store';
import {
  CheckCircle2,
  Tag,
  Clock,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
}

const CONDITION_LABELS: Record<ItemCondition, { label: string; color: string }> = {
  LIKE_NEW: { label: 'Like New', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EXCELLENT: { label: 'Excellent', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  GOOD: { label: 'Good', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  FAIR: { label: 'Fair Wear', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  FOR_PARTS: { label: 'For Parts', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
};

const MODE_LABELS: Record<TransactionMode, { label: string; color: string }> = {
  BUY: { label: 'BUY', color: 'bg-zinc-900 text-white' },
  EXCHANGE: { label: 'EXCHANGE', color: 'bg-purple-600 text-white' },
  RENT: { label: 'RENT', color: 'bg-indigo-600 text-white' },
  GIVE_AWAY: { label: 'FREE GIVEAWAY', color: 'bg-emerald-600 text-white' },
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onMakeOffer,
}) => {
  const { currentProfile, exchangeSpots } = useMarketplace();

  const spot = exchangeSpots.find((s) => s.id === listing.preferredSpotId);
  const conditionMeta = CONDITION_LABELS[listing.condition];
  const modeMeta = MODE_LABELS[listing.mode];

  const savingsPercent = listing.originalNewPrice
    ? Math.round(((listing.originalNewPrice - listing.price) / listing.originalNewPrice) * 100)
    : null;

  const isOwner = listing.sellerId === currentProfile.id;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-md">
      {/* Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => onSelect(listing)}>
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600'}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-xs ${modeMeta.color}`}>
            {modeMeta.label}
          </span>
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow-xs ${conditionMeta.color}`}>
            {conditionMeta.label}
          </span>
        </div>

        {/* Status Tag if not ACTIVE */}
        {listing.status !== 'ACTIVE' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-2xs">
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-zinc-900 shadow-lg uppercase tracking-wider">
              {listing.status.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Semester Tag */}
        {listing.relevantSemesters && listing.relevantSemesters.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="rounded-md bg-zinc-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
              Sem {listing.relevantSemesters.join(', ')}
            </span>
          </div>
        )}

        {/* Savings Badge */}
        {savingsPercent && savingsPercent > 0 && listing.mode === 'BUY' && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              Save {savingsPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-2">
          <h3
            onClick={() => onSelect(listing)}
            className="font-bold text-zinc-900 text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors"
          >
            {listing.title}
          </h3>
        </div>

        {/* Pricing line */}
        <div className="mt-2 flex items-baseline gap-2">
          {listing.mode === 'GIVE_AWAY' ? (
            <span className="text-base font-extrabold text-emerald-600">Free to Reuse</span>
          ) : listing.mode === 'RENT' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-indigo-600">₹{listing.rentalRatePerWeek || listing.price}</span>
              <span className="text-xs text-zinc-500 font-medium">/ week</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-zinc-900">₹{listing.price}</span>
              {listing.originalNewPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{listing.originalNewPrice} new
                </span>
              )}
            </div>
          )}
        </div>

        {/* Exchange details snippet */}
        {listing.mode === 'EXCHANGE' && listing.exchangeDetails && (
          <p className="mt-1 text-xs text-purple-700 bg-purple-50 p-1.5 rounded-lg line-clamp-1 border border-purple-100 font-medium">
            ⇄ {listing.exchangeDetails}
          </p>
        )}

        {/* Book Condition Checklist (PRD Section 10) */}
        {listing.bookInspection && (
          <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-zinc-500">
            {listing.bookInspection.missingPages ? (
              <span className="text-red-600 font-semibold">⚠️ Missing pages</span>
            ) : (
              <span className="text-emerald-700">✓ No missing pages</span>
            )}
            {listing.bookInspection.hasWriting && <span>• Light notes</span>}
            {listing.bookInspection.edition && <span>• {listing.bookInspection.edition}</span>}
          </div>
        )}

        {/* Preferred Exchange Spot */}
        {spot && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-zinc-500 truncate">
            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate">{spot.name}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="mt-auto pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between gap-2">
            {/* Seller Info */}
            <div className="flex items-center gap-1.5 truncate text-xs text-zinc-600">
              <span className="font-semibold text-zinc-800 truncate">
                {isOwner ? 'You (Seller)' : 'Verified Senior'}
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </div>

            {/* Action Buttons */}
            {isOwner ? (
              <button
                onClick={() => onSelect(listing)}
                className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition-colors"
              >
                Manage
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelect(listing)}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Inspect
                </button>
                <button
                  onClick={() => onMakeOffer(listing)}
                  disabled={listing.status === 'SOLD'}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {listing.mode === 'GIVE_AWAY' ? 'Claim' : 'Offer'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
