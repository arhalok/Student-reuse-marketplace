'use client';

import React from 'react';
import { Listing } from '@/lib/types';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Package,
  AlertCircle,
  Flag,
  Heart,
  Star,
  Camera,
  MessageSquare,
  QrCode,
} from 'lucide-react';

interface ListingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onMakeOffer: (listing: Listing) => void;
  onReport?: (listing: Listing) => void;
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  isOpen,
  onClose,
  listing,
  onMakeOffer,
  onReport,
}) => {
  const {
    exchangeSpots,
    currentProfile,
    savedListingIds,
    toggleSaveListing,
    currentCampus,
  } = useMarketplace();

  if (!isOpen || !listing) return null;

  const seller = INITIAL_PROFILES[listing.sellerId] || currentProfile;
  const spot = exchangeSpots.find((s) => s.id === listing.preferredSpotId);
  const isOwner = listing.sellerId === currentProfile.id;
  const isSaved = savedListingIds.includes(listing.id);

  const savingsPercent =
    listing.originalNewPrice && listing.originalNewPrice > listing.price
      ? Math.round(((listing.originalNewPrice - listing.price) / listing.originalNewPrice) * 100)
      : null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-zinc-950 text-base sm:text-lg truncate">
            {listing.title}
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 shrink-0">
            ✓ Verified Resale
          </span>
        </div>
      }
      subtitle={`Listed on ${currentCampus.name} • ${listing.distanceKm || 0.4} km away`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => toggleSaveListing(listing.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save Item'}</span>
          </button>

          {!isOwner ? (
            <button
              onClick={() => {
                onClose();
                onMakeOffer(listing);
              }}
              disabled={listing.status === 'SOLD'}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all"
            >
              <span>{listing.mode === 'GIVE_AWAY' ? 'Claim Free Item' : 'Make Offer / Negotiate'}</span>
              <span className="text-emerald-200">→</span>
            </button>
          ) : (
            <span className="text-xs text-zinc-500 font-medium">Your active campus listing</span>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Main Product Photography & Pricing Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          <div className="sm:col-span-6 rounded-2xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200 shadow-2xs">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="sm:col-span-6 flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="rounded-md bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  {listing.mode}
                </span>
                <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                  {listing.condition.replace('_', ' ')}
                </span>
                {listing.relevantSemesters && (
                  <span className="rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-semibold px-2 py-0.5">
                    Sem {listing.relevantSemesters.join(', ')}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2.5">
                {listing.mode === 'GIVE_AWAY' ? (
                  <span className="text-2xl font-black text-emerald-600">Free to Reuse</span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-zinc-950">₹{listing.price}</span>
                    {listing.originalNewPrice && (
                      <span className="text-sm text-zinc-400 line-through font-medium">
                        ₹{listing.originalNewPrice} new
                      </span>
                    )}
                    {savingsPercent && savingsPercent > 0 && (
                      <span className="rounded-md bg-emerald-100 text-emerald-900 text-xs font-black px-2 py-0.5">
                        {savingsPercent}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {listing.exchangeDetails && (
                <div className="mt-2.5 p-2 rounded-xl bg-purple-50 border border-purple-200/80 text-xs text-purple-900 font-medium">
                  <strong>⇄ Exchange Requirement:</strong> {listing.exchangeDetails}
                </div>
              )}
            </div>

            {/* Quick Handoff Location */}
            {spot && (
              <div className="mt-4 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2 text-xs text-zinc-600">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">Safe Meeting Spot: <strong>{spot.name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Structured Trust Information (Section 10 of spec) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
            <span className="text-zinc-400 text-[10px] block font-bold uppercase">Condition</span>
            <strong className="text-zinc-900">{listing.condition.replace('_', ' ')}</strong>
          </div>
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
            <span className="text-zinc-400 text-[10px] block font-bold uppercase">Seller Rating</span>
            <strong className="text-amber-600 flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>4.9 &bull; Senior</span>
            </strong>
          </div>
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
            <span className="text-zinc-400 text-[10px] block font-bold uppercase">Campus</span>
            <strong className="text-zinc-900 truncate block">{currentCampus.shortCode}</strong>
          </div>
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
            <span className="text-zinc-400 text-[10px] block font-bold uppercase">Exchange Point</span>
            <strong className="text-zinc-900 truncate block">{spot?.name || 'Library'}</strong>
          </div>
        </div>

        {/* Item Description */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</h3>
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50/70 p-4 rounded-2xl border border-zinc-200/80">
            {listing.description || 'No additional notes provided by seller.'}
          </p>
        </div>

        {/* Calculator Inspection Checklist */}
        {listing.calculatorInspection && (
          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Scientific Calculator Inspection Verification</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Model</span>
                <strong className="truncate block">{listing.calculatorInspection.model}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Keypad &amp; Power</span>
                <strong className="text-emerald-700">✓ Fully Working</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">LCD Display</span>
                <strong>{listing.calculatorInspection.displayCondition.replace('_', ' ').toLowerCase()}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Battery Health</span>
                <strong>{listing.calculatorInspection.batteryCondition.toLowerCase()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Textbook Inspection Checklist */}
        {listing.bookInspection && (
          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
              <BookOpen className="h-4 w-4 text-zinc-700" />
              <span>Physical Textbook Inspection Checklist</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Page Integrity</span>
                {listing.bookInspection.missingPages ? (
                  <strong className="text-red-600">⚠️ Missing pages noted</strong>
                ) : (
                  <strong className="text-emerald-700">✓ Complete (No missing sheets)</strong>
                )}
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Handwritten Notes</span>
                <strong>{listing.bookInspection.hasWriting ? 'Light pencil marks' : 'None / Clean'}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Highlighter Usage</span>
                <strong>{listing.bookInspection.hasHighlighting ? 'Present in key chapters' : 'None / Clean'}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
                <span className="text-zinc-400 block text-[10px]">Edition</span>
                <strong>{listing.bookInspection.edition || 'Current Syllabus'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Section 47 of spec: "What happens next?" Visual Handoff Preview */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>How This Exchange Works (Safe Campus Loop)</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="font-extrabold text-emerald-800 block">1. Make Offer</span>
              <span className="text-[11px] text-zinc-500">Propose a fair price</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="font-extrabold text-emerald-800 block">2. Accepted</span>
              <span className="text-[11px] text-zinc-500">Item reserved for you</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="font-extrabold text-emerald-800 block">3. Meet at Spot</span>
              <span className="text-[11px] text-zinc-500">Library Foyer / CCTV</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="font-extrabold text-emerald-800 block">4. Inspect &amp; UPI</span>
              <span className="text-[11px] text-zinc-500">Pay only in person</span>
            </div>
          </div>
        </div>

        {/* Verified Seller Trust Card (Section 11 of spec) */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Verified Campus Seller
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              ✓ Student Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={seller.avatarUrl}
              alt={seller.fullName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                <span>{seller.fullName}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              </div>
              <div className="text-xs text-zinc-500">{seller.degreeProgram} &bull; {currentCampus.shortCode}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/70">
              <div className="font-bold text-zinc-900">{seller.successfulTransactions}</div>
              <div className="text-[10px] text-zinc-500">Successful Reuses</div>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/70">
              <div className="font-bold text-emerald-700">{seller.responseRatePercent}%</div>
              <div className="text-[10px] text-zinc-500">Response Rate</div>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/70">
              <div className="font-bold text-zinc-800">{seller.avgResponseMinutes} min</div>
              <div className="text-[10px] text-zinc-500">Avg Reply Time</div>
            </div>
          </div>
        </div>

        {/* Safety Reporting Trigger */}
        {!isOwner && onReport && (
          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReport(listing);
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5"
            >
              <Flag className="h-3.5 w-3.5" />
              <span>Report this listing / seller</span>
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
