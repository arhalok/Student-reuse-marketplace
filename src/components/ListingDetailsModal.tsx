'use client';

import React from 'react';
import { Listing, ItemCondition } from '@/lib/types';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  X,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Package,
} from 'lucide-react';

interface ListingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onMakeOffer: (listing: Listing) => void;
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  isOpen,
  onClose,
  listing,
  onMakeOffer,
}) => {
  const { exchangeSpots, currentProfile } = useMarketplace();

  if (!isOpen || !listing) return null;

  const seller = INITIAL_PROFILES[listing.sellerId] || currentProfile;
  const spot = exchangeSpots.find((s) => s.id === listing.preferredSpotId);
  const isOwner = listing.sellerId === currentProfile.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-900 text-base">Listing Details</span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
              Verified Student Resale
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-md bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    {listing.mode}
                  </span>
                  <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5">
                    {listing.condition.replace('_', ' ')}
                  </span>
                  {listing.relevantSemesters && (
                    <span className="text-[10px] font-medium text-zinc-500">
                      Sem {listing.relevantSemesters.join(', ')}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-black text-zinc-900 leading-snug">{listing.title}</h2>

                {/* Price block */}
                <div className="mt-3 flex items-baseline gap-2">
                  {listing.mode === 'GIVE_AWAY' ? (
                    <span className="text-xl font-black text-emerald-600">Free Giveaway</span>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-zinc-900">₹{listing.price}</span>
                      {listing.originalNewPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{listing.originalNewPrice} new
                        </span>
                      )}
                    </>
                  )}
                </div>

                {listing.exchangeDetails && (
                  <p className="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 font-medium">
                    ⇄ {listing.exchangeDetails}
                  </p>
                )}
              </div>

              {/* Action Button */}
              {!isOwner && (
                <button
                  onClick={() => {
                    onClose();
                    onMakeOffer(listing);
                  }}
                  disabled={listing.status === 'SOLD'}
                  className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200 transition-colors"
                >
                  {listing.mode === 'GIVE_AWAY' ? 'Claim This Item Free' : 'Negotiate / Make Offer'}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description</h3>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
              {listing.description || 'No additional description provided.'}
            </p>
          </div>

          {/* Bundle Items Checklist if bundle */}
          {listing.isBundle && listing.bundleItems && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                <Package className="h-4 w-4 text-indigo-600" />
                Included in this Starter Pack Bundle:
              </span>
              <ul className="text-xs text-zinc-700 space-y-1">
                {listing.bundleItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Book Inspection Checklist */}
          {listing.bookInspection && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 mb-2">
                <BookOpen className="h-4 w-4 text-zinc-700" />
                Physical Textbook Inspection Checklist (Section 10)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                <div>Missing pages: {listing.bookInspection.missingPages ? '⚠️ Yes' : '✓ No missing pages'}</div>
                <div>Handwritten notes: {listing.bookInspection.hasWriting ? '✓ Light pencil marks' : 'None'}</div>
                <div>Highlighter marks: {listing.bookInspection.hasHighlighting ? 'Yes' : '✓ None'}</div>
                {listing.bookInspection.edition && <div>Edition: {listing.bookInspection.edition}</div>}
              </div>
            </div>
          )}

          {/* Seller Trust Profile Card (PRD Section 9) */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Verified Seller Trust Profile (Section 9)
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
                <div className="text-xs text-zinc-500">{seller.degreeProgram}</div>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <div className="font-bold text-zinc-900">{seller.successfulTransactions}</div>
                <div className="text-[10px] text-zinc-500">Successful Reuses</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-700">{seller.responseRatePercent}%</div>
                <div className="text-[10px] text-zinc-500">Response Rate</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <div className="font-bold text-zinc-800">{seller.avgResponseMinutes} min</div>
                <div className="text-[10px] text-zinc-500">Avg Response Time</div>
              </div>
            </div>
          </div>

          {/* Designated Campus Exchange Location */}
          {spot && (
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-zinc-900">Exchange at: {spot.name}</span>
                <p className="text-[11px] text-zinc-500">{spot.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
