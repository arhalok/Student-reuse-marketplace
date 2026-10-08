'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { NeedRequest } from '@/lib/types';
import {
  Layers,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface NeedBoardSpotlightProps {
  onOpenNeedBoard: () => void;
  onOpenCreateListingForNeed: (need: NeedRequest) => void;
}

export const NeedBoardSpotlight: React.FC<NeedBoardSpotlightProps> = ({
  onOpenNeedBoard,
  onOpenCreateListingForNeed,
}) => {
  const { needRequests, currentCampus } = useMarketplace();

  const activeCampusNeeds = needRequests.filter(
    (n) => n.campusId === currentCampus.id && n.status === 'OPEN'
  );

  if (activeCampusNeeds.length === 0) return null;

  return (
    <section className="rounded-3xl border border-amber-200/90 bg-linear-to-r from-amber-50/70 via-orange-50/40 to-yellow-50/50 p-6 sm:p-7 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-amber-950 tracking-tight">
                Students Are Looking For (Need Board)
              </h2>
              <span className="rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5">
                {activeCampusNeeds.length} Open Requests
              </span>
            </div>
            <p className="text-xs text-amber-800/80 font-normal">
              Demand before supply: Seniors who pass these items can connect directly
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNeedBoard}
          className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View All Campus Requests</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {activeCampusNeeds.slice(0, 3).map((need) => (
          <div
            key={need.id}
            className="flex flex-col justify-between rounded-2xl border border-amber-200/90 bg-white p-4 shadow-2xs hover:border-amber-300 transition-all card-hover"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-extrabold text-sm text-zinc-900 line-clamp-1">
                  {need.itemTitle}
                </span>
                <span className="rounded-lg bg-amber-100 text-amber-950 text-xs font-black px-2 py-0.5 shrink-0">
                  Max ₹{need.maxBudget}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {need.notes || 'Looking for passing senior who no longer needs this.'}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-medium">
                Cond: {need.preferredCondition.replace('_', ' ')}
              </span>
              <button
                onClick={() => onOpenCreateListingForNeed(need)}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-xs"
              >
                <span>I have this</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
