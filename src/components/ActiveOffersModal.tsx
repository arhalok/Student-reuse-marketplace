'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer } from '@/lib/types';
import {
  X,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ActiveOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer, listing: Listing) => void;
}

export const ActiveOffersModal: React.FC<ActiveOffersModalProps> = ({
  isOpen,
  onClose,
  onSelectOffer,
}) => {
  const { offers, listings, currentProfile } = useMarketplace();

  if (!isOpen) return null;

  const userOffers = offers.filter(
    (o) => o.buyerId === currentProfile.id || o.sellerId === currentProfile.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-zinc-900 text-base">Active Campus Negotiations</h2>
              <p className="text-xs text-zinc-500">Live offers, campus meeting schedules, and transaction completions.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Offers List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {userOffers.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
              No active negotiations yet. Click &apos;Offer&apos; on any listing to negotiate or test the transaction lifecycle!
            </div>
          ) : (
            userOffers.map((offer) => {
              const listing = listings.find((l) => l.id === offer.listingId);
              if (!listing) return null;
              const isSeller = offer.sellerId === currentProfile.id;

              return (
                <div
                  key={offer.id}
                  onClick={() => {
                    onClose();
                    onSelectOffer(offer, listing);
                  }}
                  className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-12 w-12 rounded-xl object-cover border border-zinc-100"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 text-xs sm:text-sm line-clamp-1">
                          {listing.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                          <span>{isSeller ? 'You are Seller' : 'You are Buyer'}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">
                            Offered: ₹{offer.counterAmount || offer.offeredAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 border border-emerald-200 uppercase">
                        {offer.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
