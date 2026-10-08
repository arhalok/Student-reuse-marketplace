'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { Bookmark, Heart, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectListing: (listing: Listing) => void;
}

export const SavedItemsModal: React.FC<SavedItemsModalProps> = ({
  isOpen,
  onClose,
  onSelectListing,
}) => {
  const { listings, savedListingIds, toggleSaveListing, currentCampus } = useMarketplace();

  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Academic Essentials"
      subtitle={`Items you saved on ${currentCampus.shortCode} • Price drops monitored`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
          <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
        </div>
      }
      maxWidth="2xl"
    >
      {savedListings.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="font-bold text-zinc-900 text-base">Your wishlist is empty</div>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Save calculators, drawing kits, textbooks, and lab gear you don&apos;t want to lose. We will alert you if the seller drops the price!
          </p>
          <button
            onClick={onClose}
            className="mt-3 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-colors"
          >
            Browse Campus Essentials
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedListings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 transition-all card-hover"
            >
              <div
                className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => {
                  onClose();
                  onSelectListing(listing);
                }}
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-16 w-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                    {listing.mode} • {listing.condition.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-zinc-900 truncate mt-1">
                    {listing.title}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-extrabold text-sm text-zinc-900">₹{listing.price}</span>
                    {listing.originalNewPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        ₹{listing.originalNewPrice} new
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleSaveListing(listing.id)}
                  title="Remove from saved"
                  className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectListing(listing);
                  }}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                >
                  <span>View</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalWrapper>
  );
};
