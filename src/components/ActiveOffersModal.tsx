'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
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
  const { offers, listings, currentProfile, currentCampus } = useMarketplace();

  if (!isOpen) return null;

  const userOffers = offers.filter(
    (o) => o.buyerId === currentProfile.id || o.sellerId === currentProfile.id
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Campus Negotiations & Meetups"
      subtitle={`Active peer-to-peer offers and scheduled handoffs on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-2xs">
          <MessageSquare className="h-5 w-5" />
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-3">
        {userOffers.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="font-bold text-zinc-900 text-sm">No active campus negotiations</div>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Make an offer on any listing or post an item to start campus commerce negotiations.
            </p>
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
                  onSelectOffer(offer, listing);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-hover"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-14 w-14 rounded-xl object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 truncate">
                        {listing.title}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : offer.status === 'COUNTERED'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 mt-0.5">
                      <span>Offered: <strong className="text-zinc-900">₹{offer.offeredAmount}</strong></span>
                      {offer.counterAmount && <span> &bull; Counter: ₹{offer.counterAmount}</span>}
                      <span> &bull; Role: {isSeller ? 'You are Seller' : 'You are Buyer'}</span>
                    </div>

                    {offer.meetingSpot && (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>Meeting at: {offer.meetingSpot.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-bold self-end sm:self-center shrink-0 hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                  <span>Open Chat</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </ModalWrapper>
  );
};
