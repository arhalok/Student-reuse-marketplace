'use client';

import React from 'react';
import { Listing, ItemCondition, TransactionMode } from '@/lib/types';
import { useMarketplace } from '@/lib/store';
import {
  CheckCircle2,
  Heart,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
}

const CONDITION_METADATA: Record<ItemCondition, { label: string; badgeClass: string }> = {
  LIKE_NEW: { label: 'Like New', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/90' },
  EXCELLENT: { label: 'Excellent', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/90' },
  GOOD: { label: 'Good', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/90' },
  FAIR: { label: 'Fair Wear', badgeClass: 'bg-orange-50 text-orange-900 border-orange-200/90' },
  FOR_PARTS: { label: 'For Parts', badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
};

const MODE_METADATA: Record<TransactionMode, { label: string; badgeClass: string }> = {
  BUY: { label: 'Buy', badgeClass: 'bg-zinc-900 text-white' },
  EXCHANGE: { label: 'Exchange', badgeClass: 'bg-purple-700 text-white' },
  RENT: { label: 'Rent', badgeClass: 'bg-indigo-700 text-white' },
  GIVE_AWAY: { label: 'Free Giveaway', badgeClass: 'bg-emerald-600 text-white' },
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onMakeOffer,
}) => {
  const {
    currentProfile,
    exchangeSpots,
    savedListingIds,
    toggleSaveListing,
    currentCampus,
  } = useMarketplace();

  const spot = exchangeSpots.find((s) => s.id === listing.preferredSpotId);
  const conditionMeta = CONDITION_METADATA[listing.condition];
  const modeMeta = MODE_METADATA[listing.mode];
  const isSaved = savedListingIds.includes(listing.id);
  const isOwner = listing.sellerId === currentProfile.id;

  const savingsPercent =
    listing.originalNewPrice && listing.originalNewPrice > listing.price
      ? Math.round(((listing.originalNewPrice - listing.price) / listing.originalNewPrice) * 100)
      : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-lg card-hover"
    >
      {/* Visual Photography Container */}
      <div
        className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 cursor-pointer"
        onClick={() => onSelect(listing)}
      >
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600'}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-104"
        />

        {/* Top Badges: Condition & Transaction Mode */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-2xs ${modeMeta.badgeClass}`}>
            {modeMeta.label}
          </span>
          <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow-2xs ${conditionMeta.badgeClass}`}>
            {conditionMeta.label}
          </span>
        </div>

        {/* Wishlist Heart Action (Interactive) */}
        <button
          type="button"
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveListing(listing.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-zinc-600 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? 'text-rose-500 fill-rose-500' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Status Overlay if Reserved / Sold */}
        {listing.status !== 'ACTIVE' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-2xs z-20">
            <span className="rounded-xl bg-white px-3.5 py-1 text-xs font-black text-zinc-950 shadow-xl uppercase tracking-wider">
              {listing.status.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Bottom Image Overlay: Semester badge & Savings % */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          {listing.relevantSemesters && listing.relevantSemesters.length > 0 ? (
            <span className="rounded-md bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
              Sem {listing.relevantSemesters.join(', ')}
            </span>
          ) : (
            <span />
          )}

          {savingsPercent && savingsPercent > 0 && listing.mode === 'BUY' && (
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm shadow-emerald-950/20">
              Save {savingsPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Product Title */}
        <h3
          onClick={() => onSelect(listing)}
          className="font-bold text-zinc-900 text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
        >
          {listing.title}
        </h3>

        {/* Pricing Layout */}
        <div className="mt-2.5 flex items-baseline gap-2">
          {listing.mode === 'GIVE_AWAY' ? (
            <span className="text-base font-black text-emerald-600">Free to Reuse</span>
          ) : listing.mode === 'RENT' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-indigo-700">₹{listing.rentalRatePerWeek || listing.price}</span>
              <span className="text-xs text-zinc-500 font-medium">/ week</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-black text-zinc-950">₹{listing.price}</span>
              {listing.originalNewPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{listing.originalNewPrice}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Exchange details pill */}
        {listing.mode === 'EXCHANGE' && listing.exchangeDetails && (
          <p className="mt-1.5 text-xs text-purple-800 bg-purple-50/80 p-2 rounded-xl line-clamp-1 border border-purple-200/60 font-medium">
            ⇄ {listing.exchangeDetails}
          </p>
        )}

        {/* Verified Condition Checklist Summary */}
        {listing.calculatorInspection && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <span className="text-emerald-700 font-bold">✓ Tested</span>
            <span>• {listing.calculatorInspection.displayCondition.replace('_', ' ').toLowerCase()} LCD</span>
            <span>• {listing.calculatorInspection.batteryCondition.toLowerCase()} battery</span>
          </div>
        )}

        {listing.bookInspection && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium truncate">
            {listing.bookInspection.missingPages ? (
              <span className="text-amber-700 font-bold">⚠️ Check pages</span>
            ) : (
              <span className="text-emerald-700 font-bold">✓ Complete</span>
            )}
            {listing.bookInspection.edition && <span>• {listing.bookInspection.edition}</span>}
            {listing.bookInspection.hasWriting && <span>• Notes</span>}
          </div>
        )}

        {/* Campus Location & Exchange Spot */}
        {spot && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="truncate">{spot.name}</span>
            </div>
            {listing.distanceKm && (
              <span className="text-[10px] font-semibold text-zinc-600 shrink-0">
                {listing.distanceKm} km
              </span>
            )}
          </div>
        )}

        {/* Bottom Card Footer */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          {/* Seller Trust Tag */}
          <div className="flex items-center gap-1.5 truncate text-xs">
            <span className="font-semibold text-zinc-800 truncate">
              {isOwner ? 'Your Listing' : 'Verified Senior'}
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          </div>

          {/* Action CTAs */}
          {isOwner ? (
            <button
              onClick={() => onSelect(listing)}
              className="rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              Manage
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelect(listing)}
                className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Inspect
              </button>
              <button
                onClick={() => onMakeOffer(listing)}
                disabled={listing.status === 'SOLD'}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-all"
              >
                {listing.mode === 'GIVE_AWAY' ? 'Claim' : 'Offer'}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
