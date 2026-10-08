'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing } from '@/lib/types';
import { Clock, Sparkles, ArrowRight, Eye } from 'lucide-react';

interface RecentlyViewedSectionProps {
  onSelectListing: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  onSelectListing,
  onMakeOffer,
}) => {
  const { listings, recentlyViewedIds, currentCampus } = useMarketplace();

  const recentlyViewed = listings.filter((l) => recentlyViewedIds.includes(l.id) && l.campusId === currentCampus.id);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="space-y-4 pt-4 border-t border-zinc-200/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
              Recently Viewed on {currentCampus.shortCode}
            </h3>
            <p className="text-xs text-zinc-500 font-normal">
              Quickly jump back to academic supplies you inspected earlier
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {recentlyViewed.slice(0, 4).map((listing) => (
          <div
            key={`recent-${listing.id}`}
            onClick={() => onSelectListing(listing)}
            className="group p-3 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 transition-all cursor-pointer card-hover flex flex-col justify-between"
          >
            <div>
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover group-hover:scale-103 transition-transform"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {listing.condition.replace('_', ' ')}
              </span>
              <h4 className="font-bold text-xs text-zinc-900 truncate mt-1.5 group-hover:text-emerald-700 transition-colors">
                {listing.title}
              </h4>
            </div>

            <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="font-black text-xs text-zinc-950">₹{listing.price}</span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
