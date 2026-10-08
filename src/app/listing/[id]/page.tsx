'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Flag,
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const {
    listings,
    currentCampus,
    currentProfile,
    exchangeSpots,
    savedListingIds,
    toggleSaveListing,
    makeOffer,
  } = useMarketplace();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [offerNote, setOfferNote] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8 bg-zinc-50">
        <div className="text-center space-y-3 max-w-sm">
          <div className="text-3xl">📦</div>
          <h2 className="text-lg font-black text-zinc-950">Item Not Found</h2>
          <p className="text-xs text-zinc-500">
            This item may have already been sold or moved by the senior.
          </p>
          <Link
            href="/browse"
            className="inline-block px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
          >
            Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  const seller = INITIAL_PROFILES[listing.sellerId] || currentProfile;
  const spot = exchangeSpots.find((s) => s.id === listing.preferredSpotId);
  const isOwner = listing.sellerId === currentProfile.id;
  const isSaved = savedListingIds.includes(listing.id);

  const savingsPercent =
    listing.originalNewPrice && listing.originalNewPrice > listing.price
      ? Math.round(((listing.originalNewPrice - listing.price) / listing.originalNewPrice) * 100)
      : null;

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOffer(true);
    try {
      const newOffer = makeOffer(listing.id, Number(offerAmount) || listing.price, offerNote);
      router.push(`/offers/${newOffer.id}`);
    } catch {
      setSubmittingOffer(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to results</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs"
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery on left, Details on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
              <img
                src={listing.images[selectedPhotoIndex] || listing.images[0]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="rounded-xl bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                  {listing.mode}
                </span>
                <span className="rounded-xl bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-zinc-800 border border-zinc-200">
                  {listing.condition.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhotoIndex === idx ? 'border-emerald-600 scale-102' : 'border-zinc-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Condition Tests & Verification Checklist */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-black text-zinc-950">Standardized Inspection Report</h3>
              </div>

              {listing.calculatorInspection && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Tested Model</span>
                    <strong className="text-zinc-900">{listing.calculatorInspection.model}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Keypad Status</span>
                    <strong className="text-emerald-700">✓ Fully Working</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">LCD Screen</span>
                    <strong className="text-zinc-900">{listing.calculatorInspection.displayCondition.replace('_', ' ').toLowerCase()}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Battery</span>
                    <strong className="text-zinc-900">{listing.calculatorInspection.batteryCondition.toLowerCase()}</strong>
                  </div>
                </div>
              )}

              {listing.bookInspection && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Pages Complete</span>
                    <strong className="text-emerald-700">✓ 100% Intact</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Notes</span>
                    <strong className="text-zinc-900">{listing.bookInspection.hasWriting ? 'Pencil markings' : 'Clean'}</strong>
                  </div>
                </div>
              )}

              {/* Safe Meetup Spot Callout */}
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>CCTV Meeting Spot: <strong>{spot?.name || 'Central Library Foyer'}</strong></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  In-Person Inspection
                </span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Title & Price Header */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  {listing.targetCourse} &bull; Sem {listing.relevantSemesters?.join(', ') || '1'}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950 leading-snug">
                  {listing.title}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1 border-t border-zinc-100">
                <span className="text-3xl font-black text-zinc-950">₹{listing.price}</span>
                {listing.originalNewPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    ₹{listing.originalNewPrice} retail
                  </span>
                )}
                {savingsPercent && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                    Save {savingsPercent}%
                  </span>
                )}
              </div>

              {/* Primary Call to Action buttons */}
              {!isOwner ? (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setOfferAmount(listing.price > 100 ? listing.price - 50 : listing.price);
                      setShowOfferDrawer(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Make an Offer</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/messages/${listing.id}?sellerId=${listing.sellerId}`}
                    className="w-full py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-zinc-500" />
                    <span>Message Senior</span>
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-zinc-100 text-center text-xs font-semibold text-zinc-600">
                  This is your active campus listing
                </div>
              )}
            </div>

            {/* Seller Trust Card (Section 15: Links to dedicated /seller/[id]) */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Verified Senior Seller
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  ✓ Student Verified
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={seller.avatarUrl}
                  alt={seller.fullName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/seller/${seller.id}`}
                    className="font-extrabold text-zinc-900 text-sm hover:text-emerald-700 flex items-center gap-1.5"
                  >
                    <span>{seller.fullName}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  </Link>
                  <p className="text-xs text-zinc-500 truncate">{seller.degreeProgram} &bull; {currentCampus.shortCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong className="text-zinc-900 block">{seller.successfulTransactions}</strong>
                  <span className="text-[10px] text-zinc-400">Reuses</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong className="text-emerald-700 block">{seller.responseRatePercent}%</strong>
                  <span className="text-[10px] text-zinc-400">Response</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong className="text-zinc-800 block">{seller.avgResponseMinutes} min</strong>
                  <span className="text-[10px] text-zinc-400">Avg Reply</span>
                </div>
              </div>

              <Link
                href={`/seller/${seller.id}`}
                className="w-full py-2 block text-center rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              >
                View Senior Profile &amp; Reviews →
              </Link>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-2 shadow-2xs">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Item Details</span>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {listing.description || 'No additional notes provided by seller.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Make an Offer Bottom Sheet / Drawer */}
      {showOfferDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-modal-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-zinc-950">Make an Offer</h3>
                <span className="text-xs text-zinc-500">Listed Price: ₹{listing.price}</span>
              </div>
              <button onClick={() => setShowOfferDrawer(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1">Your Proposed Price (₹)</label>
                <input
                  type="number"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value) || '')}
                  className="w-full rounded-2xl border border-zinc-200 p-3 text-lg font-black text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1">Note to Senior (Optional)</label>
                <input
                  type="text"
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder="e.g. Can meet today after 4 PM at Library foyer"
                  className="w-full rounded-2xl border border-zinc-200 p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-500">
                Senior can accept, decline, or counter your offer. Payment is made in person at the CCTV spot via UPI.
              </div>

              <button
                type="submit"
                disabled={submittingOffer}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
              >
                Send Offer to Senior (₹{offerAmount || listing.price})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading item details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
